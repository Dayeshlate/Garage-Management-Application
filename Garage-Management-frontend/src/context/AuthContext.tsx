import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { authApi } from '@/api/auth';
import { ApiError } from '@/api/config';
import { useSettings } from './SettingsContext';

interface User {
  id: number;
  name: string;
  email: string;
  role: 'ADMIN' | 'USER' | 'MECHANIC';
  phone?: string;
  vehicle_ids?: number[];
  currency?: string;
  taxRate?: number;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  signup: (name: string, email: string, phone: string, password: string) => Promise<boolean>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const normalizeRole = (role?: string): User['role'] => {
  const normalized = String(role ?? '')
    .replace(/^ROLE_/i, '')
    .toUpperCase();

  if (normalized === 'ADMIN' || normalized === 'USER' || normalized === 'MECHANIC') {
    return normalized;
  }

  return 'USER';
};

const buildUserFromUnknown = (raw: any): User => ({
  id: Number(raw?.id ?? 0),
  name: String(raw?.name ?? 'User'),
  email: String(raw?.email ?? ''),
  role: normalizeRole(raw?.role),
  phone: raw?.phone,
  vehicle_ids: Array.isArray(raw?.vehicle_ids) ? raw.vehicle_ids : undefined,
  currency: raw?.currency,
  taxRate: typeof raw?.taxRate === 'number' ? raw.taxRate : undefined,
});

const getDemoUser = (email: string, password: string): User | null => {
  const normalizedEmail = email.trim().toLowerCase();

  if (normalizedEmail === 'admin@garage.com' && password === 'admin123') {
    return {
      id: 1,
      name: 'Admin Demo',
      email: 'admin@garage.com',
      role: 'ADMIN',
      phone: '+91 9000000001',
    };
  }

  if (normalizedEmail === 'user@garage.com' && password === 'user123') {
    return {
      id: 2,
      name: 'User Demo',
      email: 'user@garage.com',
      role: 'USER',
      phone: '+91 9000000002',
    };
  }

  return null;
};

const getAuthErrorMessage = (error: unknown, action: 'Login' | 'Signup'): string => {
  if (error instanceof ApiError) {
    if (error.status === 0) {
      return 'Cannot connect to backend. Check VITE_API_URL and confirm the API server is running.';
    }
    return error.message || `${action} failed`;
  }
  return `${action} failed`;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const { initializeFromUser } = useSettings();
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem('garage_user');
    if (storedUser) {
      try {
        const parsed = JSON.parse(storedUser);
        const token = parsed?.token || localStorage.getItem('token');
        if (token) {
          const hydratedUser = buildUserFromUnknown(parsed);
          setUser(hydratedUser);
          initializeFromUser(parsed.currency, parsed.taxRate);
        } else {
          localStorage.removeItem('garage_user');
          localStorage.removeItem('token');
        }
      } catch {
        localStorage.removeItem('garage_user');
        localStorage.removeItem('token');
      }
    }
    setIsLoading(false);
  }, [initializeFromUser]);

  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    try {
      // Clear any stale session before attempting a new login.
      localStorage.removeItem('garage_user');
      localStorage.removeItem('token');

      const demoUser = getDemoUser(email, password);
      if (demoUser) {
        setUser(demoUser);
        initializeFromUser(demoUser.currency, demoUser.taxRate);
        localStorage.setItem('garage_user', JSON.stringify({ ...demoUser, token: 'demo-token' }));
        localStorage.setItem('token', 'demo-token');
        return true;
      }

      const response = await authApi.login({ email, password });
      if (!response?.token) {
        setUser(null);
        localStorage.removeItem('garage_user');
        localStorage.removeItem('token');
        return false;
      }
      const userData: User = buildUserFromUnknown(response.user);
      setUser(userData);
      initializeFromUser(userData.currency, userData.taxRate);
      localStorage.setItem('garage_user', JSON.stringify({ ...userData, token: response.token }));
      localStorage.setItem('token', response.token);
      return true;
    } catch (error) {
      setUser(null);
      localStorage.removeItem('garage_user');
      localStorage.removeItem('token');
      console.error('Login error:', getAuthErrorMessage(error, 'Login'));
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const signup = async (name: string, email: string, phone: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    try {
      await authApi.signup({ name, email, phone, password });
      return true;
    } catch (error) {
      console.error('Signup error:', getAuthErrorMessage(error, 'Signup'));
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('garage_user');
    localStorage.removeItem('token');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        signup,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

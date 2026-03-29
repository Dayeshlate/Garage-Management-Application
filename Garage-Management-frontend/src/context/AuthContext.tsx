import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { authApi } from '@/api/auth';
import { ApiError } from '@/api/config';

interface User {
  id: number;
  name: string;
  email: string;
  role: 'ADMIN' | 'USER';
  phone?: string;
  vehicle_ids?: number[];
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

// Demo account credentials (for testing without backend)
const DEMO_ACCOUNTS = {
  'admin@garage.com': { password: 'admin123', name: 'Admin User', role: 'admin' as const },
  'user@garage.com': { password: 'user123', name: 'Demo User', role: 'user' as const },
};

const getAuthErrorMessage = (error: unknown, action: 'Login' | 'Signup'): string => {
  if (error instanceof ApiError) {
    if (error.status === 0) {
      return 'Cannot connect to backend. Use demo account (admin@garage.com / admin123) or configure VITE_API_URL.';
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
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem('garage_user');
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch {
        localStorage.removeItem('garage_user');
      }
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    try {
      // Demo accounts for testing without backend
      const demoAccounts: Record<string, User> = {
        'admin@garage.com': { id: 1, name: 'Admin User', email: 'admin@garage.com', role: 'ADMIN', phone: '9999999999', vehicle_ids: [] },
        'user@garage.com': { id: 2, name: 'Demo Customer', email: 'user@garage.com', role: 'USER', phone: '8888888888', vehicle_ids: [] },
      };

      const demoUser = demoAccounts[email];
      if (demoUser && (password === 'admin123' || password === 'user123')) {
        setUser(demoUser);
        localStorage.setItem('garage_user', JSON.stringify({ ...demoUser, token: 'demo-token' }));
        return true;
      }

      // Real backend login
      const response = await authApi.login({ email, password });
      const userData: User = {
        ...response.user,
        role: response.user?.role ?? 'USER',
      };
      setUser(userData);
      localStorage.setItem('garage_user', JSON.stringify({ ...userData, token: response.token }));
      return true;
    } catch (error) {
      console.error('Login error:', getAuthErrorMessage(error, 'Login'));
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const signup = async (name: string, email: string, phone: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    try {
      const response = await authApi.signup({ name, email, phone, password });
      const userData: User = {
        ...response.user,
        role: response.user?.role ?? 'USER',
      };
      setUser(userData);
      localStorage.setItem('garage_user', JSON.stringify({ ...userData, token: response.token }));
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

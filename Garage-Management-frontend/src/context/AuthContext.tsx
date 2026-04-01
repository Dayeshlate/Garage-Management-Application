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
        if (token && token !== 'demo-token') {
          setUser({ ...parsed, token: undefined } as User);
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

      const response = await authApi.login({ email, password });
      if (!response?.token) {
        setUser(null);
        localStorage.removeItem('garage_user');
        localStorage.removeItem('token');
        return false;
      }
      const userData: User = {
        ...response.user,
        role: response.user?.role ?? 'USER',
      };
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

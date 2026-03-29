import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';

interface RoleGuardProps {
  allowedRoles: ('ADMIN' | 'USER')[];
  children: React.ReactNode;
}

export const RoleGuard: React.FC<RoleGuardProps> = ({ allowedRoles, children }) => {
  const { user } = useAuth();

  if (!user || !allowedRoles.includes(user.role)) {
    const redirectTo = user?.role === 'USER' ? '/my-dashboard' : '/dashboard';
    return <Navigate to={redirectTo} replace />;
  }

  return <>{children}</>;
};

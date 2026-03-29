import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { Wrench } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
export const AuthLayout: React.FC = () => {
  const {
    isAuthenticated,
    isLoading
  } = useAuth();
  if (isLoading) {
    return <div className="flex h-screen items-center justify-center bg-background">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-accent border-t-transparent" />
      </div>;
  }
  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }
  return <div className="min-h-screen bg-primary flex">
      {/* Left Panel - Branding */}
      <div className="hidden lg:flex lg:w-1/2 flex-col justify-center items-center p-12">
        <div className="max-w-md text-center">
          <div className="flex justify-center mb-8">
            <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-accent">
              <Wrench className="h-10 w-10 text-accent-foreground" />
            </div>
          </div>
          <h1 className="text-4xl font-bold text-primary-foreground mb-4">
            AutoGarage Pro
          </h1>
          <p className="text-lg text-primary-foreground/70">
            Complete garage management solution for modern auto service centers. 
            Streamline your operations, manage customers, and grow your business.
          </p>
          <div className="mt-12 grid grid-cols-3 gap-6">
            <div className="text-center">
              <p className="text-3xl font-bold text-accent">500+</p>
              <p className="text-sm text-primary-foreground/60">Active Garages</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold text-accent">50K+</p>
              <p className="text-sm text-primary-foreground/60">Jobs Completed</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold text-accent">99%</p>
              <p className="text-sm text-primary-foreground/60">Uptime</p>
            </div>
          </div>
        </div>
      </div>

      {/* Right Panel - Auth Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-background rounded-l-3xl shadow-sm">
        <Outlet />
      </div>
    </div>;
};
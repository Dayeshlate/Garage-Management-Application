import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Eye, EyeOff, LogIn } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { toast } from 'sonner';

const LOGIN_TOAST_ID = 'login-status';

export const Login = React.forwardRef<HTMLDivElement>((_, ref) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (isSubmitting) return;

    if (!email || !password) {
      toast.error('Please fill in all fields', { id: LOGIN_TOAST_ID });
      return;
    }

    setIsSubmitting(true);
    const success = await login(email, password);
    setIsSubmitting(false);

    if (success) {
      toast.success('Welcome back!', { id: LOGIN_TOAST_ID });
      navigate('/dashboard');
    } else {
      toast.error('Login failed. Try demo account: admin@garage.com / admin123', { id: LOGIN_TOAST_ID });
    }
  };

  return (
    <div ref={ref} className="w-full max-w-md animate-fade-in">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-foreground">Welcome Back</h2>
        <p className="mt-2 text-muted-foreground">
          Sign in to access your garage dashboard
        </p>
      </div>

      {/* Demo Accounts Section */}
      <div className="mb-6 p-4 bg-accent/10 border border-accent/30 rounded-lg">
        <p className="text-xs font-medium text-foreground mb-3">Demo Accounts:</p>
        <div className="grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={() => {
              setEmail('admin@garage.com');
              setPassword('admin123');
            }}
            className="text-xs bg-accent text-accent-foreground hover:bg-accent/90 px-3 py-2 rounded font-medium transition-colors"
          >
            Admin Demo
          </button>
          <button
            type="button"
            onClick={() => {
              setEmail('user@garage.com');
              setPassword('user123');
            }}
            className="text-xs bg-muted text-foreground hover:bg-muted/80 px-3 py-2 rounded font-medium transition-colors"
          >
            User Demo
          </button>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-foreground mb-2">
            Email Address
          </label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="admin@garage.com"
            className="input-field"
            autoComplete="email"
          />
        </div>

        <div>
          <label htmlFor="password" className="block text-sm font-medium text-foreground mb-2">
            Password
          </label>
          <div className="relative">
            <input
              id="password"
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="input-field pr-12"
              autoComplete="current-password"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
            >
              {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
            </button>
          </div>
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="btn-primary w-full py-3 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? (
            <div className="h-5 w-5 animate-spin rounded-full border-2 border-accent-foreground border-t-transparent" />
          ) : (
            <>
              <LogIn className="h-5 w-5" />
              Sign In
            </>
          )}
        </button>
      </form>

      {/* Demo Accounts */}
      <div className="mt-6 space-y-2">
        <p className="text-xs text-center text-muted-foreground font-medium uppercase tracking-wide">Demo Accounts</p>
        <div className="grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={() => { setEmail('admin@garage.com'); setPassword('admin123'); }}
            className="flex flex-col items-center gap-1 rounded-lg border border-border bg-muted/50 px-3 py-2.5 text-sm hover:bg-muted transition-colors"
          >
            <span className="font-semibold text-foreground">Admin</span>
            <span className="text-xs text-muted-foreground">admin@garage.com</span>
          </button>
          <button
            type="button"
            onClick={() => { setEmail('user@garage.com'); setPassword('user123'); }}
            className="flex flex-col items-center gap-1 rounded-lg border border-border bg-muted/50 px-3 py-2.5 text-sm hover:bg-muted transition-colors"
          >
            <span className="font-semibold text-foreground">User</span>
            <span className="text-xs text-muted-foreground">user@garage.com</span>
          </button>
        </div>
      </div>

      <p className="mt-4 text-center text-sm text-muted-foreground">
        Don't have an account?{' '}
        <Link to="/signup" className="text-accent hover:underline font-medium">
          Sign Up
        </Link>
      </p>
    </div>
  );
});

Login.displayName = 'Login';

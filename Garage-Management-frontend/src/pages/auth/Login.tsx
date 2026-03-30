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
      toast.error('Login failed. Please check your credentials.', { id: LOGIN_TOAST_ID });
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
            placeholder="you@example.com"
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

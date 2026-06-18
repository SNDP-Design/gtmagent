'use client';
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Eye, EyeOff, Loader2, Copy, Check } from 'lucide-react';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';

interface LoginFormData {
  email: string;
  password: string;
  rememberMe: boolean;
}

const DEMO_CREDENTIALS = { email: 'alex@buildwithgtm.co', password: 'gtm-launch-2026' };

interface LoginFormProps {
  onSwitchToSignup: () => void;
}

export default function LoginForm({ onSwitchToSignup }: LoginFormProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const { signIn } = useAuth();
  const router = useRouter();

  const {
    register,
    handleSubmit,
    setValue,
    setError,
    formState: { errors },
  } = useForm<LoginFormData>({
    defaultValues: { email: '', password: '', rememberMe: false },
  });

  const fillDemo = () => {
    setValue('email', DEMO_CREDENTIALS.email);
    setValue('password', DEMO_CREDENTIALS.password);
  };

  const handleCopy = (field: 'email' | 'password') => {
    const val = field === 'email' ? DEMO_CREDENTIALS.email : DEMO_CREDENTIALS.password;
    navigator.clipboard.writeText(val).catch(() => {});
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const onSubmit = async (data: LoginFormData) => {
    setIsLoading(true);
    try {
      await signIn(data.email, data.password);
      toast.success('Welcome back! Redirecting to your workspace…');
      router.push('/');
      router.refresh();
    } catch (err: any) {
      setError('email', { message: err.message || 'Invalid credentials. Please try again.' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fade-in">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-foreground">Welcome back</h2>
        <p className="text-[13px] text-muted-foreground mt-1">Sign in to your GTM workspace</p>
      </div>

      {/* Social auth */}
      <div className="grid grid-cols-2 gap-3 mb-6">
        <button className="flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg border border-border bg-card hover:bg-muted text-[13px] font-semibold text-foreground transition-all duration-150">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
          </svg>
          Google
        </button>
        <button className="flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg border border-border bg-card hover:bg-muted text-[13px] font-semibold text-foreground transition-all duration-150">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z"/>
          </svg>
          GitHub
        </button>
      </div>

      <div className="flex items-center gap-3 mb-6">
        <div className="flex-1 h-px bg-border" />
        <span className="text-[11px] text-muted-foreground font-semibold uppercase tracking-widest">or</span>
        <div className="flex-1 h-px bg-border" />
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label className="block text-[12px] font-semibold text-foreground mb-1.5">Email address</label>
          <input
            {...register('email', {
              required: 'Email is required',
              pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: 'Enter a valid email address' },
            })}
            type="email"
            className="input-base text-[13px]"
            placeholder="you@yourstartup.com"
            autoComplete="email"
          />
          {errors.email && <p className="text-negative text-[11px] mt-1">{errors.email.message}</p>}
        </div>

        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="block text-[12px] font-semibold text-foreground">Password</label>
            <button type="button" className="text-[11px] text-primary font-semibold hover:underline">
              Forgot password?
            </button>
          </div>
          <div className="relative">
            <input
              {...register('password', { required: 'Password is required' })}
              type={showPassword ? 'text' : 'password'}
              className="input-base text-[13px] pr-10"
              placeholder="Enter your password"
              autoComplete="current-password"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
            >
              {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
          {errors.password && <p className="text-negative text-[11px] mt-1">{errors.password.message}</p>}
        </div>

        <div className="flex items-center gap-2">
          <input
            {...register('rememberMe')}
            type="checkbox"
            id="rememberMe"
            className="w-4 h-4 rounded border-border accent-primary"
          />
          <label htmlFor="rememberMe" className="text-[12px] text-muted-foreground cursor-pointer">
            Remember me for 30 days
          </label>
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="btn-primary w-full py-3 flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed disabled:transform-none"
        >
          {isLoading ? (
            <><Loader2 size={16} className="animate-spin" /> Signing in…</>
          ) : (
            'Sign In to Workspace'
          )}
        </button>
      </form>

      {/* Demo credentials */}
      <div className="mt-5 rounded-xl border border-primary/20 bg-secondary/40 p-4">
        <div className="flex items-center justify-between mb-3">
          <p className="text-[11px] font-bold uppercase tracking-widest text-primary">Demo Account</p>
          <button
            onClick={fillDemo}
            className="text-[11px] font-semibold text-primary hover:bg-secondary px-2 py-1 rounded-lg transition-colors"
          >
            Autofill
          </button>
        </div>
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-semibold">Email</p>
              <p className="text-[12px] font-mono font-semibold text-foreground">{DEMO_CREDENTIALS.email}</p>
            </div>
            <button onClick={() => handleCopy('email')} className="p-1.5 rounded-lg text-muted-foreground hover:text-primary hover:bg-muted transition-all">
              {copiedField === 'email' ? <Check size={13} className="text-positive" /> : <Copy size={13} />}
            </button>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-semibold">Password</p>
              <p className="text-[12px] font-mono font-semibold text-foreground">{DEMO_CREDENTIALS.password}</p>
            </div>
            <button onClick={() => handleCopy('password')} className="p-1.5 rounded-lg text-muted-foreground hover:text-primary hover:bg-muted transition-all">
              {copiedField === 'password' ? <Check size={13} className="text-positive" /> : <Copy size={13} />}
            </button>
          </div>
        </div>
      </div>

      <p className="text-center text-[12px] text-muted-foreground mt-5">
        Don't have an account?{' '}
        <button onClick={onSwitchToSignup} className="text-primary font-semibold hover:underline">
          Create one free
        </button>
      </p>
    </div>
  );
}
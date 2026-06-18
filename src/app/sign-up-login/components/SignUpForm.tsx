'use client';
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Eye, EyeOff, Loader2, Check } from 'lucide-react';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';

interface SignUpFormData {
  fullName: string;
  email: string;
  password: string;
  startupName: string;
  stage: string;
  agreeTerms: boolean;
}

interface SignUpFormProps {
  onSwitchToLogin: () => void;
}

const stages = [
  'Idea stage — no product yet',
  'Building MVP',
  'MVP done — looking for first customers',
  'Pre-revenue — have users, no paying customers',
  'Early revenue — 1–10 paying customers',
];

export default function SignUpForm({ onSwitchToLogin }: SignUpFormProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const { signUp } = useAuth();
  const router = useRouter();

  const {
    register,
    handleSubmit,
    watch,
    setError,
    formState: { errors },
  } = useForm<SignUpFormData>();

  const password = watch('password', '');

  const passwordStrength = (pw: string) => {
    if (!pw) return 0;
    let score = 0;
    if (pw.length >= 8) score++;
    if (/[A-Z]/.test(pw)) score++;
    if (/[0-9]/.test(pw)) score++;
    if (/[^A-Za-z0-9]/.test(pw)) score++;
    return score;
  };

  const strength = passwordStrength(password);
  const strengthLabel = ['', 'Weak', 'Fair', 'Good', 'Strong'][strength];
  const strengthColor = ['', 'bg-negative', 'bg-warning', 'bg-info', 'bg-positive'][strength];

  const onSubmit = async (data: SignUpFormData) => {
    setIsLoading(true);
    try {
      await signUp(data.email, data.password, {
        fullName: data.fullName,
        startupName: data.startupName,
        stage: data.stage,
      });
      setSubmitted(true);
      toast.success('Account created! Welcome to GTM Fox 🚀');
    } catch (err: any) {
      setError('email', { message: err.message || 'Failed to create account. Please try again.' });
    } finally {
      setIsLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="text-center py-8 fade-in">
        <div className="w-16 h-16 rounded-2xl gradient-primary flex items-center justify-center mx-auto mb-4 shadow-btn-primary">
          <Check size={28} className="text-white" />
        </div>
        <h2 className="text-2xl font-bold text-foreground mb-2">You're in! 🎉</h2>
        <p className="text-[13px] text-muted-foreground mb-6 max-w-xs mx-auto">
          Your GTM workspace is ready. Let's build your strategy and get your first customers.
        </p>
        <a href="/" className="btn-primary px-6 py-3 inline-flex items-center gap-2">
          Open My Workspace →
        </a>
      </div>
    );
  }

  return (
    <div className="fade-in">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-foreground">Create your workspace</h2>
        <p className="text-[13px] text-muted-foreground mt-1">Free to start — no credit card required</p>
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
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-[12px] font-semibold text-foreground mb-1.5">Full Name</label>
            <input
              {...register('fullName', { required: 'Full name is required' })}
              className="input-base text-[13px]"
              placeholder="Alex Kim"
              autoComplete="name"
            />
            {errors.fullName && <p className="text-negative text-[11px] mt-1">{errors.fullName.message}</p>}
          </div>
          <div>
            <label className="block text-[12px] font-semibold text-foreground mb-1.5">Startup Name</label>
            <input
              {...register('startupName', { required: 'Startup name is required' })}
              className="input-base text-[13px]"
              placeholder="e.g. FormPilot"
            />
            {errors.startupName && <p className="text-negative text-[11px] mt-1">{errors.startupName.message}</p>}
          </div>
        </div>

        <div>
          <label className="block text-[12px] font-semibold text-foreground mb-1.5">Work Email</label>
          <input
            {...register('email', {
              required: 'Email is required',
              pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: 'Enter a valid email' },
            })}
            type="email"
            className="input-base text-[13px]"
            placeholder="you@yourstartup.com"
            autoComplete="email"
          />
          {errors.email && <p className="text-negative text-[11px] mt-1">{errors.email.message}</p>}
        </div>

        <div>
          <label className="block text-[12px] font-semibold text-foreground mb-1.5">Startup Stage</label>
          <select {...register('stage', { required: true })} className="input-base text-[13px]">
            <option value="">Select your current stage…</option>
            {stages.map((s) => (
              <option key={`stage-${s}`} value={s}>{s}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-[12px] font-semibold text-foreground mb-1.5">Password</label>
          <div className="relative">
            <input
              {...register('password', {
                required: 'Password is required',
                minLength: { value: 8, message: 'Password must be at least 8 characters' },
              })}
              type={showPassword ? 'text' : 'password'}
              className="input-base text-[13px] pr-10"
              placeholder="At least 8 characters"
              autoComplete="new-password"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
            >
              {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
          {password && (
            <div className="mt-2">
              <div className="flex gap-1 mb-1">
                {[1, 2, 3, 4].map((i) => (
                  <div
                    key={`strength-bar-${i}`}
                    className={`h-1 flex-1 rounded-full transition-all duration-300 ${i <= strength ? strengthColor : 'bg-muted'}`}
                  />
                ))}
              </div>
              <p className={`text-[11px] font-semibold ${strengthColor.replace('bg-', 'text-')}`}>{strengthLabel}</p>
            </div>
          )}
          {errors.password && <p className="text-negative text-[11px] mt-1">{errors.password.message}</p>}
        </div>

        <div className="flex items-start gap-2">
          <input
            {...register('agreeTerms', { required: 'You must agree to the terms' })}
            type="checkbox"
            id="agreeTerms"
            className="w-4 h-4 mt-0.5 rounded border-border accent-primary flex-shrink-0"
          />
          <label htmlFor="agreeTerms" className="text-[12px] text-muted-foreground cursor-pointer leading-relaxed">
            I agree to the{' '}
            <span className="text-primary font-semibold hover:underline cursor-pointer">Terms of Service</span>
            {' '}and{' '}
            <span className="text-primary font-semibold hover:underline cursor-pointer">Privacy Policy</span>
          </label>
        </div>
        {errors.agreeTerms && <p className="text-negative text-[11px] -mt-2">{errors.agreeTerms.message}</p>}

        <button
          type="submit"
          disabled={isLoading}
          className="btn-primary w-full py-3 flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed disabled:transform-none"
        >
          {isLoading ? (
            <><Loader2 size={16} className="animate-spin" /> Creating workspace…</>
          ) : (
            'Create Free Workspace'
          )}
        </button>
      </form>

      <p className="text-center text-[12px] text-muted-foreground mt-5">
        Already have an account?{' '}
        <button onClick={onSwitchToLogin} className="text-primary font-semibold hover:underline">
          Sign in
        </button>
      </p>
    </div>
  );
}
'use client';
import React, { useState } from 'react';
import LoginForm from './LoginForm';
import SignUpForm from './SignUpForm';
import { Sparkles, Target, FlaskConical, Mail } from 'lucide-react';
import AppLogo from '@/components/ui/AppLogo';
import Icon from '@/components/ui/AppIcon';


const features = [
  { id: 'feat-strategy', icon: Sparkles, text: 'AI builds your GTM strategy step by step' },
  { id: 'feat-icp', icon: Target, text: 'Find your ideal customers and best channels' },
  { id: 'feat-outreach', icon: Mail, text: 'Generate outreach copy that actually converts' },
  { id: 'feat-experiments', icon: FlaskConical, text: 'Track what works and double down fast' },
];

export default function AuthLayout() {
  const [activeTab, setActiveTab] = useState<'login' | 'signup'>('login');

  return (
    <div className="min-h-screen flex">
      {/* Left brand panel */}
      <div className="hidden lg:flex lg:w-[45%] xl:w-[40%] gradient-primary flex-col justify-between p-10 relative overflow-hidden">
        {/* Background blobs */}
        <div className="blob-primary absolute -top-20 -left-20 w-64 h-64" />
        <div className="blob-primary absolute bottom-10 right-10 w-48 h-48" />

        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-12">
            <AppLogo size={40} />
            <span className="font-bold text-xl text-white tracking-tight">GTM Fox</span>
          </div>

          <div className="mb-8">
            <h1 className="text-4xl font-extrabold text-white leading-tight mb-4">
              Your personal<br />GTM co-pilot
            </h1>
            <p className="text-white/70 text-[15px] leading-relaxed">
              First-time founder? GTM Fox guides you from zero to first customers — strategy, outreach, experiments, and progress in one place.
            </p>
          </div>

          <div className="space-y-4">
            {features?.map((f) => {
              const Icon = f?.icon;
              return (
                <div key={f?.id} className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-white/15 flex items-center justify-center flex-shrink-0">
                    <Icon size={17} className="text-white" />
                  </div>
                  <p className="text-white/85 text-[14px] font-medium">{f?.text}</p>
                </div>
              );
            })}
          </div>
        </div>

        <div className="relative z-10">
          <div className="rounded-xl bg-white/10 border border-white/20 p-4">
            <p className="text-white/80 text-[13px] italic leading-relaxed">
              "I spent 3 months guessing at GTM. GTM Fox helped me get my first 5 paying customers in 3 weeks."
            </p>
            <div className="flex items-center gap-2 mt-3">
              <div className="w-7 h-7 rounded-full bg-white/20 flex items-center justify-center text-white text-[11px] font-bold">
                SK
              </div>
              <div>
                <p className="text-white text-[12px] font-semibold">Siddharth K.</p>
                <p className="text-white/60 text-[11px]">Founder, FormPilot</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Right form panel */}
      <div className="flex-1 flex flex-col items-center justify-center p-6 lg:p-12 bg-background">
        <div className="w-full max-w-md">
          {/* Mobile logo */}
          <div className="flex items-center gap-2 mb-8 lg:hidden">
            <AppLogo size={32} />
            <span className="font-bold text-[16px] text-foreground">GTM Fox</span>
          </div>

          {/* Tab switcher */}
          <div className="flex gap-1 p-1 bg-muted rounded-xl mb-8">
            <button
              onClick={() => setActiveTab('login')}
              className={`flex-1 py-2.5 rounded-lg text-[13px] font-semibold transition-all duration-150 ${
                activeTab === 'login' ? 'bg-card text-foreground shadow-card' : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              Sign In
            </button>
            <button
              onClick={() => setActiveTab('signup')}
              className={`flex-1 py-2.5 rounded-lg text-[13px] font-semibold transition-all duration-150 ${
                activeTab === 'signup' ? 'bg-card text-foreground shadow-card' : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              Create Account
            </button>
          </div>

          {activeTab === 'login' ? (
            <LoginForm onSwitchToSignup={() => setActiveTab('signup')} />
          ) : (
            <SignUpForm onSwitchToLogin={() => setActiveTab('login')} />
          )}
        </div>
      </div>
    </div>
  );
}
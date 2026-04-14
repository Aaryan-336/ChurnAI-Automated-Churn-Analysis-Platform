'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Activity, Eye, EyeOff, Loader2, ArrowRight } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!data.success) { setError(data.error || 'Login failed'); setLoading(false); return; }
      router.push('/dashboard');
    } catch {
      setError('Something went wrong. Please try again.');
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-background">
      {/* Left – branding pane */}
      <div className="hidden lg:flex lg:w-1/2 relative items-center justify-center overflow-hidden">
        {/* Grid bg */}
        <div className="absolute inset-0 dot-grid" />
        {/* Glow */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="h-96 w-96 rounded-full bg-primary/10 blur-[100px]" />
        </div>
        <div className="relative z-10 flex flex-col items-center gap-8 px-12 text-center animate-fade-up">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 border border-primary/20 animate-pulse-glow">
            <Activity className="h-8 w-8 text-primary" />
          </div>
          <div>
            <h1 className="text-4xl font-bold tracking-tight mb-3">
              Welcome back to <span className="gradient-text">ChurnAI</span>
            </h1>
            <p className="text-muted-foreground text-sm leading-relaxed max-w-sm">
              Understand why your users leave. Take action before it's too late.
            </p>
          </div>

          {/* Stat cards teaser */}
          <div className="w-full max-w-sm space-y-3 mt-4">
            {[
              { label: 'Avg churn reduction', value: '-34%' },
              { label: 'Time to first insight', value: '< 2 min' },
            ].map((s) => (
              <div key={s.label} className="glass flex items-center justify-between rounded-xl px-5 py-3">
                <span className="text-xs text-muted-foreground">{s.label}</span>
                <span className="text-sm font-bold text-primary">{s.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right – form pane */}
      <div className="flex flex-1 items-center justify-center p-8">
        <div className="w-full max-w-sm space-y-7 animate-fade-up">
          {/* Mobile logo */}
          <div className="lg:hidden flex items-center gap-2 justify-center mb-2">
            <Activity className="h-5 w-5 text-primary" />
            <span className="font-semibold">ChurnAI</span>
          </div>

          <div className="space-y-1">
            <h2 className="text-2xl font-bold tracking-tight">Sign in</h2>
            <p className="text-sm text-muted-foreground">Enter your credentials to continue</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="rounded-lg border border-destructive/30 bg-destructive/10 px-4 py-3 text-xs text-destructive animate-fade-in">
                {error}
              </div>
            )}

            {/* Email */}
            <div className="space-y-1.5">
              <label htmlFor="login-email" className="text-xs font-medium text-muted-foreground">Email</label>
              <input
                id="login-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@company.com"
                required
                className="flex h-10 w-full rounded-lg border border-input bg-muted/50 px-3 text-sm placeholder:text-muted-foreground/50 transition-all focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring focus-visible:bg-muted"
              />
            </div>

            {/* Password */}
            <div className="space-y-1.5">
              <label htmlFor="login-pw" className="text-xs font-medium text-muted-foreground">Password</label>
              <div className="relative">
                <input
                  id="login-pw"
                  type={showPw ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="flex h-10 w-full rounded-lg border border-input bg-muted/50 px-3 pr-10 text-sm placeholder:text-muted-foreground/50 transition-all focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring focus-visible:bg-muted"
                />
                <button type="button" onClick={() => setShowPw(!showPw)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors">
                  {showPw ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="group flex h-10 w-full items-center justify-center gap-2 rounded-lg bg-primary text-sm font-semibold text-primary-foreground transition-all hover:bg-primary/90 hover:shadow-[0_0_20px_hsl(221_100%_65%/0.3)] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading
                ? <Loader2 className="h-4 w-4 animate-spin" />
                : (<>Sign in <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" /></>)
              }
            </button>
          </form>

          <p className="text-center text-xs text-muted-foreground">
            Don&apos;t have an account?{' '}
            <Link href="/signup" className="font-medium text-primary hover:text-primary/80 transition-colors">
              Create one free
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

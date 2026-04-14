'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Activity, Eye, EyeOff, Loader2, ArrowRight, CheckCircle2 } from 'lucide-react';

const perks = [
  'Schema auto-detection for CSV & XLSX',
  'Churn, retention & DAU/MAU metrics',
  'Custom formula builder',
  'Recharts dashboards — no SQL needed',
];

export default function SignupPage() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (password.length < 6) { setError('Password must be at least 6 characters'); return; }
    setLoading(true);
    try {
      const res = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, name }),
      });
      const data = await res.json();
      if (!data.success) { setError(data.error || 'Signup failed'); setLoading(false); return; }
      router.push('/dashboard');
    } catch {
      setError('Something went wrong. Please try again.');
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-background">
      {/* Left – branding */}
      <div className="hidden lg:flex lg:w-1/2 relative items-center justify-center overflow-hidden">
        <div className="absolute inset-0 dot-grid" />
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="h-96 w-96 rounded-full bg-primary/10 blur-[100px]" />
        </div>
        <div className="relative z-10 flex flex-col items-start gap-8 px-16 animate-fade-up max-w-md">
          <div className="flex items-center gap-2.5">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 border border-primary/20">
              <Activity className="h-5 w-5 text-primary" />
            </div>
            <span className="font-semibold">ChurnAI</span>
          </div>
          <div>
            <h1 className="text-3xl font-bold tracking-tight leading-snug mb-3">
              Start analyzing churn<br />
              <span className="gradient-text">in under 2 minutes</span>
            </h1>
            <p className="text-sm text-muted-foreground leading-relaxed">
              No SQL. No dashboarding tool. No analysts needed.
              Upload your data and let ChurnAI do the rest.
            </p>
          </div>
          <ul className="space-y-3">
            {perks.map((p) => (
              <li key={p} className="flex items-center gap-3 text-sm">
                <CheckCircle2 className="h-4 w-4 text-primary shrink-0" />
                <span className="text-muted-foreground">{p}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Right – form */}
      <div className="flex flex-1 items-center justify-center p-8">
        <div className="w-full max-w-sm space-y-7 animate-fade-up">
          <div className="lg:hidden flex items-center gap-2 justify-center mb-2">
            <Activity className="h-5 w-5 text-primary" />
            <span className="font-semibold">ChurnAI</span>
          </div>

          <div className="space-y-1">
            <h2 className="text-2xl font-bold tracking-tight">Create account</h2>
            <p className="text-sm text-muted-foreground">Free to start. No credit card required.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="rounded-lg border border-destructive/30 bg-destructive/10 px-4 py-3 text-xs text-destructive animate-fade-in">
                {error}
              </div>
            )}

            <div className="space-y-1.5">
              <label htmlFor="su-name" className="text-xs font-medium text-muted-foreground">Name</label>
              <input
                id="su-name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Jane Smith"
                className="flex h-10 w-full rounded-lg border border-input bg-muted/50 px-3 text-sm placeholder:text-muted-foreground/50 transition-all focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring focus-visible:bg-muted"
              />
            </div>

            <div className="space-y-1.5">
              <label htmlFor="su-email" className="text-xs font-medium text-muted-foreground">Email</label>
              <input
                id="su-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@company.com"
                required
                className="flex h-10 w-full rounded-lg border border-input bg-muted/50 px-3 text-sm placeholder:text-muted-foreground/50 transition-all focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring focus-visible:bg-muted"
              />
            </div>

            <div className="space-y-1.5">
              <label htmlFor="su-pw" className="text-xs font-medium text-muted-foreground">Password</label>
              <div className="relative">
                <input
                  id="su-pw"
                  type={showPw ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Min. 6 characters"
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
                : (<>Create account <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" /></>)
              }
            </button>
          </form>

          <p className="text-center text-xs text-muted-foreground">
            Already have an account?{' '}
            <Link href="/login" className="font-medium text-primary hover:text-primary/80 transition-colors">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

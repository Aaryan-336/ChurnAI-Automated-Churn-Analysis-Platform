import Link from 'next/link';
import Navbar from '@/components/layout/Navbar';
import {
  ArrowRight, UploadCloud, Zap, BarChart3, Target,
  ShieldCheck, TrendingDown, Users, ActivitySquare, DollarSign,
} from 'lucide-react';

const features = [
  {
    icon: UploadCloud,
    title: 'Instant Upload',
    desc: 'Drag & drop CSV or XLSX files. Parsed in seconds, no setup required.',
  },
  {
    icon: Zap,
    title: 'Smart Schema Detection',
    desc: 'Automatically identifies user IDs, dates, numerical & categorical columns.',
  },
  {
    icon: BarChart3,
    title: 'Auto Dashboards',
    desc: 'Line charts, bar charts, cohort tables — generated from your data instantly.',
  },
  {
    icon: Target,
    title: 'Metric Recommendations',
    desc: 'ChurnAI recommends churn rate, LTV, DAU/MAU and more based on your schema.',
  },
  {
    icon: ActivitySquare,
    title: 'Custom Formulas',
    desc: 'Define your own metrics with simple formulas like churn = churned / total.',
  },
  {
    icon: ShieldCheck,
    title: 'Saved Projects',
    desc: 'Persist datasets and dashboards per project. Switch contexts any time.',
  },
];

const metrics = [
  { label: 'Churn Rate', value: '4.2%', trend: '-1.1%', icon: TrendingDown, color: 'text-red-400' },
  { label: 'Active Users', value: '28,410', trend: '+3.4%', icon: Users, color: 'text-emerald-400' },
  { label: 'DAU/MAU', value: '0.41', trend: '+0.05', icon: ActivitySquare, color: 'text-blue-400' },
  { label: 'Avg LTV', value: '$1,240', trend: '+$80', icon: DollarSign, color: 'text-amber-400' },
];

const steps = [
  { n: '01', title: 'Upload your dataset', desc: 'CSV or XLSX — we handle parsing, schema detection, and type inference automatically.' },
  { n: '02', title: 'Analyze & Configure', desc: 'Review detected columns, select recommended metrics, or write your own custom formulas.' },
  { n: '03', title: 'Explore Insights', desc: 'Your personalized churn dashboard materializes — charts, KPIs, cohorts, tables, all ready.' },
];

export default function HomePage() {
  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      <Navbar />

      {/* =============================== HERO =============================== */}
      <section className="relative flex flex-col items-center justify-center min-h-screen text-center dot-grid overflow-hidden pt-16">
        {/* Radial glow */}
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
          <div className="h-[600px] w-[600px] rounded-full bg-primary/5 blur-[120px]" />
        </div>

        <div className="relative z-10 flex flex-col items-center gap-6 px-4 max-w-4xl mx-auto">
          {/* Badge */}
          <div className="animate-fade-up inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 text-xs font-medium text-primary">
            <span className="inline-block h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />
            Automated Churn Intelligence — v1.0
          </div>

          {/* Headline */}
          <h1 className="animate-fade-up-1 text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight leading-[1.08]">
            Stop guessing.<br />
            <span className="gradient-text">Start retaining.</span>
          </h1>

          {/* Subtext */}
          <p className="animate-fade-up-2 text-base sm:text-lg text-muted-foreground max-w-xl leading-relaxed">
            Upload your dataset. ChurnAI analyzes the schema, recommends the right metrics,
            and generates a polished analytics dashboard — automatically.
          </p>

          {/* CTA Buttons */}
          <div className="animate-fade-up-3 flex flex-col sm:flex-row items-center gap-3 mt-2">
            <Link
              href="/signup"
              className="group inline-flex h-11 items-center gap-2 rounded-xl bg-primary px-7 text-sm font-semibold text-primary-foreground transition-all hover:bg-primary/90 hover:shadow-[0_0_32px_hsl(221_100%_65%/0.4)] animate-pulse-glow"
            >
              Start for free
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </Link>
            <Link
              href="#how-it-works"
              className="inline-flex h-11 items-center gap-2 rounded-xl border border-border/60 px-7 text-sm font-medium text-muted-foreground transition-all hover:border-border hover:text-foreground hover:bg-muted/50"
            >
              See how it works
            </Link>
          </div>

          {/* Social proof */}
          <p className="animate-fade-up-4 text-xs text-muted-foreground/60">
            No credit card needed · Up and running in 2 minutes
          </p>
        </div>

        {/* Floating mock dashboard card */}
        <div className="animate-fade-up-4 animate-float relative z-10 mx-auto mt-20 w-full max-w-2xl px-6">
          <div className="glass rounded-2xl p-6 shadow-2xl">
            <div className="flex items-center justify-between mb-5">
              <p className="text-xs font-medium text-muted-foreground">Live Dashboard Preview</p>
              <span className="inline-flex items-center gap-1.5 text-xs text-emerald-400">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                Analyzing…
              </span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {metrics.map((m) => (
                <div key={m.label} className="rounded-xl bg-muted/50 border border-border/50 p-3">
                  <p className="text-[10px] text-muted-foreground mb-1">{m.label}</p>
                  <p className="text-lg font-bold">{m.value}</p>
                  <p className={`text-[10px] font-medium mt-0.5 ${m.color}`}>{m.trend}</p>
                </div>
              ))}
            </div>
            {/* Mini bar chart mock */}
            <div className="mt-4 flex items-end gap-1 h-14 w-full">
              {[30, 55, 40, 70, 60, 85, 75, 90, 65, 80, 95, 72].map((h, i) => (
                <div
                  key={i}
                  className="flex-1 rounded-t-sm bg-primary/20 hover:bg-primary/40 transition-colors"
                  style={{ height: `${h}%` }}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* =============================== FEATURES =============================== */}
      <section id="features" className="py-28 line-grid">
        <div className="mx-auto max-w-6xl px-6">
          <div className="text-center mb-16 animate-fade-up">
            <p className="text-xs uppercase tracking-widest text-primary font-semibold mb-3">Features</p>
            <h2 className="text-4xl font-bold tracking-tight">Everything churn, automated</h2>
            <p className="mt-4 text-muted-foreground text-base max-w-xl mx-auto">
              From upload to insight in under a minute. No SQL. No dashboarding tool. No analysts needed.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {features.map((f, i) => (
              <div
                key={f.title}
                className="card-hover hover-glow group rounded-2xl border border-border/60 bg-card p-6 flex flex-col gap-3"
                style={{ animationDelay: `${i * 80}ms` }}
              >
                <div className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 border border-primary/15 transition-all group-hover:bg-primary/20">
                  <f.icon className="h-5 w-5 text-primary" />
                </div>
                <h3 className="font-semibold text-sm">{f.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* =============================== HOW IT WORKS =============================== */}
      <section id="how-it-works" className="py-28 bg-muted/20">
        <div className="mx-auto max-w-5xl px-6">
          <div className="text-center mb-16">
            <p className="text-xs uppercase tracking-widest text-primary font-semibold mb-3">How it Works</p>
            <h2 className="text-4xl font-bold tracking-tight">Three steps to clarity</h2>
          </div>

          <div className="grid md:grid-cols-3 gap-6 relative">
            {/* Connector line */}
            <div className="hidden md:block absolute top-8 left-[20%] right-[20%] h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent" />

            {steps.map((step, i) => (
              <div key={i} className="flex flex-col items-center text-center gap-4 relative">
                <div className="flex h-14 w-14 items-center justify-center rounded-full border border-primary/30 bg-primary/10 animate-pulse-glow z-10">
                  <span className="text-sm font-bold text-primary">{step.n}</span>
                </div>
                <h3 className="font-semibold">{step.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* =============================== CTA =============================== */}
      <section className="py-28 relative overflow-hidden">
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
          <div className="h-[400px] w-[400px] rounded-full bg-primary/8 blur-[100px]" />
        </div>
        <div className="relative z-10 mx-auto max-w-3xl px-6 text-center">
          <h2 className="text-4xl sm:text-5xl font-bold tracking-tight mb-6">
            Ready to{' '}
            <span className="gradient-text">understand churn?</span>
          </h2>
          <p className="text-muted-foreground text-base mb-10 max-w-xl mx-auto">
            Join teams who use ChurnAI to understand their users better,
            reduce churn, and grow retention — automatically.
          </p>
          <Link
            href="/signup"
            className="group inline-flex h-12 items-center gap-2 rounded-xl bg-primary px-8 text-sm font-semibold text-primary-foreground transition-all hover:bg-primary/90 hover:shadow-[0_0_40px_hsl(221_100%_65%/0.5)]"
          >
            Get started free
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
          </Link>
          <div className="mt-6 flex items-center justify-center gap-2 text-xs text-muted-foreground/60">
            <ShieldCheck className="h-3.5 w-3.5" />
            No credit card · Free to start · Cancel any time
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border/50 py-8">
        <div className="mx-auto max-w-6xl px-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <Zap className="h-4 w-4 text-primary" />
            <span className="font-medium text-foreground">ChurnAI</span>
          </div>
          <p className="text-xs">© {new Date().getFullYear()} ChurnAI Inc. All rights reserved.</p>
          <div className="flex gap-4 text-xs">
            <Link href="#" className="hover:text-foreground transition-colors">Privacy</Link>
            <Link href="#" className="hover:text-foreground transition-colors">Terms</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
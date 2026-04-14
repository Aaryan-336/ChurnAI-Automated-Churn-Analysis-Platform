import Link from 'next/link';
import { Activity } from 'lucide-react';

export default function Navbar() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 h-16">
      <div className="absolute inset-0 bg-background/80 backdrop-blur-xl border-b border-border/50" />
      <div className="relative flex h-full items-center justify-between px-6 lg:px-12 max-w-7xl mx-auto">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="relative flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 border border-primary/20 transition-all group-hover:bg-primary/20 group-hover:border-primary/40">
            <Activity className="h-4 w-4 text-primary" />
          </div>
          <span className="text-sm font-semibold tracking-tight">ChurnAI</span>
        </Link>

        {/* Nav Links */}
        <nav className="hidden md:flex items-center gap-8">
          {['Features', 'How it Works', 'Pricing'].map((item) => (
            <Link
              key={item}
              href={`#${item.toLowerCase().replace(/ /g, '-')}`}
              className="text-sm text-muted-foreground hover:text-foreground transition-colors duration-200"
            >
              {item}
            </Link>
          ))}
        </nav>

        {/* Actions */}
        <div className="flex items-center gap-3">
          <Link
            href="/login"
            className="text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            Sign in
          </Link>
          <Link
            href="/signup"
            className="inline-flex h-8 items-center gap-1.5 rounded-lg bg-primary px-4 text-sm font-medium text-primary-foreground transition-all hover:bg-primary/90 hover:shadow-[0_0_16px_hsl(221_100%_65%/0.4)]"
          >
            Get started
          </Link>
        </div>
      </div>
    </header>
  );
}

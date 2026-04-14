'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  LayoutDashboard,
  Database,
  FolderOpen,
  Settings,
  Activity,
  LogOut,
  ChevronRight,
} from 'lucide-react';
import { cn } from '@/lib/utils';

const links = [
  { label: 'Overview',  href: '/dashboard',          icon: LayoutDashboard },
  { label: 'Projects',  href: '/dashboard/projects', icon: FolderOpen },
  { label: 'Datasets',  href: '/dashboard/datasets', icon: Database },
  { label: 'Settings',  href: '/dashboard/settings', icon: Settings },
];

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(true);

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    router.push('/login');
  };

  return (
    <>
      {/* Mobile Toggle */}
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="lg:hidden fixed bottom-6 right-6 z-50 h-12 w-12 rounded-full bg-primary text-primary-foreground shadow-2xl flex items-center justify-center border border-white/10"
      >
        <Activity className={cn("h-5 w-5 transition-transform", isOpen ? "rotate-180" : "")} />
      </button>

      <aside className={cn(
        "h-full flex flex-col border-r border-border/50 bg-card/50 backdrop-blur-xl transition-all duration-500 z-40 overflow-hidden",
        isOpen ? "w-64" : "w-0 lg:w-20"
      )}>
        {/* Logo */}
        <div className="flex h-16 items-center gap-2.5 px-6 border-b border-border/50 shrink-0">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 border border-primary/20">
            <Activity className="h-4 w-4 text-primary" />
          </div>
          {isOpen && <span className="text-sm font-bold tracking-tight animate-fade-in whitespace-nowrap">ChurnAI</span>}
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto custom-scrollbar px-3 py-6 space-y-1">
          {isOpen && (
            <p className="px-3 pb-3 text-[10px] uppercase tracking-widest text-muted-foreground/40 font-black animate-fade-in">
              Navigation
            </p>
          )}
          {links.map(({ label, href, icon: Icon }) => {
            const active = pathname === href || (href !== '/dashboard' && pathname.startsWith(href));
            return (
              <Link
                key={label}
                href={href}
                className={cn(
                  'group flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-bold transition-all duration-300 relative',
                  active
                    ? 'bg-primary/10 text-primary shadow-inner'
                    : 'text-muted-foreground hover:bg-muted/50 hover:text-foreground'
                )}
              >
                <Icon className={cn('h-4 w-4 shrink-0 transition-transform group-hover:scale-110', active ? 'text-primary' : 'opacity-60')} />
                {isOpen && <span className="flex-1 animate-fade-in whitespace-nowrap">{label}</span>}
                {active && isOpen && <div className="h-1 w-1 rounded-full bg-primary shadow-glow" />}
                {active && !isOpen && <div className="absolute left-0 top-1/2 -translate-y-1/2 h-6 w-1 rounded-r-full bg-primary shadow-glow" />}
              </Link>
            );
          })}
        </nav>

        {/* Footer info/Logout */}
        <div className="border-t border-border/50 p-4 space-y-2 shrink-0">
          <button
            onClick={handleLogout}
            className={cn(
              "flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-bold text-muted-foreground/60 transition-all hover:bg-destructive/10 hover:text-destructive w-full",
              !isOpen && "justify-center"
            )}
          >
            <LogOut className="h-4 w-4 shrink-0" />
            {isOpen && <span className="animate-fade-in">Sign out</span>}
          </button>
        </div>
      </aside>
    </>
  );
}

'use client';

import { useState, useEffect } from 'react';
import { Settings, Loader2, LogOut, User, Sparkles, Shield, Bell, CreditCard } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';

export default function SettingsPage() {
  const router = useRouter();
  const [user, setUser] = useState<{ email: string; name: string | null } | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeSection, setActiveSection] = useState('profile');

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch('/api/auth/me');
        const data = await res.json();
        if (data.success) setUser(data.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const handleLogout = async () => {
    toast.info('Signing out...');
    await fetch('/api/auth/logout', { method: 'POST' });
    router.push('/login');
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <Loader2 className="h-6 w-6 animate-spin text-primary opacity-50" />
      </div>
    );
  }

  const sections = [
    { id: 'profile', label: 'Identity Profile', icon: User, desc: 'Manage your personal intelligence credentials.' },
    { id: 'security', label: 'Security & Access', icon: Shield, desc: 'Configure multi-factor and encryption settings.' },
    { id: 'notifications', label: 'Alert Streams', icon: Bell, desc: 'Manage churn signal triggers and weekly reports.' },
    { id: 'billing', label: 'Subscription Level', icon: CreditCard, desc: 'Current Tier: Enterprise Intelligence.' },
  ];

  return (
    <div className="space-y-12 pb-20 max-w-4xl">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
          <div className="flex items-center gap-2 mb-2 text-primary">
            <Settings className="h-4 w-4" />
            <span className="text-[10px] uppercase font-black tracking-[0.2em]">Environment Management</span>
          </div>
          <h1 className="text-4xl font-black tracking-tight tracking-tighter decoration-primary decoration-4">
            System <span className="text-muted-foreground/30">Configuration</span>
          </h1>
          <p className="text-sm text-muted-foreground mt-3 max-w-md font-medium">
            Fine-tune your analysis environment and manage organizational access.
          </p>
        </motion.div>
      </div>

      <div className="grid md:grid-cols-4 gap-8">
         {/* Sidebar Navigation */}
         <div className="md:col-span-1 space-y-1">
            {sections.map(s => (
              <button 
                key={s.id} 
                onClick={() => setActiveSection(s.id)}
                className={`w-full text-left px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${activeSection === s.id ? 'bg-primary/10 text-primary border border-primary/20' : 'text-muted-foreground hover:bg-muted/50 hover:text-foreground border border-transparent'}`}
              >
                {s.label}
              </button>
            ))}
         </div>

         {/* Content Area */}
         <div className="md:col-span-3 space-y-8">
            <AnimatePresence mode="wait">
              {activeSection === 'profile' && (
                <motion.div 
                  key="profile"
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  className="space-y-8"
                >
                  <div className="rounded-3xl border border-border/60 bg-card overflow-hidden shadow-xl">
                    <div className="px-8 py-6 border-b border-border/40 bg-muted/10">
                        <h2 className="text-sm font-black uppercase tracking-widest">Account Identity</h2>
                    </div>
                    <div className="p-8 space-y-8">
                        <div className="grid sm:grid-cols-2 gap-8">
                          <div className="space-y-2">
                              <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/50">Primary Email</label>
                              <p className="text-sm font-bold bg-muted/50 px-4 py-2.5 rounded-xl border border-border/40">{user?.email || '—'}</p>
                          </div>
                          <div className="space-y-2">
                              <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/50">Display Name</label>
                              <p className="text-sm font-bold bg-muted/50 px-4 py-2.5 rounded-xl border border-border/40">{user?.name || 'Authorized Analyst'}</p>
                          </div>
                        </div>
                        
                        <div className="pt-4">
                            <button className="h-10 px-6 rounded-xl bg-foreground text-background text-xs font-bold hover:bg-foreground/90 transition-all">
                              Update Credentials
                            </button>
                        </div>
                    </div>
                  </div>

                  <div className="rounded-3xl border border-red-500/20 bg-red-500/5 p-8">
                    <h2 className="text-sm font-black uppercase tracking-widest text-red-400 mb-2">Security Perimeter</h2>
                    <p className="text-xs font-medium text-muted-foreground/60 mb-8 max-w-sm">
                        Destroy current session tokens and restrict access from this device immediately.
                    </p>
                    <button
                      onClick={handleLogout}
                      className="inline-flex h-11 items-center gap-2 rounded-xl bg-red-500 px-6 text-xs font-black text-white shadow-xl shadow-red-500/20 hover:bg-red-600 transition-all"
                    >
                      <LogOut className="h-4 w-4 stroke-[3px]" />
                      Terminate Session
                    </button>
                  </div>
                </motion.div>
              )}

              {activeSection !== 'profile' && (
                <motion.div 
                  key="other"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="flex flex-col items-center justify-center py-24 text-center rounded-3xl border-2 border-dashed border-border/40 bg-card/10 space-y-6"
                >
                  <div className="h-20 w-20 rounded-3xl bg-primary/5 border border-primary/10 flex items-center justify-center shadow-inner">
                     <Shield className="h-8 w-8 text-primary/20" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold mb-2">Module under Construction</h3>
                    <p className="text-sm text-muted-foreground font-medium max-w-xs">{activeSection.toUpperCase()} configuration is currently being optimized for high-performance scale.</p>
                  </div>
                  <div className="h-1 w-24 bg-primary/20 rounded-full animate-pulse-slow" />
                </motion.div>
              )}
            </AnimatePresence>
         </div>
      </div>
    </div>
  );
}

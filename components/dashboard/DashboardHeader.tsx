'use client';

import { useState } from 'react';
import { Plus, Loader2, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';

interface DashboardHeaderProps {
  projectCount: number;
}

export default function DashboardHeader({ projectCount }: DashboardHeaderProps) {
  const router = useRouter();
  const [showCreate, setShowCreate] = useState(false);
  const [creating, setCreating] = useState(false);
  const [newName, setNewName] = useState('');

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim()) return;
    setCreating(true);
    try {
      const res = await fetch('/api/projects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: newName.trim() }),
      });
      const data = await res.json();
      if (data.success) { 
        setNewName(''); 
        setShowCreate(false); 
        router.refresh(); // Refresh server data
      }
    } catch (err) { 
      console.error(err); 
    } finally { 
      setCreating(false); 
    }
  };

  return (
    <>
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
          <div className="flex items-center gap-2 mb-2 text-primary">
            <Sparkles className="h-4 w-4" />
            <span className="text-[10px] uppercase font-black tracking-[0.2em]">Platform Overview</span>
          </div>
          <h1 className="text-4xl font-black tracking-tight tracking-tighter decoration-primary decoration-4">
            Intelligence <span className="text-muted-foreground/30">Hub</span>
          </h1>
          <p className="text-sm text-muted-foreground mt-3 max-w-md font-medium">
            Manage your analysis pipelines and discover retention insights across <span className="text-foreground font-bold">{projectCount}</span> active projects.
          </p>
        </motion.div>
        
        <motion.button
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setShowCreate(true)}
          className="inline-flex h-12 items-center gap-2 rounded-2xl bg-primary px-6 text-sm font-bold text-primary-foreground shadow-2xl shadow-primary/20 hover:shadow-primary/40 transition-all border border-white/10"
        >
          <Plus className="h-4 w-4 stroke-[3px]" />
          New Project
        </motion.button>
      </div>

      <AnimatePresence>
        {showCreate && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden mt-8"
          >
            <form
              onSubmit={handleCreate}
              className="rounded-3xl border border-primary/30 bg-primary/5 p-8 flex flex-col md:flex-row items-end gap-6 shadow-inner"
            >
              <div className="flex-1 w-full space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-widest text-primary/70 px-1">Internal Project Name</label>
                <input
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  placeholder="e.g. Q2 Retention Strategy"
                  required
                  autoFocus
                  className="flex h-14 w-full rounded-2xl border border-primary/20 bg-background px-6 text-base font-semibold placeholder:text-muted-foreground/30 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary/10 focus-visible:border-primary transition-all"
                />
              </div>
              <div className="flex gap-3 shrink-0">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  disabled={creating}
                  className="inline-flex h-14 items-center justify-center rounded-2xl bg-primary px-8 text-sm font-bold text-primary-foreground hover:bg-primary/90 disabled:opacity-50 shadow-lg shadow-primary/20 transition-all"
                >
                  {creating ? <Loader2 className="h-5 w-5 animate-spin" /> : 'Launch Project'}
                </motion.button>
                <button
                  type="button"
                  onClick={() => setShowCreate(false)}
                  className="inline-flex h-14 items-center justify-center rounded-2xl border border-border px-6 text-sm font-bold text-muted-foreground hover:text-foreground hover:bg-muted transition-all"
                >
                  Cancel
                </button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

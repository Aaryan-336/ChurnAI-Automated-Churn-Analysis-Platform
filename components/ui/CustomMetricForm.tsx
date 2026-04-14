'use client';

import { useState } from 'react';
import { Plus, Calculator, Loader2, ChevronDown, ChevronUp, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';

interface CustomMetricFormProps {
  datasetId: string;
  onSaved: () => void;
}

export default function CustomMetricForm({ datasetId, onSaved }: CustomMetricFormProps) {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState('');
  const [formula, setFormula] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    setLoading(true);
    
    try {
      const res = await fetch('/api/metrics', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: name.trim(), formula: formula.trim(), datasetId }),
      });
      const data = await res.json();
      if (!data.success) { 
        toast.error(data.error || 'Failed to save metric'); 
      } else { 
        setName(''); 
        setFormula(''); 
        setOpen(false); 
        onSaved(); 
        toast.success(`Metric "${name}" saved successfully`);
      }
    } catch { 
      toast.error('Network error while saving metric');
    } finally { 
      setLoading(false); 
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      className="rounded-2xl border border-border/60 bg-card overflow-hidden transition-all duration-300 hover:border-primary/40"
    >
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="flex w-full items-center justify-between px-8 py-5 text-left transition-colors hover:bg-muted/30 group"
      >
        <div className="flex items-center gap-4">
          <div className="h-10 w-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center group-hover:bg-primary/20 transition-colors shadow-glow">
            <Calculator className="h-4 w-4 text-primary" />
          </div>
          <div>
            <p className="text-sm font-bold tracking-tight">Custom Formula Builder</p>
            <p className="text-xs text-muted-foreground font-medium uppercase tracking-widest mt-0.5">Define unique success metrics</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
           <span className="text-[10px] font-bold text-primary opacity-0 group-hover:opacity-100 transition-opacity">BUILD NOW</span>
           {open ? (
             <ChevronUp className="h-4 w-4 text-primary" />
           ) : (
             <ChevronDown className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
           )}
        </div>
      </button>

      <AnimatePresence>
        {open && (
          <motion.div 
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="border-t border-border/40 overflow-hidden"
          >
            <div className="px-8 py-8 bg-muted/10 grid lg:grid-cols-5 gap-8">
              <div className="lg:col-span-2 space-y-4">
                 <div className="flex items-center gap-2 text-primary">
                    <Sparkles className="h-4 w-4" />
                    <span className="text-xs font-bold uppercase tracking-wider">Formula Logic</span>
                 </div>
                 <p className="text-sm text-muted-foreground leading-relaxed">
                   Write mathematical expressions using your column names. Use standard operators like <code>*</code>, <code>/</code>, <code>+</code>, <code>-</code>.
                 </p>
                 <div className="p-4 rounded-xl bg-muted/50 border border-border/40 space-y-2">
                    <p className="text-[10px] font-bold text-muted-foreground uppercase">Example</p>
                    <code className="text-xs font-mono text-primary truncate block">
                      (total_spend - churned_revenue) / total_spend
                    </code>
                 </div>
              </div>

              <form onSubmit={handleSubmit} className="lg:col-span-3 space-y-6">
                <div className="grid sm:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label htmlFor="m-name" className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Metric Identity</label>
                    <input
                      id="m-name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g. Net Revenue Retention"
                      required
                      className="flex h-12 w-full rounded-xl border border-border bg-background px-4 text-sm font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/20 focus-visible:border-primary shadow-inner"
                    />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="m-formula" className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Mathematical Formula</label>
                    <input
                      id="m-formula"
                      value={formula}
                      onChange={(e) => setFormula(e.target.value)}
                      placeholder="spend / total * 100"
                      className="flex h-12 w-full rounded-xl border border-border bg-background px-4 text-sm font-mono font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/20 focus-visible:border-primary shadow-inner"
                    />
                  </div>
                </div>
                <div className="flex items-center justify-end gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setOpen(false)}
                    className="inline-flex h-11 items-center rounded-xl border border-border px-6 text-sm font-bold text-muted-foreground hover:text-foreground hover:bg-muted transition-all"
                  >
                    Cancel
                  </button>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    type="submit"
                    disabled={loading}
                    className="inline-flex h-11 items-center gap-2 rounded-xl bg-primary px-8 text-sm font-bold text-primary-foreground hover:bg-primary/90 disabled:opacity-50 shadow-lg shadow-primary/20 transition-all border border-primary/20"
                  >
                    {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : (<><Plus className="h-4 w-4" /> Deploy Metric</>)}
                  </motion.button>
                </div>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

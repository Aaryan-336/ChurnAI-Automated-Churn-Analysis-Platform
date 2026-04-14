'use client';

import { MetricRecommendation } from '@/types';
import { TrendingDown, TrendingUp, Zap, DollarSign, Plus, Check } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface MetricRecommendationsProps {
  recommendations: MetricRecommendation[];
  onSelect: (metric: MetricRecommendation) => void;
}

const catConfig: Record<string, { icon: React.ElementType; color: string; bg: string }> = {
  churn:     { icon: TrendingDown, color: 'text-red-400',     bg: 'bg-red-500/10 border-red-500/20' },
  retention: { icon: TrendingUp,   color: 'text-emerald-400', bg: 'bg-emerald-500/10 border-emerald-500/20' },
  engagement:{ icon: Zap,          color: 'text-blue-400',    bg: 'bg-blue-500/10 border-blue-500/20' },
  revenue:   { icon: DollarSign,   color: 'text-amber-400',   bg: 'bg-amber-500/10 border-amber-500/20' },
};

export default function MetricRecommendations({ recommendations, onSelect }: MetricRecommendationsProps) {
  const [selected, setSelected] = useState<Set<string>>(new Set());

  const toggle = (rec: MetricRecommendation) => {
    setSelected((prev) => {
      const next = new Set(prev);
      next.has(rec.name) ? next.delete(rec.name) : next.add(rec.name);
      return next;
    });
    onSelect(rec);
  };

  const grouped = (recommendations || []).reduce<Record<string, MetricRecommendation[]>>((acc, r) => {
    if (!r.category) return acc;
    (acc[r.category] = acc[r.category] || []).push(r);
    return acc;
  }, {});

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      className="rounded-2xl border border-border/60 bg-card overflow-hidden"
    >
      <div className="border-b border-border/40 px-8 py-5 bg-muted/20 flex items-center justify-between">
        <div>
          <h3 className="text-sm font-bold tracking-tight">AI Recommendations</h3>
          <p className="text-xs text-muted-foreground mt-0.5">
            Optimized metrics discovered in your data structure
          </p>
        </div>
        <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center">
           <Zap className="h-4 w-4 text-primary animate-pulse" />
        </div>
      </div>

      <div className="p-8 space-y-8">
        {Object.entries(grouped).map(([cat, recs], groupIdx) => {
          const cfg = catConfig[cat] || catConfig.engagement;
          const Icon = cfg.icon;
          return (
            <div key={cat} className="space-y-4">
              <div className="flex items-center gap-3">
                <div className={cn("h-6 w-6 rounded-full flex items-center justify-center", cfg.bg)}>
                   <Icon className={cn("h-3 w-3", cfg.color)} />
                </div>
                <p className="text-[10px] uppercase tracking-[0.2em] font-black text-muted-foreground/40">
                  {cat} Strategies
                </p>
              </div>

              <div className="grid grid-cols-1 gap-4">
                {recs.map((rec, i) => {
                  const isSelected = selected.has(rec.name);
                  return (
                    <motion.button
                      key={rec.name}
                      whileHover={{ scale: 1.01 }}
                      whileTap={{ scale: 0.99 }}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: (groupIdx * 0.1) + (i * 0.05) }}
                      onClick={() => toggle(rec)}
                      className={cn(
                        'group relative flex flex-col items-start gap-4 rounded-3xl border p-6 text-left transition-all duration-300',
                        isSelected
                          ? 'border-primary shadow-glow bg-primary/5'
                          : 'border-border/60 hover:border-primary/30 hover:bg-muted/30'
                      )}
                    >
                      <div className="flex w-full items-center justify-between pointer-events-none">
                        <span className={cn('inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-[9px] font-black uppercase tracking-tighter', cfg.bg, cfg.color)}>
                          {rec.category}
                        </span>
                        <div className={cn(
                          'flex h-7 w-7 items-center justify-center rounded-xl border transition-all duration-500',
                          isSelected ? 'bg-primary border-primary rotate-0' : 'border-border rotate-45 group-hover:rotate-0'
                        )}>
                          {isSelected
                            ? <Check className="h-4 w-4 text-primary-foreground" />
                            : <Plus className="h-4 w-4 text-muted-foreground group-hover:text-primary" />
                          }
                        </div>
                      </div>

                      <div className="space-y-1.5 pr-4">
                        <p className="text-sm font-bold tracking-tight text-foreground/90">{rec.name}</p>
                        <p className="text-xs text-muted-foreground leading-relaxed font-medium">{rec.description}</p>
                      </div>

                      <div className="w-full mt-2 relative">
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                        <div className="rounded-xl bg-muted/50 px-4 py-3 border border-border/20 group-hover:border-primary/20 transition-colors">
                          <code className="block w-full text-[10px] font-mono text-muted-foreground/80 break-all leading-tight">
                            {rec.formula}
                          </code>
                        </div>
                      </div>
                    </motion.button>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </motion.div>
  );
}

'use client';

import { ColumnSchema } from '@/types';
import { Hash, Calendar, Type, ToggleLeft, HelpCircle, User, Zap, Database } from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

interface SchemaViewerProps {
  schema: ColumnSchema[];
}

const typeConfig: Record<string, { icon: React.ElementType; color: string; bg: string }> = {
  numerical:   { icon: Hash,        color: 'text-blue-400',   bg: 'bg-blue-500/10 border-blue-500/20' },
  categorical: { icon: Database,    color: 'text-violet-400', bg: 'bg-violet-500/10 border-violet-500/20' },
  date:        { icon: Calendar,    color: 'text-amber-400',  bg: 'bg-amber-500/10 border-amber-500/20' },
  text:        { icon: Type,        color: 'text-emerald-400', bg: 'bg-emerald-500/10 border-emerald-500/20' },
  boolean:     { icon: ToggleLeft,  color: 'text-pink-400',    bg: 'bg-pink-500/10 border-pink-500/20' },
  unknown:     { icon: HelpCircle,  color: 'text-muted-foreground', bg: 'bg-muted border-border' },
};

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05
    }
  }
};

const item = {
  hidden: { opacity: 0, x: -10 },
  show: { opacity: 1, x: 0 }
};

export default function SchemaViewer({ schema }: SchemaViewerProps) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-2xl border border-border/60 bg-card/50 backdrop-blur-xl overflow-hidden shadow-2xl"
    >
      <div className="flex items-center justify-between border-b border-border/40 px-8 py-5 bg-muted/20">
        <div>
          <h3 className="text-base font-bold tracking-tight">Data Schema</h3>
          <p className="text-xs text-muted-foreground mt-1">
            Detected <span className="text-foreground font-semibold">{schema.length}</span> individual feature columns
          </p>
        </div>
        <div className="flex -space-x-2">
           {schema.slice(0, 5).map((col, i) => {
             const cfg = typeConfig[col.type] || typeConfig.unknown;
             return (
               <div key={i} className={cn("h-8 w-8 rounded-full border-2 border-card flex items-center justify-center shadow-lg", cfg.bg)}>
                 <cfg.icon className={cn("h-3.5 w-3.5", cfg.color)} />
               </div>
             )
           })}
           {schema.length > 5 && (
             <div className="h-8 w-8 rounded-full border-2 border-card bg-muted flex items-center justify-center text-[10px] font-bold">
               +{schema.length - 5}
             </div>
           )}
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-muted/10 border-b border-border/20">
              {['Column Name', 'Data Type', 'Uniques', 'Nulls', 'Sample Data'].map((h) => (
                <th key={h} className="px-8 py-4 text-left text-[10px] uppercase font-bold tracking-[0.1em] text-muted-foreground/50">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <motion.tbody variants={container} initial="hidden" animate="show">
            {schema.map((col) => {
              const cfg = typeConfig[col.type] || typeConfig.unknown;
              return (
                <motion.tr
                  variants={item}
                  key={col.name}
                  className="border-b border-border/10 hover:bg-muted/20 transition-all duration-150 group"
                >
                  <td className="px-8 py-4">
                    <div className="flex items-center gap-3">
                      <div className={cn("h-8 w-8 rounded-lg flex items-center justify-center transition-transform group-hover:scale-110", cfg.bg)}>
                         <cfg.icon className={cn("h-4 w-4", cfg.color)} />
                      </div>
                      <span className="font-mono text-xs font-semibold group-hover:text-primary transition-colors">{col.name}</span>
                      {col.isPossibleUserId && (
                        <span className="px-1.5 py-0.5 rounded bg-blue-500/10 text-[9px] text-blue-400 font-bold border border-blue-500/20 uppercase tracking-tighter">Identity</span>
                      )}
                    </div>
                  </td>
                  <td className="px-8 py-4">
                    <span className={cn("text-xs font-medium px-2.5 py-1 rounded-full border", cfg.bg, cfg.color)}>
                      {col.type}
                    </span>
                  </td>
                  <td className="px-8 py-4 font-mono text-xs text-muted-foreground">{col.uniqueCount.toLocaleString()}</td>
                  <td className="px-8 py-4 font-mono text-xs text-muted-foreground">{col.nullCount}</td>
                  <td className="px-8 py-4">
                    <div className="flex gap-1.5 overflow-hidden">
                      {col.sampleValues.slice(0, 2).map((v, i) => (
                        <span key={i} className="px-2 py-0.5 rounded bg-muted/50 border border-border/20 text-[10px] text-muted-foreground font-mono max-w-[100px] truncate">
                          {v}
                        </span>
                      ))}
                    </div>
                  </td>
                </motion.tr>
              );
            })}
          </motion.tbody>
        </table>
      </div>
    </motion.div>
  );
}

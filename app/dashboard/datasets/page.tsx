'use client';

import { useEffect, useState } from 'react';
import { Database, Loader2, Table2, Sparkles, Search } from 'lucide-react';
import { motion } from 'framer-motion';

interface DatasetRow {
  id: string;
  name: string;
  rowCount: number;
  createdAt: string;
  project?: { name: string };
}

export default function DatasetsPage() {
  const [datasets, setDatasets] = useState<DatasetRow[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch('/api/projects');
        const data = await res.json();
        if (data.success) {
          const all: DatasetRow[] = [];
          for (const project of data.data) {
            for (const ds of project.datasets) {
              all.push({ ...ds, project: { name: project.name } });
            }
          }
          setDatasets(all);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <motion.div animate={{ scale: [1, 1.1, 1] }} transition={{ repeat: Infinity }}>
          <Database className="h-8 w-8 text-primary opacity-50" />
        </motion.div>
      </div>
    );
  }

  return (
    <div className="space-y-12 pb-20">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
          <div className="flex items-center gap-2 mb-2 text-primary">
            <Sparkles className="h-4 w-4" />
            <span className="text-[10px] uppercase font-black tracking-[0.2em]">Data Repository</span>
          </div>
          <h1 className="text-4xl font-black tracking-tight tracking-tighter decoration-primary decoration-4">
            Source <span className="text-muted-foreground/30">Library</span>
          </h1>
          <p className="text-sm text-muted-foreground mt-3 max-w-md font-medium">
            A centralized view of all ingested customer records across your analysis pipeline.
          </p>
        </motion.div>

        <div className="relative group">
           <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/50 group-focus-within:text-primary transition-colors" />
           <input 
            placeholder="Search datasets..." 
            className="h-12 w-full md:w-64 pl-11 pr-6 rounded-2xl border border-border/60 bg-card/50 text-xs font-bold focus:outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all shadow-inner"
           />
        </div>
      </div>

      {datasets.length === 0 ? (
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex flex-col items-center justify-center rounded-3xl border-2 border-dashed border-border/60 py-24 text-center dot-grid relative"
        >
          <div className="h-20 w-20 rounded-3xl bg-muted border border-border/60 flex items-center justify-center mb-6">
            <Table2 className="h-8 w-8 text-muted-foreground/30" />
          </div>
          <h2 className="text-xl font-bold mb-3">No data ingested yet</h2>
          <p className="text-sm text-muted-foreground max-w-sm font-medium">
            Once you upload a CSV or XLSX file to any project, it will appear here for global access.
          </p>
        </motion.div>
      ) : (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-3xl border border-border/60 bg-card overflow-hidden shadow-2xl"
        >
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-muted/30 border-b border-border/40">
                <th className="px-8 py-5 text-left text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/50">Source File</th>
                <th className="px-8 py-5 text-left text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/50">Associated Project</th>
                <th className="px-8 py-5 text-left text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/50">Record Count</th>
                <th className="px-8 py-5 text-left text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/50">Ingestion Date</th>
              </tr>
            </thead>
            <tbody>
              {datasets.map((ds, i) => (
                <tr key={ds.id} className="border-b border-border/20 hover:bg-muted/20 transition-all group">
                  <td className="px-8 py-5 max-w-[240px]">
                    <div className="flex items-center gap-4">
                       <div className="h-10 w-10 rounded-xl bg-primary/5 border border-primary/10 flex items-center justify-center group-hover:bg-primary/10 transition-colors">
                          <Database className="h-4 w-4 text-primary" />
                       </div>
                       <span className="font-bold truncate group-hover:text-primary transition-colors">{ds.name}</span>
                    </div>
                  </td>
                  <td className="px-8 py-5">
                    <span className="text-xs font-bold text-muted-foreground group-hover:text-foreground transition-colors">{ds.project?.name || '-'}</span>
                  </td>
                  <td className="px-8 py-5">
                    <span className="text-xs font-mono font-bold tabular-nums">{ds.rowCount.toLocaleString()} pts</span>
                  </td>
                  <td className="px-8 py-5">
                    <span className="text-xs font-bold text-muted-foreground/60">{new Date(ds.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </motion.div>
      )}
    </div>
  );
}

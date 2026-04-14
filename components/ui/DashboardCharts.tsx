'use client';

import { useMemo } from 'react';
import {
  ResponsiveContainer, LineChart, Line, BarChart, Bar,
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
} from 'recharts';
import { TrendingUp, TrendingDown, Minus, Info, BarChart3, Zap, LineChart as LineIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

/* ---- KPI Card ---- */
interface KPICardProps {
  title: string;
  value: string | number;
  change?: number;
  suffix?: string;
  icon?: React.ElementType;
}

export function KPICard({ title, value, change, suffix, icon: Icon }: KPICardProps) {
  const trend = change !== undefined ? (change > 0 ? 'up' : change < 0 ? 'down' : 'flat') : undefined;
  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      whileInView={{ opacity: 1, scale: 1 }}
      className="group rounded-2xl border border-border/60 bg-card/40 backdrop-blur-md p-6 hover:border-primary/40 transition-all duration-300 relative overflow-hidden"
    >
      <div className="absolute top-0 right-0 p-3 opacity-10 group-hover:opacity-20 transition-opacity">
        {Icon && <Icon className="h-12 w-12" />}
      </div>
      
      <div className="flex items-center gap-2 mb-3">
        <p className="text-[10px] uppercase tracking-widest font-bold text-muted-foreground/50">{title}</p>
        <div className="h-1 w-1 rounded-full bg-primary/40" />
      </div>
      
      <div className="flex items-baseline gap-2">
        <p className="text-3xl font-bold tabular-nums tracking-tight">{value}{suffix}</p>
        {trend && (
          <span className={cn('inline-flex items-center gap-0.5 text-xs font-bold px-2 py-0.5 rounded-full border',
            trend === 'up' ? 'text-emerald-400 bg-emerald-400/10 border-emerald-400/20' : 
            trend === 'down' ? 'text-red-400 bg-red-400/10 border-red-400/20' : 
            'text-muted-foreground bg-muted border-border'
          )}>
            {trend === 'up' ? <TrendingUp className="h-3 w-3" /> : trend === 'down' ? <TrendingDown className="h-3 w-3" /> : <Minus className="h-3 w-3" />}
            {Math.abs(change!).toFixed(1)}%
          </span>
        )}
      </div>
    </motion.div>
  );
}

/* ---- Shared Tooltip Style ---- */
const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="glass rounded-xl border border-border/60 p-3 shadow-2xl">
        <p className="text-[10px] font-bold text-muted-foreground mb-2 uppercase tracking-tight">{label}</p>
        <div className="space-y-1.5">
          {payload.map((p: any, i: number) => (
            <div key={i} className="flex items-center justify-between gap-6">
              <div className="flex items-center gap-2">
                <div className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: p.stroke || p.fill }} />
                <span className="text-[11px] font-medium text-foreground/80">{p.name}</span>
              </div>
              <span className="text-[11px] font-bold tabular-nums">{p.value.toLocaleString()}</span>
            </div>
          ))}
        </div>
      </div>
    );
  }
  return null;
};

/* ---- Chart Card Wrapper ---- */
function ChartCard({ title, icon: Icon, children }: { title: string; icon: React.ElementType; children: React.ReactNode }) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      className="rounded-2xl border border-border/60 bg-card/30 backdrop-blur-sm p-8"
    >
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <div className="h-9 w-9 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center">
            <Icon className="h-4 w-4 text-primary" />
          </div>
          <div>
            <h3 className="text-sm font-bold tracking-tight">{title}</h3>
            <p className="text-[10px] text-muted-foreground font-medium uppercase tracking-widest mt-0.5">Automated Intelligence</p>
          </div>
        </div>
        <button className="h-8 w-8 rounded-lg hover:bg-muted flex items-center justify-center text-muted-foreground transition-colors">
          <Info className="h-4 w-4" />
        </button>
      </div>
      <div className="h-64 w-full">
        <ResponsiveContainer width="100%" height="100%">
          {children as React.ReactElement}
        </ResponsiveContainer>
      </div>
    </motion.div>
  );
}

/* ---- Main Component ---- */
interface DashboardChartsProps {
  data: Record<string, any>[];
  schema: { name: string; type: string }[];
  isAnalyzing?: boolean;
}

const COLORS = ['#4f6ef7', '#10b981', '#f59e0b', '#ef4444', '#a78bfa'];

export default function DashboardCharts({ data = [], schema = [], isAnalyzing = false }: DashboardChartsProps) {
  const { lineData, barData, dateCol, numCols, catCol } = useMemo(() => {
    if (!schema || !Array.isArray(schema)) return { lineData: [], barData: [], dateCol: null, numCols: [], catCol: null };
    
    const dateCol = schema.find((c) => c.type === 'date');
    const numCols = schema.filter((c) => c.type === 'numerical').slice(0, 3);
    const catCol  = schema.find((c) => c.type === 'categorical');

    const sorted = dateCol
      ? [...data].sort((a, b) => new Date(a[dateCol.name]).getTime() - new Date(b[dateCol.name]).getTime())
      : data;

    const sampled = sorted.filter((_, i) => i % Math.max(1, Math.floor(sorted.length / 40)) === 0).slice(0, 40);

    const lineData = sampled.map((row) => {
      const point: Record<string, string | number> = {};
      if (dateCol) {
        const d = new Date(row[dateCol.name]);
        point.date = isNaN(d.getTime()) ? row[dateCol.name] : `${d.getMonth() + 1}/${d.getDate()}`;
      }
      numCols.forEach((c) => { point[c.name] = parseFloat(row[c.name]) || 0; });
      return point;
    });

    let barData: Record<string, string | number>[] = [];
    if (catCol && numCols.length > 0) {
      const groups: Record<string, number[]> = {};
      data.forEach((row) => {
        const key = row[catCol.name] || 'Unknown';
        (groups[key] = groups[key] || []).push(parseFloat(row[numCols[0].name]) || 0);
      });
      barData = Object.entries(groups)
        .slice(0, 8)
        .map(([name, vals]) => ({
          name,
          avg: +(vals.reduce((a, b) => a + b, 0) / vals.length).toFixed(2),
        }));
    }

    return { lineData, barData, dateCol, numCols, catCol };
  }, [data, schema]);

  const axisProps = {
    tick: { fontSize: 10, fill: 'hsl(0 0% 40%)', fontWeight: 600 },
    stroke: 'hsl(0 0% 20%)',
    axisLine: false,
    tickLine: false,
  };

  return (
    <div className="relative">
      <AnimatePresence>
        {isAnalyzing && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-50 rounded-3xl bg-background/40 backdrop-blur-md flex flex-col items-center justify-center gap-4"
          >
            <div className="h-12 w-12 rounded-2xl bg-primary/20 border border-primary/40 flex items-center justify-center animate-pulse">
              <Zap className="h-6 w-6 text-primary" />
            </div>
            <div className="space-y-1 text-center">
              <p className="text-sm font-bold tracking-tight">Computing Intelligence...</p>
              <p className="text-[10px] text-muted-foreground uppercase tracking-widest">Aggregating Signal Clusters</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className={cn("space-y-6 transition-all duration-700", isAnalyzing && "blur-xl scale-[0.98] opacity-50")}>
        <div className="grid lg:grid-cols-2 gap-6">
        {/* Retention Trend */}
        {lineData.length > 0 && numCols.length > 0 && (
          <ChartCard title="Performance Discovery" icon={LineIcon}>
            <AreaChart data={lineData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                {numCols.map((c, i) => (
                  <linearGradient key={i} id={`color${i}`} x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={COLORS[i % COLORS.length]} stopOpacity={0.3} />
                    <stop offset="95%" stopColor={COLORS[i % COLORS.length]} stopOpacity={0} />
                  </linearGradient>
                ))}
              </defs>
              <CartesianGrid strokeDasharray="5 5" stroke="hsl(0 0% 15%)" vertical={false} />
              <XAxis dataKey={dateCol ? 'date' : undefined} {...axisProps} dy={10} />
              <YAxis {...axisProps} dx={-10} />
              <Tooltip content={<CustomTooltip />} />
              {numCols.map((col, i) => (
                <Area
                  key={col.name}
                  type="monotone"
                  dataKey={col.name}
                  stroke={COLORS[i % COLORS.length]}
                  strokeWidth={3}
                  fillOpacity={1}
                  fill={`url(#color${i})`}
                  animationDuration={1500}
                />
              ))}
            </AreaChart>
          </ChartCard>
        )}

        {/* Categories */}
        {barData.length > 0 && catCol && (
          <ChartCard title="Structural Distribution" icon={BarChart3}>
            <BarChart data={barData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }} barSize={32}>
              <CartesianGrid strokeDasharray="5 5" stroke="hsl(0 0% 15%)" vertical={false} />
              <XAxis dataKey="name" {...axisProps} dy={10} />
              <YAxis {...axisProps} dx={-10} />
              <Tooltip content={<CustomTooltip />} />
              <Bar 
                dataKey="avg" 
                name="Average Value" 
                fill="#4f6ef7" 
                radius={[6, 6, 0, 0]}
                animationDuration={1500}
              />
            </BarChart>
          </ChartCard>
        )}
      </div>

      {/* Raw View */}
      <motion.div 
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        className="rounded-2xl border border-border/60 bg-card/20 overflow-hidden"
      >
        <div className="px-8 py-5 border-b border-border/40 bg-muted/10 flex items-center justify-between">
          <div>
            <p className="text-sm font-bold tracking-tight">Dataset Explorer</p>
            <p className="text-[10px] text-muted-foreground font-medium uppercase tracking-widest mt-0.5">Showing first 12 entries</p>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-border/20">
                {schema.slice(0, 6).map((col) => (
                  <th key={col.name} className="px-8 py-4 text-left font-bold text-muted-foreground/60 whitespace-nowrap uppercase tracking-tighter">
                    {col.name}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {data.slice(0, 12).map((row, i) => (
                <tr key={i} className="border-b border-border/10 hover:bg-muted/30 transition-colors group">
                  {schema.slice(0, 6).map((col) => (
                    <td key={col.name} className="px-8 py-3 text-muted-foreground font-mono group-hover:text-foreground transition-colors">
                      {row[col.name] ?? '—'}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>
    </div>
  </div>
);
}

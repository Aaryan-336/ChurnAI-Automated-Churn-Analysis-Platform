import { getCurrentUser } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { redirect } from 'next/navigation';
import DashboardHeader from '@/components/dashboard/DashboardHeader';
import ProjectGrid from '@/components/dashboard/ProjectGrid';
import { Database, TrendingDown, FolderOpen, Zap, Plus } from 'lucide-react';
import { cn } from '@/lib/utils';
import Link from 'next/link';

export default async function DashboardPage() {
  const user = await getCurrentUser();
  if (!user) {
    redirect('/login');
  }

  const projects = await prisma.project.findMany({
    where: { userId: user.userId },
    include: {
      datasets: { select: { id: true, name: true, rowCount: true, createdAt: true } },
      dashboards: { select: { id: true, name: true, createdAt: true } },
    },
    orderBy: { updatedAt: 'desc' },
  });

  const totalRows = projects.flatMap((p: any) => p.datasets).reduce((acc: number, ds: any) => acc + ds.rowCount, 0);
  const totalDatasets = projects.flatMap((p: any) => p.datasets).length;

  return (
    <div className="space-y-12 pb-20">
      <DashboardHeader projectCount={projects.length} />

      {/* Hero Stats Card */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {[
          { label: 'Active Projects', value: projects.length, icon: FolderOpen, color: 'text-blue-400', bg: 'bg-blue-400/10' },
          { label: 'Ingested Datasets', value: totalDatasets, icon: Database, color: 'text-emerald-400', bg: 'bg-emerald-400/10' },
          { label: 'Total Rows Analyzed', value: totalRows.toLocaleString(), icon: TrendingDown, color: 'text-amber-400', bg: 'bg-amber-400/10' },
        ].map((stat) => (
          <div key={stat.label} className="relative group rounded-3xl border border-border/60 bg-card/50 p-8 hover:border-primary/40 transition-all duration-300 overflow-hidden">
            <div className={cn("absolute top-0 right-0 p-6 opacity-5 group-hover:opacity-10 transition-opacity", stat.color)}>
               <stat.icon className="h-20 w-20" />
            </div>
            <div className={cn("h-12 w-12 rounded-2xl flex items-center justify-center mb-6 shadow-inner", stat.bg)}>
              <stat.icon className={cn("h-5 w-5", stat.color)} />
            </div>
            <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-1">{stat.label}</p>
            <p className="text-3xl font-black tracking-tight">{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Projects grid */}
      <div>
        <div className="flex items-center gap-4 mb-8">
           <h2 className="text-sm font-black uppercase tracking-[0.3em] text-muted-foreground/40 whitespace-nowrap">Active Analysis Pipelines</h2>
           <div className="h-px w-full bg-border/40" />
        </div>

        {projects.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-3xl border-2 border-dashed border-border/60 py-24 text-center dot-grid relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-b from-transparent to-background/5 p-4 pointer-events-none" />
            <div className="h-20 w-20 rounded-3xl bg-primary/10 border border-primary/20 flex items-center justify-center mb-6 relative z-10 shadow-glow animate-pulse">
              <Zap className="h-8 w-8 text-primary" />
            </div>
            <h2 className="text-xl font-bold mb-3 relative z-10">Ignite Your Intelligence</h2>
            <p className="text-sm text-muted-foreground mb-8 max-w-sm relative z-10 font-medium leading-relaxed">
              You haven't initialized any projects yet. Start by creating a container for your churn datasets.
            </p>
            <Link
              href="/dashboard?create=true"
              className="relative z-10 inline-flex h-12 items-center gap-2 rounded-2xl bg-foreground text-background px-8 text-sm font-bold hover:bg-foreground/90 transition-all shadow-xl"
            >
              <Plus className="h-4 w-4 stroke-[3px]" />
              Initialize First Project
            </Link>
          </div>
        ) : (
          <ProjectGrid projects={projects} />
        )}
      </div>
    </div>
  );
}

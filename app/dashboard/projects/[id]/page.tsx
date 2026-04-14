import { getCurrentUser } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { notFound, redirect } from 'next/navigation';
import { Sparkles, ArrowLeft, MoreHorizontal, Settings, Trash2, LayoutDashboard } from 'lucide-react';
import Link from 'next/link';
import ProjectAnalysisFlow from '@/components/projects/ProjectAnalysisFlow';

interface ProjectPageProps {
  params: { id: string };
}

export default async function ProjectPage({ params }: ProjectPageProps) {
  const user = await getCurrentUser();
  if (!user) redirect('/login');

  const project = await prisma.project.findUnique({
    where: { id: params.id, userId: user.userId },
    include: {
      datasets: { orderBy: { createdAt: 'desc' } },
      dashboards: true,
    },
  });

  if (!project) notFound();

  return (
    <div className="max-w-[1400px] mx-auto pb-20 space-y-10">
      {/* Navigation & Breadcrumbs */}
      <div className="flex flex-col gap-6">
        <div className="flex items-center gap-2 text-xs font-bold text-muted-foreground/60 transition-colors">
          <Link href="/dashboard" className="hover:text-primary transition-colors">Workspace</Link>
          <span className="opacity-30">/</span>
          <span className="text-primary truncate max-w-[200px]">{project.name}</span>
        </div>

        {/* Header Block */}
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-8">
          <div className="flex-1 space-y-4">
            <h1 className="text-4xl font-black tracking-tight tracking-tighter decoration-primary decoration-4">
              {project.name}
            </h1>
            <div className="flex flex-wrap items-center gap-4 text-xs font-semibold text-muted-foreground">
              <span className="flex items-center gap-2 bg-muted/50 border border-border/60 px-3 py-1.5 rounded-full">
                <LayoutDashboard className="h-3 w-3 text-primary" />
                Project Intelligence
              </span>
              <span className="flex items-center gap-2 bg-muted/50 border border-border/60 px-3 py-1.5 rounded-full">
                Created {new Date(project.createdAt).toLocaleDateString()}
              </span>
            </div>
            {project.description && (
              <p className="max-w-xl text-sm leading-relaxed text-muted-foreground font-medium italic">
                “{project.description}”
              </p>
            )}
          </div>

          <div className="flex items-center gap-3">
            <button className="h-12 w-12 flex items-center justify-center rounded-2xl border border-border/60 bg-card hover:bg-muted transition-all">
              <Settings className="h-4 w-4" />
            </button>
            <button className="h-12 items-center gap-2 rounded-2xl border border-border/60 bg-card px-6 text-sm font-bold hover:bg-muted transition-all hidden sm:flex">
              Export Analysis
            </button>
          </div>
        </div>
      </div>

      {/* Analysis Flow - Client Island */}
      <ProjectAnalysisFlow project={project} initialDatasets={project.datasets} />
    </div>
  );
}

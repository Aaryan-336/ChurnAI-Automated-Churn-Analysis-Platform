'use client';

import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { FolderOpen, ArrowRight, Database } from 'lucide-react';

interface ProjectSummary {
  id: string;
  name: string;
  description: string | null;
  createdAt: Date;
  datasets: { id: string; name: string; rowCount: number; createdAt: Date }[];
}

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.1 } }
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 }
};

export default function ProjectGrid({ projects }: { projects: ProjectSummary[] }) {
  const router = useRouter();

  return (
    <motion.div 
      variants={container}
      initial="hidden"
      animate="show"
      className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
    >
      {projects.map((project) => (
        <motion.div
          variants={item}
          key={project.id}
          whileHover={{ y: -8 }}
          className="group relative cursor-pointer rounded-3xl border border-border/60 bg-card p-1 shadow-sm hover:shadow-2xl hover:shadow-primary/5 transition-all duration-500"
          onClick={() => router.push(`/dashboard/projects/${project.id}`)}
        >
          <div className="p-7">
            <div className="flex items-start justify-between mb-8">
              <div className="h-14 w-14 rounded-2xl bg-primary/5 border border-primary/10 flex items-center justify-center group-hover:bg-primary/10 transition-colors shadow-inner">
                <FolderOpen className="h-6 w-6 text-primary" />
              </div>
              <div className="h-8 w-8 rounded-full border border-border/60 flex items-center justify-center text-muted-foreground group-hover:text-primary group-hover:border-primary/40 transition-all">
                 <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
              </div>
            </div>
            
            <h3 className="text-xl font-bold mb-2 group-hover:text-primary transition-colors tracking-tight">
              {project.name}
            </h3>
            <div className="flex items-center gap-3 text-xs text-muted-foreground font-semibold">
              <span className="flex items-center gap-1.5 uppercase tracking-tighter">
                <Database className="h-3.5 w-3.5" />
                {project.datasets.length} Data Sources
              </span>
              <span className="h-1 w-1 rounded-full bg-border" />
              <span>{new Date(project.createdAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</span>
            </div>

            {project.datasets.length > 0 && (
              <div className="mt-8 pt-6 border-t border-border/40 flex flex-wrap gap-2">
                {project.datasets.slice(0, 3).map((ds) => (
                  <span key={ds.id} className="inline-flex items-center gap-1.5 rounded-full bg-muted/50 border border-border/60 px-3 py-1 text-[10px] font-bold text-muted-foreground hover:bg-muted transition-colors">
                    <Database className="h-2.5 w-2.5" />
                    {ds.name.length > 15 ? ds.name.slice(0, 15) + '…' : ds.name}
                  </span>
                ))}
                {project.datasets.length > 3 && (
                  <span className="inline-flex items-center rounded-full bg-primary/5 border border-primary/10 px-3 py-1 text-[10px] font-bold text-primary">
                    +{project.datasets.length - 3} Extra
                  </span>
                )}
              </div>
            )}
          </div>
        </motion.div>
      ))}
    </motion.div>
  );
}

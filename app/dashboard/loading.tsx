import { FolderOpen, Database, Zap, Sparkles } from 'lucide-react';

export default function Loading() {
  return (
    <div className="space-y-12 pb-20 animate-pulse">
      {/* Header Skeleton */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-4">
          <div className="flex items-center gap-2 mb-2 opacity-20">
            <Sparkles className="h-4 w-4" />
            <div className="h-3 w-24 bg-primary rounded-full" />
          </div>
          <div className="h-10 w-64 bg-muted rounded-2xl" />
          <div className="h-4 w-96 bg-muted/50 rounded-lg" />
        </div>
        <div className="h-12 w-32 bg-primary/20 rounded-2xl" />
      </div>

      {/* Stats Skeleton */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-44 rounded-3xl border border-border/40 bg-card/30 p-8 flex flex-col justify-between">
            <div className="h-12 w-12 rounded-2xl bg-muted/30" />
            <div className="space-y-2">
              <div className="h-3 w-24 bg-muted/40 rounded-full" />
              <div className="h-8 w-16 bg-muted rounded-lg" />
            </div>
          </div>
        ))}
      </div>

      {/* Grid Header */}
      <div className="flex items-center gap-4">
         <div className="h-4 w-48 bg-muted/20 rounded-full" />
         <div className="h-px w-full bg-border/20" />
      </div>

      {/* Projects Grid Skeleton */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div key={i} className="h-64 rounded-3xl border border-border/40 bg-card/20 p-8 space-y-6">
            <div className="flex justify-between">
              <div className="h-14 w-14 rounded-2xl bg-muted/30" />
              <div className="h-8 w-8 rounded-full bg-muted/20" />
            </div>
            <div className="space-y-3">
              <div className="h-6 w-3/4 bg-muted/50 rounded-lg" />
              <div className="h-3 w-1/2 bg-muted/30 rounded-full" />
            </div>
            <div className="pt-6 border-t border-border/10 flex gap-2">
              <div className="h-6 w-20 bg-muted/20 rounded-full" />
              <div className="h-6 w-20 bg-muted/20 rounded-full" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

import { Sparkles, ArrowLeft, MoreHorizontal } from 'lucide-react';

export default function Loading() {
  return (
    <div className="space-y-10 pb-20 animate-pulse">
      {/* Header Breadcrumbs Skeleton */}
      <div className="flex items-center gap-2 mb-2 opacity-20">
        <div className="h-3 w-16 bg-muted rounded-full" />
        <div className="h-3 w-4 bg-muted rounded-full opacity-50" />
        <div className="h-3 w-24 bg-muted rounded-full" />
      </div>

      {/* Main Header Skeleton */}
      <div className="flex flex-col md:flex-row md:items-start justify-between gap-8">
        <div className="flex-1 space-y-4">
          <div className="h-10 w-2/3 bg-muted rounded-2xl" />
          <div className="h-4 w-1/2 bg-muted/40 rounded-lg" />
          <div className="flex items-center gap-4 pt-2">
            <div className="h-6 w-24 bg-muted/30 rounded-full" />
            <div className="h-6 w-32 bg-muted/30 rounded-full" />
          </div>
        </div>
        <div className="flex gap-3">
          <div className="h-12 w-12 bg-muted/20 rounded-2xl" />
          <div className="h-12 w-32 bg-muted/30 rounded-2xl" />
        </div>
      </div>

      {/* Pipeline Stepper Skeleton */}
      <div className="rounded-3xl border border-border/40 bg-card/10 h-24 flex items-center px-12 gap-8">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="flex items-center gap-3 flex-1 last:flex-none">
            <div className="h-8 w-8 rounded-full bg-muted/30 shrink-0" />
            <div className="h-3 w-full bg-muted/20 rounded-full hidden md:block" />
          </div>
        ))}
      </div>

      {/* Main Content Area Skeleton */}
      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <div className="h-[400px] rounded-3xl bg-muted/10 border border-border/40" />
          <div className="grid grid-cols-2 gap-4">
            <div className="h-32 bg-muted/10 rounded-2xl border border-border/40" />
            <div className="h-32 bg-muted/10 rounded-2xl border border-border/40" />
          </div>
        </div>
        <div className="space-y-8">
          <div className="h-[250px] bg-muted/10 rounded-3xl border border-border/40" />
          <div className="h-[350px] bg-muted/10 rounded-3xl border border-border/40" />
        </div>
      </div>
    </div>
  );
}

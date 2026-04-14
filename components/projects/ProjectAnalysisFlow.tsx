'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Database, 
  BarChart3, 
  Lightbulb, 
  ArrowRight, 
  CheckCircle2, 
  AlertCircle,
  FileUp,
  LineChart,
  Target,
  Zap
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { MetricRecommendation } from '@/types';
import FileUpload from '@/components/ui/FileUpload';
import SchemaViewer from '@/components/ui/SchemaViewer';
import DashboardCharts from '@/components/ui/DashboardCharts';
import MetricRecommendations from '@/components/ui/MetricRecommendations';

interface ProjectAnalysisFlowProps {
  project: any;
  initialDatasets: any[];
}

const steps = [
  { id: 'ingest', name: 'Ingest', icon: Database },
  { id: 'schema', name: 'Analyze', icon: BarChart3 },
  { id: 'insights', name: 'Intelligence', icon: Lightbulb },
];

export default function ProjectAnalysisFlow({ project, initialDatasets }: ProjectAnalysisFlowProps) {
  const [activeStep, setActiveStep] = useState(initialDatasets.length > 0 ? 'schema' : 'ingest');
  const [datasets, setDatasets] = useState(initialDatasets);
  const [activeDataset, setActiveDataset] = useState(initialDatasets[0] || null);
  const [analysisData, setAnalysisData] = useState<any[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [hasApplied, setHasApplied] = useState(false);
  const [selectedRecommendations, setSelectedRecommendations] = useState<Set<string>>(new Set());

  // Auto-populate data if we have initial datasets
  useEffect(() => {
    if (activeDataset && analysisData.length === 0) {
      const schema = JSON.parse(activeDataset.schema);
      const dateCol = schema.find((c: any) => c.type === 'date')?.name || 'date';
      const numCols = schema.filter((c: any) => c.type === 'numerical').map((c: any) => c.name);
      
      const mockData = Array.from({ length: 40 }).map((_, i) => {
        const row: Record<string, any> = {
          [dateCol]: new Date(Date.now() - (40 - i) * 24 * 60 * 60 * 1000).toISOString(),
        };
        numCols.forEach((col: string, idx: number) => {
          row[col] = (Math.random() * 1000 * (idx + 1)).toFixed(2);
        });
        // Ensure some categorical data for the bar charts
        const catCol = schema.find((c: any) => c.type === 'categorical')?.name || 'segment';
        row[catCol] = ['Enterprise', 'SMB', 'Startup'][Math.floor(Math.random() * 3)];
        return row;
      });
      setAnalysisData(mockData);
    }
  }, [activeDataset]);

  const handleApply = () => {
    setIsAnalyzing(true);
    setTimeout(() => {
      setIsAnalyzing(false);
      setHasApplied(true);
    }, 2500);
  };

  const handleUploadSuccess = (result: any) => {
    // result is the data.data from API which contains { dataset, schema, preview }
    const newDataset = result.dataset;
    setDatasets([newDataset, ...datasets]);
    setActiveDataset(newDataset);
    setAnalysisData(result.preview || []);
    setActiveStep('schema');
  };

  // Generate dynamic recommendations based on the schema for the demo
  const getRecommendations = (): MetricRecommendation[] => {
    if (!activeDataset) return [];
    
    const schema = JSON.parse(activeDataset.schema);
    const colNames = schema.map((c: any) => c.name.toLowerCase());
    const recommendations: MetricRecommendation[] = [];

    // Churn/Retention Keywords
    if (colNames.some((c: string) => c.includes('churn') || c.includes('status') || c.includes('active'))) {
      recommendations.push({ 
        name: 'Churn Risk Propensity', 
        category: 'churn', 
        description: 'Predicts the likelihood of each account churning based on recent status changes.', 
        formula: 'LOGISTIC_REG(Events, Status_History)' 
      });
    }

    // Revenue Keywords
    if (colNames.some((c: string) => c.includes('price') || c.includes('amount') || c.includes('revenue') || c.includes('mrr'))) {
      recommendations.push({ 
        name: 'Incremental ARPU', 
        category: 'revenue', 
        description: 'Analyzes potential lift in Average Revenue Per User if retention is improved by 5%.', 
        formula: 'SUM(MRR) * 1.05 / COUNT(Users)' 
      });
      recommendations.push({ 
        name: 'LTV Sensitivity', 
        category: 'revenue', 
        description: 'Lifetime Value projection based on historical spend patterns and churn probability.', 
        formula: 'Avg_Revenue * (1 / Churn_Rate)' 
      });
    }

    // Date/Time Keywords
    if (colNames.some((c: string) => c.includes('date') || c.includes('time') || c.includes('timestamp') || c.includes('period'))) {
      recommendations.push({ 
        name: 'Cohort Decay Rate', 
        category: 'retention', 
        description: 'Measures the speed at which user cohorts drop off after their initial signup date.', 
        formula: 'EXP_DECAY(Signup_Date, Current_Date)' 
      });
    }

    // Engagement/Event Keywords
    if (colNames.some((c: string) => c.includes('event') || c.includes('action') || c.includes('visit') || c.includes('click'))) {
      recommendations.push({ 
        name: 'Engagement Velocity', 
        category: 'engagement', 
        description: 'Calculates the acceleration of feature adoption over the last 3 sessisons.', 
        formula: 'd(Events) / dt' 
      });
    }

    // Baseline if too few recommendations found
    if (recommendations.length < 3) {
      recommendations.push({ 
        name: 'Core Retention Index', 
        category: 'retention', 
        description: 'A global health score based on the frequency of returning users.', 
        formula: 'Return_Users / Total_Users' 
      });
      recommendations.push({ 
        name: 'User Density Score', 
        category: 'engagement', 
        description: 'Measures high-value interactions per active user session.', 
        formula: 'Count(High_Value_Events) / Sessions' 
      });
    }

    return recommendations;
  };

  const handleSelect = (rec: MetricRecommendation) => {
    setSelectedRecommendations((prev) => {
      const next = new Set(prev);
      next.has(rec.name) ? next.delete(rec.name) : next.add(rec.name);
      return next;
    });
  };

  return (
    <div className="space-y-10">
      {/* Pipeline Stepper */}
      <div className="relative rounded-3xl border border-border/40 bg-card/10 p-2 backdrop-blur-sm">
        <div className="flex items-center justify-between px-4 md:px-12 py-4 gap-4">
          {steps.map((step, idx) => {
            const isActive = activeStep === step.id;
            const isPast = steps.findIndex(s => s.id === activeStep) > idx;
            
            return (
              <div key={step.id} className="flex-1 flex items-center gap-4 relative">
                <button
                  onClick={() => (isPast || isActive) && setActiveStep(step.id)}
                  disabled={!isPast && !isActive}
                  className={cn(
                    "flex items-center gap-3 transition-all duration-300 group",
                    isActive ? "text-primary" : isPast ? "text-primary/60 hover:text-primary" : "text-muted-foreground/30"
                  )}
                >
                  <div className={cn(
                    "h-10 w-10 rounded-2xl flex items-center justify-center border-2 transition-all duration-500",
                    isActive ? "bg-primary/10 border-primary shadow-glow" : isPast ? "bg-primary/5 border-primary/40" : "bg-muted/5 border-border/40"
                  )}>
                    {isPast ? <CheckCircle2 className="h-5 w-5" /> : <step.icon className="h-5 w-5" />}
                  </div>
                  <div className="hidden md:block text-left">
                    <p className="text-[10px] uppercase font-black tracking-widest leading-none mb-1">Step 0{idx + 1}</p>
                    <p className="text-sm font-bold">{step.name}</p>
                  </div>
                </button>
                {idx < steps.length - 1 && (
                  <div className="flex-1 h-px bg-border/40 mx-4 hidden lg:block" />
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Main Stage */}
      <AnimatePresence mode="wait">
        {activeStep === 'ingest' && (
          <motion.div
            key="ingest"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="grid lg:grid-cols-5 gap-10"
          >
            <div className="lg:col-span-3 space-y-6">
              <div className="space-y-2">
                <h2 className="text-2xl font-bold tracking-tight">Data Ingestion</h2>
                <p className="text-muted-foreground text-sm font-medium">Upload your user activity logs (CSV or XLSX) to begin the churn analysis pipeline.</p>
              </div>
              <FileUpload projectId={project.id} onUploadComplete={handleUploadSuccess} />
            </div>
            <div className="lg:col-span-2">
               <div className="rounded-3xl border border-border/60 bg-card/30 p-8 space-y-6">
                  <h3 className="text-sm font-black uppercase tracking-widest text-primary/70">Requirements</h3>
                  <div className="space-y-4">
                    {[
                      { title: 'User Identifier', desc: 'Need a unique ID (email or UUID) for each user.' },
                      { title: 'Timestamp', desc: 'Required to track activity across periods.' },
                      { title: 'Status Column', desc: 'A categorical field indicating active/churned state.' },
                    ].map(req => (
                      <div key={req.title} className="flex gap-4">
                        <div className="h-5 w-5 rounded-full bg-primary/10 flex items-center justify-center mt-1 shrink-0">
                          <CheckCircle2 className="h-3 w-3 text-primary" />
                        </div>
                        <div>
                          <p className="text-sm font-bold">{req.title}</p>
                          <p className="text-xs text-muted-foreground font-medium">{req.desc}</p>
                        </div>
                      </div>
                    ))}
                  </div>
               </div>
            </div>
          </motion.div>
        )}

        {activeStep === 'schema' && activeDataset && (
          <motion.div
            key="schema"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-10"
          >
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <h2 className="text-2xl font-bold tracking-tight">Structural Analysis</h2>
                <p className="text-muted-foreground text-sm font-medium">Dataset: <span className="text-foreground font-bold">{activeDataset.name}</span> • {activeDataset.rowCount.toLocaleString()} rows detected</p>
              </div>
              <button 
                onClick={() => setActiveStep('insights')}
                className="inline-flex h-11 items-center gap-2 rounded-xl bg-primary px-6 text-sm font-bold text-primary-foreground shadow-lg shadow-primary/20 hover:bg-primary/90 transition-all"
              >
                Generate Intelligence <ArrowRight className="h-4 w-4" />
              </button>
            </div>
            <SchemaViewer schema={JSON.parse(activeDataset.schema)} />
          </motion.div>
        )}

        {activeStep === 'insights' && activeDataset && (
          <motion.div
            key="insights"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-12"
          >
            <div className="grid lg:grid-cols-4 gap-8">
               <div className="lg:col-span-3">
                 <DashboardCharts 
                   data={analysisData} 
                   schema={activeDataset ? JSON.parse(activeDataset.schema) : []} 
                   isAnalyzing={isAnalyzing}
                 />
               </div>
               <div className="lg:col-span-1 space-y-6">
                 <MetricRecommendations 
                   recommendations={getRecommendations()} 
                   onSelect={handleSelect} 
                 />
                 
                 {selectedRecommendations.size > 0 && !hasApplied && (
                   <motion.button
                     initial={{ opacity: 0, y: 10 }}
                     animate={{ opacity: 1, y: 0 }}
                     onClick={handleApply}
                     className="w-full h-14 rounded-2xl bg-primary text-primary-foreground font-bold shadow-glow flex items-center justify-center gap-3 group overflow-hidden relative"
                   >
                     <div className="absolute inset-0 bg-white/10 translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
                     <Zap className="h-5 w-5 fill-current" />
                     Run Strategic Analysis
                   </motion.button>
                 )}
               </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

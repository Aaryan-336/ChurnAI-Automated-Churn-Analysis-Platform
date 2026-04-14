'use client';

import { useCallback, useState } from 'react';
import { UploadCloud, FileSpreadsheet, X, Loader2, CheckCircle2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';

interface FileUploadProps {
  projectId: string;
  onUploadComplete: (result: any) => void;
}

export default function FileUpload({ projectId, onUploadComplete }: FileUploadProps) {
  const [dragging, setDragging] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [progress, setProgress] = useState(0);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
    const dropped = e.dataTransfer.files[0];
    if (dropped && /\.(csv|xlsx|xls)$/i.test(dropped.name)) {
      setFile(dropped);
      setSuccess(false);
      toast.success(`Selected ${dropped.name}`);
    } else {
      toast.error('Only CSV or XLSX files are supported.');
    }
  }, []);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (selected) {
      setFile(selected);
      setSuccess(false);
      toast.success(`Selected ${selected.name}`);
    }
  };

  const handleUpload = async () => {
    if (!file) return;
    setUploading(true);
    setProgress(0);

    const interval = setInterval(() => setProgress((p) => Math.min(p + 8, 92)), 200);

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('projectId', projectId);

      const res = await fetch('/api/datasets/upload', { method: 'POST', body: formData });
      const data = await res.json();
      clearInterval(interval);

      if (!data.success) {
        toast.error(data.error || 'Upload failed');
        return;
      }

      setProgress(100);
      setSuccess(true);
      toast.success('Analysis complete!');
      setTimeout(() => onUploadComplete(data.data), 800);
    } catch {
      clearInterval(interval);
      toast.error('Upload failed. Check your connection.');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-4">
      <motion.div
        onDragEnter={() => setDragging(true)}
        onDragLeave={() => setDragging(false)}
        onDragOver={(e) => e.preventDefault()}
        onDrop={handleDrop}
        onClick={() => document.getElementById('file-input')?.click()}
        whileHover={{ scale: 1.005 }}
        whileTap={{ scale: 0.995 }}
        className={cn(
          'relative group flex flex-col items-center justify-center gap-4 rounded-2xl border-2 border-dashed p-12 cursor-pointer transition-all duration-300',
          dragging
            ? 'border-primary bg-primary/5 shadow-2xl shadow-primary/10'
            : file
              ? 'border-border/60 bg-muted/20'
              : 'border-border/40 hover:border-primary/40 hover:bg-muted/10'
        )}
      >
        <input
          id="file-input"
          type="file"
          accept=".csv,.xlsx,.xls"
          onChange={handleFileSelect}
          className="hidden"
        />
        
        <motion.div 
          animate={dragging ? { y: -10, scale: 1.1 } : { y: 0, scale: 1 }}
          className={cn(
            'h-16 w-16 rounded-2xl flex items-center justify-center transition-all',
            dragging ? 'bg-primary text-primary-foreground shadow-glow' : 'bg-muted border border-border group-hover:border-primary/50'
          )}
        >
          <UploadCloud className={cn('h-7 w-7 transition-all', dragging ? 'text-primary-foreground' : 'text-muted-foreground group-hover:text-primary')} />
        </motion.div>

        <div className="text-center space-y-1">
          <p className="text-base font-semibold">
            {dragging ? 'Drop it like it\'s hot' : 'Upload your customer data'}
          </p>
          <p className="text-sm text-muted-foreground">
            CSV or XLSX · max 50MB ·{' '}
            <span className="text-primary font-medium hover:underline">browse</span>
          </p>
        </div>

        {/* Decorative corner accents */}
        <div className="absolute top-4 left-4 h-2 w-2 border-t-2 border-l-2 border-border/40 group-hover:border-primary/40 transition-colors" />
        <div className="absolute top-4 right-4 h-2 w-2 border-t-2 border-r-2 border-border/40 group-hover:border-primary/40 transition-colors" />
        <div className="absolute bottom-4 left-4 h-2 w-2 border-b-2 border-l-2 border-border/40 group-hover:border-primary/40 transition-colors" />
        <div className="absolute bottom-4 right-4 h-2 w-2 border-b-2 border-r-2 border-border/40 group-hover:border-primary/40 transition-colors" />
      </motion.div>

      <AnimatePresence mode="wait">
        {file && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className={cn(
              'flex items-center gap-5 rounded-2xl border px-6 py-5 transition-all duration-500 overflow-hidden relative',
              success ? 'border-emerald-500/30 bg-emerald-500/5' : 'border-border/60 bg-card'
            )}
          >
            <div className="h-12 w-12 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center shrink-0">
              {success
                ? <CheckCircle2 className="h-6 w-6 text-emerald-400" />
                : <FileSpreadsheet className="h-6 w-6 text-primary" />
              }
            </div>
            
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between mb-1.5">
                <p className="text-sm font-semibold truncate">{file.name}</p>
                <span className="text-xs font-mono text-muted-foreground">
                  {uploading ? `${progress}%` : (file.size / 1024).toFixed(1) + ' KB'}
                </span>
              </div>
              
              <div className="h-1.5 w-full rounded-full bg-muted overflow-hidden relative">
                {uploading && (
                  <motion.div
                    className="absolute inset-0 bg-primary/20 animate-shimmer"
                    initial={{ x: '-100%' }}
                    animate={{ x: '100%' }}
                    transition={{ repeat: Infinity, duration: 1.5, ease: 'linear' }}
                  />
                )}
                <motion.div
                  className="h-full bg-primary rounded-full shadow-[0_0_10px_rgba(79,110,247,0.5)]"
                  initial={{ width: 0 }}
                  animate={{ width: `${progress}%` }}
                  transition={{ type: 'spring', damping: 20 }}
                />
              </div>
            </div>

            <div className="flex items-center gap-3 shrink-0">
              {!success && (
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleUpload}
                  disabled={uploading}
                  className="inline-flex h-10 items-center justify-center gap-2 rounded-xl bg-primary px-6 text-xs font-bold text-primary-foreground hover:bg-primary/90 disabled:opacity-50 shadow-lg shadow-primary/20 transition-all"
                >
                  {uploading ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Run Analysis'}
                </motion.button>
              )}
              <button
                onClick={() => { setFile(null); setSuccess(false); setProgress(0); }}
                className="h-10 w-10 inline-flex items-center justify-center rounded-xl border border-border hover:bg-muted transition-colors text-muted-foreground"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

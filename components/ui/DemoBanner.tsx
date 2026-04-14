'use client';

import { Zap, AlertTriangle, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';

export default function DemoBanner() {
  const [isVisible, setIsVisible] = useState(true);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: 'auto', opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          className="bg-primary/10 border-b border-primary/20 overflow-hidden relative"
        >
          <div className="max-w-[1400px] mx-auto px-6 py-2.5 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="flex h-6 w-6 items-center justify-center rounded-lg bg-primary/20 animate-pulse-glow">
                <Zap className="h-3 w-3 text-primary shadow-glow" />
              </div>
              <p className="text-[10px] sm:text-[11px] font-bold text-primary tracking-wide uppercase">
                <span className="opacity-60 font-medium">System Status:</span> Demo Environment Active
              </p>
              <div className="hidden sm:flex h-1 w-1 rounded-full bg-primary/30" />
              <p className="hidden sm:block text-[11px] text-muted-foreground font-medium">
                Authentication is currently bypassed for exploration. No real data is stored publicly.
              </p>
            </div>
            <button 
              onClick={() => setIsVisible(false)}
              className="text-muted-foreground hover:text-primary transition-colors p-1"
            >
              <X className="h-3 w-3" />
            </button>
          </div>
          
          {/* Animated background highlights */}
          <div className="absolute top-0 left-1/4 w-1/2 h-full bg-gradient-to-r from-transparent via-primary/5 to-transparent skew-x-12 animate-shimmer pointer-events-none" />
        </motion.div>
      )}
    </AnimatePresence>
  );
}

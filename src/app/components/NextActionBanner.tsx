import React from 'react';
import Link from 'next/link';
import { Sparkles, ArrowRight, Zap } from 'lucide-react';

export default function NextActionBanner() {
  return (
    <div className="relative overflow-hidden rounded-xl border border-primary/20 bg-gradient-to-r from-secondary via-secondary/60 to-background p-4 flex items-center gap-4">
      <div className="blob-primary absolute -left-8 -top-8 w-32 h-32 pointer-events-none" />
      <div className="w-10 h-10 rounded-xl gradient-primary flex items-center justify-center flex-shrink-0 shadow-btn-primary">
        <Sparkles size={18} className="text-white" />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-0.5">
          <span className="text-[10px] font-bold uppercase tracking-widest text-primary">AI Next Best Action</span>
          <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-accent/10 text-accent text-[10px] font-semibold">
            <Zap size={9} /> High Impact
          </span>
        </div>
        <p className="text-[14px] font-semibold text-foreground">
          You have 2 ICPs defined but no outreach experiments running. Start a cold email sequence targeting SaaS CTOs, your highest-fit ICP.
        </p>
      </div>
      <Link
        href="/experiment-tracker"
        className="btn-primary px-4 py-2.5 flex items-center gap-2 flex-shrink-0 whitespace-nowrap"
      >
        Log Experiment <ArrowRight size={14} />
      </Link>
    </div>
  );
}
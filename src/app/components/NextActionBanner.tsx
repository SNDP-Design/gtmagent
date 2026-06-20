'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import { Sparkles, ArrowRight, Zap, Map, X } from 'lucide-react';

export default function NextActionBanner() {
  const [tourDismissed, setTourDismissed] = useState(false);
  const [showTourTooltip, setShowTourTooltip] = useState(false);

  return (
    <div className="space-y-3">
      {/* Module Tour Prompt — shown to new users until dismissed */}
      {!tourDismissed && (
        <div className="relative overflow-hidden rounded-xl border border-accent/30 bg-gradient-to-r from-accent/10 via-accent/5 to-background p-3.5 flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-accent/15 flex items-center justify-center flex-shrink-0">
            <Map size={16} className="text-accent" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-[13px] font-semibold text-foreground">
              👋 New here? Take a quick tour of all 5 GTM Fox modules.
            </p>
            <p className="text-[11px] text-muted-foreground mt-0.5">
              Learn what each module does and where to start your go-to-market journey.
            </p>
          </div>
          <div className="flex items-center gap-2 flex-shrink-0">
            <div className="relative">
              <button
                onClick={() => setShowTourTooltip(!showTourTooltip)}
                className="px-3 py-1.5 rounded-lg bg-accent text-white text-[12px] font-semibold hover:bg-accent/90 transition-colors flex items-center gap-1.5"
              >
                <Map size={12} /> Start Tour
              </button>
              {showTourTooltip && (
                <div className="absolute right-0 top-full mt-2 w-64 bg-card border border-border rounded-xl shadow-xl p-3 z-50">
                  <p className="text-[12px] font-semibold text-foreground mb-2">Module Tour</p>
                  <p className="text-[11px] text-muted-foreground mb-3">
                    Use the "Start Here" buttons below to jump into any module. Each one is designed to be used in sequence for best results.
                  </p>
                  <ol className="space-y-1.5 text-[11px] text-muted-foreground">
                    <li className="flex items-center gap-1.5"><span className="w-4 h-4 rounded-full bg-primary/10 text-primary text-[10px] font-bold flex items-center justify-center flex-shrink-0">1</span> AI Strategy Builder</li>
                    <li className="flex items-center gap-1.5"><span className="w-4 h-4 rounded-full bg-primary/10 text-primary text-[10px] font-bold flex items-center justify-center flex-shrink-0">2</span> ICP &amp; Channel Finder</li>
                    <li className="flex items-center gap-1.5"><span className="w-4 h-4 rounded-full bg-primary/10 text-primary text-[10px] font-bold flex items-center justify-center flex-shrink-0">3</span> Outreach Copy Generator</li>
                    <li className="flex items-center gap-1.5"><span className="w-4 h-4 rounded-full bg-primary/10 text-primary text-[10px] font-bold flex items-center justify-center flex-shrink-0">4</span> Experiment Tracker</li>
                    <li className="flex items-center gap-1.5"><span className="w-4 h-4 rounded-full bg-primary/10 text-primary text-[10px] font-bold flex items-center justify-center flex-shrink-0">5</span> GTM Momentum</li>
                  </ol>
                  <button
                    onClick={() => setShowTourTooltip(false)}
                    className="mt-3 w-full text-[11px] text-muted-foreground hover:text-foreground transition-colors"
                  >
                    Got it
                  </button>
                </div>
              )}
            </div>
            <button
              onClick={() => setTourDismissed(true)}
              className="w-6 h-6 rounded-md flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
              aria-label="Dismiss tour prompt"
            >
              <X size={13} />
            </button>
          </div>
        </div>
      )}

      {/* AI Next Best Action Banner — prominent */}
      <div className="relative overflow-hidden rounded-xl border-2 border-primary/30 bg-gradient-to-r from-secondary via-secondary/70 to-background p-4 flex items-center gap-4 shadow-md">
        <div className="blob-primary absolute -left-8 -top-8 w-40 h-40 pointer-events-none opacity-60" />
        <div className="blob-primary absolute right-0 bottom-0 w-24 h-24 pointer-events-none opacity-30" />
        <div className="w-11 h-11 rounded-xl gradient-primary flex items-center justify-center flex-shrink-0 shadow-btn-primary">
          <Sparkles size={20} className="text-white" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] font-bold uppercase tracking-widest text-primary">🎯 AI Next Best Action</span>
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-accent/15 text-accent text-[10px] font-bold border border-accent/20">
              <Zap size={9} /> High Impact
            </span>
          </div>
          <p className="text-[14px] font-semibold text-foreground leading-snug">
            You have 2 ICPs defined but no outreach experiments running. Start a cold email sequence targeting SaaS CTOs — your highest-fit ICP.
          </p>
        </div>
        <Link
          href="/experiment-tracker"
          className="btn-primary px-4 py-2.5 flex items-center gap-2 flex-shrink-0 whitespace-nowrap text-[13px] font-semibold"
        >
          Log Experiment <ArrowRight size={14} />
        </Link>
      </div>
    </div>
  );
}
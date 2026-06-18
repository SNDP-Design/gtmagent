'use client';
import React, { useState, useEffect } from 'react';
import { Bookmark, BookmarkCheck, ChevronDown, ChevronUp, Zap, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { icpProfileService } from '@/lib/services/icpProfileService';
import { useICPProfilesRealtime } from '@/lib/hooks/useICPProfilesRealtime';

const fitScoreColor = (score: number) => {
  if (score >= 85) return 'text-positive bg-positive-bg border-positive/30';
  if (score >= 70) return 'text-info bg-info-bg border-info/30';
  return 'text-warning bg-warning-bg border-warning/30';
};

export default function ICPTab() {
  const { profiles, isLoading } = useICPProfilesRealtime();
  const [savedMap, setSavedMap] = useState<Record<string, boolean>>({});
  const [expanded, setExpanded] = useState<Set<string>>(new Set());

  // Sync savedMap and default-expand first profile when profiles change
  useEffect(() => {
    if (profiles.length === 0) return;
    setSavedMap((prev) => {
      const next = { ...prev };
      profiles.forEach((p) => {
        if (!(p.id in next)) next[p.id] = p.saved;
      });
      return next;
    });
    setExpanded((prev) => {
      if (prev.size > 0) return prev;
      return new Set([profiles[0].id]);
    });
  }, [profiles]);

  const toggleSave = async (id: string, name: string) => {
    const newSaved = !savedMap[id];
    setSavedMap((prev) => ({ ...prev, [id]: newSaved }));
    toast.success(newSaved ? `Saved "${name}" to strategy` : `Removed "${name}" from strategy`);
    await icpProfileService.toggleSave(id, newSaved);
  };

  const toggleExpand = (id: string) => {
    setExpanded((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-16">
        <Loader2 size={24} className="animate-spin text-primary mr-2" />
        <p className="text-[13px] text-muted-foreground">Loading ICP profiles…</p>
      </div>
    );
  }

  if (profiles.length === 0) {
    return (
      <div className="text-center py-16">
        <p className="text-[14px] font-semibold text-foreground">No ICP profiles yet</p>
        <p className="text-[12px] text-muted-foreground mt-1">Your ICP profiles will appear here once created.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {profiles.map((icp) => {
        const isExpanded = expanded.has(icp.id);
        return (
          <div key={icp.id} className="card-base shadow-card hover:shadow-card-hover transition-shadow duration-200">
            {/* Card header */}
            <div
              className="flex items-start gap-4 p-5 cursor-pointer"
              onClick={() => toggleExpand(icp.id)}
            >
              <div className="w-12 h-12 rounded-xl gradient-primary flex items-center justify-center flex-shrink-0">
                <span className="text-white font-bold text-[16px]">{icp.fitScore}</span>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <h3 className="text-[15px] font-bold text-foreground">{icp.name}</h3>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${fitScoreColor(icp.fitScore)}`}>
                    {icp.fitScore}% fit
                  </span>
                  <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-secondary text-primary border border-primary/20">
                    {icp.stage}
                  </span>
                </div>
                <div className="flex items-center gap-4 mt-1.5 flex-wrap">
                  <span className="text-[12px] text-muted-foreground">{icp.role}</span>
                  <span className="text-muted-foreground text-[10px]">·</span>
                  <span className="text-[12px] text-muted-foreground">{icp.companySize}</span>
                  <span className="text-muted-foreground text-[10px]">·</span>
                  <span className="text-[12px] text-muted-foreground">{icp.industry}</span>
                </div>
              </div>
              <div className="flex items-center gap-2 flex-shrink-0">
                <button
                  onClick={(e) => { e.stopPropagation(); toggleSave(icp.id, icp.name); }}
                  className={`p-2 rounded-lg transition-all duration-150 ${
                    savedMap[icp.id] ? 'text-primary bg-secondary' : 'text-muted-foreground hover:text-primary hover:bg-muted'
                  }`}
                  title={savedMap[icp.id] ? 'Remove from strategy' : 'Save to strategy'}
                >
                  {savedMap[icp.id] ? <BookmarkCheck size={16} /> : <Bookmark size={16} />}
                </button>
                {isExpanded ? <ChevronUp size={16} className="text-muted-foreground" /> : <ChevronDown size={16} className="text-muted-foreground" />}
              </div>
            </div>

            {/* Expanded content */}
            {isExpanded && (
              <div className="px-5 pb-5 border-t border-border pt-4 space-y-4">
                {/* Quote */}
                <blockquote className="italic text-[13px] text-muted-foreground border-l-2 border-primary pl-3">
                  {icp.quote}
                </blockquote>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {/* Pain points */}
                  <div>
                    <p className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground mb-2">Pain Points</p>
                    <ul className="space-y-1.5">
                      {icp.painPoints?.map((pain, i) => (
                        <li key={`pain-${icp.id}-${i}`} className="flex items-start gap-2 text-[12px] text-foreground">
                          <span className="w-1.5 h-1.5 rounded-full bg-negative mt-1.5 flex-shrink-0" />
                          {pain}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Buyer signals */}
                  <div>
                    <p className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground mb-2">Buyer Signals</p>
                    <ul className="space-y-1.5">
                      {icp.buyerSignals?.map((signal, i) => (
                        <li key={`signal-${icp.id}-${i}`} className="flex items-start gap-2 text-[12px] text-foreground">
                          <Zap size={12} className="text-accent mt-0.5 flex-shrink-0" />
                          {signal}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Best channels + budget */}
                  <div>
                    <p className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground mb-2">Best Channels</p>
                    <div className="flex flex-wrap gap-1.5 mb-3">
                      {icp.channels?.map((ch) => (
                        <span key={`ch-${icp.id}-${ch}`} className="text-[11px] font-semibold px-2 py-1 rounded-lg bg-secondary text-primary">
                          {ch}
                        </span>
                      ))}
                    </div>
                    <p className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground mb-1">Budget Range</p>
                    <p className="text-[12px] text-foreground font-semibold">{icp.budget}</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
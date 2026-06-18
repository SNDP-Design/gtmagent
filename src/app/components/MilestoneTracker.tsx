'use client';
import React from 'react';
import { CheckCircle2, Circle, Clock, AlertCircle, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { useMilestonesRealtime } from '@/lib/hooks/useMilestonesRealtime';

const statusIcon = (status: string) => {
  if (status === 'done') return <CheckCircle2 size={16} className="text-positive flex-shrink-0" />;
  if (status === 'in-progress') return <Clock size={16} className="text-info flex-shrink-0" />;
  if (status === 'blocked') return <AlertCircle size={16} className="text-negative flex-shrink-0" />;
  return <Circle size={16} className="text-muted-foreground flex-shrink-0" />;
};

export default function MilestoneTracker() {
  const { milestones, isLoading } = useMilestonesRealtime();

  const done = milestones.filter((m) => m.status === 'done').length;
  const total = milestones.length;
  const pct = total > 0 ? Math.round((done / total) * 100) : 0;

  if (isLoading) {
    return (
      <div className="card-base p-5 shadow-card flex items-center justify-center py-12">
        <Loader2 size={20} className="animate-spin text-primary mr-2" />
        <p className="text-[13px] text-muted-foreground">Loading milestones…</p>
      </div>
    );
  }

  return (
    <div className="card-base p-5 shadow-card">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-[15px] font-semibold text-foreground">GTM Milestones</h3>
          <p className="text-[12px] text-muted-foreground mt-0.5">{done} of {total} completed</p>
        </div>
        <span className="text-[12px] font-bold text-primary">{pct}%</span>
      </div>

      {/* Progress bar */}
      <div className="h-1.5 rounded-full bg-muted mb-4 overflow-hidden">
        <div
          className="h-full rounded-full gradient-primary transition-all duration-700"
          style={{ width: `${pct}%` }}
        />
      </div>

      {milestones.length === 0 ? (
        <p className="text-[13px] text-muted-foreground text-center py-4">No milestones yet.</p>
      ) : (
        <div className="space-y-2">
          {milestones.map((ms) => (
            <div
              key={ms.id}
              className={`flex items-start gap-3 py-2 px-3 rounded-lg transition-colors duration-100 hover:bg-muted ${
                ms.status === 'blocked' ? 'bg-negative-bg/40' : ''
              }`}
            >
              {statusIcon(ms.status)}
              <div className="flex-1 min-w-0">
                <p
                  className={`text-[13px] font-medium leading-snug ${
                    ms.status === 'done' ? 'line-through text-muted-foreground' : 'text-foreground'
                  }`}
                >
                  {ms.label}
                </p>
                {ms.status === 'in-progress' && ms.progress !== undefined && (
                  <div className="mt-1.5 h-1 rounded-full bg-muted overflow-hidden">
                    <div
                      className="h-full rounded-full bg-info transition-all duration-500"
                      style={{ width: `${ms.progress}%` }}
                    />
                  </div>
                )}
              </div>
              <span className="text-[11px] text-muted-foreground flex-shrink-0">{ms.dueDate}</span>
            </div>
          ))}
        </div>
      )}

      <Link
        href="/ai-strategy-builder"
        className="mt-4 flex items-center justify-center w-full py-2 rounded-lg text-[13px] font-semibold text-primary hover:bg-secondary transition-colors duration-150"
      >
        View full strategy →
      </Link>
    </div>
  );
}
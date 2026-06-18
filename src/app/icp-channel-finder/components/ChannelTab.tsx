'use client';
import React from 'react';
import dynamic from 'next/dynamic';
import { Bookmark, BookmarkCheck, TrendingUp, Clock, Users } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

const ChannelRadarChart = dynamic(() => import('./ChannelRadarChart'), { ssr: false });

const channels = [
  {
    id: 'ch-warm-intro',
    name: 'Warm Introductions',
    fitScore: 97,
    effort: 'High',
    effortColor: 'text-negative bg-negative-bg border-negative/30',
    reach: 'Low',
    reachColor: 'text-warning bg-warning-bg border-warning/30',
    replyRate: '34%',
    convRate: '18%',
    tactics: ['Ask existing network for intros to target ICP', 'Use LinkedIn mutual connections', 'Attend founder meetups'],
    timeToResult: '1–2 weeks',
    recommended: true,
  },
  {
    id: 'ch-linkedin',
    name: 'LinkedIn Cold Outreach',
    fitScore: 88,
    effort: 'Medium',
    effortColor: 'text-warning bg-warning-bg border-warning/30',
    reach: 'High',
    reachColor: 'text-positive bg-positive-bg border-positive/30',
    replyRate: '18%',
    convRate: '8%',
    tactics: ['Send personalized connection requests', 'Comment on target\'s posts first', 'Follow up with DM after connection'],
    timeToResult: '2–4 weeks',
    recommended: true,
  },
  {
    id: 'ch-cold-email',
    name: 'Cold Email Sequences',
    fitScore: 72,
    effort: 'Medium',
    effortColor: 'text-warning bg-warning-bg border-warning/30',
    reach: 'High',
    reachColor: 'text-positive bg-positive-bg border-positive/30',
    replyRate: '11%',
    convRate: '4%',
    tactics: ['3-email sequence over 10 days', 'Personalize first line with prospect context', 'Clear single CTA per email'],
    timeToResult: '3–6 weeks',
    recommended: false,
  },
  {
    id: 'ch-indiehackers',
    name: 'IndieHackers Community',
    fitScore: 81,
    effort: 'Low',
    effortColor: 'text-positive bg-positive-bg border-positive/30',
    reach: 'Medium',
    reachColor: 'text-info bg-info-bg border-info/30',
    replyRate: '22%',
    convRate: '10%',
    tactics: ['Post milestone updates and lessons learned', 'Comment genuinely on others\' posts', 'Share case studies with product mention'],
    timeToResult: '4–8 weeks',
    recommended: true,
  },
  {
    id: 'ch-twitter',
    name: 'Twitter/X Founder Community',
    fitScore: 58,
    effort: 'High',
    effortColor: 'text-negative bg-negative-bg border-negative/30',
    reach: 'Very High',
    reachColor: 'text-positive bg-positive-bg border-positive/30',
    replyRate: '6%',
    convRate: '2%',
    tactics: ['Build in public thread series', 'Engage with SaaS founders daily', 'Soft-pitch in replies with value-first approach'],
    timeToResult: '6–12 weeks',
    recommended: false,
  },
  {
    id: 'ch-reddit',
    name: 'Reddit (r/SaaS, r/startups)',
    fitScore: 44,
    effort: 'Medium',
    effortColor: 'text-warning bg-warning-bg border-warning/30',
    reach: 'High',
    reachColor: 'text-positive bg-positive-bg border-positive/30',
    replyRate: '5%',
    convRate: '1.5%',
    tactics: ['Answer questions without selling', 'Share genuine insights in comments', 'Post case studies when allowed'],
    timeToResult: '8–16 weeks',
    recommended: false,
  },
];

const fitScoreColor = (score: number) => {
  if (score >= 85) return 'text-positive bg-positive-bg';
  if (score >= 65) return 'text-info bg-info-bg';
  return 'text-warning bg-warning-bg';
};

export default function ChannelTab() {
  const [savedMap, setSavedMap] = useState<Record<string, boolean>>({
    'ch-warm-intro': true,
    'ch-linkedin': true,
  });

  const toggleSave = (id: string, name: string) => {
    setSavedMap((prev) => {
      const next = { ...prev, [id]: !prev[id] };
      toast.success(next[id] ? `Added "${name}" to your channel plan` : `Removed "${name}" from channel plan`);
      return next;
    });
  };

  return (
    <div className="space-y-6">
      {/* Radar chart */}
      <div className="card-base shadow-card p-5">
        <h3 className="text-[15px] font-semibold text-foreground mb-1">Channel Fit Comparison</h3>
        <p className="text-[12px] text-muted-foreground mb-4">Radar view of fit score, reply rate, and effort across all channels</p>
        <ChannelRadarChart />
      </div>

      {/* Channel cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-3 gap-4">
        {channels.map((ch) => (
          <div
            key={ch.id}
            className={`card-base p-4 shadow-card hover:shadow-card-hover transition-shadow duration-200 ${
              ch.recommended ? 'border-primary/20' : ''
            }`}
          >
            <div className="flex items-start justify-between mb-3">
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <h4 className="text-[14px] font-bold text-foreground">{ch.name}</h4>
                  {ch.recommended && (
                    <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-secondary text-primary border border-primary/20">
                      Recommended
                    </span>
                  )}
                </div>
                <div className={`inline-flex items-center gap-1 mt-1.5 text-[11px] font-bold px-2 py-0.5 rounded-full ${fitScoreColor(ch.fitScore)}`}>
                  {ch.fitScore}% fit
                </div>
              </div>
              <button
                onClick={() => toggleSave(ch.id, ch.name)}
                className={`p-1.5 rounded-lg transition-all duration-150 ${
                  savedMap[ch.id] ? 'text-primary bg-secondary' : 'text-muted-foreground hover:text-primary hover:bg-muted'
                }`}
              >
                {savedMap[ch.id] ? <BookmarkCheck size={15} /> : <Bookmark size={15} />}
              </button>
            </div>

            {/* Metrics row */}
            <div className="grid grid-cols-3 gap-2 mb-3">
              <div className="text-center p-2 rounded-lg bg-muted">
                <TrendingUp size={12} className="text-muted-foreground mx-auto mb-1" />
                <p className="text-[13px] font-bold text-foreground tabular-nums">{ch.replyRate}</p>
                <p className="text-[10px] text-muted-foreground">Reply</p>
              </div>
              <div className="text-center p-2 rounded-lg bg-muted">
                <Users size={12} className="text-muted-foreground mx-auto mb-1" />
                <p className="text-[13px] font-bold text-foreground tabular-nums">{ch.convRate}</p>
                <p className="text-[10px] text-muted-foreground">Conv.</p>
              </div>
              <div className="text-center p-2 rounded-lg bg-muted">
                <Clock size={12} className="text-muted-foreground mx-auto mb-1" />
                <p className="text-[11px] font-bold text-foreground">{ch.timeToResult.split('–')[0]}+</p>
                <p className="text-[10px] text-muted-foreground">Weeks</p>
              </div>
            </div>

            {/* Effort / Reach */}
            <div className="flex gap-2 mb-3">
              <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${ch.effortColor}`}>
                {ch.effort} effort
              </span>
              <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${ch.reachColor}`}>
                {ch.reach} reach
              </span>
            </div>

            {/* Tactics */}
            <div>
              <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-1.5">Top Tactics</p>
              <ul className="space-y-1">
                {ch.tactics.map((t, i) => (
                  <li key={`tactic-${ch.id}-${i}`} className="text-[12px] text-foreground flex items-start gap-1.5">
                    <span className="text-primary mt-0.5">›</span>
                    {t}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
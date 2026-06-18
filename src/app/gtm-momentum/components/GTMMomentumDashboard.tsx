'use client';
import React, { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import {
  TrendingUp,
  Zap,
  FlaskConical,
  Mail,
  Sparkles,
  BarChart2,
  Clock,
  Trophy,
  ArrowUpRight,
} from 'lucide-react';
import { founderEventService, FounderEvent } from '@/lib/services/founderEventService';
import Icon from '@/components/ui/AppIcon';


const CompletionTimelineInner = dynamic(
  () => import('./CompletionTimelineInner'),
  { ssr: false, loading: () => <div className="animate-pulse bg-muted rounded-xl" style={{ minHeight: 200 }} /> }
);
const FeatureFrequencyInner = dynamic(
  () => import('./FeatureFrequencyInner'),
  { ssr: false, loading: () => <div className="animate-pulse bg-muted rounded-xl" style={{ minHeight: 200 }} /> }
);
const ActionHeatmapInner = dynamic(
  () => import('./ActionHeatmapInner'),
  { ssr: false, loading: () => <div className="animate-pulse bg-muted rounded-xl" style={{ minHeight: 200 }} /> }
);

// ─── helpers ────────────────────────────────────────────────────────────────

function formatDate(iso: string): string {
  const d = new Date(iso);
  return `${d.getMonth() + 1}/${d.getDate()}`;
}

function buildTimelineData(events: FounderEvent[]) {
  const counts: Record<string, number> = {};
  events.forEach((e) => {
    const key = formatDate(e.createdAt);
    counts[key] = (counts[key] || 0) + 1;
  });
  const sorted = Object.entries(counts).sort((a, b) => {
    const [am, ad] = a[0].split('/').map(Number);
    const [bm, bd] = b[0].split('/').map(Number);
    return am !== bm ? am - bm : ad - bd;
  });
  let cumulative = 0;
  return sorted.map(([date, evts]) => {
    cumulative += evts;
    return { date, events: evts, cumulative };
  });
}

const EVENT_LABELS: Record<string, string> = {
  strategy_section_completed: 'Strategy Done',
  strategy_section_unlocked: 'Strategy Unlocked',
  experiment_logged: 'Experiment',
  copy_variants_generated: 'Copy Generated',
};

const EVENT_CATEGORIES: Record<string, string> = {
  strategy_section_completed: 'strategy',
  strategy_section_unlocked: 'strategy',
  experiment_logged: 'experiments',
  copy_variants_generated: 'copy',
};

function buildFrequencyData(events: FounderEvent[]) {
  const counts: Record<string, number> = {};
  events.forEach((e) => {
    counts[e.eventType] = (counts[e.eventType] || 0) + 1;
  });
  return Object.entries(counts).map(([type, count]) => ({
    feature: EVENT_LABELS[type] || type,
    count,
    category: EVENT_CATEGORIES[type] || 'strategy',
  }));
}

const DAYS_ORDER = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

function buildHeatmapCells(events: FounderEvent[]) {
  const counts: Record<string, number> = {};
  events.forEach((e) => {
    const d = new Date(e.createdAt);
    const dayIdx = d.getDay(); // 0=Sun
    const dayName = DAYS_ORDER[(dayIdx + 6) % 7]; // shift so Mon=0
    const hour = Math.floor(d.getHours() / 2) * 2; // bucket to nearest 2h
    const key = `${dayName}-${hour}`;
    counts[key] = (counts[key] || 0) + 1;
  });
  return Object.entries(counts).map(([key, count]) => {
    const [day, hourStr] = key.split('-');
    return { day, hour: Number(hourStr), count };
  });
}

interface SectionEngagement {
  label: string;
  count: number;
  icon: React.ElementType;
  color: string;
  bgColor: string;
  pct: number;
}

function buildEngagementSections(events: FounderEvent[]): SectionEngagement[] {
  const counts: Record<string, number> = {};
  events.forEach((e) => {
    counts[e.eventCategory] = (counts[e.eventCategory] || 0) + 1;
  });
  const total = Object.values(counts).reduce((s, v) => s + v, 0) || 1;
  const sections: SectionEngagement[] = [
    {
      label: 'AI Strategy Builder',
      count: counts['strategy'] || 0,
      icon: Sparkles,
      color: 'text-primary',
      bgColor: 'bg-secondary',
      pct: Math.round(((counts['strategy'] || 0) / total) * 100),
    },
    {
      label: 'Experiment Tracker',
      count: counts['experiments'] || 0,
      icon: FlaskConical,
      color: 'text-accent',
      bgColor: 'bg-accent/10',
      pct: Math.round(((counts['experiments'] || 0) / total) * 100),
    },
    {
      label: 'Outreach Copy Generator',
      count: counts['copy'] || 0,
      icon: Mail,
      color: 'text-positive',
      bgColor: 'bg-positive-bg',
      pct: Math.round(((counts['copy'] || 0) / total) * 100),
    },
  ];
  return sections.sort((a, b) => b.count - a.count);
}

// ─── stat card ───────────────────────────────────────────────────────────────

interface StatCardProps {
  label: string;
  value: string | number;
  sub: string;
  icon: React.ElementType;
  iconColor: string;
  iconBg: string;
}

function StatCard({ label, value, sub, icon: Icon, iconColor, iconBg }: StatCardProps) {
  return (
    <div className="card-base p-4 shadow-card">
      <div className="flex items-start justify-between mb-3">
        <p className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground leading-tight">{label}</p>
        <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${iconBg} ${iconColor}`}>
          <Icon size={15} />
        </div>
      </div>
      <p className="text-3xl font-extrabold tabular-nums text-foreground leading-none">{value}</p>
      <p className="text-[11px] text-muted-foreground mt-1.5">{sub}</p>
    </div>
  );
}

// ─── main component ──────────────────────────────────────────────────────────

export default function GTMMomentumDashboard() {
  const [events, setEvents] = useState<FounderEvent[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    founderEventService.getAll().then((data) => {
      setEvents(data);
      setLoading(false);
    });
  }, []);

  // Derived data
  const timelineData = buildTimelineData(events);
  const frequencyData = buildFrequencyData(events);
  const heatmapCells = buildHeatmapCells(events);
  const engagementSections = buildEngagementSections(events);

  // Summary stats
  const totalActions = events.length;
  const uniqueDays = new Set(events.map((e) => formatDate(e.createdAt))).size;
  const lastEvent = events[0];
  const lastActive = lastEvent
    ? new Date(lastEvent.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
    : '—';
  const streak = uniqueDays; // simplified: unique active days as streak proxy

  // Seed fallback data when no real events yet
  const hasData = events.length > 0;

  const displayTimeline = hasData
    ? timelineData
    : [
        { date: '6/12', events: 2, cumulative: 2 },
        { date: '6/13', events: 4, cumulative: 6 },
        { date: '6/14', events: 1, cumulative: 7 },
        { date: '6/15', events: 5, cumulative: 12 },
        { date: '6/16', events: 3, cumulative: 15 },
        { date: '6/17', events: 6, cumulative: 21 },
        { date: '6/18', events: 4, cumulative: 25 },
      ];

  const displayFrequency = hasData
    ? frequencyData
    : [
        { feature: 'Strategy Done', count: 8, category: 'strategy' },
        { feature: 'Strategy Unlocked', count: 5, category: 'strategy' },
        { feature: 'Experiment', count: 7, category: 'experiments' },
        { feature: 'Copy Generated', count: 5, category: 'copy' },
      ];

  const displayHeatmap = hasData
    ? heatmapCells
    : [
        { day: 'Mon', hour: 10, count: 3 }, { day: 'Mon', hour: 14, count: 2 },
        { day: 'Tue', hour: 8, count: 1 }, { day: 'Tue', hour: 16, count: 4 },
        { day: 'Wed', hour: 10, count: 5 }, { day: 'Wed', hour: 12, count: 2 },
        { day: 'Thu', hour: 14, count: 3 }, { day: 'Thu', hour: 18, count: 1 },
        { day: 'Fri', hour: 10, count: 4 }, { day: 'Fri', hour: 12, count: 3 },
        { day: 'Sat', hour: 10, count: 1 },
      ];

  const displayEngagement = hasData
    ? engagementSections
    : [
        { label: 'AI Strategy Builder', count: 13, icon: Sparkles, color: 'text-primary', bgColor: 'bg-secondary', pct: 52 },
        { label: 'Experiment Tracker', count: 7, icon: FlaskConical, color: 'text-accent', bgColor: 'bg-accent/10', pct: 28 },
        { label: 'Outreach Copy Generator', count: 5, icon: Mail, color: 'text-positive', bgColor: 'bg-positive-bg', pct: 20 },
      ];

  return (
    <div className="flex-1 overflow-y-auto bg-background">
      <div className="max-w-6xl mx-auto px-6 py-8 space-y-8">

        {/* Header */}
        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <div className="w-7 h-7 rounded-lg gradient-primary flex items-center justify-center">
                <TrendingUp size={14} className="text-white" />
              </div>
              <h1 className="text-[22px] font-bold text-foreground tracking-tight">GTM Momentum</h1>
            </div>
            <p className="text-[13px] text-muted-foreground">Your founder action analytics — see where you're building momentum</p>
          </div>
          {!hasData && (
            <span className="text-[11px] px-3 py-1.5 rounded-full bg-warning-bg text-warning border border-warning/30 font-medium">
              Showing sample data
            </span>
          )}
        </div>

        {/* Stat cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <StatCard
            label="Total Actions"
            value={hasData ? totalActions : 25}
            sub="across all features"
            icon={Zap}
            iconColor="text-primary"
            iconBg="bg-secondary"
          />
          <StatCard
            label="Active Days"
            value={hasData ? uniqueDays : 7}
            sub="days with activity"
            icon={BarChart2}
            iconColor="text-accent"
            iconBg="bg-accent/10"
          />
          <StatCard
            label="Last Active"
            value={hasData ? lastActive : 'Today'}
            sub="most recent action"
            icon={Clock}
            iconColor="text-info"
            iconBg="bg-info-bg"
          />
          <StatCard
            label="Momentum Score"
            value={hasData ? Math.min(100, Math.round((totalActions / 30) * 100)) : 83}
            sub="actions vs 30-day target"
            icon={Trophy}
            iconColor="text-positive"
            iconBg="bg-positive-bg"
          />
        </div>

        {/* Completion Timeline */}
        <div className="card-base p-5 shadow-card">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h2 className="text-[15px] font-semibold text-foreground">Completion Timeline</h2>
              <p className="text-[12px] text-muted-foreground mt-0.5">Daily actions and cumulative GTM progress over time</p>
            </div>
            <div className="flex items-center gap-3 text-[11px]">
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-primary inline-block" />
                <span className="text-muted-foreground">Daily</span>
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-positive inline-block" />
                <span className="text-muted-foreground">Cumulative</span>
              </span>
            </div>
          </div>
          {loading ? (
            <div className="h-[220px] flex items-center justify-center">
              <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
            </div>
          ) : (
            <CompletionTimelineInner data={displayTimeline} />
          )}
        </div>

        {/* Feature Frequency + Engagement sections — 2-col bento */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          {/* Feature frequency — wider */}
          <div className="md:col-span-3 card-base p-5 shadow-card">
            <div className="mb-4">
              <h2 className="text-[15px] font-semibold text-foreground">Feature Usage Frequency</h2>
              <p className="text-[12px] text-muted-foreground mt-0.5">Which GTM actions you take most often</p>
            </div>
            <div className="flex items-center gap-3 mb-4 text-[11px]">
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-primary inline-block" />
                <span className="text-muted-foreground">Strategy</span>
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-accent inline-block" />
                <span className="text-muted-foreground">Experiments</span>
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-positive inline-block" />
                <span className="text-muted-foreground">Copy</span>
              </span>
            </div>
            {loading ? (
              <div className="h-[220px] flex items-center justify-center">
                <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
              </div>
            ) : (
              <FeatureFrequencyInner data={displayFrequency} />
            )}
          </div>

          {/* Highest engagement sections — narrower */}
          <div className="md:col-span-2 card-base p-5 shadow-card flex flex-col">
            <div className="mb-4">
              <h2 className="text-[15px] font-semibold text-foreground">Highest Engagement</h2>
              <p className="text-[12px] text-muted-foreground mt-0.5">Sections where you spend the most time</p>
            </div>
            <div className="flex-1 space-y-3">
              {displayEngagement.map((section, i) => {
                const Icon = section.icon;
                return (
                  <div key={`eng-${i}`} className="flex items-center gap-3 p-3 rounded-xl bg-muted/40 hover:bg-muted/60 transition-colors">
                    <div className={`w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 ${section.bgColor} ${section.color}`}>
                      <Icon size={16} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-[13px] font-medium text-foreground truncate">{section.label}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <div className="flex-1 h-1.5 rounded-full bg-border overflow-hidden">
                          <div
                            className="h-full rounded-full transition-all duration-700"
                            style={{
                              width: `${section.pct}%`,
                              background: i === 0 ? 'var(--primary)' : i === 1 ? 'var(--accent)' : 'var(--positive)',
                            }}
                          />
                        </div>
                        <span className="text-[11px] text-muted-foreground flex-shrink-0">{section.pct}%</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-0.5 flex-shrink-0">
                      <span className="text-[13px] font-bold text-foreground">{section.count}</span>
                      <ArrowUpRight size={12} className="text-muted-foreground" />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Action Heatmap */}
        <div className="card-base p-5 shadow-card">
          <div className="flex items-start justify-between mb-5">
            <div>
              <h2 className="text-[15px] font-semibold text-foreground">Action Heatmap</h2>
              <p className="text-[12px] text-muted-foreground mt-0.5">When you're most active — by day of week and time of day</p>
            </div>
          </div>
          {loading ? (
            <div className="h-[200px] flex items-center justify-center">
              <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
            </div>
          ) : (
            <ActionHeatmapInner cells={displayHeatmap} />
          )}
        </div>

      </div>
    </div>
  );
}

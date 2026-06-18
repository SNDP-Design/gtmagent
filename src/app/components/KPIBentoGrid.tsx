'use client';
import React, { useState } from 'react';
import { TrendingUp, TrendingDown, FlaskConical, Mail, Target, Calendar, Minus, Users, Info, X } from 'lucide-react';
import Icon from '@/components/ui/AppIcon';


// Grid plan: 6 cards → grid-cols-4 → hero spans 2 cols (row 1: hero + 2 regular) + row 2: 3 regular
const kpiData = [
  {
    id: 'kpi-readiness',
    label: 'GTM Readiness Score',
    value: '67',
    unit: '%',
    trend: '+12%',
    trendUp: true,
    sub: 'vs. last week',
    icon: Target,
    hero: true,
    color: 'primary',
    progress: 67,
    detail: '4 of 6 strategy sections complete',
  },
  {
    id: 'kpi-experiments',
    label: 'Active Experiments',
    value: '3',
    unit: '',
    trend: '+1',
    trendUp: true,
    sub: 'this week',
    icon: FlaskConical,
    hero: false,
    color: 'info',
    detail: '2 running · 1 planned',
  },
  {
    id: 'kpi-outreach',
    label: 'Outreach Sent',
    value: '247',
    unit: '',
    trend: '+38',
    trendUp: true,
    sub: 'this week',
    icon: Mail,
    hero: false,
    color: 'positive',
    detail: 'Across 3 channels',
  },
  {
    id: 'kpi-response',
    label: 'Avg Response Rate',
    value: '11.4',
    unit: '%',
    trend: '-2.1%',
    trendUp: false,
    sub: 'vs. last week',
    icon: TrendingDown,
    hero: false,
    color: 'negative',
    detail: 'Cold email dragging avg down',
    alert: true,
  },
  {
    id: 'kpi-milestones',
    label: 'Milestones Done',
    value: '5',
    unit: '/9',
    trend: 'On track',
    trendUp: true,
    sub: 'for launch',
    icon: TrendingUp,
    hero: false,
    color: 'positive',
    detail: '55% complete',
  },
  {
    id: 'kpi-days',
    label: 'Days in GTM Sprint',
    value: '18',
    unit: '',
    trend: '12 days left',
    trendUp: null,
    sub: '30-day sprint',
    icon: Calendar,
    hero: false,
    color: 'warning',
    detail: 'Sprint ends Jul 8',
  },
  {
    id: 'kpi-icp',
    label: 'ICP Profiles',
    value: '4',
    unit: '',
    trend: '+2',
    trendUp: true,
    sub: 'this month',
    icon: Users,
    hero: false,
    color: 'info',
    detail: '2 high-fit · 2 exploratory',
  },
];

const colorMap: Record<string, string> = {
  primary: 'bg-secondary text-primary',
  info: 'bg-info-bg text-info',
  positive: 'bg-positive-bg text-positive',
  negative: 'bg-negative-bg text-negative',
  warning: 'bg-warning-bg text-warning',
};

const scoreBreakdown = [
  { label: 'Strategy Defined', done: true },
  { label: 'ICP Profiles Set', done: true },
  { label: 'Channels Selected', done: true },
  { label: 'Outreach Copy Ready', done: true },
  { label: 'Experiments Running', done: false },
  { label: 'Metrics Baseline Set', done: false },
];

export default function KPIBentoGrid() {
  const hero = kpiData.find((k) => k.hero);
  const rest = kpiData.filter((k) => !k.hero);
  const [showExplanation, setShowExplanation] = useState(false);

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 xl:grid-cols-4 2xl:grid-cols-4 gap-4">
      {/* Hero card — GTM Readiness Score — highlighted with ring + glow */}
      {hero && (
        <div className="col-span-2 relative">
          {/* Highlight ring */}
          <div className="absolute -inset-0.5 rounded-2xl bg-gradient-to-br from-primary/40 via-primary/20 to-transparent pointer-events-none" />
          <div className={`relative card-base p-5 shadow-card border-primary/40 bg-gradient-to-br from-secondary/80 to-background rounded-xl`}>
            {/* Score Explained toggle */}
            <div className="flex items-start justify-between mb-4">
              <div>
                <div className="flex items-center gap-2">
                  <p className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">{hero.label}</p>
                  <button
                    onClick={() => setShowExplanation(!showExplanation)}
                    className="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center text-primary hover:bg-primary/20 transition-colors"
                    aria-label="Explain GTM Readiness Score"
                  >
                    {showExplanation ? <X size={10} /> : <Info size={10} />}
                  </button>
                </div>
                <div className="flex items-end gap-1 mt-2">
                  <span className="text-5xl font-extrabold tabular-nums text-primary leading-none">{hero.value}</span>
                  <span className="text-2xl font-bold text-primary mb-1">{hero.unit}</span>
                </div>
                <p className="text-[12px] text-muted-foreground mt-1">{hero.detail}</p>
              </div>
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${colorMap[hero.color]} shadow-sm`}>
                <hero.icon size={22} />
              </div>
            </div>

            {/* Score explanation panel */}
            {showExplanation && (
              <div className="mb-4 p-3 rounded-lg bg-primary/5 border border-primary/15">
                <p className="text-[12px] font-semibold text-foreground mb-2">How your score is calculated</p>
                <p className="text-[11px] text-muted-foreground mb-3">
                  Your GTM Readiness Score reflects how prepared you are to launch. It's based on 6 key milestones across strategy, targeting, messaging, and execution.
                </p>
                <div className="grid grid-cols-2 gap-1.5">
                  {scoreBreakdown.map((item) => (
                    <div key={item.label} className="flex items-center gap-1.5">
                      <span className={`w-3.5 h-3.5 rounded-full flex items-center justify-center flex-shrink-0 text-[9px] font-bold ${item.done ? 'bg-positive text-white' : 'bg-muted-foreground/20 text-muted-foreground'}`}>
                        {item.done ? '✓' : '○'}
                      </span>
                      <span className={`text-[11px] ${item.done ? 'text-foreground' : 'text-muted-foreground'}`}>{item.label}</span>
                    </div>
                  ))}
                </div>
                <p className="text-[10px] text-muted-foreground mt-2.5 pt-2 border-t border-border">
                  Complete all 6 milestones to reach 100% readiness and unlock your full GTM potential.
                </p>
              </div>
            )}

            {/* Progress bar */}
            {hero.progress !== undefined && (
              <div className="mt-1">
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-[11px] text-muted-foreground">Strategy completion</span>
                  <span className="text-[11px] font-semibold text-primary">{hero.progress}%</span>
                </div>
                <div className="h-2.5 rounded-full bg-secondary overflow-hidden">
                  <div
                    className="h-full rounded-full gradient-primary transition-all duration-700 shadow-sm"
                    style={{ width: `${hero.progress}%` }}
                  />
                </div>
              </div>
            )}
            <div className="flex items-center gap-1.5 mt-3">
              <TrendingUp size={13} className="text-positive" />
              <span className="text-[12px] font-semibold text-positive">{hero.trend}</span>
              <span className="text-[12px] text-muted-foreground">{hero.sub}</span>
            </div>
          </div>
        </div>
      )}

      {/* Regular cards */}
      {rest.map((kpi) => {
        const Icon = kpi.icon;
        return (
          <div
            key={kpi.id}
            className={`card-base p-4 shadow-card hover:shadow-card-hover transition-shadow duration-200 ${
              kpi.alert ? 'border-negative/30 bg-negative-bg/10' : ''
            }`}
          >
            <div className="flex items-start justify-between mb-2">
              <p className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground leading-tight">
                {kpi.label}
              </p>
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${colorMap[kpi.color]}`}>
                <Icon size={15} />
              </div>
            </div>
            <div className="flex items-end gap-1">
              <span className="text-3xl font-extrabold tabular-nums text-foreground leading-none">{kpi.value}</span>
              {kpi.unit && <span className="text-lg font-bold text-muted-foreground mb-0.5">{kpi.unit}</span>}
            </div>
            <p className="text-[11px] text-muted-foreground mt-1">{kpi.detail}</p>
            <div className="flex items-center gap-1 mt-2">
              {kpi.trendUp === true && <TrendingUp size={12} className="text-positive" />}
              {kpi.trendUp === false && <TrendingDown size={12} className="text-negative" />}
              {kpi.trendUp === null && <Minus size={12} className="text-muted-foreground" />}
              <span
                className={`text-[11px] font-semibold ${
                  kpi.trendUp === true
                    ? 'text-positive'
                    : kpi.trendUp === false
                    ? 'text-negative' :'text-muted-foreground'
                }`}
              >
                {kpi.trend}
              </span>
              <span className="text-[11px] text-muted-foreground">{kpi.sub}</span>
            </div>
          </div>
        );
      })}
    </div>
  );
}
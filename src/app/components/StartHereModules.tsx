import React from 'react';
import Link from 'next/link';
import { Lightbulb, Search, PenLine, TestTube2, Activity, ArrowRight } from 'lucide-react';
import Icon from '@/components/ui/AppIcon';


const modules = [
  {
    step: 1,
    label: 'AI Strategy Builder',
    description: 'Define your GTM strategy with AI',
    href: '/ai-strategy-builder',
    icon: Lightbulb,
    color: 'bg-primary/10 text-primary',
    borderColor: 'border-primary/20 hover:border-primary/50',
  },
  {
    step: 2,
    label: 'ICP & Channel Finder',
    description: 'Identify your best-fit customers',
    href: '/icp-channel-finder',
    icon: Search,
    color: 'bg-info-bg text-info',
    borderColor: 'border-info/20 hover:border-info/50',
  },
  {
    step: 3,
    label: 'Outreach Copy',
    description: 'Generate high-converting copy',
    href: '/outreach-copy-generator',
    icon: PenLine,
    color: 'bg-positive-bg text-positive',
    borderColor: 'border-positive/20 hover:border-positive/50',
  },
  {
    step: 4,
    label: 'Experiment Tracker',
    description: 'Run and track GTM experiments',
    href: '/experiment-tracker',
    icon: TestTube2,
    color: 'bg-warning-bg text-warning',
    borderColor: 'border-warning/20 hover:border-warning/50',
  },
  {
    step: 5,
    label: 'GTM Momentum',
    description: 'Measure your overall momentum',
    href: '/gtm-momentum',
    icon: Activity,
    color: 'bg-accent/10 text-accent',
    borderColor: 'border-accent/20 hover:border-accent/50',
  },
];

export default function StartHereModules() {
  return (
    <div className="card-base p-5 shadow-card">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-[14px] font-bold text-foreground">Start Here</h2>
          <p className="text-[12px] text-muted-foreground mt-0.5">Jump into any module — follow the steps in order for best results</p>
        </div>
        <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground bg-secondary px-2 py-1 rounded-md">5 Modules</span>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
        {modules?.map((mod) => {
          const Icon = mod?.icon;
          return (
            <Link
              key={mod?.href}
              href={mod?.href}
              className={`group relative flex flex-col gap-2.5 p-3.5 rounded-xl border bg-background transition-all duration-200 ${mod?.borderColor} hover:shadow-md hover:-translate-y-0.5`}
            >
              {/* Step badge */}
              <span className="absolute top-2.5 right-2.5 w-5 h-5 rounded-full bg-secondary text-muted-foreground text-[10px] font-bold flex items-center justify-center">
                {mod?.step}
              </span>
              <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${mod?.color}`}>
                <Icon size={17} />
              </div>
              <div>
                <p className="text-[12px] font-semibold text-foreground leading-tight pr-5">{mod?.label}</p>
                <p className="text-[11px] text-muted-foreground mt-0.5 leading-tight">{mod?.description}</p>
              </div>
              <div className="flex items-center gap-1 text-[11px] font-semibold text-primary opacity-0 group-hover:opacity-100 transition-opacity mt-auto">
                Open <ArrowRight size={11} />
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}

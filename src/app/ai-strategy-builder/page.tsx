import React from 'react';
import AppLayout from '@/components/AppLayout';
import StrategyBuilderLayout from './components/StrategyBuilderLayout';

export default function AIStrategyBuilderPage() {
  return (
    <AppLayout currentPath="/ai-strategy-builder">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">AI Strategy Builder</h1>
            <p className="text-[13px] text-muted-foreground mt-1">
              Answer a few questions — your AI co-pilot builds a tailored GTM strategy in real time
            </p>
          </div>
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-secondary text-primary text-[12px] font-semibold border border-primary/20">
              4 of 6 sections complete
            </span>
          </div>
        </div>
        <StrategyBuilderLayout />
      </div>
    </AppLayout>
  );
}
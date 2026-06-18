import React from 'react';
import AppLayout from '@/components/AppLayout';
import ExperimentSummaryCards from './components/ExperimentSummaryCards';
import ExperimentChart from './components/ExperimentChart';
import ExperimentTable from './components/ExperimentTable';

export default function ExperimentTrackerPage() {
  return (
    <AppLayout currentPath="/experiment-tracker">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Experiment Tracker</h1>
            <p className="text-[13px] text-muted-foreground mt-1">
              Log GTM experiments, track results, and double down on what works
            </p>
          </div>
          <button className="btn-primary px-4 py-2.5 flex items-center gap-2 text-[13px]">
            + Log New Experiment
          </button>
        </div>

        <ExperimentSummaryCards />

        <ExperimentChart />

        <ExperimentTable />
      </div>
    </AppLayout>
  );
}
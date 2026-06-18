import React from 'react';
import AppLayout from '@/components/AppLayout';
import ExperimentSummaryCards from './components/ExperimentSummaryCards';
import ExperimentChart from './components/ExperimentChart';
import ExperimentTable from './components/ExperimentTable';
import ROIMetricsPanel from './components/ROIMetricsPanel';

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

        {/* ROI Metrics: cost-per-reply, channel efficiency, win-rate trends */}
        <div>
          <div className="mb-3">
            <h2 className="text-[15px] font-bold text-foreground">ROI & Optimization Metrics</h2>
            <p className="text-[12px] text-muted-foreground mt-0.5">
              Data-driven signals — cost efficiency, channel scores, and win-rate trends
            </p>
          </div>
          <ROIMetricsPanel />
        </div>

        <ExperimentTable />
      </div>
    </AppLayout>
  );
}
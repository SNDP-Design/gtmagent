import React from 'react';
import AppLayout from '@/components/AppLayout';
import NextActionBanner from '../components/NextActionBanner';
import KPIBentoGrid from '../components/KPIBentoGrid';
import ActivityChart from '../components/ActivityChart';
import ExperimentResultsChart from '../components/ExperimentResultsChart';
import MilestoneTracker from '../components/MilestoneTracker';
import TaskList from '../components/TaskList';
import StartHereModules from '../components/StartHereModules';

export default function ProgressDashboardPage() {
  return (
    <AppLayout currentPath="/dashboard">
      <div className="space-y-6">
        {/* Page header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Progress Dashboard</h1>
            <p className="text-[13px] text-muted-foreground mt-1">
              Last updated · Today at 5:35 AM · Week 3 of your GTM sprint
            </p>
          </div>
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-positive-bg text-positive text-[12px] font-semibold border border-positive/30">
              <span className="w-1.5 h-1.5 rounded-full bg-positive" />
              GTM Sprint Active
            </span>
          </div>
        </div>

        {/* AI Next Action Banner — prominent for new users with tour trigger */}
        <NextActionBanner />

        {/* Start Here — quick-action module links */}
        <StartHereModules />

        {/* KPI Bento Grid — GTM Readiness Score highlighted */}
        <KPIBentoGrid />

        {/* Charts row */}
        <div className="grid grid-cols-1 lg:grid-cols-5 xl:grid-cols-5 2xl:grid-cols-5 gap-6">
          <div className="lg:col-span-3">
            <ActivityChart />
          </div>
          <div className="lg:col-span-2">
            <ExperimentResultsChart />
          </div>
        </div>

        {/* Bottom row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-2 2xl:grid-cols-2 gap-6">
          <MilestoneTracker />
          <TaskList />
        </div>
      </div>
    </AppLayout>
  );
}

import React from 'react';
import AppLayout from '@/components/AppLayout';
import ICPChannelTabs from './components/ICPChannelTabs';

export default function ICPChannelFinderPage() {
  return (
    <AppLayout currentPath="/icp-channel-finder">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">ICP & Channel Finder</h1>
            <p className="text-[13px] text-muted-foreground mt-1">
              AI-identified customer profiles and the best channels to reach them
            </p>
          </div>
          <button className="btn-primary px-4 py-2.5 flex items-center gap-2 text-[13px]">
            + Refine with AI
          </button>
        </div>
        <ICPChannelTabs />
      </div>
    </AppLayout>
  );
}
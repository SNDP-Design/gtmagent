import React from 'react';
import AppLayout from '@/components/AppLayout';
import OutreachGeneratorLayout from './components/OutreachGeneratorLayout';

export default function OutreachCopyGeneratorPage() {
  return (
    <AppLayout currentPath="/outreach-copy-generator">
      <div className="space-y-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Outreach Copy Generator</h1>
          <p className="text-[13px] text-muted-foreground mt-1">
            AI-written cold emails, LinkedIn DMs, and pitch scripts tailored to your ICP
          </p>
        </div>
        <OutreachGeneratorLayout />
      </div>
    </AppLayout>
  );
}
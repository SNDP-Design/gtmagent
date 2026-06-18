import React from 'react';
import AppLayout from '@/components/AppLayout';
import GTMMomentumDashboard from './components/GTMMomentumDashboard';

export default function GTMMomentumPage() {
  return (
    <AppLayout currentPath="/gtm-momentum">
      <GTMMomentumDashboard />
    </AppLayout>
  );
}

'use client';
import React from 'react';
import dynamic from 'next/dynamic';

const ExperimentChartInner = dynamic(
  () => import('./ExperimentChartInner'),
  {
    ssr: false,
    loading: () => <div className="animate-pulse bg-muted rounded-xl" style={{ minHeight: 280 }} />,
  }
);

export default function ExperimentChart() {
  return <ExperimentChartInner />;
}
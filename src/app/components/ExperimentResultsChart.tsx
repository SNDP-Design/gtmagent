'use client';
import React from 'react';
import dynamic from 'next/dynamic';

const ExperimentResultsChartInner = dynamic(
  () => import('./ExperimentResultsChartInner'),
  {
    ssr: false,
    loading: () => <div className="card-base p-5 shadow-card h-full animate-pulse bg-muted rounded-xl" style={{ minHeight: 280 }} />,
  }
);

export default function ExperimentResultsChart() {
  return <ExperimentResultsChartInner />;
}
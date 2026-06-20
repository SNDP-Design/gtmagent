'use client';
import React from 'react';
import dynamic from 'next/dynamic';

const ROIMetricsPanelInner = dynamic(
  () => import('./ROIMetricsPanelInner'),
  {
    ssr: false,
    loading: () => <div className="animate-pulse bg-muted rounded-xl" style={{ minHeight: 320 }} />,
  }
);

export default function ROIMetricsPanel() {
  return <ROIMetricsPanelInner />;
}

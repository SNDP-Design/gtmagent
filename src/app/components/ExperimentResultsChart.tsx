'use client';
import React from 'react';
import dynamic from 'next/dynamic';

const ExperimentResultsChartInner = dynamic(() => import('./ExperimentResultsChartInner'), { ssr: false });

export default function ExperimentResultsChart() {
  return <ExperimentResultsChartInner />;
}
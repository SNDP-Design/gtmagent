'use client';
import React from 'react';
import dynamic from 'next/dynamic';

const ExperimentChartInner = dynamic(() => import('./ExperimentChartInner'), { ssr: false });

export default function ExperimentChart() {
  return <ExperimentChartInner />;
}
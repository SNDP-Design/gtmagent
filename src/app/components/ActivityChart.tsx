'use client';
import React from 'react';
import dynamic from 'next/dynamic';

const ActivityChartInner = dynamic(() => import('./ActivityChartInner'), { ssr: false });

export default function ActivityChart() {
  return <ActivityChartInner />;
}
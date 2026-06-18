'use client';
import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from 'recharts';

const data = [
  { channel: 'Cold Email', rate: 11.4, fill: 'var(--primary)' },
  { channel: 'LinkedIn DM', rate: 18.7, fill: 'var(--accent)' },
  { channel: 'Twitter/X', rate: 6.2, fill: 'var(--muted-foreground)' },
  { channel: 'Warm Intro', rate: 34.1, fill: 'var(--positive)' },
  { channel: 'Reddit', rate: 4.8, fill: 'var(--warning)' },
];

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-card border border-border rounded-xl p-3 shadow-modal text-[12px]">
        <p className="font-semibold text-foreground">{label}</p>
        <p className="text-muted-foreground mt-1">Reply rate: <span className="font-bold text-foreground">{payload[0].value}%</span></p>
      </div>
    );
  }
  return null;
};

export default function ExperimentResultsChartInner() {
  return (
    <div className="card-base p-5 shadow-card h-full">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-[15px] font-semibold text-foreground">Channel Reply Rates</h3>
          <p className="text-[12px] text-muted-foreground mt-0.5">Across all experiments</p>
        </div>
        <span className="text-[11px] font-semibold px-2.5 py-1 rounded-full bg-positive-bg text-positive border border-positive/30">
          Warm Intro wins
        </span>
      </div>
      <ResponsiveContainer width="100%" height={220}>
        <BarChart data={data} margin={{ top: 4, right: 4, left: -20, bottom: 0 }} barSize={28}>
          <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" horizontal vertical={false} />
          <XAxis dataKey="channel" tick={{ fontSize: 10, fill: 'var(--muted-foreground)' }} axisLine={false} tickLine={false} />
          <YAxis tick={{ fontSize: 11, fill: 'var(--muted-foreground)' }} axisLine={false} tickLine={false} unit="%" />
          <Tooltip content={<CustomTooltip />} />
          <Bar dataKey="rate" radius={[6, 6, 0, 0]}>
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.fill} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
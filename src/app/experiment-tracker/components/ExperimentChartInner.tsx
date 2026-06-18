'use client';
import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,  } from 'recharts';

const data = [
  { name: 'Warm Intro', sent: 41, replies: 14, conversions: 7 },
  { name: 'LinkedIn DM', sent: 87, replies: 16, conversions: 5 },
  { name: 'Cold Email', sent: 124, replies: 14, conversions: 3 },
  { name: 'IndieHackers', sent: 28, replies: 6, conversions: 3 },
  { name: 'Twitter/X', sent: 56, replies: 3, conversions: 1 },
  { name: 'Reddit', sent: 33, replies: 2, conversions: 0 },
];

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-card border border-border rounded-xl p-3 shadow-modal text-[12px]">
        <p className="font-bold text-foreground mb-2">{label}</p>
        {payload.map((entry: any, i: number) => (
          <div key={`exp-chart-tt-${i}`} className="flex items-center gap-2 mb-1">
            <span className="w-2 h-2 rounded-full" style={{ backgroundColor: entry.fill || entry.color }} />
            <span className="text-muted-foreground">{entry.name}:</span>
            <span className="font-semibold text-foreground">{entry.value}</span>
          </div>
        ))}
        {payload[0] && payload[1] && (
          <p className="text-[11px] text-muted-foreground mt-1 pt-1 border-t border-border">
            Reply rate: {Math.round((payload[1].value / payload[0].value) * 100)}%
          </p>
        )}
      </div>
    );
  }
  return null;
};

export default function ExperimentChartInner() {
  return (
    <div className="card-base p-5 shadow-card">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-[15px] font-semibold text-foreground">Experiment Results by Channel</h3>
          <p className="text-[12px] text-muted-foreground mt-0.5">Sent, replies, and conversions across all experiments</p>
        </div>
      </div>
      <ResponsiveContainer width="100%" height={240}>
        <BarChart data={data} margin={{ top: 4, right: 4, left: -20, bottom: 0 }} barSize={20} barCategoryGap="30%">
          <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
          <XAxis dataKey="name" tick={{ fontSize: 11, fill: 'var(--muted-foreground)' }} axisLine={false} tickLine={false} />
          <YAxis tick={{ fontSize: 11, fill: 'var(--muted-foreground)' }} axisLine={false} tickLine={false} />
          <Tooltip content={<CustomTooltip />} />
          <Legend wrapperStyle={{ fontSize: 12, paddingTop: 12 }} />
          <Bar dataKey="sent" name="Sent" fill="var(--muted-foreground)" radius={[4, 4, 0, 0]} opacity={0.5} />
          <Bar dataKey="replies" name="Replies" fill="var(--primary)" radius={[4, 4, 0, 0]} />
          <Bar dataKey="conversions" name="Conversions" fill="var(--positive)" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
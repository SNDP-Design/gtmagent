'use client';
import React from 'react';
import {
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from 'recharts';

const data = [
  { metric: 'Fit Score', 'Warm Intro': 97, 'LinkedIn': 88, 'Cold Email': 72, 'IndieHackers': 81 },
  { metric: 'Reply Rate', 'Warm Intro': 85, 'LinkedIn': 55, 'Cold Email': 30, 'IndieHackers': 60 },
  { metric: 'Conv. Rate', 'Warm Intro': 90, 'LinkedIn': 40, 'Cold Email': 20, 'IndieHackers': 50 },
  { metric: 'Low Effort', 'Warm Intro': 30, 'LinkedIn': 60, 'Cold Email': 65, 'IndieHackers': 85 },
  { metric: 'Scale', 'Warm Intro': 20, 'LinkedIn': 80, 'Cold Email': 85, 'IndieHackers': 55 },
  { metric: 'Speed', 'Warm Intro': 90, 'LinkedIn': 70, 'Cold Email': 55, 'IndieHackers': 40 },
];

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-card border border-border rounded-xl p-3 shadow-modal text-[12px]">
        <p className="font-semibold text-foreground mb-2">{label}</p>
        {payload.map((entry: any, i: number) => (
          <div key={`radar-tooltip-${i}`} className="flex items-center gap-2 mb-1">
            <span className="w-2 h-2 rounded-full" style={{ backgroundColor: entry.color }} />
            <span className="text-muted-foreground">{entry.name}:</span>
            <span className="font-semibold text-foreground">{entry.value}</span>
          </div>
        ))}
      </div>
    );
  }
  return null;
};

export default function ChannelRadarChart() {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <RadarChart data={data}>
        <PolarGrid stroke="var(--border)" />
        <PolarAngleAxis dataKey="metric" tick={{ fontSize: 11, fill: 'var(--muted-foreground)' }} />
        <PolarRadiusAxis angle={30} domain={[0, 100]} tick={{ fontSize: 10, fill: 'var(--muted-foreground)' }} />
        <Tooltip content={<CustomTooltip />} />
        <Legend wrapperStyle={{ fontSize: 12 }} />
        <Radar name="Warm Intro" dataKey="Warm Intro" stroke="var(--positive)" fill="var(--positive)" fillOpacity={0.1} strokeWidth={2} />
        <Radar name="LinkedIn" dataKey="LinkedIn" stroke="var(--primary)" fill="var(--primary)" fillOpacity={0.1} strokeWidth={2} />
        <Radar name="Cold Email" dataKey="Cold Email" stroke="var(--accent)" fill="var(--accent)" fillOpacity={0.1} strokeWidth={2} />
        <Radar name="IndieHackers" dataKey="IndieHackers" stroke="var(--warning)" fill="var(--warning)" fillOpacity={0.08} strokeWidth={2} />
      </RadarChart>
    </ResponsiveContainer>
  );
}
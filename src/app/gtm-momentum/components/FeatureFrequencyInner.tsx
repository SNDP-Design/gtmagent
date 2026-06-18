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

interface Props {
  data: { feature: string; count: number; category: string }[];
}

const COLORS: Record<string, string> = {
  strategy: 'var(--primary)',
  experiments: 'var(--accent)',
  copy: 'var(--positive)',
};

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-card border border-border rounded-xl p-3 shadow-modal text-[12px]">
        <p className="font-semibold text-foreground mb-1">{label}</p>
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full" style={{ backgroundColor: payload[0]?.fill }} />
          <span className="text-muted-foreground">Actions:</span>
          <span className="font-semibold text-foreground">{payload[0]?.value}</span>
        </div>
      </div>
    );
  }
  return null;
};

export default function FeatureFrequencyInner({ data }: Props) {
  return (
    <ResponsiveContainer width="100%" height={220}>
      <BarChart data={data} margin={{ top: 4, right: 4, left: -20, bottom: 0 }} barSize={28} barCategoryGap="30%">
        <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
        <XAxis dataKey="feature" tick={{ fontSize: 10, fill: 'var(--muted-foreground)' }} axisLine={false} tickLine={false} />
        <YAxis tick={{ fontSize: 11, fill: 'var(--muted-foreground)' }} axisLine={false} tickLine={false} />
        <Tooltip content={<CustomTooltip />} />
        <Bar dataKey="count" name="Actions" radius={[5, 5, 0, 0]}>
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[entry.category] || 'var(--primary)'} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}

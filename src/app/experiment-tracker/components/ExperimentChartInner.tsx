'use client';
import React, { useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { useExperimentsRealtime } from '@/lib/hooks/useExperimentsRealtime';
import { BarChart2 } from 'lucide-react';

const CHANNELS = ['LinkedIn DM', 'Cold Email', 'Warm Intro', 'IndieHackers', 'Twitter/X', 'Reddit'];

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
        {payload[0] && payload[1] && payload[0].value > 0 && (
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
  const { experiments } = useExperimentsRealtime();

  const data = useMemo(() => {
    return CHANNELS.map((ch) => {
      const exps = experiments.filter((e) => e.channel === ch);
      const sent = exps.reduce((s, e) => s + (e.sent || 0), 0);
      const replies = exps.reduce((s, e) => s + (e.replies || 0), 0);
      const conversions = exps.reduce((s, e) => s + (e.conversions || 0), 0);
      return { name: ch, sent, replies, conversions };
    }).filter((d) => d.sent > 0 || experiments.some((e) => e.channel === d.name));
  }, [experiments]);

  const hasData = data.some((d) => d.sent > 0);

  return (
    <div className="card-base p-5 shadow-card">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-[15px] font-semibold text-foreground">Experiment Results by Channel</h3>
          <p className="text-[12px] text-muted-foreground mt-0.5">Sent, replies, and conversions across all experiments</p>
        </div>
      </div>
      {hasData ? (
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
      ) : (
        <div className="flex flex-col items-center justify-center h-[240px] gap-2">
          <BarChart2 size={28} className="text-muted-foreground opacity-40" />
          <p className="text-[12px] text-muted-foreground">Log experiments to see channel results</p>
        </div>
      )}
    </div>
  );
}
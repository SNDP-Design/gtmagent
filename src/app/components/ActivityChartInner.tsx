'use client';
import React from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';

const data = [
  { day: 'Jun 2', emails: 12, linkedin: 5, replies: 2 },
  { day: 'Jun 4', emails: 18, linkedin: 8, replies: 4 },
  { day: 'Jun 6', emails: 9, linkedin: 12, replies: 3 },
  { day: 'Jun 8', emails: 24, linkedin: 7, replies: 6 },
  { day: 'Jun 10', emails: 31, linkedin: 15, replies: 8 },
  { day: 'Jun 12', emails: 22, linkedin: 18, replies: 5 },
  { day: 'Jun 14', emails: 28, linkedin: 22, replies: 9 },
  { day: 'Jun 16', emails: 35, linkedin: 19, replies: 11 },
  { day: 'Jun 18', emails: 41, linkedin: 27, replies: 14 },
];

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-card border border-border rounded-xl p-3 shadow-modal text-[12px]">
        <p className="font-semibold text-foreground mb-2">{label}</p>
        {payload.map((entry: any, i: number) => (
          <div key={`tooltip-entry-${i}`} className="flex items-center gap-2 mb-1">
            <span className="w-2 h-2 rounded-full" style={{ backgroundColor: entry.color }} />
            <span className="text-muted-foreground capitalize">{entry.name}:</span>
            <span className="font-semibold text-foreground">{entry.value}</span>
          </div>
        ))}
      </div>
    );
  }
  return null;
};

export default function ActivityChartInner() {
  return (
    <div className="card-base p-5 shadow-card h-full">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-[15px] font-semibold text-foreground">Weekly Outreach Activity</h3>
          <p className="text-[12px] text-muted-foreground mt-0.5">Emails sent, LinkedIn DMs, and replies received</p>
        </div>
        <span className="text-[11px] font-semibold px-2.5 py-1 rounded-full bg-positive-bg text-positive border border-positive/30">
          +38% this week
        </span>
      </div>
      <ResponsiveContainer width="100%" height={220}>
        <AreaChart data={data} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
          <defs>
            <linearGradient id="gradEmails" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="var(--primary)" stopOpacity={0.25} />
              <stop offset="95%" stopColor="var(--primary)" stopOpacity={0} />
            </linearGradient>
            <linearGradient id="gradLinkedin" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="var(--accent)" stopOpacity={0.2} />
              <stop offset="95%" stopColor="var(--accent)" stopOpacity={0} />
            </linearGradient>
            <linearGradient id="gradReplies" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="var(--positive)" stopOpacity={0.2} />
              <stop offset="95%" stopColor="var(--positive)" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
          <XAxis dataKey="day" tick={{ fontSize: 11, fill: 'var(--muted-foreground)' }} axisLine={false} tickLine={false} />
          <YAxis tick={{ fontSize: 11, fill: 'var(--muted-foreground)' }} axisLine={false} tickLine={false} />
          <Tooltip content={<CustomTooltip />} />
          <Legend wrapperStyle={{ fontSize: 12, paddingTop: 12 }} />
          <Area type="monotone" dataKey="emails" name="Cold Emails" stroke="var(--primary)" strokeWidth={2} fill="url(#gradEmails)" />
          <Area type="monotone" dataKey="linkedin" name="LinkedIn DMs" stroke="var(--accent)" strokeWidth={2} fill="url(#gradLinkedin)" />
          <Area type="monotone" dataKey="replies" name="Replies" stroke="var(--positive)" strokeWidth={2} fill="url(#gradReplies)" />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
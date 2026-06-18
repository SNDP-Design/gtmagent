'use client';
import React, { useMemo } from 'react';
import {
  RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis,
  ResponsiveContainer, Tooltip, LineChart, Line, XAxis, YAxis,
  CartesianGrid, Legend,
} from 'recharts';
import { DollarSign, TrendingUp, BarChart2, Target } from 'lucide-react';
import { useExperimentsRealtime } from '@/lib/hooks/useExperimentsRealtime';

const CHANNELS = ['LinkedIn DM', 'Cold Email', 'Warm Intro', 'IndieHackers', 'Twitter/X', 'Reddit'];

function safeDiv(a: number, b: number, fallback = 0) {
  return b > 0 ? a / b : fallback;
}

const CustomRadarTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-card border border-border rounded-xl p-3 shadow-modal text-[12px]">
        <p className="font-bold text-foreground mb-1">{payload[0]?.payload?.channel}</p>
        <p className="text-muted-foreground">
          Efficiency Score: <span className="font-semibold text-primary">{payload[0]?.value?.toFixed(1)}</span>
        </p>
      </div>
    );
  }
  return null;
};

const CustomLineTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-card border border-border rounded-xl p-3 shadow-modal text-[12px]">
        <p className="font-bold text-foreground mb-2">{label}</p>
        {payload.map((entry: any, i: number) => (
          <div key={`wrt-tt-${i}`} className="flex items-center gap-2 mb-1">
            <span className="w-2 h-2 rounded-full" style={{ backgroundColor: entry.color }} />
            <span className="text-muted-foreground">{entry.name}:</span>
            <span className="font-semibold text-foreground">{entry.value?.toFixed(1)}%</span>
          </div>
        ))}
      </div>
    );
  }
  return null;
};

export default function ROIMetricsPanelInner() {
  const { experiments } = useExperimentsRealtime();

  // ── ROI summary metrics ──────────────────────────────────────────────────
  const roiMetrics = useMemo(() => {
    const totalCost = experiments.reduce((s, e) => s + (e.costPerMessage || 0) * (e.sent || 0), 0);
    const totalRevenue = experiments.reduce((s, e) => s + (e.revenueAttributed || 0), 0);
    const totalReplies = experiments.reduce((s, e) => s + (e.replies || 0), 0);
    const totalSent = experiments.reduce((s, e) => s + (e.sent || 0), 0);
    const costPerReply = safeDiv(totalCost, totalReplies);
    const roi = totalCost > 0 ? ((totalRevenue - totalCost) / totalCost) * 100 : 0;
    const avgWinRate = experiments.length > 0
      ? experiments.reduce((s, e) => s + (e.winRate || safeDiv(e.conversions, e.sent) * 100), 0) / experiments.length
      : 0;

    return { totalCost, totalRevenue, totalReplies, totalSent, costPerReply, roi, avgWinRate };
  }, [experiments]);

  // ── Channel efficiency scores (radar) ────────────────────────────────────
  // Score = weighted composite: reply_rate(40%) + conv_rate(40%) + cost_efficiency(20%)
  const channelEfficiency = useMemo(() => {
    return CHANNELS.map((ch) => {
      const exps = experiments.filter((e) => e.channel === ch);
      if (exps.length === 0) return { channel: ch, score: 0 };

      const sent = exps.reduce((s, e) => s + (e.sent || 0), 0);
      const replies = exps.reduce((s, e) => s + (e.replies || 0), 0);
      const conversions = exps.reduce((s, e) => s + (e.conversions || 0), 0);
      const totalCost = exps.reduce((s, e) => s + (e.costPerMessage || 0) * (e.sent || 0), 0);

      const replyRate = safeDiv(replies, sent) * 100;       // 0-100
      const convRate = safeDiv(conversions, sent) * 100;    // 0-100
      // cost efficiency: lower cost per reply = higher score (normalised to 0-100)
      const cpr = safeDiv(totalCost, replies);
      const costEff = cpr === 0 ? 50 : Math.min(100, 100 / (1 + cpr / 10));

      const score = replyRate * 0.4 + convRate * 0.4 + costEff * 0.2;
      return { channel: ch, score: Math.round(score * 10) / 10 };
    }).filter((d) => d.score > 0 || experiments.some((e) => e.channel === d.channel));
  }, [experiments]);

  // ── Win-rate trends (line chart by experiment order) ─────────────────────
  const winRateTrends = useMemo(() => {
    const sorted = [...experiments].sort(
      (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
    );
    return sorted.map((e, idx) => ({
      label: `Exp ${idx + 1}`,
      name: e.name.length > 18 ? e.name.slice(0, 18) + '…' : e.name,
      winRate: e.winRate > 0 ? e.winRate : safeDiv(e.conversions, e.sent) * 100,
      replyRate: safeDiv(e.replies, e.sent) * 100,
    }));
  }, [experiments]);

  const summaryCards = [
    {
      id: 'roi-card-cpr',
      label: 'Cost per Reply',
      value: roiMetrics.costPerReply > 0 ? `$${roiMetrics.costPerReply.toFixed(2)}` : '—',
      sub: `$${roiMetrics.totalCost.toFixed(0)} total spend`,
      icon: DollarSign,
      color: 'text-warning bg-warning-bg',
    },
    {
      id: 'roi-card-roi',
      label: 'Campaign ROI',
      value: roiMetrics.totalCost > 0 ? `${roiMetrics.roi >= 0 ? '+' : ''}${roiMetrics.roi.toFixed(0)}%` : '—',
      sub: `$${roiMetrics.totalRevenue.toFixed(0)} attributed revenue`,
      icon: TrendingUp,
      color: roiMetrics.roi >= 0 ? 'text-positive bg-positive-bg' : 'text-negative bg-negative-bg',
    },
    {
      id: 'roi-card-eff',
      label: 'Top Channel',
      value: channelEfficiency.length > 0
        ? channelEfficiency.sort((a, b) => b.score - a.score)[0]?.channel || '—' :'—',
      sub: channelEfficiency.length > 0
        ? `Score ${channelEfficiency.sort((a, b) => b.score - a.score)[0]?.score?.toFixed(1) || 0}`
        : 'No data yet',
      icon: BarChart2,
      color: 'text-info bg-info-bg',
    },
    {
      id: 'roi-card-wr',
      label: 'Avg Win Rate',
      value: roiMetrics.avgWinRate > 0 ? `${roiMetrics.avgWinRate.toFixed(1)}%` : '—',
      sub: `${experiments.reduce((s, e) => s + (e.conversions || 0), 0)} total wins`,
      icon: Target,
      color: 'text-accent bg-accent/10',
    },
  ];

  const hasData = experiments.length > 0;

  return (
    <div className="space-y-4">
      {/* ROI Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {summaryCards.map((card) => (
          <div key={card.id} className="card-base shadow-card p-4">
            <div className="flex items-start justify-between mb-3">
              <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${card.color}`}>
                <card.icon size={16} />
              </div>
            </div>
            <p className="text-[22px] font-bold text-foreground tabular-nums">{card.value}</p>
            <p className="text-[12px] font-semibold text-foreground mt-0.5">{card.label}</p>
            <p className="text-[11px] text-muted-foreground mt-0.5">{card.sub}</p>
          </div>
        ))}
      </div>

      {/* Charts row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Channel Efficiency Radar */}
        <div className="card-base shadow-card p-5">
          <div className="mb-4">
            <h3 className="text-[15px] font-semibold text-foreground">Channel Efficiency Scores</h3>
            <p className="text-[12px] text-muted-foreground mt-0.5">
              Composite score: reply rate (40%) + conversion rate (40%) + cost efficiency (20%)
            </p>
          </div>
          {hasData && channelEfficiency.some((d) => d.score > 0) ? (
            <ResponsiveContainer width="100%" height={220}>
              <RadarChart data={channelEfficiency} margin={{ top: 4, right: 20, bottom: 4, left: 20 }}>
                <PolarGrid stroke="var(--border)" />
                <PolarAngleAxis
                  dataKey="channel"
                  tick={{ fontSize: 10, fill: 'var(--muted-foreground)' }}
                />
                <PolarRadiusAxis
                  angle={30}
                  domain={[0, 100]}
                  tick={{ fontSize: 9, fill: 'var(--muted-foreground)' }}
                  tickCount={4}
                />
                <Radar
                  name="Efficiency"
                  dataKey="score"
                  stroke="var(--primary)"
                  fill="var(--primary)"
                  fillOpacity={0.25}
                  strokeWidth={2}
                />
                <Tooltip content={<CustomRadarTooltip />} />
              </RadarChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex flex-col items-center justify-center h-[220px] gap-2">
              <BarChart2 size={28} className="text-muted-foreground opacity-40" />
              <p className="text-[12px] text-muted-foreground">Log experiments to see channel scores</p>
            </div>
          )}
        </div>

        {/* Win-Rate Trends Line Chart */}
        <div className="card-base shadow-card p-5">
          <div className="mb-4">
            <h3 className="text-[15px] font-semibold text-foreground">Win-Rate Trends</h3>
            <p className="text-[12px] text-muted-foreground mt-0.5">
              Conversion win rate and reply rate across experiments over time
            </p>
          </div>
          {winRateTrends.length > 0 ? (
            <ResponsiveContainer width="100%" height={220}>
              <LineChart data={winRateTrends} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
                <XAxis
                  dataKey="label"
                  tick={{ fontSize: 11, fill: 'var(--muted-foreground)' }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  tick={{ fontSize: 11, fill: 'var(--muted-foreground)' }}
                  axisLine={false}
                  tickLine={false}
                  unit="%"
                />
                <Tooltip content={<CustomLineTooltip />} />
                <Legend wrapperStyle={{ fontSize: 12, paddingTop: 12 }} />
                <Line
                  type="monotone"
                  dataKey="replyRate"
                  name="Reply Rate"
                  stroke="var(--primary)"
                  strokeWidth={2}
                  dot={{ r: 3, fill: 'var(--primary)' }}
                  activeDot={{ r: 5 }}
                />
                <Line
                  type="monotone"
                  dataKey="winRate"
                  name="Win Rate"
                  stroke="var(--positive)"
                  strokeWidth={2}
                  dot={{ r: 3, fill: 'var(--positive)' }}
                  activeDot={{ r: 5 }}
                />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex flex-col items-center justify-center h-[220px] gap-2">
              <TrendingUp size={28} className="text-muted-foreground opacity-40" />
              <p className="text-[12px] text-muted-foreground">Log experiments to see win-rate trends</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

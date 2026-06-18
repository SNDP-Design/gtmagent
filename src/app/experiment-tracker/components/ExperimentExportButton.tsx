'use client';
import React, { useMemo, useState } from 'react';
import { Download } from 'lucide-react';
import { useExperimentsRealtime } from '@/lib/hooks/useExperimentsRealtime';
import ExportReportModal from '@/components/ExportReportModal';

function safeDiv(a: number, b: number, fallback = 0) {
  return b > 0 ? a / b : fallback;
}

const CHANNELS = ['LinkedIn DM', 'Cold Email', 'Warm Intro', 'IndieHackers', 'Twitter/X', 'Reddit'];

export default function ExperimentExportButton() {
  const { experiments } = useExperimentsRealtime();
  const [open, setOpen] = useState(false);

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

  const channelEfficiency = useMemo(() => {
    return CHANNELS.map((ch) => {
      const exps = experiments.filter((e) => e.channel === ch);
      if (exps.length === 0) return { channel: ch, score: 0 };
      const sent = exps.reduce((s, e) => s + (e.sent || 0), 0);
      const replies = exps.reduce((s, e) => s + (e.replies || 0), 0);
      const conversions = exps.reduce((s, e) => s + (e.conversions || 0), 0);
      const totalCost = exps.reduce((s, e) => s + (e.costPerMessage || 0) * (e.sent || 0), 0);
      const replyRate = safeDiv(replies, sent) * 100;
      const convRate = safeDiv(conversions, sent) * 100;
      const cpr = safeDiv(totalCost, replies);
      const costEff = cpr === 0 ? 50 : Math.min(100, 100 / (1 + cpr / 10));
      const score = replyRate * 0.4 + convRate * 0.4 + costEff * 0.2;
      return { channel: ch, score: Math.round(score * 10) / 10 };
    }).filter((d) => d.score > 0 || experiments.some((e) => e.channel === d.channel));
  }, [experiments]);

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="btn-secondary px-4 py-2.5 flex items-center gap-2 text-[13px]"
      >
        <Download size={14} /> Export Report
      </button>
      <ExportReportModal
        open={open}
        onClose={() => setOpen(false)}
        experiments={experiments}
        roiMetrics={roiMetrics}
        channelEfficiency={channelEfficiency}
        availableSections={['experiments', 'roi', 'recommendations']}
      />
    </>
  );
}

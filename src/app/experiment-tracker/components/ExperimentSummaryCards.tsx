'use client';
import React, { useState } from 'react';
import { TrendingUp, Send, Zap, Target, Sparkles, Loader2, X } from 'lucide-react';

import { geminiChatCompletion } from '@/lib/ai/geminiWithFallback';
import { useExperimentsRealtime } from '@/lib/hooks/useExperimentsRealtime';
import { toast } from 'sonner';

export default function ExperimentSummaryCards() {
  const { experiments } = useExperimentsRealtime();
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState<string | null>(null);
  const [showAnalysis, setShowAnalysis] = useState(false);

  const totalSent = experiments.reduce((s, e) => s + (e.sent || 0), 0);
  const totalReplies = experiments.reduce((s, e) => s + (e.replies || 0), 0);
  const totalConversions = experiments.reduce((s, e) => s + (e.conversions || 0), 0);
  const avgReplyRate = totalSent > 0 ? ((totalReplies / totalSent) * 100).toFixed(1) : '0.0';
  const running = experiments.filter((e) => e.status === 'Running').length;
  const strongSignals = experiments.filter((e) => e.signal === 'Strong').length;

  const handleAnalyze = async () => {
    if (experiments.length === 0) {
      toast.error('Log some experiments first to get AI analysis.');
      return;
    }

    setIsAnalyzing(true);
    setShowAnalysis(true);

    const experimentSummary = experiments
      .map(
        (e) =>
          `- ${e.name} | Channel: ${e.channel} | ICP: ${e.icpTarget} | Status: ${e.status} | Sent: ${e.sent} | Replies: ${e.replies} | Conversions: ${e.conversions} | Signal: ${e.signal} | Hypothesis: ${e.hypothesis}`
      )
      .join('\n');

    try {
      const result = await geminiChatCompletion(
        [
          {
            role: 'system',
            content:
              'You are a GTM experiment analyst. Analyze outreach experiment data and provide concise, actionable insights. Use **bold** for key findings. Keep response under 200 words.',
          },
          {
            role: 'user',
            content: `Analyze these GTM experiments and tell me: (1) what\'s working, (2) what to stop, (3) what to double down on, and (4) one specific next action.\n\nExperiments:\n${experimentSummary}`,
          },
        ],
        { temperature: 0.5, max_tokens: 512 }
      );

      const content = result?.choices?.[0]?.message?.content || '';
      setAnalysis(content);
    } catch (err: any) {
      toast.error('Analysis failed: ' + (err.message || 'Please try again.'));
      setShowAnalysis(false);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const cards = [
    {
      id: 'card-sent',
      label: 'Total Outreach Sent',
      value: totalSent.toLocaleString(),
      sub: `${running} experiments running`,
      icon: Send,
      color: 'text-primary bg-secondary',
    },
    {
      id: 'card-reply',
      label: 'Avg Reply Rate',
      value: `${avgReplyRate}%`,
      sub: `${totalReplies} total replies`,
      icon: TrendingUp,
      color: 'text-positive bg-positive-bg',
    },
    {
      id: 'card-conv',
      label: 'Conversions',
      value: totalConversions.toString(),
      sub: 'Discovery calls booked',
      icon: Target,
      color: 'text-info bg-info-bg',
    },
    {
      id: 'card-signal',
      label: 'Strong Signals',
      value: strongSignals.toString(),
      sub: 'Experiments to scale',
      icon: Zap,
      color: 'text-accent bg-accent/10',
    },
  ];

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {cards.map((card) => (
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

      {/* AI Analysis Panel */}
      <div className="card-base shadow-card p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg gradient-primary flex items-center justify-center">
              <Sparkles size={15} className="text-white" />
            </div>
            <div>
              <p className="text-[13px] font-semibold text-foreground">AI Experiment Analysis</p>
              <p className="text-[11px] text-muted-foreground">Gemini analyzes your experiments to surface patterns</p>
            </div>
          </div>
          <button
            onClick={handleAnalyze}
            disabled={isAnalyzing}
            className="btn-primary px-4 py-2 flex items-center gap-2 text-[12px] disabled:opacity-60 disabled:cursor-not-allowed disabled:transform-none"
          >
            {isAnalyzing ? (
              <>
                <Loader2 size={14} className="animate-spin" />
                Analyzing…
              </>
            ) : (
              <>
                <Sparkles size={14} />
                Analyze Experiments
              </>
            )}
          </button>
        </div>

        {showAnalysis && (
          <div className="mt-4 p-4 rounded-xl bg-muted border border-border relative">
            <button
              onClick={() => setShowAnalysis(false)}
              className="absolute top-3 right-3 text-muted-foreground hover:text-foreground transition-colors"
            >
              <X size={14} />
            </button>
            {isAnalyzing ? (
              <div className="flex items-center gap-2 text-[13px] text-muted-foreground">
                <Loader2 size={14} className="animate-spin text-primary" />
                Gemini is analyzing your experiment data…
              </div>
            ) : (
              <p
                className="text-[13px] text-foreground leading-relaxed pr-4"
                dangerouslySetInnerHTML={{
                  __html: (analysis || '').replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>').replace(/\n/g, '<br/>'),
                }}
              />
            )}
          </div>
        )}
      </div>
    </div>
  );
}
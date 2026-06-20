'use client';
import React, { useState } from 'react';
import { X, Download, FileText, Table2, CheckSquare, Square, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import type { Experiment } from '@/lib/services/experimentService';
import type { StrategySection } from '@/app/ai-strategy-builder/components/StrategyBuilderLayout';

export type ExportSection =
  | 'strategy' |'experiments' |'roi' |'recommendations';

interface ExportReportModalProps {
  open: boolean;
  onClose: () => void;
  // Pass whichever data is available — the modal renders only what's provided
  strategySections?: StrategySection[];
  experiments?: Experiment[];
  roiMetrics?: {
    costPerReply: number;
    roi: number;
    avgWinRate: number;
    totalCost: number;
    totalRevenue: number;
    totalReplies: number;
    totalSent: number;
  };
  channelEfficiency?: { channel: string; score: number }[];
  availableSections?: ExportSection[];
}

const SECTION_LABELS: Record<ExportSection, string> = {
  strategy: 'Strategy Plan',
  experiments: 'Experiment Results',
  roi: 'ROI Metrics',
  recommendations: 'Recommendations',
};

function safeDiv(a: number, b: number, fallback = 0) {
  return b > 0 ? a / b : fallback;
}

function buildRecommendations(
  experiments: Experiment[],
  channelEfficiency: { channel: string; score: number }[]
): string[] {
  const recs: string[] = [];

  if (channelEfficiency.length > 0) {
    const sorted = [...channelEfficiency].sort((a, b) => b.score - a.score);
    const top = sorted[0];
    if (top && top.score > 0) {
      recs.push(`Double down on ${top.channel} — highest efficiency score of ${top.score.toFixed(1)}/100.`);
    }
    const bottom = sorted[sorted.length - 1];
    if (bottom && bottom.score < 20 && sorted.length > 1) {
      recs.push(`Consider pausing ${bottom.channel} — efficiency score of ${bottom.score.toFixed(1)}/100 is below threshold.`);
    }
  }

  const completed = experiments.filter((e) => e.status === 'Completed');
  const strongSignal = completed.filter((e) => e.signal === 'Strong');
  if (strongSignal.length > 0) {
    recs.push(`Scale experiments with strong signal: ${strongSignal.map((e) => e.name).join(', ')}.`);
  }

  const highWinRate = experiments.filter((e) => (e.winRate || 0) > 20);
  if (highWinRate.length > 0) {
    recs.push(`High win-rate experiments to replicate: ${highWinRate.map((e) => `${e.name} (${e.winRate.toFixed(1)}%)`).join(', ')}.`);
  }

  const lowCPR = experiments
    .filter((e) => e.costPerMessage > 0 && e.replies > 0)
    .sort((a, b) => safeDiv(a.costPerMessage * a.sent, a.replies) - safeDiv(b.costPerMessage * b.sent, b.replies));
  if (lowCPR.length > 0) {
    recs.push(`Most cost-efficient experiment: "${lowCPR[0].name}" — lowest cost-per-reply.`);
  }

  if (recs.length === 0) {
    recs.push('Log more experiments to unlock data-driven recommendations.');
  }

  return recs;
}

function exportCSV(
  selectedSections: ExportSection[],
  experiments: Experiment[],
  strategySections: StrategySection[],
  roiMetrics: ExportReportModalProps['roiMetrics'],
  channelEfficiency: { channel: string; score: number }[]
) {
  const rows: string[][] = [];

  if (selectedSections.includes('strategy') && strategySections.length > 0) {
    rows.push(['=== STRATEGY PLAN ===']);
    rows.push(['Section', 'Status', 'Content']);
    strategySections
      .filter((s) => s.status !== 'locked')
      .forEach((s) => {
        rows.push([s.title, s.status, s.content.replace(/,/g, ';').replace(/\n/g, ' ')]);
      });
    rows.push([]);
  }

  if (selectedSections.includes('experiments') && experiments.length > 0) {
    rows.push(['=== EXPERIMENT RESULTS ===']);
    rows.push(['Name', 'Channel', 'ICP Target', 'Status', 'Sent', 'Replies', 'Conversions', 'Signal', 'Win Rate (%)', 'Cost/Msg ($)', 'Revenue ($)', 'Start Date']);
    experiments.forEach((e) => {
      rows.push([
        e.name,
        e.channel,
        e.icpTarget,
        e.status,
        String(e.sent),
        String(e.replies),
        String(e.conversions),
        e.signal,
        e.winRate > 0 ? e.winRate.toFixed(1) : safeDiv(e.conversions, e.sent * 100, 0).toFixed(1),
        e.costPerMessage > 0 ? e.costPerMessage.toFixed(2) : '0',
        e.revenueAttributed > 0 ? e.revenueAttributed.toFixed(2) : '0',
        e.startDate,
      ]);
    });
    rows.push([]);
  }

  if (selectedSections.includes('roi') && roiMetrics) {
    rows.push(['=== ROI METRICS ===']);
    rows.push(['Metric', 'Value']);
    rows.push(['Total Sent', String(roiMetrics.totalSent)]);
    rows.push(['Total Replies', String(roiMetrics.totalReplies)]);
    rows.push(['Cost per Reply', roiMetrics.costPerReply > 0 ? `$${roiMetrics.costPerReply.toFixed(2)}` : '—']);
    rows.push(['Campaign ROI', roiMetrics.totalCost > 0 ? `${roiMetrics.roi.toFixed(1)}%` : '—']);
    rows.push(['Total Spend', `$${roiMetrics.totalCost.toFixed(2)}`]);
    rows.push(['Attributed Revenue', `$${roiMetrics.totalRevenue.toFixed(2)}`]);
    rows.push(['Avg Win Rate', roiMetrics.avgWinRate > 0 ? `${roiMetrics.avgWinRate.toFixed(1)}%` : '—']);
    rows.push([]);

    if (channelEfficiency.length > 0) {
      rows.push(['Channel Efficiency Scores']);
      rows.push(['Channel', 'Score (0-100)']);
      [...channelEfficiency]
        .sort((a, b) => b.score - a.score)
        .forEach((c) => rows.push([c.channel, c.score.toFixed(1)]));
      rows.push([]);
    }
  }

  if (selectedSections.includes('recommendations')) {
    const recs = buildRecommendations(experiments, channelEfficiency);
    rows.push(['=== RECOMMENDATIONS ===']);
    rows.push(['#', 'Recommendation']);
    recs.forEach((r, i) => rows.push([String(i + 1), r]));
    rows.push([]);
  }

  const csv = rows.map((r) => r.map((cell) => `"${cell}"`).join(',')).join('\n');
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `gtm-report-${new Date().toISOString().slice(0, 10)}.csv`;
  a.click();
  URL.revokeObjectURL(url);
}

async function exportPDF(
  selectedSections: ExportSection[],
  experiments: Experiment[],
  strategySections: StrategySection[],
  roiMetrics: ExportReportModalProps['roiMetrics'],
  channelEfficiency: { channel: string; score: number }[]
) {
  const { default: jsPDF } = await import('jspdf');
  const { default: autoTable } = await import('jspdf-autotable');

  const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
  const pageW = doc.internal.pageSize.getWidth();
  const margin = 16;
  let y = margin;

  const addPageIfNeeded = (needed = 20) => {
    if (y + needed > doc.internal.pageSize.getHeight() - margin) {
      doc.addPage();
      y = margin;
    }
  };

  const drawSectionTitle = (title: string) => {
    addPageIfNeeded(14);
    doc.setFillColor(240, 240, 255);
    doc.roundedRect(margin, y, pageW - margin * 2, 9, 2, 2, 'F');
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(11);
    doc.setTextColor(60, 60, 180);
    doc.text(title, margin + 3, y + 6.2);
    y += 13;
    doc.setTextColor(30, 30, 30);
  };

  // ── Header ──────────────────────────────────────────────────────────────
  doc.setFillColor(30, 30, 60);
  doc.rect(0, 0, pageW, 22, 'F');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(16);
  doc.setTextColor(255, 255, 255);
  doc.text('GTM Fox — Strategy & Experiment Report', margin, 14);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(200, 200, 220);
  doc.text(`Generated: ${new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}`, margin, 19.5);
  y = 30;

  // ── Strategy Plan ────────────────────────────────────────────────────────
  if (selectedSections.includes('strategy') && strategySections.length > 0) {
    drawSectionTitle('Strategy Plan');
    const unlocked = strategySections.filter((s) => s.status !== 'locked');
    unlocked.forEach((s) => {
      addPageIfNeeded(24);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(10);
      doc.setTextColor(30, 30, 30);
      doc.text(s.title, margin, y);
      y += 5;

      const statusColors: Record<string, [number, number, number]> = {
        complete: [34, 197, 94],
        'in-progress': [59, 130, 246],
        locked: [150, 150, 150],
      };
      const [r, g, b] = statusColors[s.status] || [150, 150, 150];
      doc.setFillColor(r, g, b);
      doc.roundedRect(margin, y, 22, 4.5, 1, 1, 'F');
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(7);
      doc.setTextColor(255, 255, 255);
      doc.text(s.status === 'in-progress' ? 'In Progress' : s.status.charAt(0).toUpperCase() + s.status.slice(1), margin + 2, y + 3.2);
      y += 7;

      if (s.content) {
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(9);
        doc.setTextColor(60, 60, 60);
        const lines = doc.splitTextToSize(s.content, pageW - margin * 2);
        lines.forEach((line: string) => {
          addPageIfNeeded(5);
          doc.text(line, margin, y);
          y += 4.5;
        });
      }
      y += 5;
    });
  }

  // ── Experiment Results ───────────────────────────────────────────────────
  if (selectedSections.includes('experiments') && experiments.length > 0) {
    addPageIfNeeded(20);
    drawSectionTitle('Experiment Results');

    autoTable(doc, {
      startY: y,
      margin: { left: margin, right: margin },
      head: [['Name', 'Channel', 'Status', 'Sent', 'Replies', 'Conv.', 'Signal', 'Win Rate']],
      body: experiments.map((e) => [
        e.name.length > 22 ? e.name.slice(0, 22) + '…' : e.name,
        e.channel,
        e.status,
        e.sent,
        e.replies,
        e.conversions,
        e.signal,
        e.winRate > 0 ? `${e.winRate.toFixed(1)}%` : `${(safeDiv(e.conversions, e.sent) * 100).toFixed(1)}%`,
      ]),
      styles: { fontSize: 8, cellPadding: 2.5 },
      headStyles: { fillColor: [30, 30, 60], textColor: 255, fontStyle: 'bold', fontSize: 8 },
      alternateRowStyles: { fillColor: [248, 248, 255] },
      columnStyles: {
        0: { cellWidth: 42 },
        1: { cellWidth: 28 },
        2: { cellWidth: 20 },
        3: { cellWidth: 14, halign: 'right' },
        4: { cellWidth: 14, halign: 'right' },
        5: { cellWidth: 12, halign: 'right' },
        6: { cellWidth: 20 },
        7: { cellWidth: 18, halign: 'right' },
      },
      didDrawPage: (data: any) => { y = data.cursor?.y ?? y; },
    });
    y = (doc as any).lastAutoTable?.finalY + 8 || y + 8;
  }

  // ── ROI Metrics ──────────────────────────────────────────────────────────
  if (selectedSections.includes('roi') && roiMetrics) {
    addPageIfNeeded(60);
    drawSectionTitle('ROI Metrics');

    const metricRows = [
      ['Total Sent', String(roiMetrics.totalSent)],
      ['Total Replies', String(roiMetrics.totalReplies)],
      ['Cost per Reply', roiMetrics.costPerReply > 0 ? `$${roiMetrics.costPerReply.toFixed(2)}` : '—'],
      ['Campaign ROI', roiMetrics.totalCost > 0 ? `${roiMetrics.roi >= 0 ? '+' : ''}${roiMetrics.roi.toFixed(1)}%` : '—'],
      ['Total Spend', `$${roiMetrics.totalCost.toFixed(2)}`],
      ['Attributed Revenue', `$${roiMetrics.totalRevenue.toFixed(2)}`],
      ['Avg Win Rate', roiMetrics.avgWinRate > 0 ? `${roiMetrics.avgWinRate.toFixed(1)}%` : '—'],
    ];

    autoTable(doc, {
      startY: y,
      margin: { left: margin, right: margin },
      head: [['Metric', 'Value']],
      body: metricRows,
      styles: { fontSize: 9, cellPadding: 3 },
      headStyles: { fillColor: [30, 30, 60], textColor: 255, fontStyle: 'bold' },
      alternateRowStyles: { fillColor: [248, 248, 255] },
      columnStyles: { 0: { fontStyle: 'bold', cellWidth: 70 }, 1: { halign: 'right' } },
      didDrawPage: (data: any) => { y = data.cursor?.y ?? y; },
    });
    y = (doc as any).lastAutoTable?.finalY + 8 || y + 8;

    if (channelEfficiency.length > 0) {
      addPageIfNeeded(40);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(10);
      doc.setTextColor(30, 30, 30);
      doc.text('Channel Efficiency Scores', margin, y);
      y += 5;

      autoTable(doc, {
        startY: y,
        margin: { left: margin, right: margin },
        head: [['Channel', 'Efficiency Score (0–100)']],
        body: [...channelEfficiency]
          .sort((a, b) => b.score - a.score)
          .map((c) => [c.channel, c.score.toFixed(1)]),
        styles: { fontSize: 9, cellPadding: 3 },
        headStyles: { fillColor: [30, 30, 60], textColor: 255, fontStyle: 'bold' },
        alternateRowStyles: { fillColor: [248, 248, 255] },
        columnStyles: { 0: { cellWidth: 70 }, 1: { halign: 'right' } },
        didDrawPage: (data: any) => { y = data.cursor?.y ?? y; },
      });
      y = (doc as any).lastAutoTable?.finalY + 8 || y + 8;
    }
  }

  // ── Recommendations ──────────────────────────────────────────────────────
  if (selectedSections.includes('recommendations')) {
    addPageIfNeeded(20);
    drawSectionTitle('Recommendations');
    const recs = buildRecommendations(experiments, channelEfficiency);
    recs.forEach((rec, i) => {
      addPageIfNeeded(10);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(9);
      doc.setTextColor(60, 60, 180);
      doc.text(`${i + 1}.`, margin, y);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(40, 40, 40);
      const lines = doc.splitTextToSize(rec, pageW - margin * 2 - 8);
      lines.forEach((line: string, li: number) => {
        doc.text(line, margin + 6, y + li * 4.5);
      });
      y += lines.length * 4.5 + 4;
    });
  }

  // ── Footer on each page ──────────────────────────────────────────────────
  const totalPages = doc.getNumberOfPages();
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(160, 160, 160);
    doc.text(
      `GTM Fox Report  •  Page ${i} of ${totalPages}  •  Confidential`,
      pageW / 2,
      doc.internal.pageSize.getHeight() - 8,
      { align: 'center' }
    );
  }

  doc.save(`gtm-report-${new Date().toISOString().slice(0, 10)}.pdf`);
}

export default function ExportReportModal({
  open,
  onClose,
  strategySections = [],
  experiments = [],
  roiMetrics,
  channelEfficiency = [],
  availableSections = ['strategy', 'experiments', 'roi', 'recommendations'],
}: ExportReportModalProps) {
  const [selected, setSelected] = useState<Set<ExportSection>>(new Set(availableSections));
  const [format, setFormat] = useState<'pdf' | 'csv'>('pdf');
  const [exporting, setExporting] = useState(false);

  const toggle = (s: ExportSection) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(s)) next.delete(s);
      else next.add(s);
      return next;
    });
  };

  const handleExport = async () => {
    if (selected.size === 0) {
      toast.error('Select at least one section to export.');
      return;
    }
    setExporting(true);
    try {
      const sections = Array.from(selected);
      if (format === 'csv') {
        exportCSV(sections, experiments, strategySections, roiMetrics, channelEfficiency);
        toast.success('CSV report downloaded successfully');
      } else {
        await exportPDF(sections, experiments, strategySections, roiMetrics, channelEfficiency);
        toast.success('PDF report downloaded successfully');
      }
      onClose();
    } catch (err) {
      console.error(err);
      toast.error('Export failed. Please try again.');
    } finally {
      setExporting(false);
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-card border border-border rounded-2xl shadow-modal w-full max-w-md">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-border">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-primary/10 flex items-center justify-center">
              <Download size={15} className="text-primary" />
            </div>
            <div>
              <h2 className="text-[15px] font-bold text-foreground">Export Report</h2>
              <p className="text-[11px] text-muted-foreground">Share with advisors or co-founders</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-muted transition-colors">
            <X size={16} className="text-muted-foreground" />
          </button>
        </div>

        <div className="p-5 space-y-5">
          {/* Format selector */}
          <div>
            <p className="text-[12px] font-semibold text-foreground mb-2.5">Export Format</p>
            <div className="grid grid-cols-2 gap-2">
              {(['pdf', 'csv'] as const).map((f) => (
                <button
                  key={f}
                  onClick={() => setFormat(f)}
                  className={`flex items-center gap-2.5 px-3.5 py-3 rounded-xl border text-[13px] font-semibold transition-all ${
                    format === f
                      ? 'border-primary bg-primary/5 text-primary' :'border-border text-muted-foreground hover:border-primary/40 hover:text-foreground'
                  }`}
                >
                  {f === 'pdf' ? <FileText size={16} /> : <Table2 size={16} />}
                  {f === 'pdf' ? 'PDF Document' : 'CSV Spreadsheet'}
                </button>
              ))}
            </div>
          </div>

          {/* Section selector */}
          <div>
            <p className="text-[12px] font-semibold text-foreground mb-2.5">Include Sections</p>
            <div className="space-y-2">
              {availableSections.map((s) => {
                const isChecked = selected.has(s);
                return (
                  <button
                    key={s}
                    onClick={() => toggle(s)}
                    className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl border text-left transition-all ${
                      isChecked
                        ? 'border-primary/40 bg-primary/5' :'border-border hover:border-primary/20 hover:bg-muted/50'
                    }`}
                  >
                    {isChecked ? (
                      <CheckSquare size={16} className="text-primary flex-shrink-0" />
                    ) : (
                      <Square size={16} className="text-muted-foreground flex-shrink-0" />
                    )}
                    <span className={`text-[13px] font-medium ${isChecked ? 'text-foreground' : 'text-muted-foreground'}`}>
                      {SECTION_LABELS[s]}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Note */}
          <p className="text-[11px] text-muted-foreground bg-muted/60 rounded-xl px-3.5 py-2.5">
            {format === 'pdf' ?'Generates a branded PDF with tables, metrics, and recommendations — ready to share.' :'Generates a structured CSV file you can open in Excel, Google Sheets, or Notion.'}
          </p>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-2.5 px-5 py-4 border-t border-border">
          <button onClick={onClose} className="btn-secondary px-4 py-2 text-[13px]">
            Cancel
          </button>
          <button
            onClick={handleExport}
            disabled={exporting || selected.size === 0}
            className="btn-primary px-4 py-2 flex items-center gap-2 text-[13px] disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {exporting ? (
              <><Loader2 size={14} className="animate-spin" /> Exporting…</>
            ) : (
              <><Download size={14} /> Export {format.toUpperCase()}</>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

'use client';
import React, { useState, useEffect } from 'react';
import { ChevronUp, ChevronDown, Play, RotateCcw, Trash2, Edit3, Plus, X, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { useForm } from 'react-hook-form';
import { experimentService, type ExperimentStatus, type SignalStrength } from '@/lib/services/experimentService';
import { useExperimentsRealtime } from '@/lib/hooks/useExperimentsRealtime';
import { founderEventService } from '@/lib/services/founderEventService';

const statusConfig: Record<ExperimentStatus, string> = {
  Running: 'badge-running',
  Planned: 'badge-planned',
  Completed: 'badge-completed',
  Archived: 'badge-draft',
};

const signalConfig: Record<string, { color: string; dots: number }> = {
  Strong: { color: 'text-positive', dots: 3 },
  Moderate: { color: 'text-info', dots: 2 },
  Weak: { color: 'text-warning', dots: 1 },
  'No Signal': { color: 'text-negative', dots: 0 },
  '—': { color: 'text-muted-foreground', dots: 0 },
};

const channelColors: Record<string, string> = {
  'LinkedIn DM': 'bg-info-bg text-info border-info/30',
  'Cold Email': 'bg-secondary text-primary border-primary/20',
  'Warm Intro': 'bg-positive-bg text-positive border-positive/30',
  'IndieHackers': 'bg-warning-bg text-warning border-warning/30',
  'Twitter/X': 'bg-muted text-muted-foreground border-border',
  'Reddit': 'bg-negative-bg text-negative border-negative/30',
};

type SortKey = 'name' | 'sent' | 'replies' | 'conversions';

interface NewExperimentForm {
  name: string;
  channel: string;
  icpTarget: string;
  hypothesis: string;
}

export default function ExperimentTable() {
  const { experiments: data, isLoading, reload } = useExperimentsRealtime();
  const [sortKey, setSortKey] = useState<SortKey>('sent');
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('desc');
  const [filterStatus, setFilterStatus] = useState<string>('All');
  const [showModal, setShowModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);

  const { register, handleSubmit, reset, formState: { errors } } = useForm<NewExperimentForm>();

  const handleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortDir(sortDir === 'asc' ? 'desc' : 'asc');
    } else {
      setSortKey(key);
      setSortDir('desc');
    }
  };

  const filtered = data
    .filter((e) => filterStatus === 'All' || e.status === filterStatus)
    .sort((a, b) => {
      const av = a[sortKey];
      const bv = b[sortKey];
      if (typeof av === 'number' && typeof bv === 'number') {
        return sortDir === 'desc' ? bv - av : av - bv;
      }
      return sortDir === 'desc'
        ? String(bv).localeCompare(String(av))
        : String(av).localeCompare(String(bv));
    });

  const handleDeleteExperiment = async (id: string, name: string) => {
    const ok = await experimentService.delete(id);
    if (ok) {
      toast.success(`"${name}" deleted`);
      // Realtime subscription will remove the row; reload as fallback
      reload();
    } else {
      toast.error('Failed to delete experiment');
    }
    setOpenMenuId(null);
  };

  const onSubmitNew = async (formData: NewExperimentForm) => {
    setIsSubmitting(true);
    try {
      const newExp = await experimentService.create({
        name: formData.name,
        channel: formData.channel,
        icpTarget: formData.icpTarget,
        hypothesis: formData.hypothesis,
      });
      if (newExp) {
        toast.success('Experiment logged successfully');
        setShowModal(false);
        reset();
        // Track founder action
        founderEventService.log('experiment_logged', 'experiments', {
          experiment_name: formData.name,
          channel: formData.channel,
          icp_target: formData.icpTarget,
        });
        // Realtime subscription will add the row automatically
      } else {
        toast.error('Failed to log experiment');
      }
    } catch (err: any) {
      toast.error(err.message || 'Failed to log experiment');
    } finally {
      setIsSubmitting(false);
    }
  };

  const statusFilters = ['All', 'Running', 'Planned', 'Completed', 'Archived'];

  const SortIcon = ({ col }: { col: SortKey }) =>
    sortKey === col ? (
      sortDir === 'desc' ? <ChevronDown size={12} className="text-primary" /> : <ChevronUp size={12} className="text-primary" />
    ) : (
      <ChevronDown size={12} className="text-muted-foreground opacity-40" />
    );

  return (
    <>
      <div className="card-base shadow-card">
        {/* Table header */}
        <div className="px-5 py-4 border-b border-border flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-1 p-1 bg-muted rounded-lg">
            {statusFilters.map((s) => (
              <button
                key={`filter-${s}`}
                onClick={() => setFilterStatus(s)}
                className={`px-3 py-1.5 rounded-md text-[12px] font-semibold transition-all duration-150 ${
                  filterStatus === s ? 'bg-card text-primary shadow-card' : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                {s}
              </button>
            ))}
          </div>
          <span className="ml-auto text-[12px] text-muted-foreground">{filtered.length} experiments</span>
          <button
            onClick={() => setShowModal(true)}
            className="btn-primary px-3 py-2 flex items-center gap-1.5 text-[12px]"
          >
            <Plus size={14} /> Log Experiment
          </button>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          {isLoading ? (
            <div className="px-4 py-12 text-center">
              <Loader2 size={24} className="animate-spin text-primary mx-auto mb-2" />
              <p className="text-[13px] text-muted-foreground">Loading experiments…</p>
            </div>
          ) : (
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                {[
                  { label: 'Experiment Name', key: 'name' as SortKey, sortable: true },
                  { label: 'Channel', key: null, sortable: false },
                  { label: 'ICP Target', key: null, sortable: false },
                  { label: 'Hypothesis', key: null, sortable: false },
                  { label: 'Status', key: null, sortable: false },
                  { label: 'Sent', key: 'sent' as SortKey, sortable: true },
                  { label: 'Replies', key: 'replies' as SortKey, sortable: true },
                  { label: 'Conv.', key: 'conversions' as SortKey, sortable: true },
                  { label: 'Reply %', key: null, sortable: false },
                  { label: 'Signal', key: null, sortable: false },
                  { label: 'Actions', key: null, sortable: false },
                ].map((col) => (
                  <th
                    key={`th-${col.label}`}
                    className={`text-left px-4 py-3 text-[11px] font-bold uppercase tracking-widest text-muted-foreground whitespace-nowrap ${
                      col.sortable ? 'cursor-pointer hover:text-foreground select-none' : ''
                    }`}
                    onClick={() => col.sortable && col.key && handleSort(col.key)}
                  >
                    <div className="flex items-center gap-1">
                      {col.label}
                      {col.sortable && col.key && <SortIcon col={col.key} />}
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={11} className="px-4 py-12 text-center">
                    <div className="flex flex-col items-center gap-2">
                      <div className="w-12 h-12 rounded-xl bg-muted flex items-center justify-center">
                        <Plus size={20} className="text-muted-foreground" />
                      </div>
                      <p className="text-[14px] font-semibold text-foreground">No experiments yet</p>
                      <p className="text-[12px] text-muted-foreground">Log your first GTM experiment to start tracking what works.</p>
                      <button onClick={() => setShowModal(true)} className="btn-primary px-4 py-2 text-[12px] mt-1">
                        Log First Experiment
                      </button>
                    </div>
                  </td>
                </tr>
              ) : (
                filtered.map((exp) => {
                  const replyRate = exp.sent > 0 ? ((exp.replies / exp.sent) * 100).toFixed(1) : '—';
                  const signalKey = exp.signal === 'None' ? '—' : exp.signal;
                  const sig = signalConfig[signalKey] || signalConfig['—'];
                  return (
                    <tr
                      key={exp.id}
                      className="border-b border-border last:border-0 hover:bg-muted/40 transition-colors duration-100 group"
                    >
                      <td className="px-4 py-3 max-w-[220px]">
                        <p className="text-[13px] font-semibold text-foreground truncate" title={exp.name}>{exp.name}</p>
                        <p className="text-[11px] text-muted-foreground mt-0.5">Started {exp.startDate}</p>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${channelColors[exp.channel] || 'bg-muted text-muted-foreground border-border'}`}>
                          {exp.channel}
                        </span>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <span className="text-[12px] text-muted-foreground">{exp.icpTarget}</span>
                      </td>
                      <td className="px-4 py-3 max-w-[200px]">
                        <p className="text-[12px] text-muted-foreground truncate" title={exp.hypothesis}>{exp.hypothesis}</p>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <span className={`text-[10px] font-bold px-2 py-1 rounded-full border ${statusConfig[exp.status]}`}>
                          {exp.status}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <span className="text-[13px] font-semibold tabular-nums text-foreground">{exp.sent || '—'}</span>
                      </td>
                      <td className="px-4 py-3">
                        <span className="text-[13px] font-semibold tabular-nums text-foreground">{exp.replies || (exp.sent > 0 ? 0 : '—')}</span>
                      </td>
                      <td className="px-4 py-3">
                        <span className="text-[13px] font-semibold tabular-nums text-positive">{exp.conversions || (exp.sent > 0 ? 0 : '—')}</span>
                      </td>
                      <td className="px-4 py-3">
                        <span className={`text-[13px] font-bold tabular-nums ${replyRate !== '—' ? (parseFloat(replyRate) >= 15 ? 'text-positive' : parseFloat(replyRate) >= 8 ? 'text-info' : 'text-warning') : 'text-muted-foreground'}`}>
                          {replyRate !== '—' ? `${replyRate}%` : '—'}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <div className={`flex items-center gap-1 ${sig.color}`}>
                          {signalKey !== '—' ? (
                            <>
                              {[0, 1, 2].map((i) => (
                                <span
                                  key={`sig-${exp.id}-${i}`}
                                  className={`w-1.5 rounded-full transition-all ${i < sig.dots ? 'h-4 opacity-100' : 'h-4 opacity-20'}`}
                                  style={{ backgroundColor: 'currentColor' }}
                                />
                              ))}
                              <span className="text-[11px] font-semibold ml-1">{signalKey}</span>
                            </>
                          ) : (
                            <span className="text-[11px] text-muted-foreground">—</span>
                          )}
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-150 relative">
                          {exp.status === 'Completed' && (
                            <button
                              className="p-1.5 rounded-lg text-muted-foreground hover:text-positive hover:bg-positive-bg transition-all duration-150"
                              title="Run this experiment again"
                            >
                              <RotateCcw size={13} />
                            </button>
                          )}
                          {exp.status === 'Planned' && (
                            <button
                              className="p-1.5 rounded-lg text-muted-foreground hover:text-info hover:bg-info-bg transition-all duration-150"
                              title="Mark as Running"
                            >
                              <Play size={13} />
                            </button>
                          )}
                          <button
                            className="p-1.5 rounded-lg text-muted-foreground hover:text-primary hover:bg-secondary transition-all duration-150"
                            title="Edit experiment"
                          >
                            <Edit3 size={13} />
                          </button>
                          <button
                            onClick={() => handleDeleteExperiment(exp.id, exp.name)}
                            className="p-1.5 rounded-lg text-muted-foreground hover:text-negative hover:bg-negative-bg transition-all duration-150"
                            title="Delete experiment — this cannot be undone"
                          >
                            <Trash2 size={13} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
          )}
        </div>
      </div>

      {/* New Experiment Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-foreground/30 backdrop-blur-sm" onClick={() => setShowModal(false)} />
          <div className="relative bg-card rounded-2xl shadow-modal w-full max-w-lg border border-border fade-in">
            <div className="flex items-center justify-between px-6 py-4 border-b border-border">
              <h3 className="text-[16px] font-bold text-foreground">Log New Experiment</h3>
              <button
                onClick={() => setShowModal(false)}
                className="w-8 h-8 rounded-lg flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted transition-all duration-150"
              >
                <X size={16} />
              </button>
            </div>

            <form onSubmit={handleSubmit(onSubmitNew)} className="px-6 py-5 space-y-4">
              <div>
                <label className="block text-[12px] font-semibold text-foreground mb-1.5">Experiment Name</label>
                <input
                  {...register('name', { required: 'Experiment name is required' })}
                  className="input-base text-[13px]"
                  placeholder="e.g. LinkedIn DM — SaaS CTOs (Problem-Led)"
                />
                {errors.name && <p className="text-negative text-[11px] mt-1">{errors.name.message}</p>}
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[12px] font-semibold text-foreground mb-1.5">Channel</label>
                  <select {...register('channel', { required: true })} className="input-base text-[13px]">
                    {['LinkedIn DM', 'Cold Email', 'Warm Intro', 'IndieHackers', 'Twitter/X', 'Reddit', 'Other'].map((c) => (
                      <option key={`modal-ch-${c}`} value={c}>{c}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-[12px] font-semibold text-foreground mb-1.5">ICP Target</label>
                  <select {...register('icpTarget', { required: true })} className="input-base text-[13px]">
                    {['SaaS CTO', 'Non-Technical Founder', 'Ex-Consultant Founder'].map((i) => (
                      <option key={`modal-icp-${i}`} value={i}>{i}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[12px] font-semibold text-foreground mb-1">Hypothesis</label>
                <p className="text-[11px] text-muted-foreground mb-1.5">What do you believe will happen and why?</p>
                <textarea
                  {...register('hypothesis', { required: 'Hypothesis is required' })}
                  className="input-base text-[13px] resize-none"
                  rows={3}
                  placeholder="e.g. Problem-led opening gets higher reply rate than feature-led because it leads with pain"
                />
                {errors.hypothesis && <p className="text-negative text-[11px] mt-1">{errors.hypothesis.message}</p>}
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="btn-secondary flex-1 py-2.5"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="btn-primary flex-1 py-2.5 flex items-center justify-center gap-2 disabled:opacity-60"
                >
                  {isSubmitting ? (
                    <><Loader2 size={15} className="animate-spin" /> Saving…</>
                  ) : (
                    'Log Experiment'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
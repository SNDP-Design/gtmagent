'use client';
import React, { useState } from 'react';
import { CheckCircle2, Clock, Lock, ChevronDown, ChevronUp, RefreshCw, Download, Edit3, Save } from 'lucide-react';
import type { StrategySection } from './StrategyBuilderLayout';
import { toast } from 'sonner';
import ExportReportModal from '@/components/ExportReportModal';

interface StrategyDocPanelProps {
  sections: StrategySection[];
  activeSection: string;
  onSectionSelect: (id: string) => void;
  onUnlockSection: (id: string) => void;
}

const statusConfig = {
  complete: { icon: CheckCircle2, color: 'text-positive', bg: 'bg-positive-bg border-positive/30', label: 'Complete' },
  'in-progress': { icon: Clock, color: 'text-info', bg: 'bg-info-bg border-info/30', label: 'In Progress' },
  locked: { icon: Lock, color: 'text-muted-foreground', bg: 'bg-muted border-border', label: 'Locked' },
};

export default function StrategyDocPanel({ sections, activeSection, onSectionSelect, onUnlockSection }: StrategyDocPanelProps) {
  const [expanded, setExpanded] = useState<Set<string>>(new Set(['sec-positioning', 'sec-icp', 'sec-pricing']));
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editContent, setEditContent] = useState('');
  const [exportOpen, setExportOpen] = useState(false);

  const toggleExpand = (id: string) => {
    setExpanded((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const startEdit = (section: StrategySection) => {
    setEditingId(section.id);
    setEditContent(section.content);
  };

  const saveEdit = () => {
    setEditingId(null);
    toast.success('Section updated successfully');
  };

  const handleExport = () => {
    setExportOpen(true);
  };

  return (
    <div className="card-base shadow-card flex flex-col">
      <div className="px-5 py-4 border-b border-border flex items-center justify-between">
        <div>
          <h2 className="text-[15px] font-semibold text-foreground">Your GTM Strategy Doc</h2>
          <p className="text-[12px] text-muted-foreground mt-0.5">
            {sections.filter((s) => s.status === 'complete').length} of {sections.length} sections complete
          </p>
        </div>
        <button
          onClick={handleExport}
          className="btn-secondary px-3 py-2 flex items-center gap-1.5 text-[12px]"
        >
          <Download size={14} /> Export
        </button>
      </div>

      <div className="p-4 space-y-3">
        {sections.map((section) => {
          const cfg = statusConfig[section.status];
          const StatusIcon = cfg.icon;
          const isExpanded = expanded.has(section.id);
          const isActive = activeSection === section.id;

          return (
            <div
              key={section.id}
              className={`rounded-xl border transition-all duration-200 ${
                isActive ? 'border-primary/40 shadow-card' : 'border-border'
              } ${section.status === 'locked' ? 'opacity-60' : ''}`}
            >
              {/* Section header */}
              <div
                className="flex items-center gap-3 px-4 py-3 cursor-pointer hover:bg-muted/50 rounded-xl transition-colors duration-100"
                onClick={() => {
                  if (section.status !== 'locked') {
                    toggleExpand(section.id);
                    onSectionSelect(section.id);
                  }
                }}
              >
                <StatusIcon size={16} className={cfg.color} />
                <span className="flex-1 text-[14px] font-semibold text-foreground">{section.title}</span>
                <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${cfg.bg} ${cfg.color}`}>
                  {cfg.label}
                </span>
                {section.status === 'locked' ? (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onUnlockSection(section.id);
                    }}
                    className="text-[11px] font-semibold text-primary hover:underline"
                  >
                    Start
                  </button>
                ) : (
                  isExpanded ? <ChevronUp size={15} className="text-muted-foreground" /> : <ChevronDown size={15} className="text-muted-foreground" />
                )}
              </div>

              {/* Section content */}
              {isExpanded && section.status !== 'locked' && (
                <div className="px-4 pb-4">
                  <div className="h-px bg-border mb-3" />
                  {editingId === section.id ? (
                    <div>
                      <textarea
                        value={editContent}
                        onChange={(e) => setEditContent(e.target.value)}
                        className="input-base text-[13px] resize-none min-h-[120px] leading-relaxed"
                        rows={5}
                      />
                      <div className="flex gap-2 mt-2">
                        <button onClick={saveEdit} className="btn-primary px-3 py-1.5 flex items-center gap-1.5 text-[12px]">
                          <Save size={13} /> Save
                        </button>
                        <button onClick={() => setEditingId(null)} className="btn-secondary px-3 py-1.5 text-[12px]">
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div>
                      <p className="text-[13px] text-foreground leading-relaxed">{section.content}</p>
                      <div className="flex gap-2 mt-3">
                        <button
                          onClick={() => startEdit(section)}
                          className="flex items-center gap-1.5 text-[12px] font-semibold text-primary hover:bg-secondary px-2.5 py-1.5 rounded-lg transition-colors"
                        >
                          <Edit3 size={13} /> Edit
                        </button>
                        <button className="flex items-center gap-1.5 text-[12px] font-semibold text-muted-foreground hover:bg-muted px-2.5 py-1.5 rounded-lg transition-colors">
                          <RefreshCw size={13} /> Regenerate
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>

      <ExportReportModal
        open={exportOpen}
        onClose={() => setExportOpen(false)}
        strategySections={sections}
        availableSections={['strategy', 'recommendations']}
      />
    </div>
  );
}
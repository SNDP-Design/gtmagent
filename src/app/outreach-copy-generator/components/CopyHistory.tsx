'use client';
import React, { useState } from 'react';
import { Copy, Check, Trash2, Eye, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { copyHistoryService } from '@/lib/services/copyHistoryService';
import { useCopyHistoryRealtime } from '@/lib/hooks/useCopyHistoryRealtime';

const typeColor: Record<string, string> = {
  'Cold Email': 'bg-secondary text-primary border-primary/20',
  'LinkedIn DM': 'bg-info-bg text-info border-info/30',
  'Pitch Script': 'bg-warning-bg text-warning border-warning/30',
  'Follow-up Email': 'bg-muted text-muted-foreground border-border',
};

const scoreColor = (score: number) => {
  if (score >= 80) return 'text-positive';
  if (score >= 70) return 'text-info';
  return 'text-warning';
};

export default function CopyHistory() {
  const { history, isLoading } = useCopyHistoryRealtime();
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleDelete = async (id: string, label: string) => {
    const ok = await copyHistoryService.delete(id);
    if (ok) {
      toast.success(`"${label}" removed from library`);
    } else {
      toast.error('Failed to remove copy');
    }
  };

  const handleCopy = (id: string) => {
    setCopiedId(id);
    toast.success('Copied to clipboard');
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="card-base shadow-card">
      <div className="px-5 py-4 border-b border-border flex items-center justify-between">
        <div>
          <h3 className="text-[15px] font-semibold text-foreground">Copy Library</h3>
          <p className="text-[12px] text-muted-foreground mt-0.5">{history.length} saved copies · sorted by score</p>
        </div>
      </div>

      {isLoading ? (
        <div className="px-4 py-12 text-center">
          <Loader2 size={24} className="animate-spin text-primary mx-auto mb-2" />
          <p className="text-[13px] text-muted-foreground">Loading copy library…</p>
        </div>
      ) : (
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border">
              {['Copy Name', 'Type', 'ICP', 'Score', 'Sent', 'Reply Rate', 'Saved', 'Actions'].map((col) => (
                <th key={`hist-col-${col}`} className="text-left px-4 py-3 text-[11px] font-bold uppercase tracking-widest text-muted-foreground whitespace-nowrap">
                  {col}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {history.length === 0 ? (
              <tr>
                <td colSpan={8} className="px-4 py-12 text-center">
                  <p className="text-[14px] font-semibold text-foreground">No saved copies yet</p>
                  <p className="text-[12px] text-muted-foreground mt-1">Generate copy variants and save them to your library.</p>
                </td>
              </tr>
            ) : (
              history.map((item) => (
                <tr key={item.id} className="border-b border-border last:border-0 hover:bg-muted/40 transition-colors duration-100 group">
                  <td className="px-4 py-3">
                    <p className="text-[13px] font-semibold text-foreground truncate max-w-[220px]">{item.label}</p>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${typeColor[item.type] || 'bg-muted text-muted-foreground border-border'}`}>
                      {item.type}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-[12px] text-muted-foreground">{item.icp}</span>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`text-[13px] font-bold tabular-nums ${scoreColor(item.score)}`}>{item.score}</span>
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-[13px] tabular-nums text-foreground font-medium">{item.usageCount}</span>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`text-[13px] tabular-nums font-semibold ${item.replyRate !== '—' ? 'text-positive' : 'text-muted-foreground'}`}>
                      {item.replyRate}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-[12px] text-muted-foreground">{item.savedAt}</span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-150">
                      <button
                        onClick={() => handleCopy(item.id)}
                        className="p-1.5 rounded-lg text-muted-foreground hover:text-primary hover:bg-muted transition-all duration-150"
                        title="Copy to clipboard"
                      >
                        {copiedId === item.id ? <Check size={14} className="text-positive" /> : <Copy size={14} />}
                      </button>
                      <button
                        className="p-1.5 rounded-lg text-muted-foreground hover:text-info hover:bg-info-bg transition-all duration-150"
                        title="Preview copy"
                      >
                        <Eye size={14} />
                      </button>
                      <button
                        onClick={() => handleDelete(item.id, item.label)}
                        className="p-1.5 rounded-lg text-muted-foreground hover:text-negative hover:bg-negative-bg transition-all duration-150"
                        title="Delete copy (this cannot be undone)"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      )}
    </div>
  );
}
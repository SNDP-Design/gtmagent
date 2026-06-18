'use client';
import React, { useState } from 'react';
import { Copy, Check, Edit3, Save, X, RefreshCw, Star } from 'lucide-react';
import { toast } from 'sonner';
import type { GeneratedCopy } from './OutreachGeneratorLayout';

interface CopyVariantsProps {
  generatedCopy: GeneratedCopy | null;
  isGenerating: boolean;
}

const scoreColor = (score: number) => {
  if (score >= 85) return 'text-positive bg-positive-bg border-positive/30';
  if (score >= 75) return 'text-info bg-info-bg border-info/30';
  return 'text-warning bg-warning-bg border-warning/30';
};

export default function CopyVariants({ generatedCopy, isGenerating }: CopyVariantsProps) {
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editText, setEditText] = useState('');
  const [savedIds, setSavedIds] = useState<Set<string>>(new Set());

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text).catch(() => {});
    setCopiedId(id);
    toast.success('Copied to clipboard');
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleSave = (id: string, label: string) => {
    setSavedIds((prev) => new Set([...prev, id]));
    toast.success(`"${label}" saved to copy library`);
  };

  const startEdit = (id: string, body: string) => {
    setEditingId(id);
    setEditText(body);
  };

  const saveEdit = () => {
    setEditingId(null);
    toast.success('Copy updated');
  };

  if (isGenerating) {
    return (
      <div className="card-base shadow-card p-5 h-full">
        <div className="flex items-center gap-2 mb-4">
          <div className="animate-pulse h-5 w-32 bg-muted rounded" />
          <div className="animate-pulse h-5 w-20 bg-muted rounded" />
        </div>
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={`skel-${i}`} className="rounded-xl border border-border p-4 space-y-3">
              <div className="animate-pulse h-4 w-40 bg-muted rounded" />
              <div className="animate-pulse h-3 w-full bg-muted rounded" />
              <div className="animate-pulse h-3 w-4/5 bg-muted rounded" />
              <div className="animate-pulse h-3 w-3/4 bg-muted rounded" />
              <div className="animate-pulse h-3 w-2/3 bg-muted rounded" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (!generatedCopy) {
    return (
      <div className="card-base shadow-card p-5 h-full flex flex-col items-center justify-center text-center">
        <div className="w-14 h-14 rounded-2xl bg-muted flex items-center justify-center mb-4">
          <Edit3 size={24} className="text-muted-foreground" />
        </div>
        <h3 className="text-[15px] font-semibold text-foreground mb-2">No copy generated yet</h3>
        <p className="text-[13px] text-muted-foreground max-w-xs">
          Fill in the form on the left and click Generate to get 3 AI-written copy variants tailored to your ICP.
        </p>
      </div>
    );
  }

  return (
    <div className="card-base shadow-card p-5">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-[15px] font-semibold text-foreground">Generated Copy Variants</h3>
          <div className="flex items-center gap-2 mt-1">
            <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-secondary text-primary border border-primary/20">
              {generatedCopy.type}
            </span>
            <span className="text-[11px] text-muted-foreground">{generatedCopy.icp}</span>
            <span className="text-[11px] text-muted-foreground">· {generatedCopy.tone}</span>
          </div>
        </div>
        <button className="flex items-center gap-1.5 text-[12px] font-semibold text-muted-foreground hover:text-primary hover:bg-muted px-2.5 py-1.5 rounded-lg transition-colors">
          <RefreshCw size={13} /> Regenerate
        </button>
      </div>

      <div className="space-y-4">
        {generatedCopy.variants.map((variant) => (
          <div
            key={variant.id}
            className="rounded-xl border border-border hover:border-primary/30 transition-colors duration-200"
          >
            {/* Variant header */}
            <div className="flex items-center justify-between px-4 py-2.5 border-b border-border">
              <div className="flex items-center gap-2">
                <span className="text-[12px] font-bold text-foreground">{variant.label}</span>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${scoreColor(variant.score)}`}>
                  {variant.score} score
                </span>
              </div>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => handleSave(variant.id, variant.label)}
                  className={`p-1.5 rounded-lg transition-all duration-150 ${
                    savedIds.has(variant.id) ? 'text-accent bg-accent/10' : 'text-muted-foreground hover:text-accent hover:bg-muted'
                  }`}
                  title="Save to library"
                >
                  <Star size={14} fill={savedIds.has(variant.id) ? 'currentColor' : 'none'} />
                </button>
                <button
                  onClick={() => startEdit(variant.id, variant.body)}
                  className="p-1.5 rounded-lg text-muted-foreground hover:text-primary hover:bg-muted transition-all duration-150"
                  title="Edit copy"
                >
                  <Edit3 size={14} />
                </button>
                <button
                  onClick={() => handleCopy(variant.id, `${variant.subject ? `Subject: ${variant.subject}\n\n` : ''}${variant.body}`)}
                  className="p-1.5 rounded-lg text-muted-foreground hover:text-primary hover:bg-muted transition-all duration-150"
                  title="Copy to clipboard"
                >
                  {copiedId === variant.id ? <Check size={14} className="text-positive" /> : <Copy size={14} />}
                </button>
              </div>
            </div>

            {/* Subject line */}
            {variant.subject && (
              <div className="px-4 py-2 bg-muted/40 border-b border-border">
                <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Subject: </span>
                <span className="text-[12px] font-semibold text-foreground">{variant.subject}</span>
              </div>
            )}

            {/* Body */}
            <div className="px-4 py-3">
              {editingId === variant.id ? (
                <div>
                  <textarea
                    value={editText}
                    onChange={(e) => setEditText(e.target.value)}
                    className="input-base text-[13px] resize-none min-h-[180px] leading-relaxed font-mono"
                    rows={8}
                  />
                  <div className="flex gap-2 mt-2">
                    <button onClick={saveEdit} className="btn-primary px-3 py-1.5 flex items-center gap-1.5 text-[12px]">
                      <Save size={13} /> Save
                    </button>
                    <button onClick={() => setEditingId(null)} className="btn-secondary px-3 py-1.5 text-[12px] flex items-center gap-1.5">
                      <X size={13} /> Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <pre className="text-[12px] text-foreground leading-relaxed whitespace-pre-wrap font-sans">{variant.body}</pre>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
'use client';
import React, { useState } from 'react';
import { Key, Eye, EyeOff, CheckCircle2, AlertCircle, Plus, Trash2 } from 'lucide-react';

interface APIKeyEntry {
  id: string;
  provider: string;
  label: string;
  envKey: string;
  placeholder: string;
  value: string;
  connected: boolean;
  description: string;
}

const defaultKeys: APIKeyEntry[] = [
  {
    id: 'openai',
    provider: 'OpenAI',
    label: 'OpenAI API Key',
    envKey: 'OPENAI_API_KEY',
    placeholder: 'sk-...',
    value: '',
    connected: false,
    description: 'Powers AI Strategy Builder and copy generation',
  },
  {
    id: 'gemini',
    provider: 'Google Gemini',
    label: 'Gemini API Key',
    envKey: 'GEMINI_API_KEY',
    placeholder: 'AIza...',
    value: '',
    connected: false,
    description: 'Alternative AI model for strategy and ICP analysis',
  },
  {
    id: 'anthropic',
    provider: 'Anthropic',
    label: 'Anthropic API Key',
    envKey: 'ANTHROPIC_API_KEY',
    placeholder: 'sk-ant-...',
    value: '',
    connected: false,
    description: 'Claude model for nuanced outreach copy',
  },
  {
    id: 'perplexity',
    provider: 'Perplexity',
    label: 'Perplexity API Key',
    envKey: 'PERPLEXITY_API_KEY',
    placeholder: 'pplx-...',
    value: '',
    connected: false,
    description: 'Real-time market research and competitor signals',
  },
];

export default function APIKeysSection() {
  const [keys, setKeys] = useState<APIKeyEntry[]>(defaultKeys);
  const [visible, setVisible] = useState<Record<string, boolean>>({});
  const [saved, setSaved] = useState<Record<string, boolean>>({});

  const toggleVisible = (id: string) => setVisible((v) => ({ ...v, [id]: !v[id] }));

  const updateValue = (id: string, value: string) => {
    setKeys((prev) => prev.map((k) => (k.id === id ? { ...k, value } : k)));
  };

  const handleSave = (id: string) => {
    setKeys((prev) =>
      prev.map((k) => (k.id === id ? { ...k, connected: k.value.length > 8 } : k))
    );
    setSaved((s) => ({ ...s, [id]: true }));
    setTimeout(() => setSaved((s) => ({ ...s, [id]: false })), 2000);
  };

  const handleClear = (id: string) => {
    setKeys((prev) => prev.map((k) => (k.id === id ? { ...k, value: '', connected: false } : k)));
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3 mb-2">
        <Key size={18} className="text-primary" />
        <div>
          <h2 className="text-[15px] font-semibold text-foreground">API Integrations</h2>
          <p className="text-[12px] text-muted-foreground">Connect AI providers to power your GTM tools</p>
        </div>
      </div>

      {keys.map((key) => (
        <div key={key.id} className="card-base p-5 space-y-3">
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-secondary flex items-center justify-center flex-shrink-0">
                <Key size={15} className="text-primary" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <p className="text-[13px] font-semibold text-foreground">{key.label}</p>
                  {key.connected ? (
                    <span className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-positive/10 text-positive text-[10px] font-semibold">
                      <CheckCircle2 size={10} /> Connected
                    </span>
                  ) : (
                    <span className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-muted text-muted-foreground text-[10px] font-semibold">
                      <AlertCircle size={10} /> Not set
                    </span>
                  )}
                </div>
                <p className="text-[11px] text-muted-foreground">{key.description}</p>
              </div>
            </div>
          </div>

          <div className="flex gap-2">
            <div className="relative flex-1">
              <input
                type={visible[key.id] ? 'text' : 'password'}
                value={key.value}
                onChange={(e) => updateValue(key.id, e.target.value)}
                className="input-base pr-10"
                placeholder={key.placeholder}
              />
              <button
                onClick={() => toggleVisible(key.id)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
              >
                {visible[key.id] ? <EyeOff size={14} /> : <Eye size={14} />}
              </button>
            </div>
            <button
              onClick={() => handleSave(key.id)}
              className={`btn-primary px-4 py-2 text-[12px] flex-shrink-0 ${saved[key.id] ? 'bg-positive hover:bg-positive' : ''}`}
            >
              {saved[key.id] ? 'Saved!' : 'Save'}
            </button>
            {key.value && (
              <button
                onClick={() => handleClear(key.id)}
                className="p-2 rounded-lg border border-border text-muted-foreground hover:text-negative hover:border-negative/40 transition-colors"
              >
                <Trash2 size={14} />
              </button>
            )}
          </div>

          <p className="text-[11px] text-muted-foreground/60 font-mono">ENV: {key.envKey}</p>
        </div>
      ))}

      <div className="card-base p-4 border-dashed flex items-center gap-3 cursor-pointer hover:border-primary/40 transition-colors group">
        <div className="w-8 h-8 rounded-lg bg-secondary flex items-center justify-center group-hover:bg-primary/10 transition-colors">
          <Plus size={14} className="text-muted-foreground group-hover:text-primary transition-colors" />
        </div>
        <p className="text-[13px] text-muted-foreground group-hover:text-foreground transition-colors">Add custom integration</p>
      </div>
    </div>
  );
}

'use client';
import React, { useState } from 'react';
import { Bell, Save } from 'lucide-react';

interface NotifToggle {
  id: string;
  label: string;
  description: string;
  enabled: boolean;
  category: string;
}

const defaultToggles: NotifToggle[] = [
  { id: 'experiment_complete', label: 'Experiment completed', description: 'When an experiment reaches its end date or goal', enabled: true, category: 'Experiments' },
  { id: 'experiment_milestone', label: 'Experiment milestone hit', description: 'When a key metric threshold is crossed', enabled: true, category: 'Experiments' },
  { id: 'copy_generated', label: 'Copy variant ready', description: 'When AI finishes generating outreach copy', enabled: false, category: 'Outreach' },
  { id: 'copy_score_high', label: 'High-quality copy score', description: 'When a copy variant scores above 85%', enabled: true, category: 'Outreach' },
  { id: 'icp_match', label: 'New ICP signal detected', description: 'When a new buyer signal matches your ICP', enabled: true, category: 'ICP & Channels' },
  { id: 'channel_insight', label: 'Channel performance insight', description: 'Weekly summary of top-performing channels', enabled: false, category: 'ICP & Channels' },
  { id: 'milestone_due', label: 'Milestone due soon', description: '48 hours before a milestone deadline', enabled: true, category: 'Milestones' },
  { id: 'milestone_overdue', label: 'Milestone overdue', description: 'When a milestone passes its due date', enabled: true, category: 'Milestones' },
  { id: 'weekly_digest', label: 'Weekly GTM digest', description: 'Summary of all activity every Monday morning', enabled: true, category: 'Digest' },
];

function Toggle({ enabled, onChange }: { enabled: boolean; onChange: () => void }) {
  return (
    <button
      onClick={onChange}
      className={`relative w-10 h-5 rounded-full transition-colors duration-200 flex-shrink-0 ${enabled ? 'bg-primary' : 'bg-border'}`}
    >
      <span
        className={`absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-white shadow transition-transform duration-200 ${enabled ? 'translate-x-5' : 'translate-x-0'}`}
      />
    </button>
  );
}

export default function NotificationsSection() {
  const [toggles, setToggles] = useState<NotifToggle[]>(defaultToggles);
  const [emailDigest, setEmailDigest] = useState('weekly');
  const [saved, setSaved] = useState(false);

  const flip = (id: string) => {
    setToggles((prev) => prev.map((t) => (t.id === id ? { ...t, enabled: !t.enabled } : t)));
  };

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const categories = [...new Set(defaultToggles.map((t) => t.category))];

  return (
    <div className="space-y-5">
      <div className="flex items-center gap-3 mb-1">
        <Bell size={18} className="text-primary" />
        <div>
          <h2 className="text-[15px] font-semibold text-foreground">Notification Preferences</h2>
          <p className="text-[12px] text-muted-foreground">Choose what alerts matter to your GTM workflow</p>
        </div>
      </div>

      {categories.map((cat) => (
        <div key={cat} className="card-base p-5 space-y-3">
          <p className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">{cat}</p>
          <div className="space-y-3">
            {toggles.filter((t) => t.category === cat).map((t) => (
              <div key={t.id} className="flex items-center justify-between gap-4">
                <div className="min-w-0">
                  <p className="text-[13px] font-medium text-foreground">{t.label}</p>
                  <p className="text-[11px] text-muted-foreground">{t.description}</p>
                </div>
                <Toggle enabled={t.enabled} onChange={() => flip(t.id)} />
              </div>
            ))}
          </div>
        </div>
      ))}

      {/* Email frequency */}
      <div className="card-base p-5 space-y-3">
        <p className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">Email Frequency</p>
        <div className="flex gap-2 flex-wrap">
          {['realtime', 'daily', 'weekly', 'never'].map((freq) => (
            <button
              key={freq}
              onClick={() => setEmailDigest(freq)}
              className={`px-4 py-2 rounded-lg text-[12px] font-medium capitalize transition-all duration-150 ${
                emailDigest === freq
                  ? 'bg-primary text-white' :'bg-secondary text-muted-foreground hover:text-foreground'
              }`}
            >
              {freq}
            </button>
          ))}
        </div>
      </div>

      <div className="flex justify-end">
        <button
          onClick={handleSave}
          className={`btn-primary px-5 py-2.5 flex items-center gap-2 text-[13px] ${saved ? 'bg-positive hover:bg-positive' : ''}`}
        >
          <Save size={14} />
          {saved ? 'Saved!' : 'Save Preferences'}
        </button>
      </div>
    </div>
  );
}

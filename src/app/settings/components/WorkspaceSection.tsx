'use client';
import React, { useState } from 'react';
import { Building2, Save, Camera } from 'lucide-react';

export default function WorkspaceSection() {
  const [workspaceName, setWorkspaceName] = useState("Alex's Workspace");
  const [founderName, setFounderName] = useState('Alex Kim');
  const [email, setEmail] = useState('alex@buildwithgtm.co');
  const [company, setCompany] = useState('BuildWithGTM');
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="space-y-5">
      {/* Avatar + workspace identity */}
      <div className="card-base p-6 space-y-5">
        <div className="flex items-center gap-3 mb-1">
          <Building2 size={18} className="text-primary" />
          <h2 className="text-[15px] font-semibold text-foreground">Workspace Identity</h2>
        </div>

        {/* Avatar */}
        <div className="flex items-center gap-4">
          <div className="relative">
            <div className="w-16 h-16 rounded-2xl gradient-primary flex items-center justify-center text-white text-xl font-bold shadow-lg">
              {founderName?.split(' ')?.map((n) => n?.[0])?.join('')?.slice(0, 2)}
            </div>
            <button className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-card border border-border flex items-center justify-center hover:border-primary transition-colors">
              <Camera size={11} className="text-muted-foreground" />
            </button>
          </div>
          <div>
            <p className="text-[13px] font-semibold text-foreground">{founderName}</p>
            <p className="text-[11px] text-muted-foreground">{email}</p>
            <span className="inline-block mt-1 px-2 py-0.5 rounded-full bg-primary/10 text-primary text-[10px] font-semibold">Solo Plan</span>
          </div>
        </div>

        {/* Fields */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="text-[12px] font-medium text-muted-foreground uppercase tracking-wide">Workspace Name</label>
            <input
              type="text"
              value={workspaceName}
              onChange={(e) => setWorkspaceName(e?.target?.value)}
              className="input-base"
              placeholder="My Startup Workspace"
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-[12px] font-medium text-muted-foreground uppercase tracking-wide">Company / Startup</label>
            <input
              type="text"
              value={company}
              onChange={(e) => setCompany(e?.target?.value)}
              className="input-base"
              placeholder="Acme Inc."
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-[12px] font-medium text-muted-foreground uppercase tracking-wide">Your Name</label>
            <input
              type="text"
              value={founderName}
              onChange={(e) => setFounderName(e?.target?.value)}
              className="input-base"
              placeholder="Alex Kim"
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-[12px] font-medium text-muted-foreground uppercase tracking-wide">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e?.target?.value)}
              className="input-base"
              placeholder="you@startup.com"
            />
          </div>
        </div>

        <div className="flex justify-end pt-1">
          <button
            onClick={handleSave}
            className={`btn-primary px-5 py-2.5 flex items-center gap-2 text-[13px] ${saved ? 'bg-positive hover:bg-positive' : ''}`}
          >
            <Save size={14} />
            {saved ? 'Saved!' : 'Save Changes'}
          </button>
        </div>
      </div>
      {/* Danger zone */}
      <div className="card-base p-6 border-negative/20">
        <h3 className="text-[14px] font-semibold text-negative mb-1">Danger Zone</h3>
        <p className="text-[12px] text-muted-foreground mb-4">Permanently delete your workspace and all associated data. This cannot be undone.</p>
        <button className="px-4 py-2 rounded-lg border border-negative/40 text-negative text-[13px] font-medium hover:bg-negative/10 transition-colors">
          Delete Workspace
        </button>
      </div>
    </div>
  );
}

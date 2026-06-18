'use client';
import React, { useState } from 'react';
import { Target, Plus, Trash2, Save, GripVertical } from 'lucide-react';

interface GTMGoal {
  id: string;
  title: string;
  metric: string;
  target: string;
  deadline: string;
  priority: 'high' | 'medium' | 'low';
}

const defaultGoals: GTMGoal[] = [
  { id: '1', title: 'Reach 100 paying customers', metric: 'Paying customers', target: '100', deadline: '2026-09-30', priority: 'high' },
  { id: '2', title: 'Hit $10K MRR', metric: 'Monthly Recurring Revenue', target: '$10,000', deadline: '2026-10-31', priority: 'high' },
  { id: '3', title: 'Launch 3 GTM channels', metric: 'Active channels', target: '3', deadline: '2026-08-15', priority: 'medium' },
  { id: '4', title: 'Achieve 40% email open rate', metric: 'Email open rate', target: '40%', deadline: '2026-07-31', priority: 'medium' },
];

const priorityColors = {
  high: 'text-negative bg-negative/10 border-negative/20',
  medium: 'text-warning bg-warning/10 border-warning/20',
  low: 'text-positive bg-positive/10 border-positive/20',
};

export default function GTMGoalsSection() {
  const [goals, setGoals] = useState<GTMGoal[]>(defaultGoals);
  const [saved, setSaved] = useState(false);
  const [adding, setAdding] = useState(false);
  const [newGoal, setNewGoal] = useState<Omit<GTMGoal, 'id'>>({
    title: '',
    metric: '',
    target: '',
    deadline: '',
    priority: 'medium',
  });

  const removeGoal = (id: string) => setGoals((prev) => prev.filter((g) => g.id !== id));

  const updateGoal = (id: string, field: keyof GTMGoal, value: string) => {
    setGoals((prev) => prev.map((g) => (g.id === id ? { ...g, [field]: value } : g)));
  };

  const addGoal = () => {
    if (!newGoal.title.trim()) return;
    setGoals((prev) => [...prev, { ...newGoal, id: Date.now().toString() }]);
    setNewGoal({ title: '', metric: '', target: '', deadline: '', priority: 'medium' });
    setAdding(false);
  };

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between mb-1">
        <div className="flex items-center gap-3">
          <Target size={18} className="text-primary" />
          <div>
            <h2 className="text-[15px] font-semibold text-foreground">GTM Goals</h2>
            <p className="text-[12px] text-muted-foreground">Define the outcomes that drive your go-to-market strategy</p>
          </div>
        </div>
        <button
          onClick={() => setAdding(true)}
          className="btn-secondary px-3 py-2 flex items-center gap-1.5 text-[12px]"
        >
          <Plus size={13} /> Add Goal
        </button>
      </div>

      {/* Add new goal form */}
      {adding && (
        <div className="card-base p-5 space-y-3 border-primary/30">
          <p className="text-[13px] font-semibold text-primary">New GTM Goal</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="sm:col-span-2 space-y-1">
              <label className="text-[11px] font-medium text-muted-foreground uppercase tracking-wide">Goal Title</label>
              <input
                type="text"
                value={newGoal.title}
                onChange={(e) => setNewGoal((g) => ({ ...g, title: e.target.value }))}
                className="input-base"
                placeholder="e.g. Reach 500 signups"
              />
            </div>
            <div className="space-y-1">
              <label className="text-[11px] font-medium text-muted-foreground uppercase tracking-wide">Metric</label>
              <input
                type="text"
                value={newGoal.metric}
                onChange={(e) => setNewGoal((g) => ({ ...g, metric: e.target.value }))}
                className="input-base"
                placeholder="e.g. Total signups"
              />
            </div>
            <div className="space-y-1">
              <label className="text-[11px] font-medium text-muted-foreground uppercase tracking-wide">Target Value</label>
              <input
                type="text"
                value={newGoal.target}
                onChange={(e) => setNewGoal((g) => ({ ...g, target: e.target.value }))}
                className="input-base"
                placeholder="e.g. 500"
              />
            </div>
            <div className="space-y-1">
              <label className="text-[11px] font-medium text-muted-foreground uppercase tracking-wide">Deadline</label>
              <input
                type="date"
                value={newGoal.deadline}
                onChange={(e) => setNewGoal((g) => ({ ...g, deadline: e.target.value }))}
                className="input-base"
              />
            </div>
            <div className="space-y-1">
              <label className="text-[11px] font-medium text-muted-foreground uppercase tracking-wide">Priority</label>
              <select
                value={newGoal.priority}
                onChange={(e) => setNewGoal((g) => ({ ...g, priority: e.target.value as GTMGoal['priority'] }))}
                className="input-base"
              >
                <option value="high">High</option>
                <option value="medium">Medium</option>
                <option value="low">Low</option>
              </select>
            </div>
          </div>
          <div className="flex gap-2 justify-end pt-1">
            <button onClick={() => setAdding(false)} className="btn-secondary px-4 py-2 text-[12px]">Cancel</button>
            <button onClick={addGoal} className="btn-primary px-4 py-2 text-[12px]">Add Goal</button>
          </div>
        </div>
      )}

      {/* Goals list */}
      <div className="space-y-3">
        {goals.map((goal) => (
          <div key={goal.id} className="card-base p-4 flex items-start gap-3 group">
            <GripVertical size={16} className="text-border mt-0.5 flex-shrink-0 cursor-grab" />
            <div className="flex-1 min-w-0 space-y-2">
              <div className="flex items-center gap-2 flex-wrap">
                <input
                  type="text"
                  value={goal.title}
                  onChange={(e) => updateGoal(goal.id, 'title', e.target.value)}
                  className="text-[13px] font-semibold text-foreground bg-transparent border-none outline-none flex-1 min-w-0 hover:bg-secondary/50 focus:bg-secondary px-1 py-0.5 rounded transition-colors"
                />
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold border capitalize ${priorityColors[goal.priority]}`}>
                  {goal.priority}
                </span>
              </div>
              <div className="flex flex-wrap gap-3 text-[11px] text-muted-foreground">
                <span>
                  <span className="text-muted-foreground/60">Metric: </span>
                  <input
                    type="text"
                    value={goal.metric}
                    onChange={(e) => updateGoal(goal.id, 'metric', e.target.value)}
                    className="bg-transparent border-none outline-none text-muted-foreground hover:text-foreground transition-colors"
                  />
                </span>
                <span>
                  <span className="text-muted-foreground/60">Target: </span>
                  <input
                    type="text"
                    value={goal.target}
                    onChange={(e) => updateGoal(goal.id, 'target', e.target.value)}
                    className="bg-transparent border-none outline-none text-muted-foreground hover:text-foreground transition-colors w-20"
                  />
                </span>
                <span>
                  <span className="text-muted-foreground/60">Due: </span>
                  <input
                    type="date"
                    value={goal.deadline}
                    onChange={(e) => updateGoal(goal.id, 'deadline', e.target.value)}
                    className="bg-transparent border-none outline-none text-muted-foreground hover:text-foreground transition-colors"
                  />
                </span>
              </div>
            </div>
            <button
              onClick={() => removeGoal(goal.id)}
              className="opacity-0 group-hover:opacity-100 p-1.5 rounded-lg text-muted-foreground hover:text-negative hover:bg-negative/10 transition-all flex-shrink-0"
            >
              <Trash2 size={13} />
            </button>
          </div>
        ))}
      </div>

      <div className="flex justify-end">
        <button
          onClick={handleSave}
          className={`btn-primary px-5 py-2.5 flex items-center gap-2 text-[13px] ${saved ? 'bg-positive hover:bg-positive' : ''}`}
        >
          <Save size={14} />
          {saved ? 'Saved!' : 'Save Goals'}
        </button>
      </div>
    </div>
  );
}

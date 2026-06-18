'use client';
import React, { useState } from 'react';
import { CheckSquare, Square, Plus, AlertTriangle } from 'lucide-react';

const initialTasks = [
  { id: 'task-1', text: 'Follow up with 8 LinkedIn DMs sent Monday', done: false, priority: 'high', dueLabel: 'Today' },
  { id: 'task-2', text: 'Refine cold email subject line: test 3 variants', done: false, priority: 'high', dueLabel: 'Today' },
  { id: 'task-3', text: 'Add competitor analysis to strategy doc', done: true, priority: 'medium', dueLabel: 'Done' },
  { id: 'task-4', text: 'Research 20 new SaaS CTO prospects on LinkedIn', done: false, priority: 'medium', dueLabel: 'Tomorrow' },
  { id: 'task-5', text: 'Book product demo with Priya Sharma (warm intro)', done: false, priority: 'high', dueLabel: 'Jun 19' },
  { id: 'task-6', text: 'Write pitch script for 15-min discovery call', done: false, priority: 'medium', dueLabel: 'Jun 20' },
  { id: 'task-7', text: 'Post founder story thread on Twitter/X', done: true, priority: 'low', dueLabel: 'Done' },
  { id: 'task-8', text: 'Set up experiment tracking for Reddit community posts', done: false, priority: 'low', dueLabel: 'Jun 22' },
];

const priorityColor: Record<string, string> = {
  high: 'bg-negative-bg text-negative border-red-200',
  medium: 'bg-warning-bg text-warning border-yellow-200',
  low: 'bg-muted text-muted-foreground border-border',
};

export default function TaskList() {
  const [tasks, setTasks] = useState(initialTasks);

  const toggle = (id: string) => {
    setTasks((prev) => prev.map((t) => (t.id === id ? { ...t, done: !t.done } : t)));
  };

  const pending = tasks.filter((t) => !t.done);
  const done = tasks.filter((t) => t.done);

  return (
    <div className="card-base p-5 shadow-card">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-[15px] font-semibold text-foreground">Today's GTM Tasks</h3>
          <p className="text-[12px] text-muted-foreground mt-0.5">{pending.length} remaining · {done.length} done</p>
        </div>
        <button className="w-8 h-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center hover:bg-primary hover:text-white transition-all duration-150">
          <Plus size={16} />
        </button>
      </div>

      <div className="space-y-1.5">
        {tasks.map((task) => (
          <div
            key={task.id}
            className={`flex items-start gap-3 py-2 px-3 rounded-lg hover:bg-muted transition-colors duration-100 cursor-pointer group ${
              task.done ? 'opacity-50' : ''
            }`}
            onClick={() => toggle(task.id)}
          >
            {task.done ? (
              <CheckSquare size={16} className="text-positive flex-shrink-0 mt-0.5" />
            ) : (
              <Square size={16} className="text-muted-foreground group-hover:text-primary flex-shrink-0 mt-0.5 transition-colors" />
            )}
            <div className="flex-1 min-w-0">
              <p className={`text-[13px] font-medium leading-snug ${task.done ? 'line-through text-muted-foreground' : 'text-foreground'}`}>
                {task.text}
              </p>
            </div>
            <div className="flex items-center gap-1.5 flex-shrink-0">
              {!task.done && task.priority === 'high' && (
                <AlertTriangle size={12} className="text-negative" />
              )}
              <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded border ${priorityColor[task.priority]}`}>
                {task.dueLabel}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
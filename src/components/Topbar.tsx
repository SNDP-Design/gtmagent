'use client';
import React, { useState } from 'react';
import { Bell, Search, HelpCircle, ChevronDown } from 'lucide-react';

const notifications = [
  { id: 'notif-1', text: 'Experiment "LinkedIn DM: SaaS CTOs" reached 50 sends', time: '2h ago', unread: true },
  { id: 'notif-2', text: 'AI Strategy Builder: Section 3 ready for review', time: '5h ago', unread: true },
  { id: 'notif-3', text: 'Your cold email campaign hit 18% reply rate 🎉', time: '1d ago', unread: false },
];

export default function Topbar() {
  const [notifOpen, setNotifOpen] = useState(false);
  const unreadCount = notifications?.filter((n) => n?.unread)?.length;

  return (
    <header className="h-16 border-b border-border bg-card flex items-center px-6 gap-4 flex-shrink-0 z-20">
      {/* Search */}
      <div className="flex-1 max-w-sm">
        <div className="relative">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search experiments, copies, ICPs…"
            className="input-base pl-9 py-2 text-[13px] h-9 bg-muted border-transparent focus:bg-card"
          />
        </div>
      </div>
      <div className="flex items-center gap-2 ml-auto">
        {/* Help */}
        <button className="w-8 h-8 rounded-lg flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted transition-all duration-150">
          <HelpCircle size={18} />
        </button>

        {/* Notifications */}
        <div className="relative">
          <button
            onClick={() => setNotifOpen(!notifOpen)}
            className="w-8 h-8 rounded-lg flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted transition-all duration-150 relative"
          >
            <Bell size={18} />
            {unreadCount > 0 && (
              <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-accent" />
            )}
          </button>

          {notifOpen && (
            <div className="absolute right-0 top-10 w-80 bg-card border border-border rounded-xl shadow-modal z-50 fade-in overflow-hidden">
              <div className="px-4 py-3 border-b border-border flex items-center justify-between">
                <p className="text-[13px] font-semibold text-foreground">Notifications</p>
                <span className="text-[11px] text-muted-foreground">{unreadCount} unread</span>
              </div>
              {notifications?.map((n) => (
                <div
                  key={n?.id}
                  className={`px-4 py-3 border-b border-border last:border-0 hover:bg-muted transition-colors duration-100 cursor-pointer ${
                    n?.unread ? 'bg-secondary/30' : ''
                  }`}
                >
                  <p className="text-[12px] text-foreground leading-relaxed">{n?.text}</p>
                  <p className="text-[11px] text-muted-foreground mt-1">{n?.time}</p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* User */}
        <button className="flex items-center gap-2 px-2 py-1.5 rounded-lg hover:bg-muted transition-all duration-150">
          <div className="w-7 h-7 rounded-full gradient-primary flex items-center justify-center text-white text-[11px] font-bold">
            AK
          </div>
          <span className="text-[13px] font-medium text-foreground hidden sm:block">Alex Kim</span>
          <ChevronDown size={14} className="text-muted-foreground hidden sm:block" />
        </button>
      </div>
    </header>
  );
}
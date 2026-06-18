'use client';
import React, { useState } from 'react';
import AppLayout from '@/components/AppLayout';
import WorkspaceSection from './components/WorkspaceSection';
import APIKeysSection from './components/APIKeysSection';
import NotificationsSection from './components/NotificationsSection';
import GTMGoalsSection from './components/GTMGoalsSection';

const tabs = [
  { id: 'workspace', label: 'Workspace' },
  { id: 'api-keys', label: 'API Integrations' },
  { id: 'notifications', label: 'Notifications' },
  { id: 'gtm-goals', label: 'GTM Goals' },
];

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState('workspace');

  return (
    <AppLayout currentPath="/settings">
      <div className="space-y-6 max-w-3xl">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-foreground">Settings</h1>
          <p className="text-[13px] text-muted-foreground mt-1">
            Configure your workspace, integrations, and GTM preferences
          </p>
        </div>

        {/* Tab nav */}
        <div className="flex gap-1 p-1 rounded-xl bg-secondary w-fit">
          {tabs?.map((tab) => (
            <button
              key={tab?.id}
              onClick={() => setActiveTab(tab?.id)}
              className={`px-4 py-2 rounded-lg text-[13px] font-medium transition-all duration-150 ${
                activeTab === tab?.id
                  ? 'bg-card text-foreground shadow-sm'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              {tab?.label}
            </button>
          ))}
        </div>

        {/* Tab content */}
        <div className="fade-in">
          {activeTab === 'workspace' && <WorkspaceSection />}
          {activeTab === 'api-keys' && <APIKeysSection />}
          {activeTab === 'notifications' && <NotificationsSection />}
          {activeTab === 'gtm-goals' && <GTMGoalsSection />}
        </div>
      </div>
    </AppLayout>
  );
}

'use client';
import React, { useState, useRef, useEffect } from 'react';
import ChatPanel from './ChatPanel';
import StrategyDocPanel from './StrategyDocPanel';
import { founderEventService } from '@/lib/services/founderEventService';

export type StrategySection = {
  id: string;
  title: string;
  status: 'complete' | 'in-progress' | 'locked';
  content: string;
};

const initialSections: StrategySection[] = [
  {
    id: 'sec-positioning',
    title: 'Positioning Statement',
    status: 'complete',
    content:
      'GTMAgent is the AI-powered GTM workspace for first-time solo founders who need to go from zero to first customers without a marketing team. Unlike generic CRM tools or strategy consultants, GTMAgent guides the founder through every step: strategy, ICP, outreach, and experiments, all in one place.',
  },
  {
    id: 'sec-icp',
    title: 'Target Customer (ICP)',
    status: 'complete',
    content:
      'Primary ICP: B2B SaaS founders at pre-revenue stage, 1–2 person team, technical background, targeting SMBs. They have built an MVP and are struggling to get first 10 paying customers. They have no marketing budget and no sales experience. They are 25–38 years old, active on LinkedIn and IndieHackers.',
  },
  {
    id: 'sec-channels',
    title: 'Distribution Channels',
    status: 'complete',
    content:
      'Priority channels: (1) LinkedIn cold outreach to CTOs and VPs of Eng at 10–200 person SaaS companies. (2) Warm introductions via existing network (highest conversion). (3) IndieHackers community posts and comments. Secondary channels: Cold email sequences, Twitter/X founder community engagement.',
  },
  {
    id: 'sec-pricing',
    title: 'Pricing Strategy',
    status: 'in-progress',
    content:
      'Working hypothesis: $49/month solo plan (all features, 1 workspace). Rationale: founders are price-sensitive but will pay for tools that directly generate revenue. Competitive anchoring against hiring a fractional CMO ($2,000/mo). Still need to validate with 5 prospect conversations.',
  },
  {
    id: 'sec-launch',
    title: '90-Day Launch Plan',
    status: 'locked',
    content: '',
  },
  {
    id: 'sec-metrics',
    title: 'Success Metrics',
    status: 'locked',
    content: '',
  },
];

export default function StrategyBuilderLayout() {
  const [sections, setSections] = useState<StrategySection[]>(initialSections);
  const [activeSection, setActiveSection] = useState<string>('sec-pricing');

  const handleSectionUpdate = (id: string, content: string) => {
    setSections((prev) =>
      prev.map((s) => (s.id === id ? { ...s, content, status: 'complete' } : s))
    );
    // Track strategy section completed
    const section = sections.find((s) => s.id === id);
    founderEventService.log('strategy_section_completed', 'strategy', {
      section_id: id,
      section_title: section?.title || id,
    });
  };

  const handleUnlockSection = (id: string) => {
    setSections((prev) =>
      prev.map((s) => (s.id === id ? { ...s, status: 'in-progress' } : s))
    );
    setActiveSection(id);
    // Track strategy section unlocked
    const section = sections.find((s) => s.id === id);
    founderEventService.log('strategy_section_unlocked', 'strategy', {
      section_id: id,
      section_title: section?.title || id,
    });
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-2 2xl:grid-cols-5 gap-6 h-[calc(100vh-200px)] min-h-[600px]">
      <div className="lg:col-span-1 2xl:col-span-2 h-full">
        <ChatPanel
          sections={sections}
          activeSection={activeSection}
          onSectionUpdate={handleSectionUpdate}
          onUnlockSection={handleUnlockSection}
        />
      </div>
      <div className="lg:col-span-1 2xl:col-span-3 h-full overflow-y-auto">
        <StrategyDocPanel
          sections={sections}
          activeSection={activeSection}
          onSectionSelect={setActiveSection}
          onUnlockSection={handleUnlockSection}
        />
      </div>
    </div>
  );
}
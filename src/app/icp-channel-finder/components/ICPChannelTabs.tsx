'use client';
import React, { useState } from 'react';
import ICPTab from './ICPTab';
import ChannelTab from './ChannelTab';
import { Sparkles, Loader2, X, ChevronDown, ChevronUp } from 'lucide-react';
import { geminiChatCompletion } from '@/lib/ai/geminiWithFallback';
import { icpProfileService } from '@/lib/services/icpProfileService';
import { useICPProfilesRealtime } from '@/lib/hooks/useICPProfilesRealtime';
import { toast } from 'sonner';

const tabs = [
  { id: 'tab-icp', label: 'Ideal Customer Profiles', count: 3 },
  { id: 'tab-channels', label: 'Channel Recommendations', count: 6 },
];

export default function ICPChannelTabs() {
  const [active, setActive] = useState('tab-icp');
  const [showGenerator, setShowGenerator] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [productDesc, setProductDesc] = useState('');
  const [targetMarket, setTargetMarket] = useState('');
  const { reload } = useICPProfilesRealtime();

  const handleGenerateICP = async () => {
    if (!productDesc.trim()) {
      toast.error('Please describe your product first.');
      return;
    }

    setIsGenerating(true);

    try {
      const result = await geminiChatCompletion(
        [
          {
            role: 'user',
            content: `You are a GTM strategist. Generate 3 ideal customer profiles (ICPs) as a JSON object.

Product: ${productDesc}
Target Market: ${targetMarket || 'Not specified'}

Return ONLY valid JSON (no markdown):
{
  "profiles": [
    {
      "name": "Profile name (e.g. 'The Scrappy Solo Founder')",
      "role": "Job title",
      "companySize": "e.g. 1-10 employees",
      "industry": "e.g. B2B SaaS",
      "stage": "e.g. Pre-revenue",
      "fitScore": 92,
      "quote": "A realistic quote this person would say about their problem",
      "painPoints": ["pain 1", "pain 2", "pain 3"],
      "buyerSignals": ["signal 1", "signal 2", "signal 3"],
      "channels": ["LinkedIn", "Cold Email"],
      "budget": "e.g. $0–$500/mo"
    }
  ]
}

Rules: fitScore between 60-97, 3 distinct profiles with different roles/stages, be specific and realistic.`,
          },
        ],
        { temperature: 0.7, max_tokens: 2048 }
      );

      const content = result?.choices?.[0]?.message?.content || '';
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      if (!jsonMatch) throw new Error('Invalid AI response format');

      const parsed = JSON.parse(jsonMatch[0]);
      if (!parsed.profiles || !Array.isArray(parsed.profiles)) throw new Error('Unexpected response structure');

      // Save each profile via service
      let saved = 0;
      for (const p of parsed.profiles) {
        await icpProfileService.create({
          name: p.name,
          role: p.role,
          companySize: p.companySize,
          industry: p.industry,
          stage: p.stage,
          fitScore: p.fitScore,
          quote: p.quote,
          painPoints: p.painPoints,
          buyerSignals: p.buyerSignals,
          channels: p.channels,
          budget: p.budget,
          saved: false,
        });
        saved++;
      }

      toast.success(`${saved} ICP profiles generated and saved!`);
      setShowGenerator(false);
      setProductDesc('');
      setTargetMarket('');
      // Reload profiles via realtime hook instead of full page reload
      reload();
    } catch (err: any) {
      toast.error('ICP generation failed: ' + (err.message || 'Please try again.'));
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div>
      {/* AI ICP Generator Panel */}
      <div className="card-base shadow-card p-4 mb-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg gradient-primary flex items-center justify-center">
              <Sparkles size={15} className="text-white" />
            </div>
            <div>
              <p className="text-[13px] font-semibold text-foreground">Generate ICPs with Gemini AI</p>
              <p className="text-[11px] text-muted-foreground">Describe your product and get 3 AI-crafted customer profiles</p>
            </div>
          </div>
          <button
            onClick={() => setShowGenerator((v) => !v)}
            className="flex items-center gap-1.5 text-[12px] font-semibold text-primary hover:bg-secondary px-3 py-1.5 rounded-lg transition-colors"
          >
            {showGenerator ? <><ChevronUp size={14} /> Hide</> : <><ChevronDown size={14} /> Generate ICPs</>}
          </button>
        </div>

        {showGenerator && (
          <div className="mt-4 space-y-3 border-t border-border pt-4">
            <div>
              <label className="block text-[12px] font-semibold text-foreground mb-1.5">
                What does your product do? <span className="text-negative">*</span>
              </label>
              <textarea
                value={productDesc}
                onChange={(e) => setProductDesc(e.target.value)}
                className="input-base text-[13px] resize-none"
                rows={2}
                placeholder="e.g. AI-powered GTM workspace that helps solo founders get their first 10 customers through strategy, ICP targeting, and outreach automation"
              />
            </div>
            <div>
              <label className="block text-[12px] font-semibold text-foreground mb-1.5">Target market (optional)</label>
              <input
                value={targetMarket}
                onChange={(e) => setTargetMarket(e.target.value)}
                className="input-base text-[13px]"
                placeholder="e.g. Early-stage B2B SaaS founders, bootstrapped startups"
              />
            </div>
            <div className="flex gap-2 pt-1">
              <button
                onClick={handleGenerateICP}
                disabled={isGenerating || !productDesc.trim()}
                className="btn-primary px-4 py-2 flex items-center gap-2 text-[12px] disabled:opacity-60 disabled:cursor-not-allowed disabled:transform-none"
              >
                {isGenerating ? (
                  <><Loader2 size={14} className="animate-spin" /> Generating…</>
                ) : (
                  <><Sparkles size={14} /> Generate 3 ICP Profiles</>
                )}
              </button>
              <button
                onClick={() => setShowGenerator(false)}
                className="btn-secondary px-4 py-2 text-[12px] flex items-center gap-1.5"
              >
                <X size={13} /> Cancel
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Tabs */}
      <div className="flex gap-1 p-1 bg-muted rounded-xl w-fit mb-6">
        {tabs?.map((tab) => (
          <button
            key={tab?.id}
            onClick={() => setActive(tab?.id)}
            className={`px-4 py-2 rounded-lg text-[13px] font-semibold transition-all duration-150 flex items-center gap-2 ${
              active === tab?.id
                ? 'bg-card text-primary shadow-card'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            {tab?.label}
            <span className={`min-w-[20px] h-5 px-1.5 rounded-full text-[10px] font-bold flex items-center justify-center ${
              active === tab?.id ? 'bg-primary text-white' : 'bg-border text-muted-foreground'
            }`}>
              {tab?.count}
            </span>
          </button>
        ))}
      </div>
      {active === 'tab-icp' ? <ICPTab /> : <ChannelTab />}
    </div>
  );
}
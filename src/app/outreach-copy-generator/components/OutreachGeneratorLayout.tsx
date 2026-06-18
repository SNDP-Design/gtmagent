'use client';
import React, { useState, useEffect } from 'react';
import GeneratorForm from './GeneratorForm';
import CopyVariants from './CopyVariants';
import CopyHistory from './CopyHistory';

import { geminiChatCompletion } from '@/lib/ai/geminiWithFallback';
import { toast } from 'sonner';
import { founderEventService } from '@/lib/services/founderEventService';

export type GeneratedCopy = {
  id: string;
  type: string;
  icp: string;
  tone: string;
  variants: {
    id: string;
    label: string;
    subject?: string;
    body: string;
    score: number;
  }[];
  createdAt: string;
};

function buildCopyPrompt(formData: Record<string, string>): string {
  return `You are an expert B2B copywriter. Generate exactly 3 outreach copy variants as a JSON object.

Context:
- Copy Type: ${formData.copyType}
- Target ICP: ${formData.icp}
- Tone: ${formData.tone}
- Product Name: ${formData.productName}
- Value Proposition: ${formData.valueProposition}
- Desired CTA: ${formData.callToAction || 'Schedule a call'}
- Additional Context: ${formData.context || 'None'}

Return ONLY valid JSON in this exact format (no markdown, no explanation):
{
  "variants": [
    {
      "label": "Variant A: [Hook Type]",
      "subject": "Subject line here (for emails only, omit for LinkedIn DM/Pitch Script)",
      "body": "Full copy body here with line breaks as \\n",
      "score": 85
    },
    {
      "label": "Variant B: [Hook Type]",
      "subject": "Subject line here",
      "body": "Full copy body here",
      "score": 79
    },
    {
      "label": "Variant C: [Hook Type]",
      "subject": "Subject line here",
      "body": "Full copy body here",
      "score": 72
    }
  ]
}

Rules:
- Each variant must use a different hook/angle (e.g. Problem-Led, Social Proof, Curiosity, Value-Led, Story-Led)
- Score reflects estimated reply rate potential (60-95 range)
- Body should be concise and ready-to-send (under 150 words for emails/DMs)
- Use {{first_name}} and {{company}} as personalization tokens
- For LinkedIn DM: no subject line, conversational tone, under 100 words
- For Pitch Script: no subject line, structured with hook/problem/solution/CTA`;
}

export default function OutreachGeneratorLayout() {
  const [generatedCopy, setGeneratedCopy] = useState<GeneratedCopy | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerate = async (formData: Record<string, string>) => {
    setIsGenerating(true);
    setGeneratedCopy(null);

    try {
      const result = await geminiChatCompletion(
        [
          {
            role: 'user',
            content: buildCopyPrompt(formData),
          },
        ],
        { temperature: 0.8, max_tokens: 2048 }
      );

      const content = result?.choices?.[0]?.message?.content || '';

      // Parse JSON from response
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      if (!jsonMatch) throw new Error('Invalid response format from AI');

      const parsed = JSON.parse(jsonMatch[0]);
      if (!parsed.variants || !Array.isArray(parsed.variants)) {
        throw new Error('Unexpected response structure');
      }

      const copy: GeneratedCopy = {
        id: `copy-${Date.now()}`,
        type: formData.copyType,
        icp: formData.icp,
        tone: formData.tone,
        createdAt: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
        variants: parsed.variants.map((v: any, i: number) => ({
          id: `var-${Date.now()}-${i}`,
          label: v.label || `Variant ${String.fromCharCode(65 + i)}`,
          subject: v.subject || undefined,
          body: v.body || '',
          score: typeof v.score === 'number' ? v.score : 75,
        })),
      };

      setGeneratedCopy(copy);
      toast.success('3 copy variants generated!');
      // Track founder action
      founderEventService.log('copy_variants_generated', 'copy', {
        copy_type: formData.copyType,
        icp: formData.icp,
        tone: formData.tone,
        variants_count: copy.variants.length,
      });
    } catch (err: any) {
      toast.error(err.message || 'Failed to generate copy. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-5 xl:grid-cols-5 2xl:grid-cols-5 gap-6">
        <div className="lg:col-span-2">
          <GeneratorForm onGenerate={handleGenerate} isGenerating={isGenerating} />
        </div>
        <div className="lg:col-span-3">
          <CopyVariants generatedCopy={generatedCopy} isGenerating={isGenerating} />
        </div>
      </div>
      <CopyHistory />
    </div>
  );
}
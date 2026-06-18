'use client';
import React from 'react';
import { useForm } from 'react-hook-form';
import { Sparkles, Loader2 } from 'lucide-react';

interface FormData {
  copyType: string;
  icp: string;
  tone: string;
  productName: string;
  valueProposition: string;
  callToAction: string;
  context: string;
}

interface GeneratorFormProps {
  onGenerate: (data: Record<string, string>) => void;
  isGenerating: boolean;
}

const copyTypes = ['Cold Email', 'LinkedIn DM', 'Pitch Script', 'Follow-up Email'];
const icpOptions = [
  'SaaS CTO at Early-Stage Startup',
  'Non-Technical Solo Founder',
  'Ex-Consultant Turned Founder',
];
const toneOptions = [
  'Direct & Confident',
  'Friendly & Conversational',
  'Formal & Professional',
  'Curiosity-Driven',
  'Empathetic & Supportive',
];

export default function GeneratorForm({ onGenerate, isGenerating }: GeneratorFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    defaultValues: {
      copyType: 'Cold Email',
      icp: 'SaaS CTO at Early-Stage Startup',
      tone: 'Direct & Confident',
      productName: 'GTMAgent',
      valueProposition: 'AI-powered GTM workspace that helps solo founders get their first 10 customers',
      callToAction: '15-minute discovery call',
      context: '',
    },
  });

  return (
    <div className="card-base shadow-card p-5">
      <div className="flex items-center gap-2 mb-5">
        <div className="w-8 h-8 rounded-lg gradient-primary flex items-center justify-center">
          <Sparkles size={15} className="text-white" />
        </div>
        <h3 className="text-[15px] font-semibold text-foreground">Configure Copy</h3>
      </div>

      <form onSubmit={handleSubmit(onGenerate)} className="space-y-4">
        {/* Copy type */}
        <div>
          <label className="block text-[12px] font-semibold text-foreground mb-1.5">Copy Type</label>
          <select {...register('copyType', { required: true })} className="input-base text-[13px]">
            {copyTypes.map((t) => (
              <option key={`type-${t}`} value={t}>{t}</option>
            ))}
          </select>
        </div>

        {/* ICP */}
        <div>
          <label className="block text-[12px] font-semibold text-foreground mb-1.5">Target ICP</label>
          <select {...register('icp', { required: true })} className="input-base text-[13px]">
            {icpOptions.map((i) => (
              <option key={`icp-${i}`} value={i}>{i}</option>
            ))}
          </select>
        </div>

        {/* Tone */}
        <div>
          <label className="block text-[12px] font-semibold text-foreground mb-1.5">Tone</label>
          <select {...register('tone', { required: true })} className="input-base text-[13px]">
            {toneOptions.map((t) => (
              <option key={`tone-${t}`} value={t}>{t}</option>
            ))}
          </select>
        </div>

        {/* Product name */}
        <div>
          <label className="block text-[12px] font-semibold text-foreground mb-1.5">Product Name</label>
          <input
            {...register('productName', { required: 'Product name is required' })}
            className="input-base text-[13px]"
            placeholder="e.g. GTMAgent"
          />
          {errors.productName && (
            <p className="text-negative text-[11px] mt-1">{errors.productName.message}</p>
          )}
        </div>

        {/* Value prop */}
        <div>
          <label className="block text-[12px] font-semibold text-foreground mb-1">Value Proposition</label>
          <p className="text-[11px] text-muted-foreground mb-1.5">What does your product do and who is it for?</p>
          <textarea
            {...register('valueProposition', { required: 'Value proposition is required' })}
            className="input-base text-[13px] resize-none"
            rows={3}
            placeholder="e.g. AI GTM workspace for solo founders who need their first customers"
          />
          {errors.valueProposition && (
            <p className="text-negative text-[11px] mt-1">{errors.valueProposition.message}</p>
          )}
        </div>

        {/* CTA */}
        <div>
          <label className="block text-[12px] font-semibold text-foreground mb-1.5">Desired CTA</label>
          <input
            {...register('callToAction')}
            className="input-base text-[13px]"
            placeholder="e.g. 15-minute discovery call"
          />
        </div>

        {/* Additional context */}
        <div>
          <label className="block text-[12px] font-semibold text-foreground mb-1">Additional Context</label>
          <p className="text-[11px] text-muted-foreground mb-1.5">Any recent news, personalization hooks, or specific objections to address?</p>
          <textarea
            {...register('context')}
            className="input-base text-[13px] resize-none"
            rows={2}
            placeholder="e.g. Target recently posted about hiring challenges on LinkedIn"
          />
        </div>

        <button
          type="submit"
          disabled={isGenerating}
          className="btn-primary w-full py-3 flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed disabled:transform-none"
        >
          {isGenerating ? (
            <>
              <Loader2 size={16} className="animate-spin" />
              Generating 3 variants…
            </>
          ) : (
            <>
              <Sparkles size={16} />
              Generate Copy Variants
            </>
          )}
        </button>
      </form>
    </div>
  );
}
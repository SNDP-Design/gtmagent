'use client';

import { createClient } from '@/lib/supabase/client';

export interface ICPProfile {
  id: string;
  userId: string;
  name: string;
  fitScore: number;
  industry: string;
  role: string;
  companySize: string;
  budget: string;
  stage: string;
  painPoints: string[];
  buyerSignals: string[];
  channels: string[];
  quote: string;
  saved: boolean;
}

function toICPProfile(row: any): ICPProfile {
  return {
    id: row.id,
    userId: row.user_id,
    name: row.name,
    fitScore: row.fit_score,
    industry: row.industry,
    role: row.role,
    companySize: row.company_size,
    budget: row.budget,
    stage: row.stage,
    painPoints: Array.isArray(row.pain_points) ? row.pain_points : [],
    buyerSignals: Array.isArray(row.buyer_signals) ? row.buyer_signals : [],
    channels: Array.isArray(row.channels) ? row.channels : [],
    quote: row.quote || '',
    saved: row.saved || false,
  };
}

function isSchemaError(error: any): boolean {
  if (!error) return false;
  if (error.code && typeof error.code === 'string') {
    const cls = error.code.substring(0, 2);
    if (cls === '42' || cls === '08') return true;
    if (cls === '23') return false;
  }
  if (error.message) {
    return /relation.*does not exist|column.*does not exist|function.*does not exist|syntax error/i.test(error.message);
  }
  return false;
}

export const icpProfileService = {
  async getAll(): Promise<ICPProfile[]> {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return [];

    try {
      const { data, error } = await supabase
        .from('icp_profiles')
        .select('*')
        .eq('user_id', user.id)
        .order('fit_score', { ascending: false });

      if (error) {
        if (isSchemaError(error)) throw error;
        return [];
      }
      return data?.map(toICPProfile) || [];
    } catch (err: any) {
      if (isSchemaError(err)) throw err;
      return [];
    }
  },

  async toggleSave(id: string, saved: boolean): Promise<boolean> {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return false;

    try {
      const { error } = await supabase
        .from('icp_profiles')
        .update({ saved })
        .eq('id', id)
        .eq('user_id', user.id);

      if (error) {
        if (isSchemaError(error)) throw error;
        return false;
      }
      return true;
    } catch (err: any) {
      if (isSchemaError(err)) throw err;
      return false;
    }
  },

  async create(profile: Omit<ICPProfile, 'id' | 'userId'>): Promise<ICPProfile | null> {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return null;

    try {
      const { data, error } = await supabase
        .from('icp_profiles')
        .insert({
          user_id: user.id,
          name: profile.name,
          fit_score: profile.fitScore,
          industry: profile.industry,
          role: profile.role,
          company_size: profile.companySize,
          budget: profile.budget,
          stage: profile.stage,
          pain_points: profile.painPoints,
          buyer_signals: profile.buyerSignals,
          channels: profile.channels,
          quote: profile.quote,
          saved: profile.saved,
        })
        .select()
        .single();

      if (error) {
        if (isSchemaError(error)) throw error;
        return null;
      }
      return data ? toICPProfile(data) : null;
    } catch (err: any) {
      if (isSchemaError(err)) throw err;
      return null;
    }
  },
};

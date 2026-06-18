'use client';

import { createClient } from '@/lib/supabase/client';

export type ExperimentStatus = 'Running' | 'Planned' | 'Completed' | 'Archived';
export type SignalStrength = 'Strong' | 'Moderate' | 'Weak' | 'No Signal' | 'None';

export interface Experiment {
  id: string;
  userId: string;
  name: string;
  channel: string;
  icpTarget: string;
  hypothesis: string;
  status: ExperimentStatus;
  sent: number;
  replies: number;
  conversions: number;
  signal: SignalStrength;
  startDate: string;
  lastUpdated: string;
  createdAt: string;
}

function toExperiment(row: any): Experiment {
  return {
    id: row.id,
    userId: row.user_id,
    name: row.name,
    channel: row.channel,
    icpTarget: row.icp_target,
    hypothesis: row.hypothesis,
    status: row.status as ExperimentStatus,
    sent: row.sent,
    replies: row.replies,
    conversions: row.conversions,
    signal: row.signal === 'None' ? '—' as any : row.signal as SignalStrength,
    startDate: row.start_date,
    lastUpdated: row.last_updated,
    createdAt: row.created_at,
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

export const experimentService = {
  async getAll(): Promise<Experiment[]> {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return [];

    try {
      const { data, error } = await supabase
        .from('experiments')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) {
        if (isSchemaError(error)) throw error;
        return [];
      }
      return data?.map(toExperiment) || [];
    } catch (err: any) {
      if (isSchemaError(err)) throw err;
      return [];
    }
  },

  async create(exp: { name: string; channel: string; icpTarget: string; hypothesis: string }): Promise<Experiment | null> {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');

    const today = new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' });

    try {
      const { data, error } = await supabase
        .from('experiments')
        .insert({
          user_id: user.id,
          name: exp.name,
          channel: exp.channel,
          icp_target: exp.icpTarget,
          hypothesis: exp.hypothesis,
          status: 'Planned',
          sent: 0,
          replies: 0,
          conversions: 0,
          signal: 'None',
          start_date: today,
          last_updated: '—',
        })
        .select()
        .single();

      if (error) {
        if (isSchemaError(error)) throw error;
        return null;
      }
      return data ? toExperiment(data) : null;
    } catch (err: any) {
      if (isSchemaError(err)) throw err;
      return null;
    }
  },

  async delete(id: string): Promise<boolean> {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return false;

    try {
      const { error } = await supabase
        .from('experiments')
        .delete()
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
};

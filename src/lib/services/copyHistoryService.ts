'use client';

import { createClient } from '@/lib/supabase/client';

export interface CopyHistoryItem {
  id: string;
  userId: string;
  label: string;
  type: string;
  icp: string;
  tone: string;
  score: number;
  usageCount: number;
  replyRate: string;
  body: string;
  subject: string;
  savedAt: string;
}

function toCopyHistoryItem(row: any): CopyHistoryItem {
  return {
    id: row.id,
    userId: row.user_id,
    label: row.label,
    type: row.copy_type,
    icp: row.icp,
    tone: row.tone,
    score: row.score,
    usageCount: row.usage_count,
    replyRate: row.reply_rate || '—',
    body: row.body || '',
    subject: row.subject || '',
    savedAt: row.saved_at
      ? new Date(row.saved_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
      : '',
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

export const copyHistoryService = {
  async getAll(): Promise<CopyHistoryItem[]> {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return [];

    try {
      const { data, error } = await supabase
        .from('copy_history')
        .select('*')
        .eq('user_id', user.id)
        .order('score', { ascending: false });

      if (error) {
        if (isSchemaError(error)) throw error;
        return [];
      }
      return data?.map(toCopyHistoryItem) || [];
    } catch (err: any) {
      if (isSchemaError(err)) throw err;
      return [];
    }
  },

  async save(item: {
    label: string;
    copyType: string;
    icp: string;
    tone: string;
    score: number;
    body: string;
    subject?: string;
  }): Promise<CopyHistoryItem | null> {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');

    try {
      const { data, error } = await supabase
        .from('copy_history')
        .insert({
          user_id: user.id,
          label: item.label,
          copy_type: item.copyType,
          icp: item.icp,
          tone: item.tone,
          score: item.score,
          usage_count: 0,
          reply_rate: '—',
          body: item.body,
          subject: item.subject || '',
        })
        .select()
        .single();

      if (error) {
        if (isSchemaError(error)) throw error;
        return null;
      }
      return data ? toCopyHistoryItem(data) : null;
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
        .from('copy_history')
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

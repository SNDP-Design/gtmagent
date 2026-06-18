'use client';

import { createClient } from '@/lib/supabase/client';

export type MilestoneStatus = 'done' | 'in-progress' | 'todo' | 'blocked';

export interface Milestone {
  id: string;
  userId: string;
  label: string;
  status: MilestoneStatus;
  dueDate: string;
  progress?: number;
  sortOrder: number;
}

function toMilestone(row: any): Milestone {
  return {
    id: row.id,
    userId: row.user_id,
    label: row.label,
    status: row.status as MilestoneStatus,
    dueDate: row.due_date || '',
    progress: row.progress ?? undefined,
    sortOrder: row.sort_order,
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

export const milestoneService = {
  async getAll(): Promise<Milestone[]> {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return [];

    try {
      const { data, error } = await supabase
        .from('milestones')
        .select('*')
        .eq('user_id', user.id)
        .order('sort_order', { ascending: true });

      if (error) {
        if (isSchemaError(error)) throw error;
        return [];
      }
      return data?.map(toMilestone) || [];
    } catch (err: any) {
      if (isSchemaError(err)) throw err;
      return [];
    }
  },
};

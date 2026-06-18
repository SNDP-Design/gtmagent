'use client';

import { createClient } from '@/lib/supabase/client';

export type FounderEventType =
  | 'strategy_section_completed'
  | 'strategy_section_unlocked' |'experiment_logged' |'copy_variants_generated';

export type FounderEventCategory = 'strategy' | 'experiments' | 'copy';

export interface FounderEvent {
  id: string;
  userId: string;
  eventType: FounderEventType;
  eventCategory: FounderEventCategory;
  metadata: Record<string, any>;
  createdAt: string;
}

function toFounderEvent(row: any): FounderEvent {
  return {
    id: row.id,
    userId: row.user_id,
    eventType: row.event_type as FounderEventType,
    eventCategory: row.event_category as FounderEventCategory,
    metadata: row.metadata || {},
    createdAt: row.created_at,
  };
}

export const founderEventService = {
  /**
   * Log a founder action event. Fire-and-forget — never throws.
   */
  async log(
    eventType: FounderEventType,
    eventCategory: FounderEventCategory,
    metadata: Record<string, any> = {}
  ): Promise<void> {
    try {
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return;

      await supabase.from('founder_events').insert({
        user_id: user.id,
        event_type: eventType,
        event_category: eventCategory,
        metadata,
      });
    } catch {
      // Silently swallow — event tracking must never break the app
    }
  },

  /**
   * Fetch all events for the current user, newest first.
   */
  async getAll(): Promise<FounderEvent[]> {
    try {
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return [];

      const { data, error } = await supabase
        .from('founder_events')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) return [];
      return data?.map(toFounderEvent) || [];
    } catch {
      return [];
    }
  },

  /**
   * Get event counts grouped by event_type for the current user.
   */
  async getSummary(): Promise<Record<string, number>> {
    try {
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return {};

      const { data, error } = await supabase
        .from('founder_events')
        .select('event_type')
        .eq('user_id', user.id);

      if (error || !data) return {};

      return data.reduce<Record<string, number>>((acc, row) => {
        acc[row.event_type] = (acc[row.event_type] || 0) + 1;
        return acc;
      }, {});
    } catch {
      return {};
    }
  },
};

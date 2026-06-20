'use client';

import { useEffect, useState, useCallback, useRef } from 'react';
import { createClient } from '@/lib/supabase/client';
import { experimentService, type Experiment } from '@/lib/services/experimentService';

/**
 * useExperimentsRealtime
 *
 * Loads all experiments for the current user and subscribes to Supabase
 * Realtime so that INSERT / UPDATE / DELETE events on the `experiments`
 * table are reflected immediately — across every browser tab and device —
 * without a manual refresh.
 */
export function useExperimentsRealtime() {
  const [experiments, setExperiments] = useState<Experiment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const channelRef = useRef<ReturnType<ReturnType<typeof createClient>['channel']> | null>(null);

  // ─── helpers ────────────────────────────────────────────────────────────────

  function toExperiment(row: any): Experiment {
    return {
      id: row.id,
      userId: row.user_id,
      name: row.name,
      channel: row.channel,
      icpTarget: row.icp_target,
      hypothesis: row.hypothesis,
      status: row.status,
      sent: row.sent,
      replies: row.replies,
      conversions: row.conversions,
      signal: row.signal === 'None' ? ('—' as any) : row.signal,
      startDate: row.start_date,
      lastUpdated: row.last_updated,
      createdAt: row.created_at,
      costPerMessage: row.cost_per_message ?? 0,
      revenueAttributed: row.revenue_attributed ?? 0,
      winRate: row.win_rate ?? 0,
    };
  }

  // ─── initial load ────────────────────────────────────────────────────────────

  const load = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await experimentService.getAll();
      setExperiments(data);
    } catch {
      // silently ignore — caller can show its own error
    } finally {
      setIsLoading(false);
    }
  }, []);

  // ─── realtime subscription ───────────────────────────────────────────────────

  useEffect(() => {
    let cancelled = false;

    const supabase = createClient();

    // Fetch current user so we can filter realtime events to this user only
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (!user || cancelled) return;

      // Initial load
      load();

      // Subscribe to all changes on the experiments table for this user
      const channel = supabase
        .channel(`experiments:user:${user.id}`)
        .on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table: 'experiments',
            filter: `user_id=eq.${user.id}`,
          },
          (payload) => {
            if (cancelled) return;

            const { eventType, new: newRow, old: oldRow } = payload;

            if (eventType === 'INSERT') {
              const inserted = toExperiment(newRow);
              setExperiments((prev) => {
                // Avoid duplicates (e.g. optimistic insert already present)
                if (prev.some((e) => e.id === inserted.id)) return prev;
                return [inserted, ...prev];
              });
            } else if (eventType === 'UPDATE') {
              const updated = toExperiment(newRow);
              setExperiments((prev) =>
                prev.map((e) => (e.id === updated.id ? updated : e))
              );
            } else if (eventType === 'DELETE') {
              const deletedId = (oldRow as any)?.id;
              if (deletedId) {
                setExperiments((prev) => prev.filter((e) => e.id !== deletedId));
              }
            }
          }
        )
        .subscribe();

      channelRef.current = channel;
    });

    return () => {
      cancelled = true;
      if (channelRef.current) {
        const supabase = createClient();
        supabase.removeChannel(channelRef.current);
        channelRef.current = null;
      }
    };
  }, [load]);

  return { experiments, isLoading, reload: load };
}

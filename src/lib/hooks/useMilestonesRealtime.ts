'use client';

import { useEffect, useState, useCallback, useRef } from 'react';
import { createClient } from '@/lib/supabase/client';
import { milestoneService, type Milestone, type MilestoneStatus } from '@/lib/services/milestoneService';

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

/**
 * useMilestonesRealtime
 *
 * Loads all milestones for the current user and subscribes to Supabase
 * Realtime so INSERT / UPDATE / DELETE events on the `milestones` table
 * are reflected immediately across all tabs and devices without a refresh.
 */
export function useMilestonesRealtime() {
  const [milestones, setMilestones] = useState<Milestone[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const channelRef = useRef<ReturnType<ReturnType<typeof createClient>['channel']> | null>(null);

  const load = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await milestoneService.getAll();
      setMilestones(data);
    } catch {
      // silently ignore
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    let cancelled = false;
    const supabase = createClient();

    supabase.auth.getUser().then(({ data: { user } }) => {
      if (!user || cancelled) return;

      load();

      const channel = supabase
        .channel(`milestones:user:${user.id}`)
        .on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table: 'milestones',
            filter: `user_id=eq.${user.id}`,
          },
          (payload) => {
            if (cancelled) return;
            const { eventType, new: newRow, old: oldRow } = payload;

            if (eventType === 'INSERT') {
              const inserted = toMilestone(newRow);
              setMilestones((prev) => {
                if (prev.some((m) => m.id === inserted.id)) return prev;
                // Maintain sort_order ascending
                const next = [...prev, inserted];
                return next.sort((a, b) => a.sortOrder - b.sortOrder);
              });
            } else if (eventType === 'UPDATE') {
              const updated = toMilestone(newRow);
              setMilestones((prev) =>
                prev.map((m) => (m.id === updated.id ? updated : m))
              );
            } else if (eventType === 'DELETE') {
              const deletedId = (oldRow as any)?.id;
              if (deletedId) {
                setMilestones((prev) => prev.filter((m) => m.id !== deletedId));
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

  return { milestones, isLoading, reload: load };
}

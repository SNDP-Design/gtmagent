'use client';

import { useEffect, useState, useCallback, useRef } from 'react';
import { createClient } from '@/lib/supabase/client';
import { copyHistoryService, type CopyHistoryItem } from '@/lib/services/copyHistoryService';

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

/**
 * useCopyHistoryRealtime
 *
 * Loads all copy history items for the current user and subscribes to
 * Supabase Realtime so INSERT / UPDATE / DELETE events on `copy_history`
 * are reflected immediately across all tabs and devices without a refresh.
 */
export function useCopyHistoryRealtime() {
  const [history, setHistory] = useState<CopyHistoryItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const channelRef = useRef<ReturnType<ReturnType<typeof createClient>['channel']> | null>(null);

  const load = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await copyHistoryService.getAll();
      setHistory(data);
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
        .channel(`copy_history:user:${user.id}`)
        .on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table: 'copy_history',
            filter: `user_id=eq.${user.id}`,
          },
          (payload) => {
            if (cancelled) return;
            const { eventType, new: newRow, old: oldRow } = payload;

            if (eventType === 'INSERT') {
              const inserted = toCopyHistoryItem(newRow);
              setHistory((prev) => {
                if (prev.some((h) => h.id === inserted.id)) return prev;
                // Insert sorted by score descending
                const next = [inserted, ...prev];
                return next.sort((a, b) => b.score - a.score);
              });
            } else if (eventType === 'UPDATE') {
              const updated = toCopyHistoryItem(newRow);
              setHistory((prev) =>
                prev.map((h) => (h.id === updated.id ? updated : h))
              );
            } else if (eventType === 'DELETE') {
              const deletedId = (oldRow as any)?.id;
              if (deletedId) {
                setHistory((prev) => prev.filter((h) => h.id !== deletedId));
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

  return { history, isLoading, reload: load };
}

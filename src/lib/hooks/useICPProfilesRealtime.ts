'use client';

import { useEffect, useState, useCallback, useRef } from 'react';
import { createClient } from '@/lib/supabase/client';
import { icpProfileService, type ICPProfile } from '@/lib/services/icpProfileService';

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

/**
 * useICPProfilesRealtime
 *
 * Loads all ICP profiles for the current user and subscribes to Supabase
 * Realtime so INSERT / UPDATE / DELETE events on the `icp_profiles` table
 * are reflected immediately across all tabs and devices without a refresh.
 */
export function useICPProfilesRealtime() {
  const [profiles, setProfiles] = useState<ICPProfile[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const channelRef = useRef<ReturnType<ReturnType<typeof createClient>['channel']> | null>(null);

  const load = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await icpProfileService.getAll();
      setProfiles(data);
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
        .channel(`icp_profiles:user:${user.id}`)
        .on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table: 'icp_profiles',
            filter: `user_id=eq.${user.id}`,
          },
          (payload) => {
            if (cancelled) return;
            const { eventType, new: newRow, old: oldRow } = payload;

            if (eventType === 'INSERT') {
              const inserted = toICPProfile(newRow);
              setProfiles((prev) => {
                if (prev.some((p) => p.id === inserted.id)) return prev;
                // Maintain fit_score descending
                const next = [...prev, inserted];
                return next.sort((a, b) => b.fitScore - a.fitScore);
              });
            } else if (eventType === 'UPDATE') {
              const updated = toICPProfile(newRow);
              setProfiles((prev) =>
                prev.map((p) => (p.id === updated.id ? updated : p))
              );
            } else if (eventType === 'DELETE') {
              const deletedId = (oldRow as any)?.id;
              if (deletedId) {
                setProfiles((prev) => prev.filter((p) => p.id !== deletedId));
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

  return { profiles, isLoading, reload: load };
}

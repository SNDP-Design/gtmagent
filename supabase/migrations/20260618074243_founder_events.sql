-- GTM Fox: Founder Events Tracking
-- Logs founder actions: strategy sections completed, experiments logged, copy variants generated

-- ============================================================
-- 1. FOUNDER EVENTS TABLE
-- ============================================================
CREATE TABLE IF NOT EXISTS public.founder_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.user_profiles(id) ON DELETE CASCADE,
  event_type TEXT NOT NULL,
  event_category TEXT NOT NULL DEFAULT '',
  metadata JSONB NOT NULL DEFAULT '{}'::JSONB,
  created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- ============================================================
-- 2. INDEXES
-- ============================================================
CREATE INDEX IF NOT EXISTS idx_founder_events_user_id ON public.founder_events(user_id);
CREATE INDEX IF NOT EXISTS idx_founder_events_event_type ON public.founder_events(event_type);
CREATE INDEX IF NOT EXISTS idx_founder_events_created_at ON public.founder_events(created_at DESC);

-- ============================================================
-- 3. ENABLE RLS
-- ============================================================
ALTER TABLE public.founder_events ENABLE ROW LEVEL SECURITY;

-- ============================================================
-- 4. RLS POLICIES
-- ============================================================
DROP POLICY IF EXISTS "users_manage_own_founder_events" ON public.founder_events;
CREATE POLICY "users_manage_own_founder_events"
ON public.founder_events FOR ALL TO authenticated
USING (user_id = auth.uid())
WITH CHECK (user_id = auth.uid());

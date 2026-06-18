-- GTM Fox: Initial Schema Migration
-- Tables: user_profiles, experiments, copy_history, icp_profiles, milestones

-- ============================================================
-- 1. TYPES
-- ============================================================
DROP TYPE IF EXISTS public.experiment_status CASCADE;
CREATE TYPE public.experiment_status AS ENUM ('Running', 'Planned', 'Completed', 'Archived');

DROP TYPE IF EXISTS public.signal_strength CASCADE;
CREATE TYPE public.signal_strength AS ENUM ('Strong', 'Moderate', 'Weak', 'No Signal', 'None');

DROP TYPE IF EXISTS public.milestone_status CASCADE;
CREATE TYPE public.milestone_status AS ENUM ('done', 'in-progress', 'todo', 'blocked');

-- ============================================================
-- 2. CORE TABLES
-- ============================================================

-- User profiles (intermediary for auth.users)
CREATE TABLE IF NOT EXISTS public.user_profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL UNIQUE,
  full_name TEXT NOT NULL DEFAULT '',
  startup_name TEXT DEFAULT '',
  stage TEXT DEFAULT '',
  avatar_url TEXT DEFAULT '',
  created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- Experiments
CREATE TABLE IF NOT EXISTS public.experiments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.user_profiles(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  channel TEXT NOT NULL DEFAULT '',
  icp_target TEXT NOT NULL DEFAULT '',
  hypothesis TEXT NOT NULL DEFAULT '',
  status public.experiment_status NOT NULL DEFAULT 'Planned'::public.experiment_status,
  sent INTEGER NOT NULL DEFAULT 0,
  replies INTEGER NOT NULL DEFAULT 0,
  conversions INTEGER NOT NULL DEFAULT 0,
  signal public.signal_strength NOT NULL DEFAULT 'None'::public.signal_strength,
  start_date TEXT DEFAULT '',
  last_updated TEXT DEFAULT '',
  created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- Copy history / library
CREATE TABLE IF NOT EXISTS public.copy_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.user_profiles(id) ON DELETE CASCADE,
  label TEXT NOT NULL,
  copy_type TEXT NOT NULL DEFAULT '',
  icp TEXT NOT NULL DEFAULT '',
  tone TEXT NOT NULL DEFAULT '',
  score INTEGER NOT NULL DEFAULT 0,
  usage_count INTEGER NOT NULL DEFAULT 0,
  reply_rate TEXT DEFAULT '—',
  body TEXT DEFAULT '',
  subject TEXT DEFAULT '',
  saved_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
  created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- ICP profiles
CREATE TABLE IF NOT EXISTS public.icp_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.user_profiles(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  fit_score INTEGER NOT NULL DEFAULT 0,
  industry TEXT NOT NULL DEFAULT '',
  role TEXT NOT NULL DEFAULT '',
  company_size TEXT NOT NULL DEFAULT '',
  budget TEXT NOT NULL DEFAULT '',
  stage TEXT NOT NULL DEFAULT '',
  pain_points JSONB NOT NULL DEFAULT '[]'::JSONB,
  buyer_signals JSONB NOT NULL DEFAULT '[]'::JSONB,
  channels JSONB NOT NULL DEFAULT '[]'::JSONB,
  quote TEXT DEFAULT '',
  saved BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- Milestones
CREATE TABLE IF NOT EXISTS public.milestones (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.user_profiles(id) ON DELETE CASCADE,
  label TEXT NOT NULL,
  status public.milestone_status NOT NULL DEFAULT 'todo'::public.milestone_status,
  due_date TEXT DEFAULT '',
  progress INTEGER DEFAULT NULL,
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- ============================================================
-- 3. INDEXES
-- ============================================================
CREATE INDEX IF NOT EXISTS idx_experiments_user_id ON public.experiments(user_id);
CREATE INDEX IF NOT EXISTS idx_experiments_status ON public.experiments(status);
CREATE INDEX IF NOT EXISTS idx_copy_history_user_id ON public.copy_history(user_id);
CREATE INDEX IF NOT EXISTS idx_icp_profiles_user_id ON public.icp_profiles(user_id);
CREATE INDEX IF NOT EXISTS idx_milestones_user_id ON public.milestones(user_id);
CREATE INDEX IF NOT EXISTS idx_milestones_sort_order ON public.milestones(sort_order);

-- ============================================================
-- 4. FUNCTIONS (must be before RLS policies)
-- ============================================================

-- Auto-create user_profiles on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  INSERT INTO public.user_profiles (id, email, full_name, startup_name, stage, avatar_url)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', ''),
    COALESCE(NEW.raw_user_meta_data->>'startup_name', ''),
    COALESCE(NEW.raw_user_meta_data->>'stage', ''),
    COALESCE(NEW.raw_user_meta_data->>'avatar_url', '')
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$;

-- Auto-update updated_at timestamp
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = CURRENT_TIMESTAMP;
  RETURN NEW;
END;
$$;

-- ============================================================
-- 5. ENABLE RLS
-- ============================================================
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.experiments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.copy_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.icp_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.milestones ENABLE ROW LEVEL SECURITY;

-- ============================================================
-- 6. RLS POLICIES
-- ============================================================

-- user_profiles
DROP POLICY IF EXISTS "users_manage_own_user_profiles" ON public.user_profiles;
CREATE POLICY "users_manage_own_user_profiles"
ON public.user_profiles FOR ALL TO authenticated
USING (id = auth.uid())
WITH CHECK (id = auth.uid());

-- experiments
DROP POLICY IF EXISTS "users_manage_own_experiments" ON public.experiments;
CREATE POLICY "users_manage_own_experiments"
ON public.experiments FOR ALL TO authenticated
USING (user_id = auth.uid())
WITH CHECK (user_id = auth.uid());

-- copy_history
DROP POLICY IF EXISTS "users_manage_own_copy_history" ON public.copy_history;
CREATE POLICY "users_manage_own_copy_history"
ON public.copy_history FOR ALL TO authenticated
USING (user_id = auth.uid())
WITH CHECK (user_id = auth.uid());

-- icp_profiles
DROP POLICY IF EXISTS "users_manage_own_icp_profiles" ON public.icp_profiles;
CREATE POLICY "users_manage_own_icp_profiles"
ON public.icp_profiles FOR ALL TO authenticated
USING (user_id = auth.uid())
WITH CHECK (user_id = auth.uid());

-- milestones
DROP POLICY IF EXISTS "users_manage_own_milestones" ON public.milestones;
CREATE POLICY "users_manage_own_milestones"
ON public.milestones FOR ALL TO authenticated
USING (user_id = auth.uid())
WITH CHECK (user_id = auth.uid());

-- ============================================================
-- 7. TRIGGERS
-- ============================================================
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

DROP TRIGGER IF EXISTS set_user_profiles_updated_at ON public.user_profiles;
CREATE TRIGGER set_user_profiles_updated_at
  BEFORE UPDATE ON public.user_profiles
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

DROP TRIGGER IF EXISTS set_experiments_updated_at ON public.experiments;
CREATE TRIGGER set_experiments_updated_at
  BEFORE UPDATE ON public.experiments
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

DROP TRIGGER IF EXISTS set_icp_profiles_updated_at ON public.icp_profiles;
CREATE TRIGGER set_icp_profiles_updated_at
  BEFORE UPDATE ON public.icp_profiles
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

DROP TRIGGER IF EXISTS set_milestones_updated_at ON public.milestones;
CREATE TRIGGER set_milestones_updated_at
  BEFORE UPDATE ON public.milestones
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- ============================================================
-- 8. MOCK DATA (demo user + seed data)
-- ============================================================
DO $$
DECLARE
  demo_uuid UUID := gen_random_uuid();
BEGIN
  -- Create demo auth user (trigger will create user_profiles row)
  INSERT INTO auth.users (
    id, instance_id, aud, role, email, encrypted_password, email_confirmed_at,
    created_at, updated_at, raw_user_meta_data, raw_app_meta_data,
    is_sso_user, is_anonymous, confirmation_token, confirmation_sent_at,
    recovery_token, recovery_sent_at, email_change_token_new, email_change,
    email_change_sent_at, email_change_token_current, email_change_confirm_status,
    reauthentication_token, reauthentication_sent_at, phone, phone_change,
    phone_change_token, phone_change_sent_at
  ) VALUES (
    demo_uuid, '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated',
    'alex@buildwithgtm.co', crypt('gtm-launch-2026', gen_salt('bf', 10)), now(), now(), now(),
    jsonb_build_object('full_name', 'Alex Kim', 'startup_name', 'FormPilot', 'stage', 'MVP done — looking for first customers'),
    jsonb_build_object('provider', 'email', 'providers', ARRAY['email']::TEXT[]),
    false, false, '', null, '', null, '', '', null, '', 0, '', null, null, '', '', null
  ) ON CONFLICT (id) DO NOTHING;

  -- Seed experiments for demo user
  INSERT INTO public.experiments (id, user_id, name, channel, icp_target, hypothesis, status, sent, replies, conversions, signal, start_date, last_updated)
  VALUES
    (gen_random_uuid(), demo_uuid, 'LinkedIn DM — SaaS CTOs (Problem-Led)', 'LinkedIn DM', 'SaaS CTO', 'Problem-led opening gets higher reply than feature-led', 'Running'::public.experiment_status, 87, 16, 5, 'Strong'::public.signal_strength, 'Jun 10', 'Jun 18'),
    (gen_random_uuid(), demo_uuid, 'Cold Email — 3-Step Sequence (Curiosity Hook)', 'Cold Email', 'SaaS CTO', 'Curiosity subject lines outperform direct value prop', 'Running'::public.experiment_status, 124, 14, 3, 'Moderate'::public.signal_strength, 'Jun 8', 'Jun 17'),
    (gen_random_uuid(), demo_uuid, 'Warm Intro — Mutual LinkedIn Connections', 'Warm Intro', 'SaaS CTO', 'Warm intros via mutual connections convert 3x cold', 'Completed'::public.experiment_status, 41, 14, 7, 'Strong'::public.signal_strength, 'Jun 1', 'Jun 14'),
    (gen_random_uuid(), demo_uuid, 'IndieHackers Post — Build-in-Public Update', 'IndieHackers', 'Non-Technical Founder', 'Milestone posts drive more DMs than product posts', 'Completed'::public.experiment_status, 28, 6, 3, 'Moderate'::public.signal_strength, 'Jun 3', 'Jun 11'),
    (gen_random_uuid(), demo_uuid, 'Twitter/X Thread — GTM Mistakes Series', 'Twitter/X', 'SaaS CTO', 'Educational threads generate inbound DMs from ICP', 'Running'::public.experiment_status, 56, 3, 1, 'Weak'::public.signal_strength, 'Jun 12', 'Jun 16'),
    (gen_random_uuid(), demo_uuid, 'Reddit — r/SaaS Value-First Comments', 'Reddit', 'Non-Technical Founder', 'Helpful comments without selling drive profile visits', 'Archived'::public.experiment_status, 33, 2, 0, 'No Signal'::public.signal_strength, 'May 25', 'Jun 5')
  ON CONFLICT (id) DO NOTHING;

  -- Seed copy history for demo user
  INSERT INTO public.copy_history (id, user_id, label, copy_type, icp, tone, score, usage_count, reply_rate, saved_at)
  VALUES
    (gen_random_uuid(), demo_uuid, 'Variant A — Problem-Led', 'Cold Email', 'SaaS CTO', 'Direct', 87, 47, '14.3%', now() - interval '1 day'),
    (gen_random_uuid(), demo_uuid, 'LinkedIn DM — Curiosity Hook', 'LinkedIn DM', 'SaaS CTO', 'Curiosity-Driven', 81, 23, '21.7%', now() - interval '4 days'),
    (gen_random_uuid(), demo_uuid, 'Pitch Script — Discovery Call', 'Pitch Script', 'Non-Technical Founder', 'Friendly', 76, 8, '—', now() - interval '7 days'),
    (gen_random_uuid(), demo_uuid, 'Follow-up Email — Day 5', 'Follow-up Email', 'SaaS CTO', 'Direct', 72, 31, '9.7%', now() - interval '9 days'),
    (gen_random_uuid(), demo_uuid, 'LinkedIn DM — Social Proof', 'LinkedIn DM', 'Ex-Consultant Founder', 'Confident', 68, 15, '18.2%', now() - interval '12 days'),
    (gen_random_uuid(), demo_uuid, 'Cold Email — Warm Intro Follow-up', 'Cold Email', 'SaaS CTO', 'Empathetic', 83, 12, '25.0%', now() - interval '14 days')
  ON CONFLICT (id) DO NOTHING;

  -- Seed ICP profiles for demo user
  INSERT INTO public.icp_profiles (id, user_id, name, fit_score, industry, role, company_size, budget, stage, pain_points, buyer_signals, channels, quote, saved)
  VALUES
    (gen_random_uuid(), demo_uuid, 'SaaS CTO at Early-Stage Startup', 94, 'B2B SaaS', 'CTO / VP Engineering', '10–50 employees', '$200–$500/mo for tools', 'Primary ICP',
      '["No dedicated marketing or sales team","Technically strong but GTM-naive","Has shipped product, struggling to get first 10 customers","Overwhelmed by conflicting GTM advice online"]'::JSONB,
      '["Posted on IndieHackers about customer acquisition","LinkedIn headline says building in public","Active in SaaS Slack communities"]'::JSONB,
      '["LinkedIn DM","IndieHackers","Warm Intro"]'::JSONB,
      'I have no idea how to sell. I can build anything but I cannot get anyone to pay for it.', true),
    (gen_random_uuid(), demo_uuid, 'Non-Technical Solo Founder', 78, 'B2B SaaS / Services', 'Founder / CEO', '1–5 employees', '$50–$200/mo for tools', 'Secondary ICP',
      '["Can sell but does not know how to scale outreach","Has tried cold email but got poor results","Needs templates and frameworks, not theory","Time-constrained — wears all hats"]'::JSONB,
      '["Follows GTM influencers on Twitter/X","Searches for cold email templates for SaaS","In founder communities on Slack/Discord"]'::JSONB,
      '["Twitter/X","Cold Email","Product Hunt"]'::JSONB,
      'I can close deals when I get a call, but I cannot figure out how to book the calls in the first place.', false),
    (gen_random_uuid(), demo_uuid, 'Ex-Consultant Turned Founder', 65, 'Consulting / Professional Services SaaS', 'Founder', '1–3 employees', '$100–$300/mo for tools', 'Tertiary ICP',
      '["Knows strategy but lacks execution tools","Has a network but not productized outreach","Overcomplicates GTM with frameworks","Needs accountability and tracking"]'::JSONB,
      '["MBA background, analytical","Writes about entrepreneurship on LinkedIn","Follows startup accelerator content"]'::JSONB,
      '["LinkedIn DM","Warm Intro","Email Newsletter"]'::JSONB,
      'I have built 20 GTM decks for clients but cannot build one for myself without it feeling fake.', false)
  ON CONFLICT (id) DO NOTHING;

  -- Seed milestones for demo user
  INSERT INTO public.milestones (id, user_id, label, status, due_date, progress, sort_order)
  VALUES
    (gen_random_uuid(), demo_uuid, 'Define ICP (Ideal Customer Profile)', 'done'::public.milestone_status, 'Jun 5', NULL, 1),
    (gen_random_uuid(), demo_uuid, 'Complete AI Strategy Builder', 'done'::public.milestone_status, 'Jun 8', NULL, 2),
    (gen_random_uuid(), demo_uuid, 'Write first cold email sequence', 'done'::public.milestone_status, 'Jun 10', NULL, 3),
    (gen_random_uuid(), demo_uuid, 'Launch LinkedIn outreach experiment', 'in-progress'::public.milestone_status, 'Jun 20', NULL, 4),
    (gen_random_uuid(), demo_uuid, 'Reach 100 outreach touches', 'in-progress'::public.milestone_status, 'Jun 22', 72, 5),
    (gen_random_uuid(), demo_uuid, 'Book 5 discovery calls', 'todo'::public.milestone_status, 'Jun 28', NULL, 6),
    (gen_random_uuid(), demo_uuid, 'Validate pricing with 3 prospects', 'todo'::public.milestone_status, 'Jul 2', NULL, 7),
    (gen_random_uuid(), demo_uuid, 'Publish landing page with social proof', 'blocked'::public.milestone_status, 'Jul 5', NULL, 8),
    (gen_random_uuid(), demo_uuid, 'Close first paying customer', 'todo'::public.milestone_status, 'Jul 8', NULL, 9)
  ON CONFLICT (id) DO NOTHING;

EXCEPTION
  WHEN OTHERS THEN
    RAISE NOTICE 'Mock data insertion failed: %', SQLERRM;
END $$;

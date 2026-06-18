-- GTM Fox: Add ROI metrics columns to experiments table
-- Adds: cost_per_message (cost per outreach sent), revenue_attributed, win_rate

ALTER TABLE public.experiments
  ADD COLUMN IF NOT EXISTS cost_per_message NUMERIC(10,2) DEFAULT 0,
  ADD COLUMN IF NOT EXISTS revenue_attributed NUMERIC(10,2) DEFAULT 0,
  ADD COLUMN IF NOT EXISTS win_rate NUMERIC(5,2) DEFAULT 0;

-- Backfill win_rate for existing rows that have sent > 0
UPDATE public.experiments
SET win_rate = ROUND((conversions::NUMERIC / NULLIF(sent, 0)) * 100, 2)
WHERE sent > 0 AND win_rate = 0;

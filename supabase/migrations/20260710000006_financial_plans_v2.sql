-- =============================================================
-- Herizon — Stage 2G: Financial Compass AI Integration
-- Migration: 20260710000006_financial_plans_v2
--
-- Non-destructive extensions to financial_plans table.
-- Adds queryable fields for employment type, goal details,
-- target amount, timeline, and input_hash for cache detection.
-- The full generated plan continues to live in plan_json.
-- =============================================================

ALTER TABLE public.financial_plans
  ADD COLUMN IF NOT EXISTS employment_type  TEXT,
  ADD COLUMN IF NOT EXISTS goal_details     TEXT,
  ADD COLUMN IF NOT EXISTS target_amount    NUMERIC(14,2),
  ADD COLUMN IF NOT EXISTS target_timeline  TEXT,
  ADD COLUMN IF NOT EXISTS model_used       TEXT,
  ADD COLUMN IF NOT EXISTS prompt_version   TEXT,
  ADD COLUMN IF NOT EXISTS input_hash       TEXT;

-- Index on input_hash for fast cache-hit checks
CREATE INDEX IF NOT EXISTS idx_financial_plans_input_hash
  ON public.financial_plans(user_id, input_hash)
  WHERE input_hash IS NOT NULL;

-- =============================================================
-- END OF MIGRATION
-- =============================================================

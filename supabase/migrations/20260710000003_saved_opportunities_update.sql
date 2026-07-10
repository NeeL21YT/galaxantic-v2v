-- =============================================================
-- Herizon — Stage 2D: Saved Opportunities Schema Update
-- Migration: 20260710000003_saved_opportunities_update
--
-- Non-destructive additions to saved_opportunities:
--   • opportunity_id  — dataset reference (JSON file ID)
--   • ai_notes        — AI ranking metadata stored separately
--                       from the static opportunity record
-- =============================================================

-- Add opportunity_id column (dataset key, not a foreign key
-- because the dataset lives in JSON files, not a DB table)
ALTER TABLE public.saved_opportunities
  ADD COLUMN IF NOT EXISTS opportunity_id TEXT;

-- Add ai_notes JSONB column for storing AI ranking metadata:
-- { matchScore, whyMatched, missingSkills, recommendedLearning,
--   priority, nextAction, modelUsed, rankingVersion, rankedAt }
ALTER TABLE public.saved_opportunities
  ADD COLUMN IF NOT EXISTS ai_notes JSONB;

-- Fast lookup: "is opportunity X bookmarked by this user?"
CREATE INDEX IF NOT EXISTS idx_saved_opportunities_opp_id
  ON public.saved_opportunities(user_id, opportunity_id);

-- =============================================================
-- END OF MIGRATION
-- =============================================================

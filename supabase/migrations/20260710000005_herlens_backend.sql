-- =============================================================
-- Herizon — Stage 2F: HerLens Backend
-- Migration: 20260710000005_herlens_backend
--
-- Non-destructive additions to herlens_news:
--   • original_url — canonical source URL for duplicate detection
--   • indexes for fast category and URL lookups
-- =============================================================

ALTER TABLE public.herlens_news
  ADD COLUMN IF NOT EXISTS original_url TEXT;

CREATE INDEX IF NOT EXISTS idx_herlens_news_original_url
  ON public.herlens_news(original_url)
  WHERE original_url IS NOT NULL;

CREATE INDEX IF NOT EXISTS idx_herlens_news_category_updated
  ON public.herlens_news(category, updated_at DESC);

-- =============================================================
-- END OF MIGRATION
-- =============================================================

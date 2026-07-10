-- =============================================================
-- Herizon — Initial Database Schema
-- Migration: 20260710000001_initial_schema
--
-- Creates all core tables with:
-- - Proper primary keys and foreign key constraints
-- - Automatic updated_at triggers
-- - Row Level Security (RLS) on every table
-- - Sensible defaults for all nullable columns
-- =============================================================

-- -------------------------------------------------------------
-- 0. EXTENSIONS
-- -------------------------------------------------------------
-- gen_random_uuid() requires pgcrypto (pre-installed on Supabase)
-- No additional extensions needed.

-- -------------------------------------------------------------
-- 1. HELPER — updated_at trigger function
-- -------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- -------------------------------------------------------------
-- 2. TABLE: profiles
-- -------------------------------------------------------------
-- One row per authenticated user. Created automatically after
-- email verification via the /auth/callback route handler.
-- auth_user_id references auth.users.id (managed by Supabase Auth).
-- -------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.profiles (
  id               UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  auth_user_id     UUID        UNIQUE NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  email            TEXT        NOT NULL,
  full_name        TEXT,
  education_level  TEXT,        -- 'high_school' | 'diploma' | 'undergraduate' | 'postgraduate' | 'phd' | 'other'
  career_stage     TEXT,        -- 'student' | 'career_break' | 'working' | 'freelancer' | 'entrepreneur'
  location         TEXT,
  bio              TEXT,
  skills           TEXT[]      DEFAULT '{}',
  interests        TEXT[]      DEFAULT '{}',
  onboarding_completed BOOLEAN DEFAULT FALSE,
  created_at       TIMESTAMPTZ DEFAULT NOW(),
  updated_at       TIMESTAMPTZ DEFAULT NOW()
);

-- Index for fast lookups by Supabase Auth user ID
CREATE INDEX IF NOT EXISTS idx_profiles_auth_user_id ON public.profiles(auth_user_id);

-- Auto-update updated_at on every UPDATE
CREATE TRIGGER profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- RLS: Enable
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Policy: Users can only SELECT their own profile
CREATE POLICY "profiles_select_own"
  ON public.profiles FOR SELECT
  USING (auth_user_id = auth.uid());

-- Policy: Users can only UPDATE their own profile
CREATE POLICY "profiles_update_own"
  ON public.profiles FOR UPDATE
  USING (auth_user_id = auth.uid())
  WITH CHECK (auth_user_id = auth.uid());

-- Policy: Allow INSERT from auth callback (service role bypasses RLS, but
-- the anon client in the callback has a live session, so allow authenticated insert
-- only for the user's own row).
CREATE POLICY "profiles_insert_own"
  ON public.profiles FOR INSERT
  WITH CHECK (auth_user_id = auth.uid());

-- -------------------------------------------------------------
-- 3. TABLE: resumes
-- -------------------------------------------------------------
-- Stores resume file metadata. File bytes live in Supabase Storage
-- (Stage 2C). analysis_status tracks the AI processing pipeline.
-- -------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.resumes (
  id               UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id          UUID        NOT NULL REFERENCES public.profiles(auth_user_id) ON DELETE CASCADE,
  file_name        TEXT,
  file_path        TEXT,        -- Storage path: resumes/{user_id}/{uuid}.pdf
  file_size        BIGINT,      -- Bytes
  file_type        TEXT,        -- MIME type, e.g. 'application/pdf'
  analysis_status  TEXT        NOT NULL DEFAULT 'pending',  -- 'pending' | 'processing' | 'analyzed' | 'failed'
  resume_score     INTEGER,     -- 0–100, set after AI analysis
  uploaded_at      TIMESTAMPTZ DEFAULT NOW(),
  created_at       TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_resumes_user_id ON public.resumes(user_id);

ALTER TABLE public.resumes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "resumes_select_own"
  ON public.resumes FOR SELECT
  USING (user_id = auth.uid());

CREATE POLICY "resumes_insert_own"
  ON public.resumes FOR INSERT
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "resumes_update_own"
  ON public.resumes FOR UPDATE
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "resumes_delete_own"
  ON public.resumes FOR DELETE
  USING (user_id = auth.uid());

-- -------------------------------------------------------------
-- 4. TABLE: career_roadmaps
-- -------------------------------------------------------------
-- Stores AI-generated career roadmaps as JSONB.
-- roadmap_json contains milestones, phases, tasks.
-- (AI generation is Stage 2C+; this table is the storage layer.)
-- -------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.career_roadmaps (
  id               UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id          UUID        NOT NULL REFERENCES public.profiles(auth_user_id) ON DELETE CASCADE,
  goal             TEXT,
  current_stage    TEXT,
  roadmap_json     JSONB,       -- { milestones: [...], phases: [...] }
  created_at       TIMESTAMPTZ DEFAULT NOW(),
  updated_at       TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_career_roadmaps_user_id ON public.career_roadmaps(user_id);

CREATE TRIGGER career_roadmaps_updated_at
  BEFORE UPDATE ON public.career_roadmaps
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

ALTER TABLE public.career_roadmaps ENABLE ROW LEVEL SECURITY;

CREATE POLICY "career_roadmaps_select_own"
  ON public.career_roadmaps FOR SELECT
  USING (user_id = auth.uid());

CREATE POLICY "career_roadmaps_insert_own"
  ON public.career_roadmaps FOR INSERT
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "career_roadmaps_update_own"
  ON public.career_roadmaps FOR UPDATE
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "career_roadmaps_delete_own"
  ON public.career_roadmaps FOR DELETE
  USING (user_id = auth.uid());

-- -------------------------------------------------------------
-- 5. TABLE: saved_opportunities
-- -------------------------------------------------------------
-- User bookmarks for jobs, scholarships, hackathons etc.
-- Sourced from external APIs (Stage 2C+); this table stores the
-- saved snapshot so bookmarks persist without re-fetching.
-- -------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.saved_opportunities (
  id               UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id          UUID        NOT NULL REFERENCES public.profiles(auth_user_id) ON DELETE CASCADE,
  title            TEXT,
  organization     TEXT,
  category         TEXT,        -- 'job' | 'scholarship' | 'hackathon' | 'fellowship' | 'grant'
  deadline         TIMESTAMPTZ,
  url              TEXT,
  saved_at         TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_saved_opportunities_user_id ON public.saved_opportunities(user_id);

ALTER TABLE public.saved_opportunities ENABLE ROW LEVEL SECURITY;

CREATE POLICY "saved_opportunities_select_own"
  ON public.saved_opportunities FOR SELECT
  USING (user_id = auth.uid());

CREATE POLICY "saved_opportunities_insert_own"
  ON public.saved_opportunities FOR INSERT
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "saved_opportunities_update_own"
  ON public.saved_opportunities FOR UPDATE
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "saved_opportunities_delete_own"
  ON public.saved_opportunities FOR DELETE
  USING (user_id = auth.uid());

-- -------------------------------------------------------------
-- 6. TABLE: financial_plans
-- -------------------------------------------------------------
-- One active financial plan per user (upsert on update).
-- plan_json stores AI-generated budget allocations and action steps.
-- -------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.financial_plans (
  id               UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id          UUID        NOT NULL REFERENCES public.profiles(auth_user_id) ON DELETE CASCADE,
  monthly_income   NUMERIC(12,2),
  monthly_expenses NUMERIC(12,2),
  current_savings  NUMERIC(12,2),
  goal             TEXT,
  plan_json        JSONB,       -- { allocations: [...], recommendations: [...], action_steps: [...] }
  updated_at       TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_financial_plans_user_id ON public.financial_plans(user_id);

CREATE TRIGGER financial_plans_updated_at
  BEFORE UPDATE ON public.financial_plans
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

ALTER TABLE public.financial_plans ENABLE ROW LEVEL SECURITY;

CREATE POLICY "financial_plans_select_own"
  ON public.financial_plans FOR SELECT
  USING (user_id = auth.uid());

CREATE POLICY "financial_plans_insert_own"
  ON public.financial_plans FOR INSERT
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "financial_plans_update_own"
  ON public.financial_plans FOR UPDATE
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "financial_plans_delete_own"
  ON public.financial_plans FOR DELETE
  USING (user_id = auth.uid());

-- -------------------------------------------------------------
-- 7. TABLE: herlens_news
-- -------------------------------------------------------------
-- Stores curated news articles for the HerLens feed.
-- Populated by a server-side cron job (Stage 2C+) using NewsData.io.
-- All authenticated users can read; only the service role can write.
-- -------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.herlens_news (
  id               UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  category         TEXT,        -- NewsCategory enum value
  title            TEXT        NOT NULL,
  summary          TEXT,        -- ≤90 words AI summary
  key_takeaways    JSONB,       -- string[]
  source           TEXT,
  published_at     TIMESTAMPTZ,
  updated_at       TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_herlens_news_category ON public.herlens_news(category);
CREATE INDEX IF NOT EXISTS idx_herlens_news_published_at ON public.herlens_news(published_at DESC);

CREATE TRIGGER herlens_news_updated_at
  BEFORE UPDATE ON public.herlens_news
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

ALTER TABLE public.herlens_news ENABLE ROW LEVEL SECURITY;

-- Readable by ALL authenticated users (public news feed)
CREATE POLICY "herlens_news_select_authenticated"
  ON public.herlens_news FOR SELECT
  TO authenticated
  USING (TRUE);

-- Write reserved for service role (bypasses RLS) — no anon/authenticated INSERT policy.
-- Stage 2C will use SUPABASE_SERVICE_ROLE_KEY in the cron job.

-- =============================================================
-- END OF MIGRATION
-- =============================================================

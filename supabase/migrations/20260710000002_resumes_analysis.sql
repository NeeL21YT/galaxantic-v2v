-- =============================================================
-- Migration: 20260710000002_resumes_analysis.sql
--
-- Purpose:
--   1. Extend the resumes table with AI analysis columns,
--      text extraction columns, and deduplication support.
--   2. Expand analysis_status to include all pipeline stages.
--   3. Add updated_at trigger to resumes.
--   4. Create the `resumes` Supabase Storage bucket.
--   5. Add RLS policies for the storage bucket.
--
-- IMPORTANT: Run this migration against your Supabase project
-- via the SQL editor or `supabase db push`.
-- =============================================================

-- ── 1. Add new columns to public.resumes ──────────────────────

ALTER TABLE public.resumes
  -- Full text extracted from the uploaded file
  ADD COLUMN IF NOT EXISTS extracted_text     TEXT,

  -- SHA-256 hex of extracted_text — used for deduplication
  ADD COLUMN IF NOT EXISTS text_hash          TEXT,

  -- Structured Gemini response stored as JSONB
  ADD COLUMN IF NOT EXISTS analysis_json      JSONB,

  -- ATS score (0–100) from Gemini
  ADD COLUMN IF NOT EXISTS ats_score          INTEGER,

  -- Career readiness score (0–100) from Gemini
  ADD COLUMN IF NOT EXISTS career_readiness   INTEGER,

  -- Gemini model name used for analysis, e.g. 'gemini-2.5-flash'
  ADD COLUMN IF NOT EXISTS model_used         TEXT,

  -- Analysis schema version for future migrations
  ADD COLUMN IF NOT EXISTS analysis_version   TEXT DEFAULT '1.0',

  -- Wall-clock milliseconds for the Gemini call
  ADD COLUMN IF NOT EXISTS analysis_duration_ms INTEGER,

  -- Timestamp when Gemini analysis completed
  ADD COLUMN IF NOT EXISTS analyzed_at        TIMESTAMPTZ,

  -- Tracks when this row was last touched
  ADD COLUMN IF NOT EXISTS updated_at         TIMESTAMPTZ DEFAULT NOW();

-- Expand analysis_status beyond the original 4 values.
-- Drop the old check constraint if it exists, then recreate.
ALTER TABLE public.resumes
  DROP CONSTRAINT IF EXISTS resumes_analysis_status_check;

ALTER TABLE public.resumes
  ADD CONSTRAINT resumes_analysis_status_check
    CHECK (analysis_status IN (
      'uploading',   -- file upload in progress
      'uploaded',    -- file stored in Storage
      'extracting',  -- text extraction in progress
      'analyzing',   -- Gemini call in progress
      'completed',   -- full pipeline succeeded
      'failed',      -- any stage failed
      -- legacy values kept for backward-compat
      'pending',
      'processing',
      'analyzed'
    ));

-- ── 2. Add updated_at trigger to resumes ──────────────────────

-- Reuse the existing handle_updated_at function from migration 1
CREATE TRIGGER resumes_updated_at
  BEFORE UPDATE ON public.resumes
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- Index on text_hash for deduplication lookups
CREATE INDEX IF NOT EXISTS idx_resumes_text_hash
  ON public.resumes(text_hash)
  WHERE text_hash IS NOT NULL;

-- Index on analysis_status for filtering
CREATE INDEX IF NOT EXISTS idx_resumes_status
  ON public.resumes(analysis_status);

-- ── 3. Create `resumes` Supabase Storage bucket ───────────────

-- Private bucket; 10 MB per file; only PDF and DOCX accepted.
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'resumes',
  'resumes',
  false,
  10485760,   -- 10 MB
  ARRAY[
    'application/pdf',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
  ]
)
ON CONFLICT (id) DO NOTHING;

-- ── 4. Storage RLS policies ───────────────────────────────────
-- Path convention: {user_id}/{timestamp}_{filename}
-- The first folder segment must equal auth.uid().

-- Allow authenticated users to upload their own resumes
CREATE POLICY "resumes_storage_insert_own"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'resumes'
    AND auth.uid()::text = (storage.foldername(name))[1]
  );

-- Allow authenticated users to read their own resumes
CREATE POLICY "resumes_storage_select_own"
  ON storage.objects FOR SELECT
  USING (
    bucket_id = 'resumes'
    AND auth.uid()::text = (storage.foldername(name))[1]
  );

-- Allow authenticated users to delete their own resumes
CREATE POLICY "resumes_storage_delete_own"
  ON storage.objects FOR DELETE
  USING (
    bucket_id = 'resumes'
    AND auth.uid()::text = (storage.foldername(name))[1]
  );

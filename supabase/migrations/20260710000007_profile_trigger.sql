-- =============================================================
-- Migration: 20260710000007_profile_trigger.sql
-- 
-- Fix for Cross-Browser PKCE Auth Failures.
-- Ensures that a `public.profiles` row is ALWAYS created when an 
-- `auth.users` row is created, even if the user verifies their email 
-- on a different browser/device and the /auth/callback fails to complete.
-- =============================================================

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (auth_user_id, email, full_name)
  VALUES (
    new.id,
    new.email,
    new.raw_user_meta_data->>'full_name'
  )
  -- The /auth/callback route also tries to upsert the profile. 
  -- If this trigger fires first (or second), we gracefully handle collisions.
  ON CONFLICT (auth_user_id) DO NOTHING;
  
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Drop if exists for idempotency
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

-- Attach trigger
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

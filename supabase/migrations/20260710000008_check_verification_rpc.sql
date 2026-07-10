-- =============================================================
-- Migration: 20260710000008_check_verification_rpc.sql
-- 
-- Adds a secure RPC function to check if a user's email is verified.
-- This bypasses RLS and allows the frontend to poll for verification
-- without hitting auth rate limits or exposing sensitive auth data.
-- =============================================================

CREATE OR REPLACE FUNCTION public.check_email_verified(p_email text)
RETURNS boolean AS $$
DECLARE
  v_confirmed_at timestamptz;
BEGIN
  SELECT email_confirmed_at INTO v_confirmed_at
  FROM auth.users
  WHERE email = p_email
  LIMIT 1;
  
  RETURN v_confirmed_at IS NOT NULL;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

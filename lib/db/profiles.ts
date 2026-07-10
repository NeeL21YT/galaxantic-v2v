/**
 * lib/db/profiles.ts
 *
 * Database helper functions for the `profiles` table.
 *
 * These are thin data-access wrappers — no business logic.
 * All functions run server-side only (Server Components, Server Actions,
 * Route Handlers). Never import from client components.
 *
 * Error handling: Functions return null on not-found or auth errors.
 * Callers decide whether to redirect, throw, or show an error state.
 */

import { createClient } from "@/lib/supabase/server";
import type { Profile, ProfileInsert, ProfileUpdate } from "@/types/database";

/* ── Get Profile ────────────────────────────────────────────── */

/**
 * Fetches the profile row for the currently authenticated user.
 * Returns null if not found or the user is not authenticated.
 */
export async function getProfile(): Promise<Profile | null> {
  const supabase = await createClient();

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) return null;

  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("auth_user_id", user.id)
    .single();

  if (error || !data) return null;

  return data as Profile;
}

/**
 * Fetches a profile by Supabase auth user ID.
 * Used in server contexts where the user ID is already known.
 */
export async function getProfileByUserId(
  authUserId: string
): Promise<Profile | null> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("auth_user_id", authUserId)
    .single();

  if (error || !data) return null;

  return data as Profile;
}

/* ── Create Profile ─────────────────────────────────────────── */

/**
 * Creates a new profile row.
 * Uses upsert to safely handle the case where the callback fires
 * more than once (idempotent).
 *
 * Called from the /auth/callback route after email verification.
 */
export async function createProfile(
  insert: ProfileInsert
): Promise<Profile | null> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("profiles")
    .upsert(
      {
        auth_user_id: insert.auth_user_id,
        email: insert.email,
        full_name: insert.full_name ?? null,
      },
      {
        onConflict: "auth_user_id",
        ignoreDuplicates: false, // update email/name if they've changed
      }
    )
    .select()
    .single();

  if (error || !data) {
    console.error("[db/profiles] createProfile error:", error?.message);
    return null;
  }

  return data as Profile;
}

/* ── Update Profile ─────────────────────────────────────────── */

/**
 * Updates the currently authenticated user's profile.
 * Only modifies the fields explicitly passed in `updates`.
 * Returns the updated profile row on success, null on failure.
 */
export async function updateProfile(
  updates: ProfileUpdate
): Promise<Profile | null> {
  const supabase = await createClient();

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) return null;

  const { data, error } = await supabase
    .from("profiles")
    .update(updates)
    .eq("auth_user_id", user.id)
    .select()
    .single();

  if (error || !data) {
    console.error("[db/profiles] updateProfile error:", error?.message);
    return null;
  }

  return data as Profile;
}

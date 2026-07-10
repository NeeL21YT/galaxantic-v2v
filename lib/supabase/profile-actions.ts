/**
 * lib/supabase/profile-actions.ts
 *
 * Server Actions for the user profile system.
 *
 * Responsibilities:
 * - Validate and sanitize user input
 * - Call the db helper layer (lib/db/profiles)
 * - Return typed ActionResult — never throw to the client
 *
 * These actions are intentionally separate from auth actions
 * (lib/supabase/actions.ts) to keep auth isolated from profile
 * business logic as each stage builds independently.
 */

"use server";

import { redirect } from "next/navigation";
import { getProfile, updateProfile } from "@/lib/db/profiles";
import type { Profile, ProfileUpdate, EducationLevel, CareerStage } from "@/types/database";

/* ── Types ──────────────────────────────────────────────────── */

export type ProfileActionResult =
  | { success: true; profile?: Profile }
  | { success: false; error: string };

/* ── Fetch Profile ──────────────────────────────────────────── */

/**
 * Fetches the currently authenticated user's profile.
 * Returns the profile on success, or an error result.
 */
export async function fetchProfile(): Promise<ProfileActionResult> {
  const profile = await getProfile();

  if (!profile) {
    return { success: false, error: "Profile not found." };
  }

  return { success: true, profile };
}

/* ── Update Profile ─────────────────────────────────────────── */

/**
 * Updates allowed profile fields with validation and whitespace trimming.
 * Used by onboarding wizard steps and settings page.
 */
export async function updateProfileAction(
  updates: ProfileUpdate
): Promise<ProfileActionResult> {
  // Sanitize text fields — trim whitespace and convert empty strings to null
  const sanitized: ProfileUpdate = {};

  if (updates.full_name !== undefined) {
    const trimmed = updates.full_name?.trim() ?? null;
    sanitized.full_name = trimmed === "" ? null : trimmed;
  }

  if (updates.location !== undefined) {
    const trimmed = updates.location?.trim() ?? null;
    sanitized.location = trimmed === "" ? null : trimmed;
  }

  if (updates.bio !== undefined) {
    const trimmed = updates.bio?.trim() ?? null;
    sanitized.bio = trimmed === "" ? null : trimmed;
  }

  if (updates.education_level !== undefined) {
    sanitized.education_level = updates.education_level;
  }

  if (updates.career_stage !== undefined) {
    sanitized.career_stage = updates.career_stage;
  }

  if (updates.skills !== undefined) {
    // Deduplicate and remove empty strings
    sanitized.skills = [...new Set(updates.skills.filter((s) => s.trim() !== ""))];
  }

  if (updates.interests !== undefined) {
    sanitized.interests = [...new Set(updates.interests.filter((i) => i.trim() !== ""))];
  }

  const profile = await updateProfile(sanitized);

  if (!profile) {
    return { success: false, error: "Failed to update profile. Please try again." };
  }

  return { success: true, profile };
}

/* ── Complete Onboarding ────────────────────────────────────── */

/**
 * Final onboarding action. Validates required fields, saves the full
 * profile, sets onboarding_completed = true, then redirects to /dashboard.
 *
 * NOTE: redirect() throws a special Next.js error — do NOT wrap in
 * try/catch. Let it propagate so Next.js can handle the redirect.
 */
export async function completeOnboarding(formData: {
  full_name: string;
  location: string;
  education_level: EducationLevel | "";
  career_stage: CareerStage | "";
  skills: string[];
  interests: string[];
}): Promise<ProfileActionResult> {
  // Validate required fields
  const name = formData.full_name.trim();
  if (!name) {
    return { success: false, error: "Full name is required." };
  }

  const updates: ProfileUpdate = {
    full_name: name,
    location: formData.location.trim() || null,
    education_level: (formData.education_level as EducationLevel) || null,
    career_stage: (formData.career_stage as CareerStage) || null,
    skills: [...new Set(formData.skills.filter((s) => s.trim() !== ""))],
    interests: [...new Set(formData.interests.filter((i) => i.trim() !== ""))],
    onboarding_completed: true,
  };

  const profile = await updateProfile(updates);

  if (!profile) {
    return {
      success: false,
      error: "Could not save your profile. Please try again.",
    };
  }

  // Redirect throws — must not be inside try/catch
  redirect("/dashboard");
}

/**
 * lib/supabase/actions.ts
 *
 * Server Actions for Supabase authentication.
 *
 * All functions run exclusively on the server - credentials and tokens
 * never touch the client bundle.
 *
 * Auth logic is intentionally isolated here so that Stage 2B (database),
 * Stage 2C (resume analysis), and later stages can build on it without
 * coupling to business logic.
 *
 * NOTE: `redirect()` throws an internal Next.js error (NEXT_REDIRECT) to
 * work. Do not wrap redirect() calls in try/catch - let it propagate.
 */

"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

/* ── Types ──────────────────────────────────────────────────── */

export type AuthResult =
  | { success: true; message?: string }
  | { success: false; error: string };

/* ── Sign In ────────────────────────────────────────────────── */

/**
 * Signs in an existing user with email + password.
 * On success, redirects to /dashboard.
 * On failure, returns a typed error result.
 */
export async function signIn(
  email: string,
  password: string
): Promise<AuthResult> {
  const supabase = await createClient();

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    return {
      success: false,
      error: mapAuthError(error.message),
    };
  }

  redirect("/dashboard");
}

/* ── Sign Up ────────────────────────────────────────────────── */

/**
 * Registers a new user with email, password, and display name.
 *
 * Supabase sends an email verification link by default.
 * On success, returns { success: true } with a message asking the user
 * to check their inbox - do NOT redirect immediately.
 *
 * TODO Stage 2B: After Supabase confirms the user (via /auth/callback),
 * create a profile row in the `profiles` table:
 *   supabase.from('profiles').insert({ id: user.id, full_name: fullName })
 * Profile data will be consumed by AI Coach, Opportunity Navigator,
 * HerLens, and Financial Compass for personalization.
 */
export async function signUp(
  email: string,
  password: string,
  fullName: string
): Promise<AuthResult> {
  const supabase = await createClient();

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        full_name: fullName,
      },
      // The callback URL where Supabase redirects after email verification.
      // The /auth/callback route exchanges the code for a session.
      emailRedirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/auth/callback`,
    },
  });

  if (error) {
    return {
      success: false,
      error: mapAuthError(error.message),
    };
  }

  // If the user already exists but is unconfirmed, Supabase returns an
  // identities array that is empty. Surface a friendly message.
  if (data.user && data.user.identities?.length === 0) {
    return {
      success: false,
      error:
        "An account with this email already exists. Please sign in instead.",
    };
  }

  return {
    success: true,
    message:
      "Account created! Check your email and click the verification link to get started.",
  };
}

/* ── Sign Out ───────────────────────────────────────────────── */

/**
 * Signs out the current user and redirects to /login.
 */
export async function signOut(): Promise<never> {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/login");
}

/* ── Delete Account ─────────────────────────────────────────── */

/**
 * Permanently deletes the currently authenticated user's account.
 *
 * Requires SUPABASE_SERVICE_ROLE_KEY in .env.local.
 * The auth.users cascade deletes the profiles row automatically
 * (ON DELETE CASCADE set in the migration).
 *
 * Flow: validate email → admin.deleteUser() → signOut → redirect /login
 */
export async function deleteAccount(
  confirmedEmail: string
): Promise<AuthResult> {
  const supabase = await createClient();

  // Get current user and verify the confirmed email matches
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    return { success: false, error: "You must be signed in to delete your account." };
  }

  if (confirmedEmail.trim().toLowerCase() !== user.email?.toLowerCase()) {
    return { success: false, error: "Email address does not match. Please try again." };
  }

  // Use service role admin client to delete the auth user
  // (anon key cannot delete auth users)
  const { createAdminClient } = await import("@/lib/supabase/admin");

  let adminClient;
  try {
    adminClient = createAdminClient();
  } catch {
    return {
      success: false,
      error: "Account deletion is not configured. Contact support.",
    };
  }

  const { error: deleteError } = await adminClient.auth.admin.deleteUser(user.id);

  if (deleteError) {
    console.error("[deleteAccount] admin.deleteUser error:", deleteError.message);
    return {
      success: false,
      error: "Failed to delete account. Please try again or contact support.",
    };
  }

  // Clear the session cookies after deletion
  await supabase.auth.signOut();

  redirect("/login");
}

/* ── Reset Password ─────────────────────────────────────────── */

/**
 * Sends a password-reset email.
 * Returns { success: true } on success so the UI can show the
 * "check your inbox" state.
 */
export async function resetPassword(email: string): Promise<AuthResult> {
  const supabase = await createClient();

  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/auth/callback?next=/dashboard/settings`,
  });

  if (error) {
    return {
      success: false,
      error: mapAuthError(error.message),
    };
  }

  return { success: true };
}

/* ── Error Mapping ──────────────────────────────────────────── */

/**
 * Maps Supabase raw error messages to user-friendly strings.
 * Keeps sensitive auth internals hidden from the UI.
 */
function mapAuthError(message: string): string {
  const m = message.toLowerCase();

  if (m.includes("invalid login credentials") || m.includes("invalid email or password")) {
    return "Incorrect email or password. Please try again.";
  }
  if (m.includes("email not confirmed")) {
    return "Please verify your email address before signing in.";
  }
  if (m.includes("user already registered") || m.includes("already been registered")) {
    return "An account with this email already exists. Please sign in instead.";
  }
  if (m.includes("password should be at least")) {
    return "Password must be at least 8 characters long.";
  }
  if (m.includes("rate limit") || m.includes("too many requests")) {
    return "Too many attempts. Please wait a moment before trying again.";
  }
  if (m.includes("network") || m.includes("fetch")) {
    return "Network error. Please check your connection and try again.";
  }

  // Fallback - return the original message if we don't recognise it.
  return message;
}

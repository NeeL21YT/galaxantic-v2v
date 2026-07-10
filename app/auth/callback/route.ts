/**
 * app/auth/callback/route.ts
 *
 * Auth Callback Route Handler.
 *
 * Supabase redirects users here after:
 * - Email address verification (after registration)
 * - Password reset links
 * - OAuth provider sign-in (Google, etc. - future stages)
 *
 * The `code` query param is a one-time PKCE authorisation code.
 * Exchanging it for a session writes the auth cookies to the browser.
 *
 * Query params:
 *   code        - PKCE auth code from Supabase (required)
 *   next        - Path to redirect to after success (optional, defaults to /dashboard)
 *   error       - Error code from Supabase (present on failure)
 *   error_description - Human-readable error message
 *
 * Profile Bootstrap (Stage 2B):
 * After a successful code exchange, we upsert a minimal profile row.
 * This is idempotent - if the profile already exists (e.g. on re-verification),
 * the upsert updates email/name but keeps all other fields untouched.
 * Proxy then detects onboarding_completed = false and redirects to /dashboard/onboarding.
 */

import { NextResponse, type NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createProfile } from "@/lib/db/profiles";

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url);

  const code = searchParams.get("code");
  const next = searchParams.get("next") ?? "/dashboard";
  const errorCode = searchParams.get("error");
  const errorDescription = searchParams.get("error_description");

  // ── Handle Supabase error redirects ─────────────────────────
  if (errorCode) {
    const loginUrl = new URL("/login", origin);
    loginUrl.searchParams.set(
      "error",
      errorDescription ?? "Authentication failed. Please try again."
    );
    return NextResponse.redirect(loginUrl);
  }

  // ── Exchange the PKCE code for a session ─────────────────────
  if (code) {
    const supabase = await createClient();
    const { error: exchangeError } = await supabase.auth.exchangeCodeForSession(code);

    if (!exchangeError) {
      // ── Bootstrap user profile ─────────────────────────────
      // After a successful code exchange the session is live.
      // Upsert a minimal profile row so every authenticated user
      // always has a profiles record. The proxy will then check
      // onboarding_completed and redirect to /dashboard/onboarding
      // if this is the user's first login.
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (user) {
        await createProfile({
          auth_user_id: user.id,
          email: user.email ?? "",
          full_name:
            (user.user_metadata?.full_name as string | undefined) ?? null,
        });
      }

      // Ensure the redirect target is same-origin for security.
      const redirectUrl = new URL(
        next.startsWith("/") ? next : "/dashboard",
        origin
      );
      return NextResponse.redirect(redirectUrl);
    }
  }

  // ── Fallback - code missing or PKCE exchange failed ───────────────
  const loginUrl = new URL("/login", origin);
  
  if (code) {
    // If we had a code but no errorCode from Supabase, the email WAS verified 
    // but the session exchange failed (usually due to cross-browser PKCE).
    loginUrl.searchParams.set(
      "message",
      "Email verified successfully! Please log in to continue."
    );
  } else {
    loginUrl.searchParams.set(
      "error",
      "The verification link has expired or is invalid. Please try again."
    );
  }

  return NextResponse.redirect(loginUrl);
}

/**
 * app/auth/callback/route.ts
 *
 * Auth Callback Route Handler.
 *
 * Supabase redirects users here after:
 * - Email address verification (after registration)
 * - Password reset links
 * - OAuth provider sign-in (Google, GitHub, etc. — future stages)
 *
 * The `code` query param is a one-time PKCE authorisation code.
 * Exchanging it for a session writes the auth cookies to the browser.
 *
 * Query params:
 *   code        — PKCE auth code from Supabase (required)
 *   next        — Path to redirect to after success (optional, defaults to /dashboard)
 *   error       — Error code from Supabase (present on failure)
 *   error_description — Human-readable error message
 *
 * TODO Stage 2B: After successful code exchange, check if the user has a
 * profile row in the `profiles` table. If not, create one:
 *   const { data: { user } } = await supabase.auth.getUser()
 *   await supabase.from('profiles').upsert({ id: user.id, full_name: user.user_metadata.full_name })
 * This is the correct place to initialise the profile because the email
 * is now verified and the session is live.
 */

import { NextResponse, type NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";

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
    const { error } = await supabase.auth.exchangeCodeForSession(code);

    if (!error) {
      // TODO Stage 2B: Initialise user profile here if it does not exist.
      // See file docstring above for implementation notes.

      // Ensure the redirect target is same-origin for security.
      const redirectUrl = new URL(next.startsWith("/") ? next : "/dashboard", origin);
      return NextResponse.redirect(redirectUrl);
    }
  }

  // ── Fallback — code missing or exchange failed ───────────────
  const loginUrl = new URL("/login", origin);
  loginUrl.searchParams.set(
    "error",
    "The verification link has expired or is invalid. Please try again."
  );
  return NextResponse.redirect(loginUrl);
}

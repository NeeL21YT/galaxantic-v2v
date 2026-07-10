/**
 * proxy.ts
 *
 * Next.js 16 Proxy (replaces deprecated middleware.ts).
 *
 * Responsibilities:
 * 1. Refresh the Supabase session on every request (via getUser()).
 * 2. Redirect unauthenticated users away from /dashboard/** → /login.
 * 3. Redirect already-authenticated users away from auth pages → /dashboard.
 * 4. Redirect authenticated users with onboarding_completed=false
 *    away from /dashboard/** → /dashboard/onboarding (except the
 *    onboarding page itself and the sign-out action).
 *
 * The matcher is configured to skip static assets, _next internals,
 * images, and the favicon so proxy only runs where it matters.
 *
 * NOTE: Next.js 16 renamed "middleware" to "proxy". The function must be
 * exported as `proxy` (not `middleware`).
 *
 * NOTE: Proxy runs in the Edge Runtime. The standard server client
 * (lib/supabase/server.ts) uses next/headers which is NOT available
 * in Edge. We use the middleware client (lib/supabase/middleware.ts)
 * which reads/writes cookies from the NextRequest/NextResponse directly.
 */

import { type NextRequest, NextResponse } from "next/server";
import { createMiddlewareClient } from "@/lib/supabase/middleware";

export async function proxy(request: NextRequest) {
  const { supabase, response } = await createMiddlewareClient(request);

  // IMPORTANT: Call getUser() - this triggers the token refresh and writes
  // the updated session cookies to the response.
  // Do NOT use getSession() here: it reads from cookies without contacting
  // the Supabase Auth server, so it cannot be trusted for routing decisions.
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { pathname } = request.nextUrl;

  // ── Protected routes ────────────────────────────────────────
  // If the user is not authenticated, redirect to /login.
  if (pathname.startsWith("/dashboard")) {
    if (!user) {
      const loginUrl = request.nextUrl.clone();
      loginUrl.pathname = "/login";
      // Preserve the original destination so we can redirect back after login.
      loginUrl.searchParams.set("redirectTo", pathname);
      return NextResponse.redirect(loginUrl);
    }

    // ── Onboarding guard ──────────────────────────────────────
    // If the user IS authenticated but hasn't completed onboarding,
    // send them to /dashboard/onboarding - unless they're already there.
    // We exempt /dashboard/onboarding itself to avoid an infinite loop.
    if (!pathname.startsWith("/dashboard/onboarding")) {
      const { data: profile } = await supabase
        .from("profiles")
        .select("onboarding_completed")
        .eq("auth_user_id", user.id)
        .single();

      if (profile && profile.onboarding_completed === false) {
        const onboardingUrl = request.nextUrl.clone();
        onboardingUrl.pathname = "/dashboard/onboarding";
        onboardingUrl.search = "";
        return NextResponse.redirect(onboardingUrl);
      }
    }
  }

  // ── Auth pages ───────────────────────────────────────────────
  // If the user is already authenticated, redirect away from auth pages.
  const authPages = ["/login", "/register", "/forgot-password"];
  if (authPages.includes(pathname) && user) {
    const dashboardUrl = request.nextUrl.clone();
    dashboardUrl.pathname = "/dashboard";
    dashboardUrl.search = "";
    return NextResponse.redirect(dashboardUrl);
  }

  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths EXCEPT:
     * - _next/static  (Next.js static assets)
     * - _next/image   (Next.js image optimisation)
     * - favicon.ico   (browser favicon request)
     * - sitemap.xml / robots.txt (metadata files)
     * - Files with common static extensions
     *
     * This keeps proxy off the hot path for asset requests while
     * still running on every HTML navigation and Route Handler.
     */
    "/((?!_next/static|_next/image|favicon\\.ico|sitemap\\.xml|robots\\.txt|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|woff|woff2|ttf|otf|eot)).*)",
  ],
};

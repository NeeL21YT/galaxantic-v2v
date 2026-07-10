/**
 * lib/supabase/middleware.ts
 *
 * Middleware-specific Supabase client factory.
 *
 * Unlike the server client, this variant operates on NextRequest /
 * NextResponse pairs so that refreshed auth tokens can be written
 * back to the HTTP response before it is sent to the browser.
 *
 * IMPORTANT: The middleware MUST call supabase.auth.getUser() to
 * trigger the token refresh and write the updated cookies to the
 * response. Without this call the session will not be refreshed and
 * will expire early.
 */

import { createServerClient } from "@supabase/ssr";
import { type NextRequest, NextResponse } from "next/server";

export async function createMiddlewareClient(request: NextRequest): Promise<{
  supabase: ReturnType<typeof createServerClient>;
  response: NextResponse;
}> {
  // Start with a pass-through response that we will mutate as needed.
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet, headers) {
          // Write cookies to both the request (for downstream middleware)
          // and the response (so the browser receives the refreshed token).
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          );

          response = NextResponse.next({
            request: {
              headers: request.headers,
            },
          });

          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options)
          );

          // Apply the required no-cache headers for auth cookie responses.
          // This prevents CDNs/reverse proxies from serving stale sessions.
          Object.entries(headers).forEach(([key, value]) =>
            response.headers.set(key, value)
          );
        },
      },
    }
  );

  return { supabase, response };
}

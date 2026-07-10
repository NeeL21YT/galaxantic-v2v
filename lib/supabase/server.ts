/**
 * lib/supabase/server.ts
 *
 * Server-side Supabase client factory.
 * Call createClient() once per request inside Server Components,
 * Server Actions, and Route Handlers.
 *
 * IMPORTANT: Always create a new instance per request — never share
 * a server client across requests.
 *
 * Cookie handling uses the non-deprecated getAll/setAll API.
 * `setAll` is a best-effort write; if Next.js cannot set cookies from
 * the current context (e.g., a read-only Server Component), the middleware
 * will handle the refresh on the next request.
 */

import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import type { User } from "@supabase/supabase-js";

export async function createClient() {
  const cookieStore = await cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) => {
              cookieStore.set(name, value, options);
            });
          } catch {
            // setAll called from a Server Component where cookies are read-only.
            // The middleware will handle the refresh on the next request.
          }
        },
      },
    }
  );
}

/**
 * Returns the currently authenticated Supabase user, or null if not signed in.
 *
 * Uses `getUser()` (not `getSession()`) which contacts the Supabase Auth
 * server to validate the token — safe to use for authorization decisions.
 *
 * Import this in protected Server Components and layouts instead of
 * maintaining client-side auth state.
 */
export async function getUser(): Promise<User | null> {
  const supabase = await createClient();
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error) {
    // Token invalid or expired — treat as unauthenticated
    return null;
  }

  return user;
}

/**
 * lib/supabase/client.ts
 *
 * Browser-side Supabase client.
 * Use this in Client Components ("use client") only.
 *
 * Uses `isSingleton: true` so a single instance is reused across the
 * lifetime of a page - avoids multiple GoTrue instances and the
 * auth state race conditions they cause.
 */

import { createBrowserClient } from "@supabase/ssr";

export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { isSingleton: true }
  );
}

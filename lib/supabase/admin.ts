/**
 * lib/supabase/admin.ts
 *
 * Supabase Admin client — uses the service role key.
 *
 * IMPORTANT:
 * - NEVER import this in client components.
 * - NEVER expose SUPABASE_SERVICE_ROLE_KEY to the browser.
 * - Only use in Server Actions and Route Handlers.
 *
 * The admin client bypasses RLS entirely — use with extreme care.
 * Scope every operation to the minimum required.
 */

import { createClient } from "@supabase/supabase-js";

/**
 * Returns a Supabase admin client using the service role key.
 * Throws if the env var is missing so failures are loud at startup,
 * not silently broken at runtime.
 */
export function createAdminClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const secretKey = process.env.SUPABASE_SECRET_KEY;

  if (!url || !secretKey) {
    throw new Error(
      "Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SECRET_KEY. " +
        "Add SUPABASE_SECRET_KEY to .env.local (Project Settings → API → Secret keys)."
    );
  }

  return createClient(url, secretKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}

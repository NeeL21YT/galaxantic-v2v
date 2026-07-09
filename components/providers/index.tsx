/**
 * components/providers/index.tsx
 *
 * Root provider composition component.
 * Add Supabase, React Query, and other providers here in Stage 2.
 *
 * Usage in app/layout.tsx:
 *   import { Providers } from "@/components/providers";
 *   <Providers>{children}</Providers>
 */

"use client";

interface ProvidersProps {
  children: React.ReactNode;
}

/**
 * Root Providers wrapper.
 * Currently passes children through — ready for Stage 2 integrations.
 */
export function Providers({ children }: ProvidersProps) {
  // Stage 2: Wrap with SupabaseProvider, ReactQueryProvider, etc.
  return <>{children}</>;
}

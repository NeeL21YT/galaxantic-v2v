/**
 * components/auth/SocialLoginButtons.tsx
 *
 * Google social login button.
 * Hidden until Google OAuth is wired up with Supabase.
 * TODO: supabase.auth.signInWithOAuth({ provider: 'google' })
 */

"use client";

interface SocialLoginButtonsProps {
  action?: "login" | "register";
}

export function SocialLoginButtons(props: SocialLoginButtonsProps) {
  void props;
  // Hidden until Google OAuth is configured in Supabase.
  return null;
}

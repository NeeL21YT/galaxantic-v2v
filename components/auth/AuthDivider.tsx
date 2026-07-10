/**
 * components/auth/AuthDivider.tsx
 *
 * "Or continue with" divider line for auth pages.
 */

export function AuthDivider({ label = "or continue with" }: { label?: string }) {
  // Hidden until social OAuth is wired up alongside SocialLoginButtons.
  void label;
  return null;
}

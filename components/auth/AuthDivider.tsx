/**
 * components/auth/AuthDivider.tsx
 *
 * "Or continue with" divider line for auth pages.
 */

export function AuthDivider({ label = "or continue with" }: { label?: string }) {
  return (
    <div className="flex items-center gap-3 my-5" role="separator" aria-label={label}>
      <div className="flex-1 h-px" style={{ background: "var(--color-border)" }} />
      <span className="text-xs px-1 flex-shrink-0" style={{ color: "var(--color-text-muted)" }}>
        {label}
      </span>
      <div className="flex-1 h-px" style={{ background: "var(--color-border)" }} />
    </div>
  );
}

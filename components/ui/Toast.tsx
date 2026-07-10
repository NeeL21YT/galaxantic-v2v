/**
 * components/ui/Toast.tsx
 *
 * Lightweight toast notification component.
 * No external dependencies - uses the existing CSS design tokens.
 *
 * Usage:
 *   const [toast, setToast] = useState<ToastProps | null>(null)
 *   <Toast {...toast} onDismiss={() => setToast(null)} />
 */

"use client";

import { useEffect } from "react";
import { CheckCircle2, XCircle, Info, X } from "lucide-react";

export type ToastVariant = "success" | "error" | "info";

export interface ToastProps {
  message: string;
  variant?: ToastVariant;
  /** Auto-dismiss after this many ms. 0 = no auto-dismiss. Default: 5000 */
  duration?: number;
  onDismiss: () => void;
}

const ICONS: Record<ToastVariant, React.ReactNode> = {
  success: <CheckCircle2 className="w-4 h-4 flex-shrink-0" aria-hidden="true" />,
  error: <XCircle className="w-4 h-4 flex-shrink-0" aria-hidden="true" />,
  info: <Info className="w-4 h-4 flex-shrink-0" aria-hidden="true" />,
};

const STYLES: Record<ToastVariant, { bg: string; color: string; border: string }> = {
  success: {
    bg: "rgba(34,197,94,0.10)",
    color: "#15803d",
    border: "rgba(34,197,94,0.25)",
  },
  error: {
    bg: "rgba(220,38,38,0.08)",
    color: "#dc2626",
    border: "rgba(220,38,38,0.20)",
  },
  info: {
    bg: "rgba(99,102,241,0.08)",
    color: "#4f46e5",
    border: "rgba(99,102,241,0.20)",
  },
};

export function Toast({
  message,
  variant = "info",
  duration = 5000,
  onDismiss,
}: ToastProps) {
  useEffect(() => {
    if (!duration) return;
    const timer = setTimeout(onDismiss, duration);
    return () => clearTimeout(timer);
  }, [duration, onDismiss]);

  const style = STYLES[variant];

  return (
    <div
      role="alert"
      aria-live="assertive"
      aria-atomic="true"
      className="flex items-start gap-3 rounded-xl px-4 py-3 text-sm font-medium animate-fade-in"
      style={{
        background: style.bg,
        color: style.color,
        border: `1px solid ${style.border}`,
      }}
    >
      {ICONS[variant]}
      <span className="flex-1 leading-snug">{message}</span>
      <button
        type="button"
        onClick={onDismiss}
        aria-label="Dismiss notification"
        className="flex-shrink-0 rounded-md p-0.5 transition-opacity duration-150 opacity-70 hover:opacity-100"
        style={{ color: style.color }}
      >
        <X className="w-3.5 h-3.5" aria-hidden="true" />
      </button>
    </div>
  );
}

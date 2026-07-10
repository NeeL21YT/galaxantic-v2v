/**
 * components/dashboard/DeleteAccountModal.tsx
 *
 * Confirmation modal for permanent account deletion.
 *
 * Flow:
 * 1. User clicks Delete in the Danger Zone.
 * 2. This modal opens with a clear warning.
 * 3. User must type their email address to confirm.
 * 4. On submit, calls the deleteAccount server action.
 * 5. On success, server redirects to /login.
 * 6. On error, shows the error inline.
 *
 * Traps focus while open and closes on Escape.
 */

"use client";

import { useState, useTransition, useEffect, useRef } from "react";
import { AlertTriangle, X, Trash2 } from "lucide-react";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { deleteAccount } from "@/lib/supabase/actions";

interface DeleteAccountModalProps {
  userEmail: string;
  onClose: () => void;
}

export function DeleteAccountModal({ userEmail, onClose }: DeleteAccountModalProps) {
  const [confirmedEmail, setConfirmedEmail] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const firstInputRef = useRef<HTMLInputElement>(null);

  // Focus the email input when modal opens
  useEffect(() => {
    firstInputRef.current?.focus();
  }, []);

  // Close on Escape
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape" && !isPending) onClose();
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [onClose, isPending]);

  function handleDelete() {
    setError(null);
    if (!confirmedEmail.trim()) {
      setError("Please enter your email address to confirm.");
      return;
    }
    startTransition(async () => {
      const result = await deleteAccount(confirmedEmail);
      if (!result.success) {
        setError(result.error);
      }
      // On success, deleteAccount redirects — no further action needed.
    });
  }

  const emailMatches =
    confirmedEmail.trim().toLowerCase() === userEmail.toLowerCase();

  return (
    /* Backdrop */
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: "rgba(0,0,0,0.45)", backdropFilter: "blur(4px)" }}
      role="dialog"
      aria-modal="true"
      aria-labelledby="delete-modal-title"
      onClick={(e) => {
        if (e.target === e.currentTarget && !isPending) onClose();
      }}
    >
      {/* Panel */}
      <div
        className="w-full max-w-md rounded-3xl p-6 animate-fade-in-up"
        style={{
          background: "var(--color-surface)",
          border: "1px solid rgba(220,38,38,0.2)",
          boxShadow: "0 24px 64px rgba(0,0,0,0.2)",
        }}
      >
        {/* Header */}
        <div className="flex items-start justify-between gap-3 mb-5">
          <div className="flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-2xl flex items-center justify-center flex-shrink-0"
              style={{ background: "rgba(220,38,38,0.08)" }}
              aria-hidden="true"
            >
              <Trash2 className="w-5 h-5" style={{ color: "#dc2626" }} />
            </div>
            <div>
              <h2
                id="delete-modal-title"
                className="text-base font-bold"
                style={{ fontFamily: "var(--font-heading)", color: "#dc2626" }}
              >
                Delete Account
              </h2>
              <p className="text-xs" style={{ color: "var(--color-text-muted)" }}>
                This action is permanent and irreversible.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            disabled={isPending}
            aria-label="Close dialog"
            className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 transition-colors duration-150"
            style={{
              background: "var(--color-surface-hover)",
              color: "var(--color-text-muted)",
            }}
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Warning box */}
        <div
          className="rounded-xl p-3.5 mb-5 flex gap-2.5"
          style={{
            background: "rgba(220,38,38,0.05)",
            border: "1px solid rgba(220,38,38,0.15)",
          }}
        >
          <AlertTriangle
            className="w-4 h-4 flex-shrink-0 mt-0.5"
            style={{ color: "#dc2626" }}
            aria-hidden="true"
          />
          <p className="text-xs leading-relaxed" style={{ color: "#dc2626" }}>
            Your account, profile, saved opportunities, career roadmaps, and all
            associated data will be{" "}
            <strong>permanently deleted</strong>. This cannot be undone.
          </p>
        </div>

        {/* Confirmation input */}
        <div className="mb-5">
          <p className="text-sm mb-3" style={{ color: "var(--color-text-secondary)" }}>
            Type your email address{" "}
            <span
              className="font-semibold"
              style={{ color: "var(--color-text-primary)" }}
            >
              {userEmail}
            </span>{" "}
            to confirm deletion:
          </p>
          <Input
            ref={firstInputRef}
            id="confirm-delete-email"
            type="email"
            placeholder={userEmail}
            value={confirmedEmail}
            onChange={(e) => {
              setConfirmedEmail(e.target.value);
              setError(null);
            }}
            autoComplete="off"
            aria-label="Confirm your email address"
            disabled={isPending}
          />
        </div>

        {/* Error */}
        {error && (
          <p
            className="text-sm font-medium mb-4"
            role="alert"
            style={{ color: "#dc2626" }}
          >
            {error}
          </p>
        )}

        {/* Actions */}
        <div className="flex gap-2.5">
          <Button
            variant="ghost"
            fullWidth
            onClick={onClose}
            disabled={isPending}
          >
            Cancel
          </Button>
          <Button
            variant="danger"
            fullWidth
            onClick={handleDelete}
            loading={isPending}
            disabled={!emailMatches || isPending}
          >
            {isPending ? "Deleting…" : "Delete My Account"}
          </Button>
        </div>
      </div>
    </div>
  );
}

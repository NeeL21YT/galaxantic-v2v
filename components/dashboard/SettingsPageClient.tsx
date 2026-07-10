/**
 * components/dashboard/SettingsPageClient.tsx
 *
 * Client shell for the Settings page.
 *
 * Receives real userEmail from the server layout so the delete
 * confirmation can verify the typed email server-side too.
 */

"use client";

import { useState } from "react";
import { Save, Eye, EyeOff, AlertTriangle } from "lucide-react";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { SettingsCard } from "@/components/dashboard/SettingsCard";
import { DeleteAccountModal } from "@/components/dashboard/DeleteAccountModal";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { PLACEHOLDER_NOTIFICATIONS } from "@/lib/data/placeholder";

interface SettingsPageClientProps {
  userEmail: string;
  userName: string;
}

export function SettingsPageClient({ userEmail, userName }: SettingsPageClientProps) {
  const [notifications, setNotifications] = useState(PLACEHOLDER_NOTIFICATIONS);
  const [showPassword, setShowPassword] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  function toggleNotification(id: string) {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, enabled: !n.enabled } : n))
    );
  }

  return (
    <>
      <PageHeader title="Settings" subtitle="Manage your account, preferences, and notifications." />

      <div className="flex flex-col gap-5 max-w-2xl">

        {/* Profile Info */}
        <SettingsCard title="Profile Information" description="Update your personal details">
          <div className="flex flex-col gap-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Full Name"
                id="full-name"
                defaultValue={userName}
                placeholder="Your full name"
              />
              <Input
                label="Email Address"
                id="email"
                type="email"
                defaultValue={userEmail}
                placeholder="your@email.com"
                disabled
                helperText="Email cannot be changed here."
              />
            </div>
            <div className="flex justify-end">
              <Button variant="primary" size="sm" onClick={() => { /* TODO: wire up profile update */ }}>
                <Save className="w-3.5 h-3.5" aria-hidden="true" />
                Save Changes
              </Button>
            </div>
          </div>
        </SettingsCard>

        {/* Notifications */}
        <SettingsCard title="Notifications" description="Choose what you hear about">
          <ul className="flex flex-col gap-4" role="list">
            {notifications.map((n) => (
              <li key={n.id} className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-sm font-medium" style={{ color: "var(--color-text-primary)" }}>{n.label}</p>
                  <p className="text-xs" style={{ color: "var(--color-text-muted)" }}>{n.description}</p>
                </div>
                <button
                  type="button"
                  role="switch"
                  aria-checked={n.enabled}
                  aria-label={`Toggle ${n.label}`}
                  onClick={() => toggleNotification(n.id)}
                  className="w-10 h-5.5 rounded-full relative flex-shrink-0 transition-colors duration-200"
                  style={{ background: n.enabled ? "var(--color-rose-gold)" : "var(--color-border)" }}
                >
                  <span
                    className="absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-white transition-transform duration-200"
                    style={{ transform: n.enabled ? "translateX(18px)" : "translateX(0)" }}
                    aria-hidden="true"
                  />
                </button>
              </li>
            ))}
          </ul>
        </SettingsCard>

        {/* Security */}
        <SettingsCard title="Security" description="Update your password">
          <div className="flex flex-col gap-4">
            <Input
              label="New Password"
              id="new-password"
              type={showPassword ? "text" : "password"}
              placeholder="••••••••"
              rightElement={
                <button
                  type="button"
                  onClick={() => setShowPassword((s) => !s)}
                  style={{ color: "var(--color-text-muted)" }}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              }
            />
            <Input
              label="Confirm Password"
              id="confirm-password"
              type={showPassword ? "text" : "password"}
              placeholder="••••••••"
            />
            <div className="flex justify-end">
              <Button variant="primary" size="sm" onClick={() => { /* TODO: password change */ }}>
                Update Password
              </Button>
            </div>
          </div>
        </SettingsCard>

        {/* Preferences */}
        <SettingsCard title="Preferences" description="Customise your Herizon experience">
          <div className="flex flex-col gap-4 text-sm" style={{ color: "var(--color-text-secondary)" }}>
            <div className="flex items-center justify-between py-2 border-b" style={{ borderColor: "var(--color-border-light)" }}>
              <div>
                <p className="font-medium" style={{ color: "var(--color-text-primary)" }}>Theme</p>
                <p className="text-xs" style={{ color: "var(--color-text-muted)" }}>Dark mode coming in a future update</p>
              </div>
              <span className="px-2.5 py-1 rounded-full text-xs" style={{ background: "var(--color-surface-hover)", color: "var(--color-text-muted)" }}>
                Light (Default)
              </span>
            </div>
            <div className="flex items-center justify-between py-2">
              <div>
                <p className="font-medium" style={{ color: "var(--color-text-primary)" }}>Language</p>
                <p className="text-xs" style={{ color: "var(--color-text-muted)" }}>Interface language</p>
              </div>
              <span className="px-2.5 py-1 rounded-full text-xs" style={{ background: "var(--color-surface-hover)", color: "var(--color-text-muted)" }}>
                English
              </span>
            </div>
          </div>
        </SettingsCard>

        {/* Danger Zone */}
        <SettingsCard title="Danger Zone" description="Irreversible account actions" danger>
          <div
            className="flex items-start gap-3 p-4 rounded-xl"
            style={{ background: "rgba(239,68,68,0.05)", border: "1px dashed rgba(239,68,68,0.3)" }}
          >
            <AlertTriangle className="w-5 h-5 flex-shrink-0 mt-0.5" style={{ color: "#dc2626" }} aria-hidden="true" />
            <div className="flex-1">
              <p className="text-sm font-semibold" style={{ color: "#dc2626" }}>Delete Account</p>
              <p className="text-xs mt-0.5" style={{ color: "var(--color-text-muted)" }}>
                Permanently delete your account and all associated data. This cannot be undone.
              </p>
            </div>
            <Button
              variant="danger"
              size="sm"
              onClick={() => setShowDeleteModal(true)}
            >
              Delete
            </Button>
          </div>
        </SettingsCard>
      </div>

      {/* Delete confirmation modal */}
      {showDeleteModal && (
        <DeleteAccountModal
          userEmail={userEmail}
          onClose={() => setShowDeleteModal(false)}
        />
      )}
    </>
  );
}

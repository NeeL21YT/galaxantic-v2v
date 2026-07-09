/**
 * app/dashboard/settings/page.tsx
 *
 * Settings — Profile, Notifications, Security, Preferences, Danger Zone.
 */

"use client";

import { useState } from "react";
import { Save, Eye, EyeOff, AlertTriangle } from "lucide-react";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { ProfileCard } from "@/components/dashboard/ProfileCard";
import { SettingsCard } from "@/components/dashboard/SettingsCard";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { PLACEHOLDER_USER, PLACEHOLDER_NOTIFICATIONS } from "@/lib/data/placeholder";

export default function SettingsPage() {
  const [notifications, setNotifications] = useState(PLACEHOLDER_NOTIFICATIONS);
  const [showPassword, setShowPassword] = useState(false);

  function toggleNotification(id: string) {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, enabled: !n.enabled } : n))
    );
  }

  return (
    <>
      <PageHeader title="Settings" subtitle="Manage your account, preferences, and notifications." />

      <div className="flex flex-col gap-5 max-w-2xl">
        {/* Profile Card */}
        <ProfileCard user={PLACEHOLDER_USER} />

        {/* Profile Info */}
        <SettingsCard title="Profile Information" description="Update your personal details">
          <div className="flex flex-col gap-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="First Name"
                id="first-name"
                defaultValue={PLACEHOLDER_USER.name.split(" ")[0]}
                placeholder="First name"
              />
              <Input
                label="Last Name"
                id="last-name"
                defaultValue={PLACEHOLDER_USER.name.split(" ")[1] ?? ""}
                placeholder="Last name"
              />
            </div>
            <Input
              label="Email Address"
              id="email"
              type="email"
              defaultValue={PLACEHOLDER_USER.email}
              placeholder="your@email.com"
            />
            <Input
              label="Current Role / Title"
              id="role"
              defaultValue={PLACEHOLDER_USER.role}
              placeholder="e.g. Product Manager"
            />
            <div className="flex justify-end">
              <Button variant="primary" size="sm" onClick={() => { /* TODO Stage 2: save profile */ }}>
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
                {/* Toggle */}
                <button
                  type="button"
                  role="switch"
                  aria-checked={n.enabled}
                  aria-label={`Toggle ${n.label}`}
                  onClick={() => toggleNotification(n.id)}
                  className="w-10 h-5.5 rounded-full relative flex-shrink-0 transition-colors duration-200"
                  style={{
                    background: n.enabled ? "var(--color-rose-gold)" : "var(--color-border)",
                  }}
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
            <div className="relative">
              <Input
                label="New Password"
                id="new-password"
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
              />
              <button
                type="button"
                onClick={() => setShowPassword((s) => !s)}
                className="absolute right-3 top-[38px]"
                style={{ color: "var(--color-text-muted)" }}
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            <Input
              label="Confirm Password"
              id="confirm-password"
              type={showPassword ? "text" : "password"}
              placeholder="••••••••"
            />
            <div className="flex justify-end">
              <Button
                variant="primary"
                size="sm"
                onClick={() => { /* TODO Stage 2: implement password change via Supabase Auth */ }}
              >
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
              <span
                className="px-2.5 py-1 rounded-full text-xs"
                style={{ background: "var(--color-surface-hover)", color: "var(--color-text-muted)" }}
              >
                Light (Default)
              </span>
            </div>
            <div className="flex items-center justify-between py-2">
              <div>
                <p className="font-medium" style={{ color: "var(--color-text-primary)" }}>Language</p>
                <p className="text-xs" style={{ color: "var(--color-text-muted)" }}>Interface language</p>
              </div>
              <span
                className="px-2.5 py-1 rounded-full text-xs"
                style={{ background: "var(--color-surface-hover)", color: "var(--color-text-muted)" }}
              >
                English
              </span>
            </div>
          </div>
        </SettingsCard>

        {/* Danger Zone */}
        <SettingsCard title="Danger Zone" description="Irreversible account actions" danger>
          <div className="flex items-start gap-3 p-4 rounded-xl" style={{ background: "rgba(239,68,68,0.05)", border: "1px dashed rgba(239,68,68,0.3)" }}>
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
              onClick={() => { /* TODO Stage 2: implement account deletion */ }}
            >
              Delete
            </Button>
          </div>
        </SettingsCard>
      </div>
    </>
  );
}

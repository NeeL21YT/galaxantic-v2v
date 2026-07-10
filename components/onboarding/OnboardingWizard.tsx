/**
 * components/onboarding/OnboardingWizard.tsx
 *
 * 7-step onboarding wizard for new Herizon users.
 *
 * Steps:
 *  1 – Welcome
 *  2 – Personal Info (full_name, location)
 *  3 – Education level
 *  4 – Career stage
 *  5 – Skills chip selector
 *  6 – Interests chip selector
 *  7 – Review + Complete Setup
 *
 * On completion, calls the `completeOnboarding` server action which
 * saves the profile and redirects to /dashboard.
 *
 * Uses the existing design system — no inline ad-hoc styles beyond
 * CSS variable references.
 */

"use client";

import { useState, useTransition } from "react";
import {
  ArrowRight,
  ArrowLeft,
  Sparkles,
  MapPin,
  GraduationCap,
  Briefcase,
  Code2,
  Heart,
  CheckCircle2,
  User,
} from "lucide-react";
import { StepIndicator } from "./StepIndicator";
import { ChipSelector } from "./ChipSelector";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { completeOnboarding } from "@/lib/supabase/profile-actions";
import type { Profile, EducationLevel, CareerStage } from "@/types/database";

/* ── Constants ─────────────────────────────────────────────── */

const STEPS = [
  { number: 1, label: "Welcome" },
  { number: 2, label: "Personal" },
  { number: 3, label: "Education" },
  { number: 4, label: "Career" },
  { number: 5, label: "Skills" },
  { number: 6, label: "Interests" },
  { number: 7, label: "Review" },
];

const EDUCATION_OPTIONS: { value: EducationLevel; label: string }[] = [
  { value: "high_school", label: "High School" },
  { value: "diploma", label: "Diploma" },
  { value: "undergraduate", label: "Undergraduate" },
  { value: "postgraduate", label: "Postgraduate" },
  { value: "phd", label: "PhD" },
  { value: "other", label: "Other" },
];

const CAREER_OPTIONS: { value: CareerStage; label: string; description: string }[] = [
  { value: "student", label: "Student", description: "Currently studying" },
  { value: "career_break", label: "Career Break", description: "Taking a pause, ready to restart" },
  { value: "working", label: "Working Professional", description: "Currently employed" },
  { value: "freelancer", label: "Freelancer", description: "Self-employed / contract work" },
  { value: "entrepreneur", label: "Entrepreneur", description: "Running or building a business" },
];

const SKILL_OPTIONS = [
  "React", "Node.js", "Python", "UI Design", "Marketing",
  "Finance", "Teaching", "Healthcare", "Data Analysis", "Project Management",
  "Communication", "Leadership", "Writing", "Research", "Sales",
  "Photography", "Video Editing", "Social Media", "Other",
];

const INTEREST_OPTIONS = [
  "Scholarships", "Jobs", "Hackathons", "Business", "Leadership",
  "Technology", "Finance", "Education", "Entrepreneurship", "Mentorship",
  "Wellness", "Arts & Culture", "Sports", "Policy & Advocacy", "Research",
];

/* ── Form State ─────────────────────────────────────────────── */

interface FormState {
  full_name: string;
  location: string;
  education_level: EducationLevel | "";
  career_stage: CareerStage | "";
  skills: string[];
  interests: string[];
}

/* ── Component ─────────────────────────────────────────────── */

interface OnboardingWizardProps {
  profile: Profile;
}

export function OnboardingWizard({ profile }: OnboardingWizardProps) {
  const [step, setStep] = useState(1);
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const [form, setForm] = useState<FormState>({
    full_name: profile.full_name ?? "",
    location: profile.location ?? "",
    education_level: (profile.education_level as EducationLevel) ?? "",
    career_stage: (profile.career_stage as CareerStage) ?? "",
    skills: profile.skills ?? [],
    interests: profile.interests ?? [],
  });

  // ── Helpers ──────────────────────────────────────────────────

  function update<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  function next() {
    setError(null);
    // Validate step 2 requires at least a name
    if (step === 2 && !form.full_name.trim()) {
      setError("Please enter your full name.");
      return;
    }
    setStep((s) => Math.min(s + 1, STEPS.length));
  }

  function back() {
    setError(null);
    setStep((s) => Math.max(s - 1, 1));
  }

  function handleComplete() {
    setError(null);
    if (!form.full_name.trim()) {
      setStep(2);
      setError("Please enter your full name before completing setup.");
      return;
    }
    startTransition(async () => {
      const result = await completeOnboarding(form);
      if (!result.success) {
        setError(result.error);
      }
      // On success, completeOnboarding redirects — no further action needed.
    });
  }

  // ── Render ───────────────────────────────────────────────────

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-10"
      style={{ background: "var(--color-background)" }}
    >
      <div className="w-full max-w-xl animate-fade-in-up">

        {/* Header */}
        <div className="text-center mb-8">
          <div
            className="inline-flex items-center justify-center w-12 h-12 rounded-2xl mb-4"
            style={{ background: "var(--color-champagne)" }}
          >
            <Sparkles className="w-6 h-6" style={{ color: "var(--color-puce-red)" }} aria-hidden="true" />
          </div>
          <h1
            className="text-2xl font-bold mb-1"
            style={{ fontFamily: "var(--font-heading)", color: "var(--color-puce-red)" }}
          >
            Set Up Your Profile
          </h1>
          <p className="text-sm" style={{ color: "var(--color-text-muted)" }}>
            Step {step} of {STEPS.length}
          </p>
        </div>

        {/* Step Indicator */}
        <div className="mb-8">
          <StepIndicator steps={STEPS} currentStep={step} />
        </div>

        {/* Card */}
        <div
          className="rounded-3xl p-8"
          style={{
            background: "var(--color-surface)",
            border: "1px solid var(--color-border)",
            boxShadow: "var(--shadow-lg)",
          }}
        >
          {/* ─── Step 1: Welcome ───────────────────────────── */}
          {step === 1 && (
            <section aria-labelledby="step-1-heading">
              <div
                className="w-14 h-14 rounded-2xl flex items-center justify-center mb-5"
                style={{ background: "var(--color-champagne)" }}
                aria-hidden="true"
              >
                <Sparkles className="w-7 h-7" style={{ color: "var(--color-puce-red)" }} />
              </div>
              <h2
                id="step-1-heading"
                className="text-2xl font-bold mb-3"
                style={{ fontFamily: "var(--font-heading)", color: "var(--color-puce-red)" }}
              >
                Welcome to Herizon ✨
              </h2>
              <p className="mb-4 leading-relaxed" style={{ color: "var(--color-text-secondary)" }}>
                You&apos;re about to unlock a personalized career companion built just for you.
              </p>
              <p className="mb-6 leading-relaxed" style={{ color: "var(--color-text-secondary)" }}>
                In the next few steps we&apos;ll collect some basic information so our AI can tailor your
                career roadmap, surface the right opportunities, and give you financial guidance that
                actually fits your life.
              </p>
              <div
                className="rounded-2xl p-4 mb-2"
                style={{ background: "var(--color-champagne)", border: "1px solid var(--color-border-light)" }}
              >
                <p className="text-sm font-medium" style={{ color: "var(--color-puce-red)" }}>
                  🔒 Your data is private and secure. Only you can see your profile.
                </p>
              </div>
            </section>
          )}

          {/* ─── Step 2: Personal Info ─────────────────────── */}
          {step === 2 && (
            <section aria-labelledby="step-2-heading">
              <div
                className="w-12 h-12 rounded-2xl flex items-center justify-center mb-5"
                style={{ background: "var(--color-champagne)" }}
                aria-hidden="true"
              >
                <User className="w-6 h-6" style={{ color: "var(--color-puce-red)" }} />
              </div>
              <h2
                id="step-2-heading"
                className="text-xl font-bold mb-1"
                style={{ fontFamily: "var(--font-heading)", color: "var(--color-puce-red)" }}
              >
                Personal Information
              </h2>
              <p className="text-sm mb-6" style={{ color: "var(--color-text-muted)" }}>
                Tell us a little about yourself.
              </p>
              <div className="flex flex-col gap-4">
                <Input
                  id="full-name"
                  label="Full Name"
                  placeholder="e.g. Priya Sharma"
                  value={form.full_name}
                  onChange={(e) => update("full_name", e.target.value)}
                  autoComplete="name"
                  required
                  aria-required="true"
                  leftIcon={<User className="w-4 h-4" />}
                />
                <Input
                  id="location"
                  label="Location"
                  placeholder="e.g. Mumbai, India"
                  value={form.location}
                  onChange={(e) => update("location", e.target.value)}
                  autoComplete="address-level2"
                  leftIcon={<MapPin className="w-4 h-4" />}
                />
              </div>
            </section>
          )}

          {/* ─── Step 3: Education ────────────────────────── */}
          {step === 3 && (
            <section aria-labelledby="step-3-heading">
              <div
                className="w-12 h-12 rounded-2xl flex items-center justify-center mb-5"
                style={{ background: "var(--color-champagne)" }}
                aria-hidden="true"
              >
                <GraduationCap className="w-6 h-6" style={{ color: "var(--color-puce-red)" }} />
              </div>
              <h2
                id="step-3-heading"
                className="text-xl font-bold mb-1"
                style={{ fontFamily: "var(--font-heading)", color: "var(--color-puce-red)" }}
              >
                Education Level
              </h2>
              <p className="text-sm mb-6" style={{ color: "var(--color-text-muted)" }}>
                Select your highest level of education.
              </p>
              <div className="grid grid-cols-2 gap-3" role="radiogroup" aria-label="Education level">
                {EDUCATION_OPTIONS.map((opt) => {
                  const isSelected = form.education_level === opt.value;
                  return (
                    <button
                      key={opt.value}
                      type="button"
                      role="radio"
                      aria-checked={isSelected}
                      onClick={() => update("education_level", opt.value)}
                      className="px-4 py-3 rounded-2xl text-sm font-medium text-left transition-all duration-200 focus-visible:outline-none focus-visible:ring-2"
                      style={{
                        background: isSelected ? "var(--color-puce-red)" : "var(--color-champagne)",
                        color: isSelected ? "#fff" : "var(--color-text-secondary)",
                        border: isSelected
                          ? "1.5px solid var(--color-puce-red)"
                          : "1.5px solid var(--color-border)",
                        boxShadow: isSelected ? "0 4px 12px rgba(110,46,52,0.2)" : "none",
                        transform: isSelected ? "translateY(-1px)" : "none",
                      }}
                    >
                      {opt.label}
                    </button>
                  );
                })}
              </div>
            </section>
          )}

          {/* ─── Step 4: Career Stage ────────────────────── */}
          {step === 4 && (
            <section aria-labelledby="step-4-heading">
              <div
                className="w-12 h-12 rounded-2xl flex items-center justify-center mb-5"
                style={{ background: "var(--color-champagne)" }}
                aria-hidden="true"
              >
                <Briefcase className="w-6 h-6" style={{ color: "var(--color-puce-red)" }} />
              </div>
              <h2
                id="step-4-heading"
                className="text-xl font-bold mb-1"
                style={{ fontFamily: "var(--font-heading)", color: "var(--color-puce-red)" }}
              >
                Career Stage
              </h2>
              <p className="text-sm mb-6" style={{ color: "var(--color-text-muted)" }}>
                Where are you in your career journey?
              </p>
              <div className="flex flex-col gap-3" role="radiogroup" aria-label="Career stage">
                {CAREER_OPTIONS.map((opt) => {
                  const isSelected = form.career_stage === opt.value;
                  return (
                    <button
                      key={opt.value}
                      type="button"
                      role="radio"
                      aria-checked={isSelected}
                      onClick={() => update("career_stage", opt.value)}
                      className="w-full flex items-start gap-3 px-4 py-3.5 rounded-2xl text-left transition-all duration-200 focus-visible:outline-none focus-visible:ring-2"
                      style={{
                        background: isSelected ? "var(--color-puce-red)" : "var(--color-champagne)",
                        border: isSelected
                          ? "1.5px solid var(--color-puce-red)"
                          : "1.5px solid var(--color-border)",
                        boxShadow: isSelected ? "0 4px 12px rgba(110,46,52,0.2)" : "none",
                        transform: isSelected ? "translateY(-1px)" : "none",
                      }}
                    >
                      <div className="flex-1">
                        <p
                          className="text-sm font-semibold"
                          style={{ color: isSelected ? "#fff" : "var(--color-text-primary)" }}
                        >
                          {opt.label}
                        </p>
                        <p
                          className="text-xs mt-0.5"
                          style={{ color: isSelected ? "rgba(255,255,255,0.75)" : "var(--color-text-muted)" }}
                        >
                          {opt.description}
                        </p>
                      </div>
                      {isSelected && (
                        <CheckCircle2
                          className="w-5 h-5 flex-shrink-0 mt-0.5"
                          style={{ color: "#fff" }}
                          aria-hidden="true"
                        />
                      )}
                    </button>
                  );
                })}
              </div>
            </section>
          )}

          {/* ─── Step 5: Skills ──────────────────────────── */}
          {step === 5 && (
            <section aria-labelledby="step-5-heading">
              <div
                className="w-12 h-12 rounded-2xl flex items-center justify-center mb-5"
                style={{ background: "var(--color-champagne)" }}
                aria-hidden="true"
              >
                <Code2 className="w-6 h-6" style={{ color: "var(--color-puce-red)" }} />
              </div>
              <h2
                id="step-5-heading"
                className="text-xl font-bold mb-1"
                style={{ fontFamily: "var(--font-heading)", color: "var(--color-puce-red)" }}
              >
                Your Skills
              </h2>
              <p className="text-sm mb-6" style={{ color: "var(--color-text-muted)" }}>
                Select all that apply — this helps us surface relevant opportunities.
              </p>
              <ChipSelector
                options={SKILL_OPTIONS}
                selected={form.skills}
                onChange={(s) => update("skills", s)}
                label="Skills"
              />
            </section>
          )}

          {/* ─── Step 6: Interests ───────────────────────── */}
          {step === 6 && (
            <section aria-labelledby="step-6-heading">
              <div
                className="w-12 h-12 rounded-2xl flex items-center justify-center mb-5"
                style={{ background: "var(--color-champagne)" }}
                aria-hidden="true"
              >
                <Heart className="w-6 h-6" style={{ color: "var(--color-puce-red)" }} />
              </div>
              <h2
                id="step-6-heading"
                className="text-xl font-bold mb-1"
                style={{ fontFamily: "var(--font-heading)", color: "var(--color-puce-red)" }}
              >
                Your Interests
              </h2>
              <p className="text-sm mb-6" style={{ color: "var(--color-text-muted)" }}>
                What areas are you most excited to explore?
              </p>
              <ChipSelector
                options={INTEREST_OPTIONS}
                selected={form.interests}
                onChange={(s) => update("interests", s)}
                label="Interests"
              />
            </section>
          )}

          {/* ─── Step 7: Review ──────────────────────────── */}
          {step === 7 && (
            <section aria-labelledby="step-7-heading">
              <div
                className="w-12 h-12 rounded-2xl flex items-center justify-center mb-5"
                style={{ background: "var(--color-champagne)" }}
                aria-hidden="true"
              >
                <CheckCircle2 className="w-6 h-6" style={{ color: "var(--color-puce-red)" }} />
              </div>
              <h2
                id="step-7-heading"
                className="text-xl font-bold mb-1"
                style={{ fontFamily: "var(--font-heading)", color: "var(--color-puce-red)" }}
              >
                Review Your Profile
              </h2>
              <p className="text-sm mb-6" style={{ color: "var(--color-text-muted)" }}>
                Everything look good? You can always update these in Settings.
              </p>

              <div className="flex flex-col gap-3">
                {[
                  { label: "Full Name", value: form.full_name || "—" },
                  { label: "Location", value: form.location || "—" },
                  {
                    label: "Education",
                    value:
                      EDUCATION_OPTIONS.find((e) => e.value === form.education_level)?.label || "—",
                  },
                  {
                    label: "Career Stage",
                    value:
                      CAREER_OPTIONS.find((c) => c.value === form.career_stage)?.label || "—",
                  },
                  {
                    label: "Skills",
                    value: form.skills.length > 0 ? form.skills.join(", ") : "—",
                  },
                  {
                    label: "Interests",
                    value: form.interests.length > 0 ? form.interests.join(", ") : "—",
                  },
                ].map(({ label, value }) => (
                  <div
                    key={label}
                    className="flex gap-3 items-start px-4 py-3 rounded-xl"
                    style={{ background: "var(--color-champagne)", border: "1px solid var(--color-border-light)" }}
                  >
                    <span
                      className="text-xs font-semibold w-24 flex-shrink-0 mt-0.5"
                      style={{ color: "var(--color-text-muted)" }}
                    >
                      {label}
                    </span>
                    <span
                      className="text-sm font-medium flex-1 leading-snug"
                      style={{ color: "var(--color-text-primary)" }}
                    >
                      {value}
                    </span>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* ── Error message ────────────────────────────── */}
          {error && (
            <p
              className="mt-4 text-sm font-medium"
              role="alert"
              style={{ color: "#dc2626" }}
            >
              {error}
            </p>
          )}

          {/* ── Navigation ───────────────────────────────── */}
          <div className={`mt-8 flex ${step > 1 ? "justify-between" : "justify-end"}`}>
            {step > 1 && (
              <Button
                variant="ghost"
                onClick={back}
                disabled={isPending}
                leftIcon={<ArrowLeft className="w-4 h-4" />}
              >
                Back
              </Button>
            )}

            {step < STEPS.length ? (
              <Button
                variant="primary"
                onClick={next}
                disabled={isPending}
                rightIcon={<ArrowRight className="w-4 h-4" />}
              >
                Continue
              </Button>
            ) : (
              <Button
                variant="primary"
                onClick={handleComplete}
                loading={isPending}
                rightIcon={!isPending ? <Sparkles className="w-4 h-4" /> : undefined}
              >
                {isPending ? "Saving…" : "Complete Setup"}
              </Button>
            )}
          </div>
        </div>

        {/* Footer note */}
        <p className="text-center text-xs mt-4" style={{ color: "var(--color-text-muted)" }}>
          You can update your profile any time from Settings.
        </p>
      </div>
    </div>
  );
}

/**
 * app/dashboard/financial-compass/page.tsx
 *
 * Financial Compass — 7-step AI financial planning wizard.
 *
 * Stage 2G: Connected to real backend.
 * - Steps 1–3 collect validated inputs
 * - "Generate Plan" (step 3 → 4) calls Gemini via server action
 * - Steps 4–7 display real AI + calculated data
 * - Existing plan loads automatically on mount
 * - Input changes trigger "Financial information changed" regeneration banner
 * - input_hash cache detection prevents unnecessary Gemini calls
 *
 * DO NOT redesign this page. Only backend connections were added.
 */

"use client";

import { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  GraduationCap,
  Briefcase,
  Laptop,
  Rocket,
  Heart,
  TrendingUp,
  Activity,
  Crosshair,
  BarChart2,
  RefreshCw,
  AlertTriangle,
  Loader2,
  Info,
  CheckCircle2,
} from "lucide-react";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { Stepper } from "@/components/financial/Stepper";
import { StepCard } from "@/components/financial/StepCard";
import { GoalCard } from "@/components/financial/GoalCard";
import { BudgetCard } from "@/components/financial/BudgetCard";
import { FinancialStat } from "@/components/financial/FinancialStat";
import { RecommendationCard } from "@/components/financial/RecommendationCard";
import { Checklist } from "@/components/financial/Checklist";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { FINANCIAL_GOALS } from "@/lib/data/financial-goals";
import { generateInputHash } from "@/lib/financial/calculations";
import {
  generateFinancialPlanAction,
  loadFinancialPlanAction,
  deleteFinancialPlanAction,
  type ValidationError,
} from "./actions";
import type { ReactNode } from "react";
import type {
  FinancialFormData,
  FinancialGoalType,
  EmploymentType,
  ActionPlanItem,
  FinancialPlanResult,
  BudgetBreakdown,
} from "@/types/dashboard";

/* ── Constants ───────────────────────────────────────────────── */

const STEPS = [
  "Current Situation",
  "Financial Goal",
  "Goal Details",
  "AI Analysis",
  "Budget Allocation",
  "Recommendations",
  "Action Plan",
];

const TOTAL_STEPS = STEPS.length;

const LOADING_MESSAGES = [
  "Analyzing your finances...",
  "Building your personalized financial roadmap...",
  "Generating recommendations...",
  "Calculating budget allocation...",
  "Finalizing your action plan...",
];

const EMPLOYMENT_OPTIONS: { value: EmploymentType; label: string; icon: ReactNode }[] = [
  { value: "student",     label: "Student",       icon: <GraduationCap className="w-4 h-4" /> },
  { value: "working",     label: "Working",        icon: <Briefcase className="w-4 h-4" /> },
  { value: "freelancer",  label: "Freelancer",     icon: <Laptop className="w-4 h-4" /> },
  { value: "business",    label: "Business Owner", icon: <Rocket className="w-4 h-4" /> },
  { value: "other",       label: "Other",          icon: <Info className="w-4 h-4" /> },
];

const INITIAL_FORM: FinancialFormData = {
  monthlyIncome: "",
  employmentType: "",
  customEmploymentType: "",
  currentSavings: "",
  monthlyExpenses: "",
  goal: "",
  customGoal: "",
  goalDetails: "",
  targetAmount: "",
  targetTimeline: "",
  additionalNotes: "",
  businessIdea: "",
  businessLocation: "",
  education: "",
  currentSkills: "",
  businessExperience: "",
  expectedInvestment: "",
};

/* ── Step transition variants ────────────────────────────────── */

const stepVariants = {
  enter: (dir: number) => ({ x: dir > 0 ? 60 : -60, opacity: 0 }),
  center: { x: 0, opacity: 1 },
  exit:  (dir: number) => ({ x: dir > 0 ? -60 : 60, opacity: 0 }),
};

/* ── Helpers ─────────────────────────────────────────────────── */

function formatINR(amount: number): string {
  return `₹${amount.toLocaleString("en-IN")}`;
}

function gradeColor(grade: string): string {
  if (grade === "Excellent") return "var(--color-rackley)";
  if (grade === "Good")      return "var(--color-rose-gold)";
  if (grade === "Fair")      return "#d97706";
  return "#dc2626";
}

/* ── Main Component ──────────────────────────────────────────── */

export default function FinancialCompassPage() {
  const [currentStep, setCurrentStep] = useState(1);
  const [direction, setDirection]     = useState(1);
  const [formData, setFormData]       = useState<FinancialFormData>(INITIAL_FORM);
  const [activePlan, setActivePlan]   = useState<FinancialPlanResult | null>(null);
  const [actionItems, setActionItems] = useState<ActionPlanItem[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isLoading, setIsLoading]     = useState(true);
  const [loadingMessage, setLoadingMessage] = useState(LOADING_MESSAGES[0]);
  const [error, setError]             = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [validationErrors, setValidationErrors] = useState<ValidationError[]>([]);

  /* ── Input Hash for change detection ── */
  const currentInputHash = useMemo(() => {
    const income  = parseFloat(formData.monthlyIncome);
    const expenses = parseFloat(formData.monthlyExpenses);
    const savings  = parseFloat(formData.currentSavings);
    const target   = parseFloat(formData.targetAmount);
    if (!income || !expenses || !savings || !formData.goal) return null;

    const effectiveEmployment =
      formData.employmentType === "other"
        ? (formData.customEmploymentType?.trim() ?? "other")
        : formData.employmentType;
    const effectiveGoal =
      formData.goal === "other"
        ? (formData.customGoal?.trim() ?? "other")
        : formData.goal;

    return generateInputHash({
      monthlyIncome:  income || 0,
      monthlyExpenses:expenses || 0,
      currentSavings: savings || 0,
      employmentType: effectiveEmployment,
      goal:           effectiveGoal,
      targetAmount:   target || 0,
      targetTimeline: formData.targetTimeline,
    });
  }, [formData]);

  const inputsHaveChanged =
    activePlan !== null &&
    currentInputHash !== null &&
    activePlan.inputHash !== currentInputHash;

  /* ── Load existing plan on mount ── */
  useEffect(() => {
    async function load() {
      setIsLoading(true);
      const result = await loadFinancialPlanAction();
      if (result.success && result.plan) {
        setActivePlan(result.plan);
        restoreFormFromPlan(result.plan, setFormData);
        buildActionItems(result.plan, setActionItems);
        // Jump to results if plan exists
        setCurrentStep(4);
      }
      setIsLoading(false);
    }
    load();
  }, []);

  /* ── Rotate loading messages ── */
  useEffect(() => {
    if (!isGenerating) return;
    let i = 0;
    const interval = setInterval(() => {
      i = (i + 1) % LOADING_MESSAGES.length;
      setLoadingMessage(LOADING_MESSAGES[i]);
    }, 2200);
    return () => clearInterval(interval);
  }, [isGenerating]);

  function updateForm(field: keyof FinancialFormData, value: string) {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setValidationErrors((prev) => prev.filter((e) => e.field !== field));
  }

  function goToStep(step: number) {
    setDirection(step > currentStep ? 1 : -1);
    setCurrentStep(step);
  }

  function validateStep(step: number): boolean {
    const errors: ValidationError[] = [];

    if (step === 1) {
      const income = parseFloat(formData.monthlyIncome);
      if (!formData.monthlyIncome || isNaN(income) || income <= 0)
        errors.push({ field: "monthlyIncome", message: "Monthly income is required and must be greater than zero." });

      if (!formData.employmentType)
        errors.push({ field: "employmentType", message: "Please select your employment type." });

      if (formData.employmentType === "other" && !formData.customEmploymentType?.trim())
        errors.push({ field: "customEmploymentType", message: "Please describe your employment type." });

      const savings = parseFloat(formData.currentSavings);
      if (!formData.currentSavings || isNaN(savings) || savings < 0)
        errors.push({ field: "currentSavings", message: "Current savings is required (enter 0 if none)." });

      const expenses = parseFloat(formData.monthlyExpenses);
      if (!formData.monthlyExpenses || isNaN(expenses) || expenses < 0)
        errors.push({ field: "monthlyExpenses", message: "Monthly expenses is required (enter 0 if none)." });
    }

    if (step === 2) {
      if (!formData.goal)
        errors.push({ field: "goal", message: "Please select a financial goal." });
      if (formData.goal === "other" && !formData.customGoal?.trim())
        errors.push({ field: "customGoal", message: "Please describe your financial goal." });
    }

    if (step === 3) {
      const target = parseFloat(formData.targetAmount);
      if (!formData.targetAmount || isNaN(target) || target <= 0)
        errors.push({ field: "targetAmount", message: "Target amount is required and must be greater than zero." });
      if (!formData.targetTimeline?.trim())
        errors.push({ field: "targetTimeline", message: "Target timeline is required." });
      // Business goal: expectedInvestment acts as targetAmount
      if (isBusinessGoal) {
        const inv = parseFloat(formData.expectedInvestment);
        if (!formData.expectedInvestment || isNaN(inv) || inv <= 0)
          errors.push({ field: "targetAmount", message: "Expected investment is required." });
      }
    }

    setValidationErrors(errors);
    return errors.length === 0;
  }

  function handleNext() {
    if (!validateStep(currentStep)) return;
    if (currentStep < TOTAL_STEPS) goToStep(currentStep + 1);
  }

  function handleBack() {
    if (currentStep > 1) {
      setValidationErrors([]);
      goToStep(currentStep - 1);
    }
  }

  function toggleActionItem(id: string) {
    setActionItems((items) =>
      items.map((item) => (item.id === id ? { ...item, checked: !item.checked } : item))
    );
  }

  async function handleGeneratePlan() {
    if (!validateStep(3)) return;
    setError(null);
    setValidationErrors([]);
    setIsGenerating(true);
    setLoadingMessage(LOADING_MESSAGES[0]);
    goToStep(4);

    const result = await generateFinancialPlanAction(formData);

    if (!result.success) {
      setError(result.error);
      setValidationErrors(result.validationErrors ?? []);
      setIsGenerating(false);
      return;
    }

    setActivePlan(result.plan);
    buildActionItems(result.plan, setActionItems);
    setIsGenerating(false);
    setSuccessMessage(
      result.cached
        ? "Your existing plan is up to date."
        : "Financial plan generated successfully. The latest recommendations have been saved."
    );
    setTimeout(() => setSuccessMessage(null), 5000);
  }

  async function handleDeletePlan() {
    if (!activePlan) return;
    const result = await deleteFinancialPlanAction(activePlan.id);
    if (result.success) {
      setActivePlan(null);
      setFormData(INITIAL_FORM);
      setActionItems([]);
      setCurrentStep(1);
      setDirection(-1);
    } else {
      setError(result.error);
    }
  }

  const isBusinessGoal = formData.goal === "start-business";
  const remainingSteps = TOTAL_STEPS - currentStep;

  if (isLoading) {
    return (
      <div className="flex flex-col gap-8">
        <PageHeader title="Financial Compass" subtitle="Plan smarter. Grow stronger." />
        <div className="flex items-center justify-center py-24 gap-3">
          <Loader2
            className="w-5 h-5 animate-spin"
            style={{ color: "var(--color-rose-gold)" }}
          />
          <span className="text-sm" style={{ color: "var(--color-text-muted)" }}>
            Loading your financial plan...
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-8">
      <PageHeader title="Financial Compass" subtitle="Plan smarter. Grow stronger." />

      {/* Success message */}
      <AnimatePresence>
        {successMessage && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="rounded-xl px-4 py-3 flex items-center gap-2 text-sm"
            style={{
              background: "rgba(22,163,74,0.08)",
              border: "1px solid rgba(22,163,74,0.2)",
              color: "#15803d",
            }}
            role="status"
          >
            <CheckCircle2 className="w-4 h-4 flex-shrink-0" aria-hidden="true" />
            {successMessage}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Inputs changed banner */}
      <AnimatePresence>
        {inputsHaveChanged && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="rounded-xl px-4 py-3 flex items-center justify-between gap-3 text-sm"
            style={{
              background: "rgba(245,158,11,0.08)",
              border: "1px solid rgba(245,158,11,0.2)",
              color: "#92400e",
            }}
            role="note"
          >
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 flex-shrink-0" aria-hidden="true" />
              Financial information changed. Regenerate your plan to see updated recommendations.
            </div>
            <Button
              variant="outline"
              leftIcon={<RefreshCw className="w-3.5 h-3.5" />}
              onClick={handleGeneratePlan}
              disabled={isGenerating}
            >
              Regenerate Plan
            </Button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Global error */}
      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="rounded-xl px-4 py-3 flex items-center gap-2 text-sm"
            style={{
              background: "rgba(220,38,38,0.08)",
              border: "1px solid rgba(220,38,38,0.2)",
              color: "#991b1b",
            }}
            role="alert"
          >
            <AlertTriangle className="w-4 h-4 flex-shrink-0" aria-hidden="true" />
            {error}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Step meta row */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 -mt-4"
      >
        <div className="flex flex-col gap-0.5">
          <span
            className="text-xs font-semibold uppercase tracking-wider"
            style={{ color: "var(--color-text-muted)" }}
          >
            Step {currentStep} of {TOTAL_STEPS}
          </span>
          <h2
            className="text-lg font-bold"
            style={{ fontFamily: "var(--font-heading)", color: "var(--color-puce-red)" }}
          >
            {STEPS[currentStep - 1]}
          </h2>
        </div>
        {remainingSteps > 0 && (
          <span className="text-xs" style={{ color: "var(--color-text-muted)" }}>
            {remainingSteps} step{remainingSteps !== 1 ? "s" : ""} remaining
          </span>
        )}
      </motion.div>

      {/* Stepper */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.1 }}
      >
        <Stepper steps={STEPS} currentStep={currentStep} />
      </motion.div>

      {/* Step content */}
      <AnimatePresence mode="wait" custom={direction}>
        <motion.div
          key={currentStep}
          custom={direction}
          variants={stepVariants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{ duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
        >
          {currentStep === 1 && (
            <Step1
              formData={formData}
              updateForm={updateForm}
              validationErrors={validationErrors}
              disabled={isGenerating}
            />
          )}
          {currentStep === 2 && (
            <Step2
              formData={formData}
              onSelect={(goal) => updateForm("goal", goal)}
              onCustomGoalChange={(v) => updateForm("customGoal", v)}
              validationErrors={validationErrors}
              disabled={isGenerating}
            />
          )}
          {currentStep === 3 && (
            <Step3
              formData={formData}
              updateForm={updateForm}
              isBusinessGoal={isBusinessGoal}
              validationErrors={validationErrors}
              disabled={isGenerating}
            />
          )}
          {currentStep === 4 && (
            <Step4
              plan={activePlan}
              isGenerating={isGenerating}
              loadingMessage={loadingMessage}
              error={error}
            />
          )}
          {currentStep === 5 && (
            <Step5 plan={activePlan} isGenerating={isGenerating} />
          )}
          {currentStep === 6 && (
            <Step6 plan={activePlan} isGenerating={isGenerating} />
          )}
          {currentStep === 7 && (
            <Step7
              plan={activePlan}
              actionItems={actionItems}
              onToggle={toggleActionItem}
              isGenerating={isGenerating}
              onDeletePlan={handleDeletePlan}
            />
          )}
        </motion.div>
      </AnimatePresence>

      {/* Navigation */}
      <div className="flex items-center justify-between gap-4 pt-2">
        <Button
          variant="outline"
          leftIcon={<ArrowLeft className="w-4 h-4" />}
          onClick={handleBack}
          disabled={currentStep === 1 || isGenerating}
        >
          Back
        </Button>

        {currentStep < TOTAL_STEPS ? (
          currentStep === 3 ? (
            <Button
              variant="primary"
              leftIcon={
                isGenerating ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <RefreshCw className="w-4 h-4" />
                )
              }
              onClick={handleGeneratePlan}
              disabled={isGenerating}
            >
              {isGenerating ? "Generating Plan..." : "Generate Plan"}
            </Button>
          ) : (
            <Button
              variant="primary"
              rightIcon={<ArrowRight className="w-4 h-4" />}
              onClick={handleNext}
              disabled={isGenerating}
            >
              Continue
            </Button>
          )
        ) : (
          <Button
            variant="primary"
            leftIcon={<Check className="w-4 h-4" />}
            onClick={() => goToStep(1)}
          >
            Start New Plan
          </Button>
        )}
      </div>
    </div>
  );
}

/* ── Step 1: Current Situation ───────────────────────────────── */

function Step1({
  formData,
  updateForm,
  validationErrors,
  disabled,
}: {
  formData: FinancialFormData;
  updateForm: (field: keyof FinancialFormData, value: string) => void;
  validationErrors: ValidationError[];
  disabled: boolean;
}) {
  function fieldError(field: string) {
    return validationErrors.find((e) => e.field === field)?.message;
  }

  return (
    <StepCard
      title="Current Situation"
      subtitle="Tell us where you are financially right now."
    >
      <div className="flex flex-col gap-4">
        {/* Required note */}
        <p className="text-xs" style={{ color: "var(--color-text-muted)" }}>
          Fields marked <span style={{ color: "#dc2626" }}>*</span> are required.
        </p>

        <Input
          id="monthly-income"
          label={<>Monthly Income (₹) <span style={{ color: "#dc2626" }}>*</span></>}
          type="number"
          min="0"
          placeholder="e.g. 50000"
          value={formData.monthlyIncome}
          onChange={(e) => updateForm("monthlyIncome", e.target.value)}
          leftIcon={<span className="text-sm font-medium">₹</span>}
          disabled={disabled}
          error={fieldError("monthlyIncome")}
        />

        {/* Employment Type */}
        <fieldset>
          <legend
            className="text-sm font-medium mb-2 block"
            style={{ color: "var(--color-text-primary)" }}
          >
            Employment Type <span style={{ color: "#dc2626" }}>*</span>
          </legend>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {EMPLOYMENT_OPTIONS.map((opt) => (
              <button
                key={opt.value}
                type="button"
                onClick={() => updateForm("employmentType", opt.value)}
                className="rounded-xl px-4 py-3 text-sm font-medium text-left transition-all duration-200 outline-none focus-visible:ring-2 flex items-center gap-2"
                aria-pressed={formData.employmentType === opt.value}
                disabled={disabled}
                style={{
                  background:
                    formData.employmentType === opt.value
                      ? "var(--color-champagne)"
                      : "var(--color-surface)",
                  border:
                    formData.employmentType === opt.value
                      ? "2px solid var(--color-rose-gold)"
                      : "1.5px solid var(--color-border)",
                  color:
                    formData.employmentType === opt.value
                      ? "var(--color-puce-red)"
                      : "var(--color-text-secondary)",
                }}
              >
                <span aria-hidden="true">{opt.icon}</span>
                {opt.label}
              </button>
            ))}
          </div>
          {validationErrors.find((e) => e.field === "employmentType") && (
            <p className="text-xs mt-1" style={{ color: "#dc2626" }}>
              {validationErrors.find((e) => e.field === "employmentType")?.message}
            </p>
          )}
        </fieldset>

        {/* Custom employment type field */}
        <AnimatePresence>
          {formData.employmentType === "other" && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              style={{ overflow: "hidden" }}
            >
              <Input
                id="custom-employment-type"
                label="Describe your employment"
                placeholder="e.g. Part-time, Contract, etc."
                value={formData.customEmploymentType}
                onChange={(e) => updateForm("customEmploymentType", e.target.value)}
                disabled={disabled}
                error={fieldError("customEmploymentType")}
              />
            </motion.div>
          )}
        </AnimatePresence>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            id="current-savings"
            label={<>Current Savings (₹) <span style={{ color: "#dc2626" }}>*</span></>}
            type="number"
            min="0"
            placeholder="e.g. 25000 (enter 0 if none)"
            value={formData.currentSavings}
            onChange={(e) => updateForm("currentSavings", e.target.value)}
            leftIcon={<span className="text-sm font-medium">₹</span>}
            disabled={disabled}
            error={fieldError("currentSavings")}
          />
          <Input
            id="monthly-expenses"
            label={<>Monthly Expenses (₹) <span style={{ color: "#dc2626" }}>*</span></>}
            type="number"
            min="0"
            placeholder="e.g. 30000"
            value={formData.monthlyExpenses}
            onChange={(e) => updateForm("monthlyExpenses", e.target.value)}
            leftIcon={<span className="text-sm font-medium">₹</span>}
            disabled={disabled}
            error={fieldError("monthlyExpenses")}
          />
        </div>
      </div>
    </StepCard>
  );
}

/* ── Step 2: Financial Goal ──────────────────────────────────── */

function Step2({
  formData,
  onSelect,
  onCustomGoalChange,
  validationErrors,
  disabled,
}: {
  formData: FinancialFormData;
  onSelect: (goal: string) => void;
  onCustomGoalChange: (v: string) => void;
  validationErrors: ValidationError[];
  disabled: boolean;
}) {
  return (
    <StepCard
      title="Choose Your Financial Goal"
      subtitle="What do you want to achieve? Select the one that fits best."
    >
      <div className="flex flex-col gap-4">
        {/* Required note */}
        <p className="text-xs" style={{ color: "var(--color-text-muted)" }}>
          Fields marked <span style={{ color: "#dc2626" }}>*</span> are required.
        </p>

        <div>
          <p className="text-sm font-medium mb-2" style={{ color: "var(--color-text-primary)" }}>
            Financial Goal <span style={{ color: "#dc2626" }}>*</span>
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
            {FINANCIAL_GOALS.map((goal, i) => (
              <GoalCard
                key={goal.id}
                id={goal.id}
                icon={goal.icon}
                label={goal.label}
                description={goal.description}
                selected={formData.goal === goal.id}
                onClick={() => onSelect(goal.id as FinancialGoalType)}
                index={i}
              />
            ))}
          </div>
          {validationErrors.find((e) => e.field === "goal") && (
            <p className="text-xs mt-2" style={{ color: "#dc2626" }}>
              {validationErrors.find((e) => e.field === "goal")?.message}
            </p>
          )}
        </div>

        {/* Custom goal field */}
        <AnimatePresence>
          {formData.goal === "other" && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              style={{ overflow: "hidden" }}
            >
              <Input
                id="custom-goal"
                label={<>Describe your goal <span style={{ color: "#dc2626" }}>*</span></>}
                placeholder="e.g. Save for wedding, Build retirement fund..."
                value={formData.customGoal}
                onChange={(e) => onCustomGoalChange(e.target.value)}
                disabled={disabled}
                error={validationErrors.find((e) => e.field === "customGoal")?.message}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </StepCard>
  );
}

/* ── Step 3: Goal Details ────────────────────────────────────── */

function Step3({
  formData,
  updateForm,
  isBusinessGoal,
  validationErrors,
  disabled,
}: {
  formData: FinancialFormData;
  updateForm: (field: keyof FinancialFormData, value: string) => void;
  isBusinessGoal: boolean;
  validationErrors: ValidationError[];
  disabled: boolean;
}) {
  const selectedGoal = FINANCIAL_GOALS.find((g) => g.id === formData.goal);

  function fieldError(field: string) {
    return validationErrors.find((e) => e.field === field)?.message;
  }

  if (isBusinessGoal) {
    return (
      <StepCard
        title="Business Details"
        subtitle="Help us understand your business idea so we can tailor your plan."
      >
        <div className="flex flex-col gap-4">
          {/* Required note */}
          <p className="text-xs" style={{ color: "var(--color-text-muted)" }}>
            Fields marked <span style={{ color: "#dc2626" }}>*</span> are required.
          </p>
          <Textarea
            id="business-idea"
            label="Business Idea"
            placeholder="Describe your business concept briefly..."
            value={formData.businessIdea}
            onChange={(e) => updateForm("businessIdea", e.target.value)}
            rows={3}
            disabled={disabled}
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              id="business-location"
              label="Location / City"
              placeholder="e.g. Bengaluru, Karnataka"
              value={formData.businessLocation}
              onChange={(e) => updateForm("businessLocation", e.target.value)}
              disabled={disabled}
            />
            <Input
              id="education"
              label="Your Education"
              placeholder="e.g. B.Com, MBA"
              value={formData.education}
              onChange={(e) => updateForm("education", e.target.value)}
              disabled={disabled}
            />
            <Input
              id="current-skills"
              label="Current Skills"
              placeholder="e.g. Marketing, Sales"
              value={formData.currentSkills}
              onChange={(e) => updateForm("currentSkills", e.target.value)}
              disabled={disabled}
            />
            <Input
              id="business-experience"
              label="Business Experience"
              placeholder="e.g. 2 years in retail"
              value={formData.businessExperience}
              onChange={(e) => updateForm("businessExperience", e.target.value)}
              disabled={disabled}
            />
          </div>
          <Input
            id="expected-investment"
            label={<>Expected Investment (₹) <span style={{ color: "#dc2626" }}>*</span></>}
            type="number"
            min="0"
            placeholder="e.g. 200000"
            value={formData.expectedInvestment}
            onChange={(e) => updateForm("expectedInvestment", e.target.value)}
            leftIcon={<span className="text-sm font-medium">₹</span>}
            error={fieldError("targetAmount")}
            disabled={disabled}
          />
          <Input
            id="goal-timeline"
            label={<>Target Timeline <span style={{ color: "#dc2626" }}>*</span></>}
            placeholder="e.g. 24 months"
            value={formData.targetTimeline}
            onChange={(e) => updateForm("targetTimeline", e.target.value)}
            error={fieldError("targetTimeline")}
            disabled={disabled}
          />
          <Textarea
            id="additional-notes"
            label="Additional Notes (Optional)"
            placeholder="Any other context that might help personalize your plan..."
            value={formData.additionalNotes}
            onChange={(e) => updateForm("additionalNotes", e.target.value)}
            rows={2}
            disabled={disabled}
          />
        </div>
      </StepCard>
    );
  }

  return (
    <StepCard
      title={`${selectedGoal?.label ?? "Goal"} Details`}
      subtitle="Give us a few more details to personalise your plan."
    >
      <div className="flex flex-col gap-4">
          {/* Required note */}
          <p className="text-xs" style={{ color: "var(--color-text-muted)" }}>
            Fields marked <span style={{ color: "#dc2626" }}>*</span> are required.
          </p>

        <Textarea
          id="goal-details"
          label="Describe your goal"
          placeholder={`Tell us more about your ${selectedGoal?.label?.toLowerCase() ?? "goal"} plan...`}
          value={formData.goalDetails}
          onChange={(e) => updateForm("goalDetails", e.target.value)}
          rows={4}
          disabled={disabled}
        />
        <Input
          id="goal-amount"
          label={<>Target Amount (₹) <span style={{ color: "#dc2626" }}>*</span></>}
          type="number"
          min="0"
          placeholder="e.g. 500000"
          value={formData.targetAmount}
          onChange={(e) => updateForm("targetAmount", e.target.value)}
          leftIcon={<span className="text-sm font-medium">₹</span>}
          error={fieldError("targetAmount")}
          disabled={disabled}
        />
        <Input
          id="goal-timeline"
          label={<>Target Timeline <span style={{ color: "#dc2626" }}>*</span></>}
          placeholder="e.g. 24 months or 2 years"
          value={formData.targetTimeline}
          onChange={(e) => updateForm("targetTimeline", e.target.value)}
          error={fieldError("targetTimeline")}
          disabled={disabled}
        />
        <Textarea
          id="additional-notes"
          label="Additional Notes (Optional)"
          placeholder="Any other context that might help personalize your plan..."
          value={formData.additionalNotes}
          onChange={(e) => updateForm("additionalNotes", e.target.value)}
          rows={2}
          disabled={disabled}
        />
      </div>
    </StepCard>
  );
}

/* ── Step 4: AI Analysis ─────────────────────────────────────── */

function Step4({
  plan,
  isGenerating,
  loadingMessage,
  error,
}: {
  plan: FinancialPlanResult | null;
  isGenerating: boolean;
  loadingMessage: string;
  error: string | null;
}) {
  if (isGenerating) {
    return (
      <StepCard
        title="AI Analysis"
        subtitle="Herizon Financial AI is building your personalized plan."
      >
        <div className="flex flex-col items-center gap-6 py-10">
          <div
            className="w-16 h-16 rounded-full flex items-center justify-center"
            style={{ background: "var(--color-champagne)" }}
          >
            <Loader2
              className="w-8 h-8 animate-spin"
              style={{ color: "var(--color-rose-gold)" }}
            />
          </div>
          <AnimatePresence mode="wait">
            <motion.p
              key={loadingMessage}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              className="text-sm font-medium text-center"
              style={{ color: "var(--color-puce-red)" }}
            >
              {loadingMessage}
            </motion.p>
          </AnimatePresence>
          <p className="text-xs text-center" style={{ color: "var(--color-text-muted)" }}>
            This usually takes 10–20 seconds
          </p>
        </div>
      </StepCard>
    );
  }

  if (error || !plan) {
    return (
      <StepCard
        title="AI Analysis"
        subtitle="Something went wrong. Please go back and try again."
      >
        <div className="flex flex-col items-center gap-4 py-10">
          <AlertTriangle
            className="w-10 h-10"
            style={{ color: "var(--color-rose-gold)" }}
          />
          <p className="text-sm text-center" style={{ color: "var(--color-text-secondary)" }}>
            {error ?? "No plan available. Please generate a plan from Step 3."}
          </p>
        </div>
      </StepCard>
    );
  }

  const { calculatedMetrics, aiAnalysis } = plan;
  const grade = calculatedMetrics.financialHealthGrade;

  return (
    <StepCard
      title="Your Financial Health"
      subtitle="Based on your inputs, here is a snapshot of your financial position."
    >
      <div className="grid grid-cols-2 gap-3">
        <FinancialStat
          label="Financial Health"
          value={`${calculatedMetrics.financialHealthScore}/100`}
          rating={calculatedMetrics.financialHealthScore}
          color={gradeColor(grade)}
          icon={<Heart className="w-3.5 h-3.5" />}
        />
        <FinancialStat
          label="Savings Rate"
          value={`${calculatedMetrics.savingsRate.toFixed(1)}%`}
          rating={calculatedMetrics.savingsRate}
          color="var(--color-rackley)"
          icon={<TrendingUp className="w-3.5 h-3.5" />}
        />
        <FinancialStat
          label="Expense Ratio"
          value={`${calculatedMetrics.expenseRatio.toFixed(1)}%`}
          rating={Math.max(0, 100 - calculatedMetrics.expenseRatio)}
          color="#d97706"
          icon={<Activity className="w-3.5 h-3.5" />}
        />
        <FinancialStat
          label="Emergency Fund"
          value={`${calculatedMetrics.emergencyFundProgress.toFixed(0)}%`}
          rating={calculatedMetrics.emergencyFundProgress}
          color="#7c3aed"
          icon={<Crosshair className="w-3.5 h-3.5" />}
        />
      </div>

      <div
        className="rounded-xl px-4 py-3 mt-4"
        style={{
          background: "var(--color-champagne)",
          border: "1px solid var(--color-border)",
        }}
      >
        <p
          className="text-sm font-medium flex items-center gap-2"
          style={{ color: "var(--color-puce-red)" }}
        >
          <BarChart2 className="w-4 h-4" aria-hidden="true" />
          AI Summary
        </p>
        <p className="text-sm mt-1" style={{ color: "var(--color-text-secondary)" }}>
          {aiAnalysis.financialHealth.summary}
        </p>
      </div>

      {/* Analysis breakdown */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4">
        {[
          { label: "Income", text: aiAnalysis.analysis.income },
          { label: "Expenses", text: aiAnalysis.analysis.expenses },
          { label: "Savings", text: aiAnalysis.analysis.savings },
          { label: "Goal", text: aiAnalysis.analysis.goal },
        ].map((item) => (
          <div
            key={item.label}
            className="rounded-xl px-4 py-3"
            style={{
              background: "var(--color-surface)",
              border: "1px solid var(--color-border)",
            }}
          >
            <p
              className="text-xs font-semibold uppercase tracking-wider mb-1"
              style={{ color: "var(--color-rose-gold)" }}
            >
              {item.label}
            </p>
            <p className="text-sm" style={{ color: "var(--color-text-secondary)" }}>
              {item.text}
            </p>
          </div>
        ))}
      </div>

      {/* Goal progress */}
      <div
        className="rounded-xl px-4 py-3 mt-2 flex items-center justify-between gap-4"
        style={{
          background: "rgba(94,123,155,0.06)",
          border: "1px solid rgba(94,123,155,0.2)",
        }}
      >
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider"
            style={{ color: "var(--color-rackley)" }}>
            Monthly Goal Contribution
          </p>
          <p className="text-lg font-bold" style={{ color: "var(--color-puce-red)" }}>
            {formatINR(calculatedMetrics.monthlyGoalContribution)}
          </p>
        </div>
        <div className="text-right">
          <p className="text-xs font-semibold uppercase tracking-wider"
            style={{ color: "var(--color-rackley)" }}>
            Estimated Completion
          </p>
          <p className="text-sm font-semibold" style={{ color: "var(--color-text-secondary)" }}>
            {calculatedMetrics.goalReachable && calculatedMetrics.estimatedGoalCompletionMonths !== null
              ? calculatedMetrics.estimatedGoalCompletionMonths === 0
                ? "Already reached!"
                : `~${calculatedMetrics.estimatedGoalCompletionMonths} months`
              : "Extend timeline"}
          </p>
        </div>
      </div>

      {/* Risk factors */}
      {aiAnalysis.riskFactors.length > 0 && (
        <div className="mt-4">
          <p
            className="text-xs font-semibold uppercase tracking-wider mb-2"
            style={{ color: "#dc2626" }}
          >
            Risk Factors
          </p>
          <ul className="flex flex-col gap-1.5">
            {aiAnalysis.riskFactors.map((risk, i) => (
              <li key={i} className="flex items-start gap-2 text-sm">
                <span
                  className="w-1.5 h-1.5 rounded-full flex-shrink-0 mt-1.5"
                  style={{ background: "#dc2626" }}
                  aria-hidden="true"
                />
                <span style={{ color: "var(--color-text-secondary)" }}>{risk}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Motivational summary */}
      {aiAnalysis.motivationalSummary && (
        <div
          className="rounded-xl px-4 py-3 mt-2 text-sm italic"
          style={{
            background: "var(--color-champagne)",
            color: "var(--color-puce-red)",
            border: "1px solid var(--color-border)",
          }}
        >
          {aiAnalysis.motivationalSummary}
        </div>
      )}
    </StepCard>
  );
}

/* ── Step 5: Budget Allocation ───────────────────────────────── */

function Step5({
  plan,
  isGenerating,
}: {
  plan: FinancialPlanResult | null;
  isGenerating: boolean;
}) {
  if (isGenerating || !plan) {
    return (
      <StepCard title="Budget Allocation" subtitle="Your personalized budget will appear here.">
        <div className="flex items-center justify-center py-12">
          <Loader2
            className="w-6 h-6 animate-spin"
            style={{ color: "var(--color-rose-gold)" }}
          />
        </div>
      </StepCard>
    );
  }

  const { calculatedMetrics, aiAnalysis } = plan;
  const income = plan.userInputs.monthlyIncome;

  // Map BudgetBreakdown to BudgetAllocation shape for BudgetCard
  const allocations = calculatedMetrics.budgetBreakdown.map((b: BudgetBreakdown) => ({
    label:       b.label,
    percent:     b.percent,
    amount:      formatINR(b.amount),
    color:       b.color,
    description: b.description,
  }));

  return (
    <StepCard
      title="Recommended Budget Allocation"
      subtitle="A personalised monthly budget based on your income and goal."
    >
      <div
        className="rounded-xl px-4 py-3 text-sm mb-2"
        style={{
          background: "rgba(94,123,155,0.08)",
          border: "1px solid rgba(94,123,155,0.2)",
          color: "var(--color-rackley-dark)",
        }}
        role="note"
      >
        Based on a monthly income of {formatINR(income)}
      </div>

      <div className="flex flex-col gap-3">
        {allocations.map((allocation) => (
          <BudgetCard
            key={allocation.label}
            allocation={allocation}
            monthlyIncome={income}
          />
        ))}
      </div>

      {/* AI budget insights */}
      {aiAnalysis.budgetInsights.length > 0 && (
        <div className="mt-4">
          <p
            className="text-xs font-semibold uppercase tracking-wider mb-2"
            style={{ color: "var(--color-rose-gold)" }}
          >
            Budget Insights
          </p>
          <ul className="flex flex-col gap-2">
            {aiAnalysis.budgetInsights.map((insight, i) => (
              <li key={i} className="flex items-start gap-2 text-sm">
                <span
                  className="w-1.5 h-1.5 rounded-full flex-shrink-0 mt-1.5"
                  style={{ background: "var(--color-rose-gold)" }}
                  aria-hidden="true"
                />
                <span style={{ color: "var(--color-text-secondary)" }}>{insight}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </StepCard>
  );
}

/* ── Step 6: Recommendations ─────────────────────────────────── */

function Step6({
  plan,
  isGenerating,
}: {
  plan: FinancialPlanResult | null;
  isGenerating: boolean;
}) {
  if (isGenerating || !plan) {
    return (
      <StepCard title="Recommendations" subtitle="Personalised recommendations will appear here.">
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-6 h-6 animate-spin" style={{ color: "var(--color-rose-gold)" }} />
        </div>
      </StepCard>
    );
  }

  const { aiAnalysis } = plan;

  // Map AI text recommendations to the RecommendationCard shape
  const recommendations = aiAnalysis.recommendations.map((text, i) => ({
    id: `rec-${i}`,
    icon: null,
    title: text.length > 60 ? text.slice(0, 57) + "..." : text,
    description: text,
    priority: (i < 3 ? "high" : i < 6 ? "medium" : "low") as "high" | "medium" | "low",
  }));

  return (
    <StepCard
      title="Personalised Recommendations"
      subtitle="Actionable steps to improve your financial position."
    >
      <div className="flex flex-col gap-3">
        {recommendations.map((rec) => (
          <RecommendationCard key={rec.id} recommendation={rec} />
        ))}
      </div>

      {/* Career investment suggestions */}
      {aiAnalysis.careerInvestment.length > 0 && (
        <div className="mt-6">
          <p
            className="text-xs font-semibold uppercase tracking-wider mb-2"
            style={{ color: "var(--color-rose-gold)" }}
          >
            Career Investments
          </p>
          <ul className="flex flex-col gap-2">
            {aiAnalysis.careerInvestment.map((item, i) => (
              <li key={i} className="flex items-start gap-2 text-sm">
                <span
                  className="w-1.5 h-1.5 rounded-full flex-shrink-0 mt-1.5"
                  style={{ background: "var(--color-rose-gold)" }}
                  aria-hidden="true"
                />
                <span style={{ color: "var(--color-text-secondary)" }}>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Learning suggestions */}
      {aiAnalysis.learningSuggestions.length > 0 && (
        <div className="mt-4">
          <p
            className="text-xs font-semibold uppercase tracking-wider mb-2"
            style={{ color: "var(--color-rackley)" }}
          >
            Learning Suggestions
          </p>
          <ul className="flex flex-col gap-2">
            {aiAnalysis.learningSuggestions.map((item, i) => (
              <li key={i} className="flex items-start gap-2 text-sm">
                <span
                  className="w-1.5 h-1.5 rounded-full flex-shrink-0 mt-1.5"
                  style={{ background: "var(--color-rackley)" }}
                  aria-hidden="true"
                />
                <span style={{ color: "var(--color-text-secondary)" }}>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </StepCard>
  );
}

/* ── Step 7: Action Plan ─────────────────────────────────────── */

function Step7({
  plan,
  actionItems,
  onToggle,
  isGenerating,
  onDeletePlan,
}: {
  plan: FinancialPlanResult | null;
  actionItems: ActionPlanItem[];
  onToggle: (id: string) => void;
  isGenerating: boolean;
  onDeletePlan: () => void;
}) {
  if (isGenerating || !plan) {
    return (
      <div className="flex flex-col gap-6">
        <StepCard title="Action Plan" subtitle="Your personalized action plan will appear here.">
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-6 h-6 animate-spin" style={{ color: "var(--color-rose-gold)" }} />
          </div>
        </StepCard>
      </div>
    );
  }

  const completedCount = actionItems.filter((i) => i.checked).length;
  const meta = plan.meta;

  return (
    <div className="flex flex-col gap-6">
      <StepCard
        title="Your Action Plan"
        subtitle={`${completedCount} of ${actionItems.length} tasks completed`}
      >
        <Checklist items={actionItems} onToggle={onToggle} />
      </StepCard>

      {/* Plan metadata */}
      <div
        className="rounded-xl px-4 py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2"
        style={{
          background: "var(--color-surface)",
          border: "1px solid var(--color-border)",
        }}
      >
        <div className="flex flex-col gap-0.5">
          <p className="text-xs font-semibold uppercase tracking-wider"
            style={{ color: "var(--color-text-muted)" }}>
            Plan Generated
          </p>
          <p className="text-sm" style={{ color: "var(--color-text-secondary)" }}>
            {new Date(meta.generated_at).toLocaleDateString("en-IN", {
              day: "numeric", month: "long", year: "numeric",
            })}
            {" · "}Powered by Herizon AI
          </p>
        </div>
        <button
          type="button"
          onClick={onDeletePlan}
          className="text-xs font-medium rounded-lg px-3 py-1.5 transition-colors"
          style={{
            color: "#dc2626",
            background: "rgba(220,38,38,0.06)",
            border: "1px solid rgba(220,38,38,0.15)",
          }}
        >
          Reset Plan
        </button>
      </div>
    </div>
  );
}

/* ── Helpers ─────────────────────────────────────────────────── */

/**
 * Restores form state from a saved plan so the user sees their previous inputs.
 */
function restoreFormFromPlan(
  plan: FinancialPlanResult,
  setFormData: React.Dispatch<React.SetStateAction<FinancialFormData>>
) {
  const inputs = plan.userInputs;
  setFormData((prev) => ({
    ...prev,
    monthlyIncome:    String(inputs.monthlyIncome),
    monthlyExpenses:  String(inputs.monthlyExpenses),
    currentSavings:   String(inputs.currentSavings),
    employmentType:   inputs.employmentType as EmploymentType,
    goal:             inputs.goal as FinancialGoalType,
    goalDetails:      inputs.goalDetails,
    targetAmount:     String(inputs.targetAmount),
    targetTimeline:   inputs.targetTimeline,
    additionalNotes:  inputs.additionalNotes,
  }));
}

/**
 * Builds ActionPlanItem[] from the AI's 30/60/90-day plan for the Checklist component.
 */
function buildActionItems(
  plan: FinancialPlanResult,
  setActionItems: React.Dispatch<React.SetStateAction<ActionPlanItem[]>>
) {
  const { actionPlan } = plan.aiAnalysis;
  const items: ActionPlanItem[] = [
    ...actionPlan["30Days"].map((text, i) => ({
      id: `30d-${i}`,
      label: text,
      checked: false,
      phase: "30" as const,
    })),
    ...actionPlan["60Days"].map((text, i) => ({
      id: `60d-${i}`,
      label: text,
      checked: false,
      phase: "60" as const,
    })),
    ...actionPlan["90Days"].map((text, i) => ({
      id: `90d-${i}`,
      label: text,
      checked: false,
      phase: "90" as const,
    })),
  ];
  setActionItems(items);
}

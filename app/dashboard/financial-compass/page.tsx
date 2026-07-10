/**
 * app/dashboard/financial-compass/page.tsx
 *
 * Financial Compass — 7-step financial planning wizard.
 *
 * Current: All data is local React state (placeholder).
 *
 * TODO Stage 2 — Supabase Autosave:
 *   - On each step completion, save formData + currentStep to Supabase
 *     (user_financial_compass table, keyed by user ID).
 *   - On page load, fetch the last saved step from Supabase and
 *     restore state so the user can continue from where they left off.
 *   - Use optimistic updates for snappy UX during save.
 *
 * TODO Stage 2 — AI Analysis (Step 4):
 *   - Call a Gemini server action with the formData from Steps 1–3.
 *   - Gemini should return: Financial Health score, Savings Rate,
 *     Income Stability, Risk Score, and personalised recommendations.
 *   - Cache the result in Supabase so the user doesn't re-trigger AI.
 */

"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  GraduationCap,
  Briefcase,
  Laptop,
  Rocket,
  Info,
  Heart,
  TrendingUp,
  Activity,
  Crosshair,
  BarChart2,
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
import {
  FINANCIAL_GOALS,
  PLACEHOLDER_BUDGET_ALLOCATIONS,
  PLACEHOLDER_RECOMMENDATIONS,
  PLACEHOLDER_ACTION_PLAN,
  PLACEHOLDER_BUSINESS_PLAN,
} from "@/lib/data/placeholder";
import type { ReactNode } from "react";
import type {
  FinancialFormData,
  FinancialGoalType,
  EmploymentType,
  ActionPlanItem,
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

const EMPLOYMENT_OPTIONS: { value: EmploymentType; label: string; icon: ReactNode }[] = [
  { value: "student", label: "Student", icon: <GraduationCap className="w-4 h-4" /> },
  { value: "working", label: "Working", icon: <Briefcase className="w-4 h-4" /> },
  { value: "freelancer", label: "Freelancer", icon: <Laptop className="w-4 h-4" /> },
  { value: "business", label: "Business Owner", icon: <Rocket className="w-4 h-4" /> },
];

const INITIAL_FORM: FinancialFormData = {
  monthlyIncome: "",
  employmentType: "",
  currentSavings: "",
  monthlyExpenses: "",
  goal: "",
  goalDetails: "",
  businessIdea: "",
  businessLocation: "",
  education: "",
  currentSkills: "",
  businessExperience: "",
  expectedInvestment: "",
};

/* ── Step transition variants ────────────────────────────────── */

const stepVariants = {
  enter: (dir: number) => ({
    x: dir > 0 ? 60 : -60,
    opacity: 0,
  }),
  center: { x: 0, opacity: 1 },
  exit: (dir: number) => ({
    x: dir > 0 ? -60 : 60,
    opacity: 0,
  }),
};

/* ── Main Component ──────────────────────────────────────────── */

export default function FinancialCompassPage() {
  const [currentStep, setCurrentStep] = useState(1);
  const [direction, setDirection] = useState(1);
  const [formData, setFormData] = useState<FinancialFormData>(INITIAL_FORM);
  const [actionItems, setActionItems] = useState<ActionPlanItem[]>(
    PLACEHOLDER_ACTION_PLAN
  );

  // TODO Stage 2: Load progress from Supabase here (useEffect on mount)

  function updateForm(field: keyof FinancialFormData, value: string) {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // TODO Stage 2: Debounce and save to Supabase after each field update
  }

  function goToStep(step: number) {
    setDirection(step > currentStep ? 1 : -1);
    setCurrentStep(step);
    // TODO Stage 2: Save currentStep to Supabase so user can resume later
  }

  function handleNext() {
    if (currentStep < TOTAL_STEPS) goToStep(currentStep + 1);
  }

  function handleBack() {
    if (currentStep > 1) goToStep(currentStep - 1);
  }

  function toggleActionItem(id: string) {
    setActionItems((items) =>
      items.map((item) =>
        item.id === id ? { ...item, checked: !item.checked } : item
      )
    );
  }

  const isBusinessGoal = formData.goal === "start-business";
  const remainingSteps = TOTAL_STEPS - currentStep;

  return (
    <div className="flex flex-col gap-8">
      <PageHeader
        title="Financial Compass"
        subtitle="Plan smarter. Grow stronger."
      />

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
            style={{
              fontFamily: "var(--font-heading)",
              color: "var(--color-puce-red)",
            }}
          >
            {STEPS[currentStep - 1]}
          </h2>
        </div>
        {remainingSteps > 0 && (
          <span
            className="text-xs"
            style={{ color: "var(--color-text-muted)" }}
          >
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

      {/* Step content with slide transition */}
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
          {currentStep === 1 && <Step1 formData={formData} updateForm={updateForm} />}
          {currentStep === 2 && (
            <Step2
              formData={formData}
              onSelect={(goal) => updateForm("goal", goal)}
            />
          )}
          {currentStep === 3 && (
            <Step3
              formData={formData}
              updateForm={updateForm}
              isBusinessGoal={isBusinessGoal}
            />
          )}
          {currentStep === 4 && <Step4 />}
          {currentStep === 5 && <Step5 />}
          {currentStep === 6 && <Step6 />}
          {currentStep === 7 && (
            <Step7
              actionItems={actionItems}
              onToggle={toggleActionItem}
              isBusinessGoal={isBusinessGoal}
            />
          )}
        </motion.div>
      </AnimatePresence>

      {/* Navigation buttons */}
      <div className="flex items-center justify-between gap-4 pt-2">
        <Button
          variant="outline"
          leftIcon={<ArrowLeft className="w-4 h-4" />}
          onClick={handleBack}
          disabled={currentStep === 1}
        >
          Back
        </Button>

        {currentStep < TOTAL_STEPS ? (
          <Button
            variant="primary"
            rightIcon={<ArrowRight className="w-4 h-4" />}
            onClick={handleNext}
          >
            {currentStep === TOTAL_STEPS - 1 ? "Generate Plan" : "Continue"}
          </Button>
        ) : (
          <Button
            variant="primary"
            leftIcon={<Check className="w-4 h-4" />}
            onClick={() => {
              // TODO Stage 2: Mark the plan as complete in Supabase
              alert("Your Financial Compass plan is complete! 🎉");
            }}
          >
            Complete Plan
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
}: {
  formData: FinancialFormData;
  updateForm: (field: keyof FinancialFormData, value: string) => void;
}) {
  return (
    <StepCard
      title="Current Situation"
      subtitle="Tell us where you are financially right now."
    >
      <div className="flex flex-col gap-4">
        {/* Monthly Income */}
        <Input
          id="monthly-income"
          label="Monthly Income (₹)"
          type="number"
          min="0"
          placeholder="e.g. 50000"
          value={formData.monthlyIncome}
          onChange={(e) => updateForm("monthlyIncome", e.target.value)}
          leftIcon={<span className="text-sm font-medium">₹</span>}
        />

        {/* Employment Type */}
        <fieldset>
          <legend
            className="text-sm font-medium mb-2 block"
            style={{ color: "var(--color-text-primary)" }}
          >
            Employment Type
          </legend>
          <div className="grid grid-cols-2 gap-2">
            {EMPLOYMENT_OPTIONS.map((opt) => (
              <button
                key={opt.value}
                type="button"
                onClick={() => updateForm("employmentType", opt.value)}
                className="rounded-xl px-4 py-3 text-sm font-medium text-left transition-all duration-200 outline-none focus-visible:ring-2 flex items-center gap-2"
                aria-pressed={formData.employmentType === opt.value}
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
        </fieldset>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Current Savings */}
          <Input
            id="current-savings"
            label="Current Savings (₹)"
            type="number"
            min="0"
            placeholder="e.g. 25000"
            value={formData.currentSavings}
            onChange={(e) => updateForm("currentSavings", e.target.value)}
            leftIcon={<span className="text-sm font-medium">₹</span>}
          />

          {/* Monthly Expenses */}
          <Input
            id="monthly-expenses"
            label="Monthly Expenses (₹)"
            type="number"
            min="0"
            placeholder="e.g. 30000"
            value={formData.monthlyExpenses}
            onChange={(e) => updateForm("monthlyExpenses", e.target.value)}
            leftIcon={<span className="text-sm font-medium">₹</span>}
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
}: {
  formData: FinancialFormData;
  onSelect: (goal: string) => void;
}) {
  return (
    <StepCard
      title="Choose Your Financial Goal"
      subtitle="What do you want to achieve? Select the one that fits best."
    >
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
    </StepCard>
  );
}

/* ── Step 3: Goal Details ────────────────────────────────────── */

function Step3({
  formData,
  updateForm,
  isBusinessGoal,
}: {
  formData: FinancialFormData;
  updateForm: (field: keyof FinancialFormData, value: string) => void;
  isBusinessGoal: boolean;
}) {
  const selectedGoal = FINANCIAL_GOALS.find((g) => g.id === formData.goal);

  if (isBusinessGoal) {
    return (
      <StepCard
        title="Business Details"
        subtitle="Help us understand your business idea so we can tailor your plan."
      >
        <div className="flex flex-col gap-4">
          <Textarea
            id="business-idea"
            label="Business Idea"
            placeholder="Describe your business concept briefly..."
            value={formData.businessIdea}
            onChange={(e) => updateForm("businessIdea", e.target.value)}
            rows={3}
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              id="business-location"
              label="Location / City"
              placeholder="e.g. Bengaluru, Karnataka"
              value={formData.businessLocation}
              onChange={(e) => updateForm("businessLocation", e.target.value)}
            />
            <Input
              id="education"
              label="Your Education"
              placeholder="e.g. B.Com, MBA"
              value={formData.education}
              onChange={(e) => updateForm("education", e.target.value)}
            />
            <Input
              id="current-skills"
              label="Current Skills"
              placeholder="e.g. Marketing, Sales"
              value={formData.currentSkills}
              onChange={(e) => updateForm("currentSkills", e.target.value)}
            />
            <Input
              id="business-experience"
              label="Business Experience"
              placeholder="e.g. 2 years in retail"
              value={formData.businessExperience}
              onChange={(e) => updateForm("businessExperience", e.target.value)}
            />
          </div>
          <Input
            id="expected-investment"
            label="Expected Investment (₹)"
            type="number"
            min="0"
            placeholder="e.g. 200000"
            value={formData.expectedInvestment}
            onChange={(e) => updateForm("expectedInvestment", e.target.value)}
            leftIcon={<span className="text-sm font-medium">₹</span>}
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
        <Textarea
          id="goal-details"
          label="Describe your goal"
          placeholder={`Tell us more about your ${selectedGoal?.label?.toLowerCase() ?? "goal"} plan...`}
          value={formData.goalDetails}
          onChange={(e) => updateForm("goalDetails", e.target.value)}
          rows={4}
        />
        <Input
          id="goal-amount"
          label="Target Amount (₹)"
          type="number"
          min="0"
          placeholder="e.g. 500000"
          onChange={() => {}}
          leftIcon={<span className="text-sm font-medium">₹</span>}
        />
        <Input
          id="goal-timeline"
          label="Target Timeline"
          placeholder="e.g. 24 months"
          onChange={() => {}}
        />
      </div>
    </StepCard>
  );
}

/* ── Step 4: AI Analysis ─────────────────────────────────────── */

function Step4() {
  // TODO Stage 2: Replace placeholder values with Gemini analysis
  // Trigger: POST to /api/financial-analysis with formData from Steps 1–3
  // Gemini returns: financialHealth, savingsRate, incomeStability, riskScore, recommendations
  // Cache result in Supabase to avoid re-running Gemini on revisit.

  return (
    <StepCard
      title="Your Financial Health"
      subtitle="Based on your inputs, here is a snapshot of your financial position."
    >
      <div
        className="rounded-xl px-4 py-3 text-sm mb-2 flex items-center gap-2"
        style={{
          background: "rgba(245,158,11,0.08)",
          border: "1px solid rgba(245,158,11,0.2)",
          color: "#92400e",
        }}
        role="note"
      >
        <Info className="w-4 h-4 flex-shrink-0" aria-hidden="true" />
        <span>These are placeholder values. In Stage 2, this analysis will be powered by Gemini AI.</span>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <FinancialStat
          label="Financial Health"
          value="Good"
          rating={72}
          color="var(--color-rose-gold)"
          icon={<Heart className="w-3.5 h-3.5" />}
        />
        <FinancialStat
          label="Savings Rate"
          value="18%"
          rating={18}
          color="var(--color-rackley)"
          icon={<TrendingUp className="w-3.5 h-3.5" />}
        />
        <FinancialStat
          label="Income Stability"
          value="Moderate"
          rating={65}
          color="#d97706"
          icon={<Activity className="w-3.5 h-3.5" />}
        />
        <FinancialStat
          label="Risk Score"
          value="Medium"
          rating={50}
          color="#7c3aed"
          icon={<Crosshair className="w-3.5 h-3.5" />}
        />
      </div>

      <div
        className="rounded-xl px-4 py-3 mt-2"
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
          Summary
        </p>
        <p
          className="text-sm mt-1"
          style={{ color: "var(--color-text-secondary)" }}
        >
          Your financial health is good. You have a moderate savings rate but
          there is room to improve. Focus on building your emergency fund before
          investing aggressively. Your income stability suggests diversifying
          income sources could reduce financial risk.
        </p>
      </div>
    </StepCard>
  );
}

/* ── Step 5: Budget Allocation ───────────────────────────────── */

function Step5() {
  const income = 50000; // Placeholder — TODO Stage 2: derive from formData

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
        Based on a monthly income of ₹{income.toLocaleString("en-IN")}
      </div>

      <div className="flex flex-col gap-3">
        {PLACEHOLDER_BUDGET_ALLOCATIONS.map((allocation) => (
          <BudgetCard
            key={allocation.label}
            allocation={allocation}
            monthlyIncome={income}
          />
        ))}
      </div>
    </StepCard>
  );
}

/* ── Step 6: Recommendations ─────────────────────────────────── */

function Step6() {
  // TODO Stage 2: Replace with Gemini-generated personalised recommendations
  // stored in Supabase after Step 4 AI Analysis

  return (
    <StepCard
      title="Personalised Recommendations"
      subtitle="Actionable steps to improve your financial position."
    >
      <div className="flex flex-col gap-3">
        {PLACEHOLDER_RECOMMENDATIONS.map((rec) => (
          <RecommendationCard key={rec.id} recommendation={rec} />
        ))}
      </div>
    </StepCard>
  );
}

/* ── Step 7: Action Plan ─────────────────────────────────────── */

function Step7({
  actionItems,
  onToggle,
  isBusinessGoal,
}: {
  actionItems: ActionPlanItem[];
  onToggle: (id: string) => void;
  isBusinessGoal: boolean;
}) {
  const completedCount = actionItems.filter((i) => i.checked).length;

  return (
    <div className="flex flex-col gap-6">
      <StepCard
        title="Your Action Plan"
        subtitle={`${completedCount} of ${actionItems.length} tasks completed`}
      >
        <Checklist items={actionItems} onToggle={onToggle} />
      </StepCard>

      {/* Business Planner — shown only if goal is Start a Business */}
      {isBusinessGoal && (
        <StepCard
          title="Business Planner"
          subtitle="A tailored roadmap for launching your business."
          icon={<Rocket className="w-5 h-5" />}
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {PLACEHOLDER_BUSINESS_PLAN.map((card) => (
              <div
                key={card.id}
                className="flex items-start gap-3 p-4 rounded-2xl"
                style={{
                  background: "var(--color-surface)",
                  border: "1px solid var(--color-border)",
                  boxShadow: "var(--shadow-card)",
                }}
              >
                <div
                  className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
                  style={{ background: "rgba(180,108,114,0.10)", color: "var(--color-rose-gold)" }}
                  aria-hidden="true"
                >
                  {card.icon}
                </div>
                <div className="flex flex-col gap-0.5 min-w-0">
                  <p
                    className="text-xs font-semibold uppercase tracking-wider"
                    style={{ color: "var(--color-text-muted)" }}
                  >
                    {card.label}
                  </p>
                  <p
                    className="text-sm font-bold"
                    style={{ color: "var(--color-puce-red)" }}
                  >
                    {card.value}
                  </p>
                  {card.description && (
                    <p
                      className="text-xs"
                      style={{ color: "var(--color-text-muted)" }}
                    >
                      {card.description}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </StepCard>
      )}
    </div>
  );
}

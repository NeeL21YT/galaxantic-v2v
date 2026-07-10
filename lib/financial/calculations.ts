/**
 * lib/financial/calculations.ts
 *
 * ALL deterministic financial calculations for Financial Compass.
 *
 * Rules:
 * - No AI logic. No Supabase. Pure functions only.
 * - All monetary values are in INR.
 * - Percentages are 0–100 unless noted.
 * - Every calculation is documented with its formula.
 */

import type {
  BudgetBreakdown,
  FinancialHealthInputs,
  CalculatedMetrics,
  FinancialGoalType,
} from "@/types/dashboard";

/* ── Versioning ──────────────────────────────────────────────── */

/**
 * Increment this when the calculation logic changes significantly.
 * Saved plans store this version so future code can detect stale plans.
 */
export const CALCULATION_VERSION = "financial-calculation-v1";

/* ── Core Calculations ───────────────────────────────────────── */

/**
 * Disposable Income = Monthly Income − Monthly Expenses
 * Clamped to 0 (cannot be negative for planning purposes).
 */
export function calculateDisposableIncome(income: number, expenses: number): number {
  return Math.max(0, income - expenses);
}

/**
 * Savings Rate = (Current Savings ÷ Monthly Income) × 100
 * Represents how many months of income is saved.
 */
export function calculateSavingsRate(savings: number, income: number): number {
  if (income <= 0) return 0;
  return Math.min(100, (savings / income) * 100);
}

/**
 * Expense Ratio = (Monthly Expenses ÷ Monthly Income) × 100
 * Healthy range: < 70%. Warning: 70–85%. Critical: > 85%.
 */
export function calculateExpenseRatio(expenses: number, income: number): number {
  if (income <= 0) return 100;
  return Math.min(100, (expenses / income) * 100);
}

/**
 * Emergency Fund Target = Monthly Expenses × 6 months
 * Standard personal finance recommendation.
 */
export function calculateEmergencyFundTarget(expenses: number): number {
  return expenses * 6;
}

/**
 * Monthly Goal Contribution = Target Amount remaining ÷ Remaining months
 * Clamped to disposable income (can't contribute more than disposable).
 */
export function calculateMonthlyGoalContribution(
  disposableIncome: number,
  targetAmount: number,
  currentSavings: number,
  timelineMonths: number
): number {
  if (timelineMonths <= 0 || targetAmount <= 0) return 0;
  const remaining = Math.max(0, targetAmount - currentSavings);
  const requiredMonthly = remaining / timelineMonths;
  return Math.min(requiredMonthly, disposableIncome);
}

/**
 * Estimated Goal Completion
 * Based on current savings + monthly contribution toward target.
 * Returns null months if income is 0 or goal is already reached.
 */
export function estimateGoalCompletion(
  currentSavings: number,
  monthlyContribution: number,
  targetAmount: number
): { months: number | null; reachable: boolean } {
  if (currentSavings >= targetAmount) {
    return { months: 0, reachable: true };
  }
  if (monthlyContribution <= 0) {
    return { months: null, reachable: false };
  }
  const remaining = targetAmount - currentSavings;
  const months = Math.ceil(remaining / monthlyContribution);
  return { months, reachable: true };
}

/* ── Income Stability Score ──────────────────────────────────── */

/**
 * Maps employment type to a stability score (0–100).
 * Used as one weighted input to the financial health score.
 */
function employmentStabilityScore(employmentType: string): number {
  const scores: Record<string, number> = {
    working: 85,
    business: 70,
    freelancer: 55,
    student: 40,
    other: 60,
  };
  return scores[employmentType] ?? 60;
}

/* ── Goal Difficulty Score ───────────────────────────────────── */

/**
 * Calculates how difficult the goal is to achieve based on
 * the required monthly contribution vs disposable income.
 * Lower score = harder goal.
 */
function goalDifficultyScore(
  monthlyContribution: number,
  disposableIncome: number
): number {
  if (disposableIncome <= 0) return 0;
  const ratio = monthlyContribution / disposableIncome;
  // If contribution <= 30% of disposable, goal is easy (score: 100)
  // If contribution > 80% of disposable, goal is very hard (score: 10)
  if (ratio <= 0.3) return 100;
  if (ratio <= 0.5) return 75;
  if (ratio <= 0.7) return 50;
  if (ratio <= 0.9) return 25;
  return 10;
}

/* ── Financial Health Inputs ─────────────────────────────────── */

export function calculateFinancialHealthInputs(
  income: number,
  expenses: number,
  savings: number,
  employmentType: string,
  monthlyContribution: number,
  disposableIncome: number
): FinancialHealthInputs {
  const emergencyFundTarget = calculateEmergencyFundTarget(expenses);
  const emergencyFundProgress =
    emergencyFundTarget > 0
      ? Math.min(100, (savings / emergencyFundTarget) * 100)
      : 100;

  return {
    savingsRate: calculateSavingsRate(savings, income),
    expenseRatio: calculateExpenseRatio(expenses, income),
    emergencyFundProgress,
    goalDifficultyScore: goalDifficultyScore(monthlyContribution, disposableIncome),
    incomeStabilityScore: employmentStabilityScore(employmentType),
    disposableIncomeRatio:
      income > 0 ? Math.min(100, (disposableIncome / income) * 100) : 0,
  };
}

/* ── Financial Health Score ──────────────────────────────────── */

/**
 * Fully deterministic composite score (0–100).
 *
 * Weighted factors:
 * - Expense Ratio (inverted):   25% — lower expenses = better
 * - Savings Rate:               20% — more savings = better
 * - Emergency Fund Progress:    20% — safety net coverage
 * - Income Stability:           15% — employment type stability
 * - Disposable Income Ratio:    10% — breathing room
 * - Goal Difficulty (inverted): 10% — realistic goal = better
 */
export function calculateFinancialHealthScore(inputs: FinancialHealthInputs): number {
  const expenseScore = Math.max(0, 100 - inputs.expenseRatio); // Invert: low expense = high score

  const weighted =
    expenseScore * 0.25 +
    inputs.savingsRate * 0.20 +
    inputs.emergencyFundProgress * 0.20 +
    inputs.incomeStabilityScore * 0.15 +
    inputs.disposableIncomeRatio * 0.10 +
    inputs.goalDifficultyScore * 0.10;

  return Math.round(Math.min(100, Math.max(0, weighted)));
}

export function scoreToGrade(
  score: number
): "Excellent" | "Good" | "Fair" | "Needs Improvement" {
  if (score >= 80) return "Excellent";
  if (score >= 60) return "Good";
  if (score >= 40) return "Fair";
  return "Needs Improvement";
}

/* ── Budget Breakdown ────────────────────────────────────────── */

const BUDGET_COLORS: Record<string, string> = {
  "Living Expenses":          "#b46c72",
  "Emergency Fund":           "#7c3aed",
  "Goal Savings":             "#5e7b9b",
  "Learning & Certifications":"#d97706",
  "Insurance":                "#16a34a",
  "Lifestyle":                "#db2777",
  "Discretionary":            "#9ca3af",
  "Career Investment":        "#ea580c",
};

/**
 * Calculates a personalised monthly budget allocation.
 * Amounts are calculated from income; percentages are derived from that.
 * The goal type influences how savings are prioritised.
 */
export function calculateBudgetBreakdown(
  income: number,
  expenses: number,
  disposableIncome: number,
  goal: FinancialGoalType | string
): BudgetBreakdown[] {
  if (income <= 0) return [];

  // Base: living expenses are what the user actually spends
  const livingExpenses = Math.min(expenses, income * 0.65);
  const remaining = income - livingExpenses;

  // Allocation of remaining budget, biased by goal type
  const isEmergencyGoal = goal === "emergency-fund";
  const isEducationGoal = goal === "higher-education";
  const isBusinessGoal = goal === "start-business";

  const emergencyAlloc = isEmergencyGoal ? remaining * 0.40 : remaining * 0.20;
  const goalSavingsAlloc = isEmergencyGoal ? remaining * 0.20 :
    isBusinessGoal ? remaining * 0.30 : remaining * 0.25;
  const learningAlloc = isEducationGoal ? remaining * 0.25 :
    isBusinessGoal ? remaining * 0.15 : remaining * 0.10;
  const insuranceAlloc = remaining * 0.08;
  const lifestyleAlloc = remaining * 0.10;
  const careerAlloc = isBusinessGoal ? remaining * 0.10 : remaining * 0.05;
  const discretionaryAlloc = Math.max(0,
    remaining - emergencyAlloc - goalSavingsAlloc - learningAlloc - insuranceAlloc - lifestyleAlloc - careerAlloc
  );

  const alloc: Array<{ label: string; amount: number; description: string }> = [
    { label: "Living Expenses",           amount: livingExpenses,    description: "Rent, groceries, utilities, and essential bills" },
    { label: "Emergency Fund",            amount: emergencyAlloc,    description: "Building your 6-month safety net" },
    { label: "Goal Savings",             amount: goalSavingsAlloc,  description: "Monthly contribution toward your primary financial goal" },
    { label: "Learning & Certifications",amount: learningAlloc,     description: "Courses, books, and certifications for career growth" },
    { label: "Insurance",                amount: insuranceAlloc,    description: "Health, life, and asset protection" },
    { label: "Lifestyle",                amount: lifestyleAlloc,    description: "Dining, entertainment, and personal care" },
    { label: "Career Investment",        amount: careerAlloc,       description: "Networking, tools, and professional memberships" },
    { label: "Discretionary",            amount: discretionaryAlloc,description: "Flexible spending for remaining needs" },
  ];

  return alloc
    .filter((a) => a.amount > 0)
    .map((a) => ({
      label:       a.label,
      amount:      Math.round(a.amount),
      percent:     Math.round((a.amount / income) * 100),
      color:       BUDGET_COLORS[a.label] ?? "#9ca3af",
      description: a.description,
    }));
}

/* ── Input Hash ──────────────────────────────────────────────── */

/**
 * Generates a stable string key from financial inputs.
 * Used to detect whether inputs have changed and regeneration is required.
 * Not a cryptographic hash — just a deterministic fingerprint.
 */
export function generateInputHash(inputs: {
  monthlyIncome: number;
  monthlyExpenses: number;
  currentSavings: number;
  employmentType: string;
  goal: string;
  targetAmount: number;
  targetTimeline: string;
}): string {
  const canonical = [
    Math.round(inputs.monthlyIncome),
    Math.round(inputs.monthlyExpenses),
    Math.round(inputs.currentSavings),
    inputs.employmentType.trim().toLowerCase(),
    inputs.goal.trim().toLowerCase(),
    Math.round(inputs.targetAmount),
    inputs.targetTimeline.trim().toLowerCase(),
  ].join("|");

  // Simple deterministic hash (djb2 variant) — no crypto dependency needed
  let hash = 5381;
  for (let i = 0; i < canonical.length; i++) {
    hash = (hash * 33) ^ canonical.charCodeAt(i);
  }
  return (hash >>> 0).toString(16); // unsigned 32-bit hex
}

/* ── Full Metrics Calculation ────────────────────────────────── */

/**
 * Orchestrates all calculations from raw user inputs.
 * Returns the complete CalculatedMetrics object ready to pass to Gemini.
 */
export function calculateAllMetrics(inputs: {
  monthlyIncome: number;
  monthlyExpenses: number;
  currentSavings: number;
  employmentType: string;
  goal: FinancialGoalType | string;
  targetAmount: number;
  targetTimeline: string; // e.g. "12 months", "24 months"
}): CalculatedMetrics {
  const { monthlyIncome, monthlyExpenses, currentSavings, employmentType, goal, targetAmount, targetTimeline } = inputs;

  // Parse timeline to months
  const timelineMonths = parseTimelineMonths(targetTimeline);

  const disposableIncome = calculateDisposableIncome(monthlyIncome, monthlyExpenses);
  const savingsRate = calculateSavingsRate(currentSavings, monthlyIncome);
  const expenseRatio = calculateExpenseRatio(monthlyExpenses, monthlyIncome);
  const emergencyFundTarget = calculateEmergencyFundTarget(monthlyExpenses);
  const monthlyGoalContribution = calculateMonthlyGoalContribution(
    disposableIncome, targetAmount, currentSavings, timelineMonths
  );
  const { months: estimatedMonths, reachable: goalReachable } = estimateGoalCompletion(
    currentSavings, monthlyGoalContribution, targetAmount
  );
  const budgetBreakdown = calculateBudgetBreakdown(
    monthlyIncome, monthlyExpenses, disposableIncome, goal as FinancialGoalType
  );
  const healthInputs = calculateFinancialHealthInputs(
    monthlyIncome, monthlyExpenses, currentSavings, employmentType,
    monthlyGoalContribution, disposableIncome
  );
  const financialHealthScore = calculateFinancialHealthScore(healthInputs);
  const financialHealthGrade = scoreToGrade(financialHealthScore);
  const emergencyFundProgress =
    emergencyFundTarget > 0
      ? Math.min(100, (currentSavings / emergencyFundTarget) * 100)
      : 100;

  return {
    disposableIncome,
    savingsRate,
    expenseRatio,
    emergencyFundTarget,
    emergencyFundProgress,
    monthlyGoalContribution,
    estimatedGoalCompletionMonths: estimatedMonths,
    goalReachable,
    financialHealthScore,
    financialHealthGrade,
    budgetBreakdown,
    inputs: healthInputs,
  };
}

/**
 * Parses a timeline string into a number of months.
 * Accepts: "12", "12 months", "2 years", "18 months", etc.
 */
export function parseTimelineMonths(timeline: string): number {
  if (!timeline) return 12;
  const lower = timeline.toLowerCase().trim();
  const years = lower.match(/(\d+)\s*year/);
  if (years) return parseInt(years[1], 10) * 12;
  const months = lower.match(/(\d+)/);
  if (months) return Math.max(1, parseInt(months[1], 10));
  return 12;
}

/**
 * lib/financial/prompt-builder.ts
 *
 * Builds the Gemini prompt for Financial Compass AI analysis.
 *
 * Contract:
 * - All mathematical calculations are done BEFORE this module is called.
 * - This module only formats existing values into a prompt string.
 * - Gemini MUST NOT recalculate any numbers. It only explains them.
 */

import { CALCULATION_VERSION } from "./calculations";
import type {
  FinancialGeminiAnalysis,
  CalculatedMetrics,
} from "@/types/dashboard";

export const PROMPT_VERSION = "financial-prompt-v1";

/* ── Response Schema (for Gemini structured output) ──────────── */

export const FINANCIAL_RESPONSE_SCHEMA = {
  type: "object" as const,
  properties: {
    financialHealth: {
      type: "object" as const,
      properties: {
        score: { type: "integer" as const },
        grade: { type: "string" as const },
        summary: { type: "string" as const },
      },
      required: ["score", "grade", "summary"],
    },
    analysis: {
      type: "object" as const,
      properties: {
        income:   { type: "string" as const },
        expenses: { type: "string" as const },
        savings:  { type: "string" as const },
        goal:     { type: "string" as const },
      },
      required: ["income", "expenses", "savings", "goal"],
    },
    recommendations: { type: "array" as const, items: { type: "string" as const } },
    budgetInsights:   { type: "array" as const, items: { type: "string" as const } },
    riskFactors:      { type: "array" as const, items: { type: "string" as const } },
    actionPlan: {
      type: "object" as const,
      properties: {
        "30Days": { type: "array" as const, items: { type: "string" as const } },
        "60Days": { type: "array" as const, items: { type: "string" as const } },
        "90Days": { type: "array" as const, items: { type: "string" as const } },
      },
      required: ["30Days", "60Days", "90Days"],
    },
    careerInvestment:   { type: "array" as const, items: { type: "string" as const } },
    learningSuggestions:{ type: "array" as const, items: { type: "string" as const } },
    motivationalSummary:{ type: "string" as const },
  },
  required: [
    "financialHealth", "analysis", "recommendations", "budgetInsights",
    "riskFactors", "actionPlan", "careerInvestment", "learningSuggestions",
    "motivationalSummary",
  ],
};

/* ── System Prompt ───────────────────────────────────────────── */

const SYSTEM_PROMPT = `You are Herizon Financial AI, an educational financial planning assistant built into the Herizon career empowerment platform for women.

Your role is to help users save money, budget responsibly, build financial stability, achieve financial goals, and invest in career growth.

CRITICAL RULES:
- You are an educational financial guidance tool, NOT a licensed financial advisor.
- You MUST use ONLY the pre-calculated numbers provided in the prompt. NEVER recalculate percentages, savings rates, timelines, or amounts.
- NEVER guarantee investment returns or promise specific financial outcomes.
- NEVER provide tax advice or legal advice.
- NEVER recommend risky financial behaviour.
- All numbers (health score, budget percentages, amounts, timelines) are already calculated. Your job is to EXPLAIN and PERSONALIZE them.
- Provide practical, conservative, and empowering advice.
- Always explain your reasoning in plain language.
- Use Indian Rupee (INR / ₹) as the currency context.`;

/* ── Goal Label Map ──────────────────────────────────────────── */

function goalLabel(goal: string): string {
  const labels: Record<string, string> = {
    "higher-education": "Higher Education",
    "emergency-fund":   "Emergency Fund",
    "start-business":   "Start a Business",
    "buy-laptop":       "Buy a Laptop",
    "home":             "Own a Home",
    "vehicle":          "Buy a Vehicle",
    "other":            "Custom Financial Goal",
  };
  return labels[goal] ?? goal;
}

/* ── Prompt Builder ──────────────────────────────────────────── */

export interface PromptInputs {
  employmentType: string;
  monthlyIncome: number;
  monthlyExpenses: number;
  currentSavings: number;
  goal: string;
  goalDetails: string;
  targetAmount: number;
  targetTimeline: string;
  additionalNotes: string;
  metrics: CalculatedMetrics;
  // Optional enrichment from profile
  careerGoals?: string | null;
  resumeScore?: number | null;
  careerStage?: string | null;
}

export function buildFinancialPrompt(inputs: PromptInputs): string {
  const { metrics } = inputs;
  const fmt = (n: number) => `₹${n.toLocaleString("en-IN")}`;

  const budgetBreakdownText = metrics.budgetBreakdown
    .map((b) => `  - ${b.label}: ${b.percent}% (${fmt(b.amount)})/month — ${b.description}`)
    .join("\n");

  const goalCompletionText = metrics.goalReachable && metrics.estimatedGoalCompletionMonths !== null
    ? `${metrics.estimatedGoalCompletionMonths} months at the current monthly contribution rate`
    : "Goal may not be reachable within the stated timeline at current savings rate";

  const careerContext = [
    inputs.careerStage ? `Career Stage: ${inputs.careerStage}` : null,
    inputs.resumeScore !== null && inputs.resumeScore !== undefined
      ? `Resume Score: ${inputs.resumeScore}/100` : null,
    inputs.careerGoals ? `Career Goals: ${inputs.careerGoals}` : null,
  ].filter(Boolean).join("\n");

  return `${SYSTEM_PROMPT}

---

## USER FINANCIAL PROFILE

Employment Type: ${inputs.employmentType}
Monthly Income: ${fmt(inputs.monthlyIncome)}
Monthly Expenses: ${fmt(inputs.monthlyExpenses)}
Current Savings: ${fmt(inputs.currentSavings)}
Financial Goal: ${goalLabel(inputs.goal)}
Goal Details: ${inputs.goalDetails || "Not specified"}
Target Amount: ${fmt(inputs.targetAmount)}
Target Timeline: ${inputs.targetTimeline || "Not specified"}
${inputs.additionalNotes ? `Additional Notes: ${inputs.additionalNotes}` : ""}
${careerContext ? `\n## CAREER CONTEXT\n${careerContext}` : ""}

---

## PRE-CALCULATED FINANCIAL METRICS
(These numbers are mathematically exact. Use them as-is. Do NOT recalculate.)

Disposable Income: ${fmt(metrics.disposableIncome)}/month
Savings Rate: ${metrics.savingsRate.toFixed(1)}%
Expense Ratio: ${metrics.expenseRatio.toFixed(1)}%
Emergency Fund Target: ${fmt(metrics.emergencyFundTarget)} (6 months of expenses)
Emergency Fund Progress: ${metrics.inputs.emergencyFundProgress.toFixed(1)}% of target covered
Monthly Goal Contribution: ${fmt(metrics.monthlyGoalContribution)}/month
Estimated Goal Completion: ${goalCompletionText}
Income Stability Score: ${metrics.inputs.incomeStabilityScore}/100

## FINANCIAL HEALTH SCORE (pre-calculated, deterministic)
Score: ${metrics.financialHealthScore}/100
Grade: ${metrics.financialHealthGrade}

## BUDGET BREAKDOWN (pre-calculated, deterministic)
${budgetBreakdownText}

Calculation Version: ${CALCULATION_VERSION}

---

## YOUR TASK

Using ONLY the values above, provide a complete financial analysis with the following structure:

1. financialHealth: Repeat the exact score (${metrics.financialHealthScore}) and grade (${metrics.financialHealthGrade}). Write a 2–3 sentence summary explaining WHY this score was achieved based on the metrics.

2. analysis: Write 1–2 sentence insights for income, expenses, savings, and goal progress.

3. recommendations: Provide 5–8 actionable, personalized recommendations. Be specific to this user's employment type and goal. No generic advice.

4. budgetInsights: For each budget category in the allocation above, explain in 1 sentence WHY that category receives its allocation. Reference the actual amounts.

5. riskFactors: Identify 2–4 specific financial risks based on the metrics (e.g., high expense ratio, low emergency fund, slow goal progress). Be direct and clear.

6. actionPlan: Provide 3–4 concrete actions for each period:
   - 30Days: Immediate steps this month
   - 60Days: Short-term actions for the next 2 months
   - 90Days: Medium-term actions for the next 3 months

7. careerInvestment: Suggest 2–3 specific career investments (certifications, skills, tools) that could improve this user's long-term income potential, relevant to their employment type and goals.

8. learningSuggestions: Suggest 2–3 specific learning resources or topics that would benefit this user financially and professionally.

9. motivationalSummary: A 2–3 sentence empowering closing message personalised to this user's specific situation and goal.

Return ONLY valid JSON matching the schema. Do not include any text outside the JSON.`;
}

/* ── Response Validation ─────────────────────────────────────── */

export function validateFinancialGeminiResponse(raw: unknown): FinancialGeminiAnalysis {
  if (!raw || typeof raw !== "object") {
    throw new Error("Invalid Gemini response: not an object");
  }

  const r = raw as Record<string, unknown>;

  function safeString(val: unknown, fallback = ""): string {
    return typeof val === "string" && val.trim() ? val.trim() : fallback;
  }

  function safeStringArray(val: unknown): string[] {
    if (!Array.isArray(val)) return [];
    return val.map((v) => String(v).trim()).filter(Boolean);
  }

  function safeObj(val: unknown): Record<string, unknown> {
    return val && typeof val === "object" && !Array.isArray(val)
      ? (val as Record<string, unknown>)
      : {};
  }

  const health = safeObj(r.financialHealth);
  const analysis = safeObj(r.analysis);
  const actionPlanRaw = safeObj(r.actionPlan);

  return {
    financialHealth: {
      score:   typeof health.score === "number" ? health.score : 0,
      grade:   safeString(health.grade, "Fair"),
      summary: safeString(health.summary, "Financial analysis completed."),
    },
    analysis: {
      income:   safeString(analysis.income,   "Income analysis not available."),
      expenses: safeString(analysis.expenses, "Expense analysis not available."),
      savings:  safeString(analysis.savings,  "Savings analysis not available."),
      goal:     safeString(analysis.goal,     "Goal analysis not available."),
    },
    recommendations:     safeStringArray(r.recommendations),
    budgetInsights:      safeStringArray(r.budgetInsights),
    riskFactors:         safeStringArray(r.riskFactors),
    actionPlan: {
      "30Days": safeStringArray(actionPlanRaw["30Days"]),
      "60Days": safeStringArray(actionPlanRaw["60Days"]),
      "90Days": safeStringArray(actionPlanRaw["90Days"]),
    },
    careerInvestment:    safeStringArray(r.careerInvestment),
    learningSuggestions: safeStringArray(r.learningSuggestions),
    motivationalSummary: safeString(r.motivationalSummary, "Keep building toward your financial goals!"),
  };
}

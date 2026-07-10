"use server";

/**
 * app/dashboard/financial-compass/actions.ts
 *
 * Server Actions for Financial Compass AI Integration (Stage 2G).
 *
 * Flow:
 * validateInputs → generateInputHash → check cache → calculateAllMetrics
 *   → buildFinancialPrompt → sendFinancialPromptToGemini → assemblePlanJson
 *   → saveFinancialPlan → return FinancialPlanResult
 */

import { getUser } from "@/lib/supabase/server";
import { calculateAllMetrics, generateInputHash, CALCULATION_VERSION } from "@/lib/financial/calculations";
import { buildFinancialPrompt, PROMPT_VERSION } from "@/lib/financial/prompt-builder";
import {
  sendFinancialPromptToGemini,
  getFriendlyFinancialErrorMessage,
  FinancialGeminiError,
} from "@/lib/financial/gemini-financial";
import {
  saveFinancialPlan,
  loadLatestFinancialPlan,
  deleteFinancialPlan,
  mapPlanRowToResult,
} from "@/lib/financial/database";
import { createClient } from "@/lib/supabase/server";
import type { FinancialFormData, FinancialPlanResult } from "@/types/dashboard";
import type { Profile, Resume } from "@/types/database";
import type { ResumeAnalysis } from "@/types/resume-analysis";

/* ── Auth Helper ─────────────────────────────────────────────── */

async function requireAuth() {
  const user = await getUser();
  if (!user) throw new Error("UNAUTHENTICATED");
  return user;
}

/* ── Validation ──────────────────────────────────────────────── */

export interface ValidationError {
  field: string;
  message: string;
}

function validateFinancialInputs(
  formData: FinancialFormData
): { valid: true; inputs: ParsedInputs } | { valid: false; errors: ValidationError[] } {
  const errors: ValidationError[] = [];

  const income = parseFloat(formData.monthlyIncome);
  if (!formData.monthlyIncome || isNaN(income) || income <= 0) {
    errors.push({ field: "monthlyIncome", message: "Monthly income must be greater than zero." });
  }

  const expenses = parseFloat(formData.monthlyExpenses);
  if (!formData.monthlyExpenses || isNaN(expenses) || expenses < 0) {
    errors.push({ field: "monthlyExpenses", message: "Monthly expenses cannot be negative." });
  }

  if (!isNaN(income) && !isNaN(expenses) && expenses > income * 2) {
    errors.push({ field: "monthlyExpenses", message: "Monthly expenses seem unusually high. Please double-check." });
  }

  const savings = parseFloat(formData.currentSavings);
  if (!formData.currentSavings || isNaN(savings) || savings < 0) {
    errors.push({ field: "currentSavings", message: "Current savings cannot be negative." });
  }

  if (!formData.employmentType) {
    errors.push({ field: "employmentType", message: "Please select your employment type." });
  }

  if (formData.employmentType === "other" && !formData.customEmploymentType?.trim()) {
    errors.push({ field: "customEmploymentType", message: "Please describe your employment type." });
  }

  if (!formData.goal) {
    errors.push({ field: "goal", message: "Please select a financial goal." });
  }

  if (formData.goal === "other" && !formData.customGoal?.trim()) {
    errors.push({ field: "customGoal", message: "Please describe your financial goal." });
  }

  const targetAmount = parseFloat(formData.targetAmount);
  if (!formData.targetAmount || isNaN(targetAmount) || targetAmount <= 0) {
    errors.push({ field: "targetAmount", message: "Target amount must be greater than zero." });
  }

  if (!formData.targetTimeline?.trim()) {
    errors.push({ field: "targetTimeline", message: "Please specify your target timeline." });
  }

  if (errors.length > 0) {
    return { valid: false, errors };
  }

  const effectiveEmploymentType =
    formData.employmentType === "other"
      ? (formData.customEmploymentType?.trim() ?? "other")
      : formData.employmentType;

  const effectiveGoal =
    formData.goal === "other"
      ? (formData.customGoal?.trim() ?? "other")
      : formData.goal;

  return {
    valid: true,
    inputs: {
      monthlyIncome:    income,
      monthlyExpenses:  expenses,
      currentSavings:   savings,
      employmentType:   effectiveEmploymentType,
      goal:             effectiveGoal,
      goalDetails:      formData.goalDetails?.trim() ?? "",
      targetAmount:     targetAmount,
      targetTimeline:   formData.targetTimeline?.trim() ?? "",
      additionalNotes:  formData.additionalNotes?.trim() ?? "",
    },
  };
}

interface ParsedInputs {
  monthlyIncome: number;
  monthlyExpenses: number;
  currentSavings: number;
  employmentType: string;
  goal: string;
  goalDetails: string;
  targetAmount: number;
  targetTimeline: string;
  additionalNotes: string;
}

/* ── Load User Career Context ────────────────────────────────── */

async function loadUserCareerContext(userId: string): Promise<{
  profile: Profile | null;
  resumeScore: number | null;
  careerGoals: string | null;
  careerStage: string | null;
}> {
  try {
    const supabase = await createClient();
    const [profileResult, resumeResult] = await Promise.all([
      supabase
        .from("profiles")
        .select("career_stage, interests")
        .eq("auth_user_id", userId)
        .maybeSingle(),
      supabase
        .from("resumes")
        .select("resume_score, analysis_json")
        .eq("user_id", userId)
        .eq("analysis_status", "completed")
        .order("analyzed_at", { ascending: false })
        .limit(1)
        .maybeSingle(),
    ]);

    const profile = profileResult.data as Profile | null;
    const resume = resumeResult.data as (Resume & { analysis_json: ResumeAnalysis }) | null;

    return {
      profile,
      resumeScore: resume?.resume_score ?? null,
      careerGoals: Array.isArray(profile?.interests) ? profile!.interests.join(", ") : null,
      careerStage: profile?.career_stage ?? null,
    };
  } catch {
    return { profile: null, resumeScore: null, careerGoals: null, careerStage: null };
  }
}

/* ── Action Types ────────────────────────────────────────────── */

export type GenerateFinancialPlanResult =
  | { success: true; plan: FinancialPlanResult; cached: boolean }
  | { success: false; error: string; validationErrors?: ValidationError[] };

export type LoadFinancialPlanResult =
  | { success: true; plan: FinancialPlanResult | null }
  | { success: false; error: string };

export type DeleteFinancialPlanResult =
  | { success: true }
  | { success: false; error: string };

/* ── Generate Financial Plan ─────────────────────────────────── */

export async function generateFinancialPlanAction(
  formData: FinancialFormData
): Promise<GenerateFinancialPlanResult> {
  try {
    const user = await requireAuth();

    // 1. Validate inputs
    const validation = validateFinancialInputs(formData);
    if (!validation.valid) {
      return {
        success: false,
        error: "Please fix the validation errors before generating your plan.",
        validationErrors: validation.errors,
      };
    }

    const inputs = validation.inputs;

    // 2. Generate stable input hash
    const inputHash = generateInputHash({
      monthlyIncome:  inputs.monthlyIncome,
      monthlyExpenses:inputs.monthlyExpenses,
      currentSavings: inputs.currentSavings,
      employmentType: inputs.employmentType,
      goal:           inputs.goal,
      targetAmount:   inputs.targetAmount,
      targetTimeline: inputs.targetTimeline,
    });

    // 3. Check cache — if hash matches, return existing plan
    const existingPlan = await loadLatestFinancialPlan(user.id);
    if (existingPlan && existingPlan.input_hash === inputHash) {
      const result = mapPlanRowToResult(existingPlan);
      if (result) {
        return { success: true, plan: result, cached: true };
      }
    }

    // 4. Deterministic calculations (no AI)
    const calculatedMetrics = calculateAllMetrics({
      monthlyIncome:  inputs.monthlyIncome,
      monthlyExpenses:inputs.monthlyExpenses,
      currentSavings: inputs.currentSavings,
      employmentType: inputs.employmentType,
      goal:           inputs.goal,
      targetAmount:   inputs.targetAmount,
      targetTimeline: inputs.targetTimeline,
    });

    // 5. Load optional career context to enrich prompt
    const careerContext = await loadUserCareerContext(user.id);

    // 6. Build prompt (receives all pre-calculated values)
    const prompt = buildFinancialPrompt({
      employmentType: inputs.employmentType,
      monthlyIncome:  inputs.monthlyIncome,
      monthlyExpenses:inputs.monthlyExpenses,
      currentSavings: inputs.currentSavings,
      goal:           inputs.goal,
      goalDetails:    inputs.goalDetails,
      targetAmount:   inputs.targetAmount,
      targetTimeline: inputs.targetTimeline,
      additionalNotes:inputs.additionalNotes,
      metrics:        calculatedMetrics,
      careerGoals:    careerContext.careerGoals,
      resumeScore:    careerContext.resumeScore,
      careerStage:    careerContext.careerStage,
    });

    // 7. Gemini — explanation only, no calculations
    const geminiResult = await sendFinancialPromptToGemini(prompt);

    // 8. Assemble plan_json (single source of truth)
    const now = new Date().toISOString();
    const planJson: Record<string, unknown> = {
      userInputs: {
        monthlyIncome:  inputs.monthlyIncome,
        monthlyExpenses:inputs.monthlyExpenses,
        currentSavings: inputs.currentSavings,
        employmentType: inputs.employmentType,
        goal:           inputs.goal,
        goalDetails:    inputs.goalDetails,
        targetAmount:   inputs.targetAmount,
        targetTimeline: inputs.targetTimeline,
        additionalNotes:inputs.additionalNotes,
      },
      calculatedMetrics,
      aiAnalysis: geminiResult.analysis,
      meta: {
        generated_at:        now,
        model_used:          geminiResult.modelUsed,
        calculation_version: CALCULATION_VERSION,
        prompt_version:      PROMPT_VERSION,
        processing_time_ms:  geminiResult.processingTimeMs,
      },
    };

    // 9. Save to Supabase
    const savedRow = await saveFinancialPlan(
      user.id,
      {
        monthlyIncome:  inputs.monthlyIncome,
        monthlyExpenses:inputs.monthlyExpenses,
        currentSavings: inputs.currentSavings,
        goal:           inputs.goal,
        employmentType: inputs.employmentType,
        goalDetails:    inputs.goalDetails,
        targetAmount:   inputs.targetAmount,
        targetTimeline: inputs.targetTimeline,
        modelUsed:      geminiResult.modelUsed,
        promptVersion:  PROMPT_VERSION,
      },
      planJson,
      inputHash
    );

    const result = mapPlanRowToResult(savedRow);
    if (!result) {
      throw new Error("Failed to map saved plan to result.");
    }

    return { success: true, plan: result, cached: false };
  } catch (err) {
    if (err instanceof FinancialGeminiError) {
      return { success: false, error: getFriendlyFinancialErrorMessage(err.code) };
    }

    const msg = err instanceof Error ? err.message : String(err);
    if (msg === "UNAUTHENTICATED") {
      return { success: false, error: "Please sign in to generate a financial plan." };
    }

    console.error("[financial/actions] generateFinancialPlanAction:", msg);
    return { success: false, error: "Could not generate your financial plan. Please try again." };
  }
}

/* ── Load Latest Financial Plan ──────────────────────────────── */

export async function loadFinancialPlanAction(): Promise<LoadFinancialPlanResult> {
  try {
    const user = await requireAuth();
    const row = await loadLatestFinancialPlan(user.id);
    if (!row) return { success: true, plan: null };

    const plan = mapPlanRowToResult(row);
    return { success: true, plan };
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    if (msg === "UNAUTHENTICATED") {
      return { success: false, error: "Please sign in to view your financial plan." };
    }
    console.error("[financial/actions] loadFinancialPlanAction:", msg);
    return { success: false, error: "Could not load your financial plan." };
  }
}

/* ── Delete Financial Plan ───────────────────────────────────── */

export async function deleteFinancialPlanAction(planId: string): Promise<DeleteFinancialPlanResult> {
  try {
    const user = await requireAuth();
    await deleteFinancialPlan(planId, user.id);
    return { success: true };
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    if (msg === "UNAUTHENTICATED") {
      return { success: false, error: "Please sign in to delete your financial plan." };
    }
    console.error("[financial/actions] deleteFinancialPlanAction:", msg);
    return { success: false, error: "Could not delete your financial plan." };
  }
}

/**
 * lib/financial/database.ts
 *
 * Supabase CRUD helpers for financial plans.
 * Uses the authenticated server client.
 * One plan per user — upsert on generate.
 */

import { createClient } from "@/lib/supabase/server";
import type { FinancialPlan, FinancialPlanUpsert } from "@/types/database";
import type { FinancialPlanResult } from "@/types/dashboard";

/* ── Save Financial Plan ─────────────────────────────────────── */

/**
 * Upserts the user's financial plan (one plan per user).
 * plan_json is the single source of truth for all generated data.
 */
export async function saveFinancialPlan(
  userId: string,
  inputs: {
    monthlyIncome: number;
    monthlyExpenses: number;
    currentSavings: number;
    goal: string;
    employmentType: string;
    goalDetails: string;
    targetAmount: number;
    targetTimeline: string;
    modelUsed: string;
    promptVersion: string;
  },
  planJson: Record<string, unknown>,
  inputHash: string
): Promise<FinancialPlan> {
  const supabase = await createClient();

  const upsertData: FinancialPlanUpsert = {
    user_id:         userId,
    monthly_income:  inputs.monthlyIncome,
    monthly_expenses:inputs.monthlyExpenses,
    current_savings: inputs.currentSavings,
    goal:            inputs.goal,
    employment_type: inputs.employmentType,
    goal_details:    inputs.goalDetails,
    target_amount:   inputs.targetAmount,
    target_timeline: inputs.targetTimeline,
    model_used:      inputs.modelUsed,
    prompt_version:  inputs.promptVersion,
    input_hash:      inputHash,
    plan_json:       planJson,
  };

  // Check if a plan already exists for this user
  const { data: existing } = await supabase
    .from("financial_plans")
    .select("id")
    .eq("user_id", userId)
    .maybeSingle();

  if (existing?.id) {
    // Update existing plan
    const { data, error } = await supabase
      .from("financial_plans")
      .update(upsertData)
      .eq("id", existing.id)
      .eq("user_id", userId) // RLS guard
      .select()
      .single();

    if (error) {
      console.error("[financial/database] saveFinancialPlan update:", error.message);
      throw new Error("Failed to save financial plan.");
    }

    return data as FinancialPlan;
  }

  // Insert new plan
  const { data, error } = await supabase
    .from("financial_plans")
    .insert({ ...upsertData })
    .select()
    .single();

  if (error) {
    console.error("[financial/database] saveFinancialPlan insert:", error.message);
    throw new Error("Failed to save financial plan.");
  }

  return data as FinancialPlan;
}

/* ── Load Latest Financial Plan ──────────────────────────────── */

export async function loadLatestFinancialPlan(userId: string): Promise<FinancialPlan | null> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("financial_plans")
    .select("*")
    .eq("user_id", userId)
    .order("updated_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (error) {
    console.error("[financial/database] loadLatestFinancialPlan:", error.message);
    return null;
  }

  return (data as FinancialPlan | null);
}

/* ── Delete Financial Plan ───────────────────────────────────── */

export async function deleteFinancialPlan(planId: string, userId: string): Promise<void> {
  const supabase = await createClient();

  const { error } = await supabase
    .from("financial_plans")
    .delete()
    .eq("id", planId)
    .eq("user_id", userId); // RLS guard

  if (error) {
    console.error("[financial/database] deleteFinancialPlan:", error.message);
    throw new Error("Failed to delete financial plan.");
  }
}

/* ── Map DB Row to FinancialPlanResult ───────────────────────── */

/**
 * Extracts the full FinancialPlanResult from a saved plan row.
 * Returns null if plan_json is missing or malformed.
 */
export function mapPlanRowToResult(row: FinancialPlan): FinancialPlanResult | null {
  if (!row.plan_json) return null;

  try {
    const json = row.plan_json as Record<string, unknown>;

    // Validate the essential structure is present
    if (!json.calculatedMetrics || !json.aiAnalysis || !json.userInputs) {
      return null;
    }

    return {
      id:                row.id,
      inputHash:         row.input_hash ?? "",
      userInputs:        json.userInputs as FinancialPlanResult["userInputs"],
      calculatedMetrics: json.calculatedMetrics as FinancialPlanResult["calculatedMetrics"],
      aiAnalysis:        json.aiAnalysis as FinancialPlanResult["aiAnalysis"],
      meta:              json.meta as FinancialPlanResult["meta"],
      updatedAt:         row.updated_at,
    };
  } catch {
    return null;
  }
}

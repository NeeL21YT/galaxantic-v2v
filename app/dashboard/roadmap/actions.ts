"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import type { MilestoneStatus } from "@/types/dashboard";

/**
 * Updates the status of a specific milestone in a user's career roadmap.
 * Only allows the update if the roadmap belongs to the authenticated user.
 */
export async function updateMilestoneStatusAction(
  roadmapId: string,
  milestoneId: string,
  newStatus: MilestoneStatus
) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("Unauthorized");
  }

  // Fetch the current roadmap
  const { data: roadmap, error: fetchError } = await supabase
    .from("career_roadmaps")
    .select("roadmap_json")
    .eq("id", roadmapId)
    .eq("user_id", user.id)
    .single();

  if (fetchError || !roadmap) {
    console.error("[actions.ts] Error fetching roadmap:", fetchError);
    throw new Error("Failed to fetch roadmap or unauthorized.");
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const roadmapJson = roadmap.roadmap_json as Record<string, any>;
  const milestones = Array.isArray(roadmapJson.milestones)
    ? roadmapJson.milestones
    : [];

  // Find the milestone and update its status
  let updated = false;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const updatedMilestones = milestones.map((m: any) => {
    if (m.id === milestoneId) {
      updated = true;
      return { ...m, status: newStatus };
    }
    return m;
  });

  if (!updated) {
    throw new Error("Milestone not found in roadmap.");
  }

  // Update the database
  const { error: updateError } = await supabase
    .from("career_roadmaps")
    .update({
      roadmap_json: {
        ...roadmapJson,
        milestones: updatedMilestones,
      },
    })
    .eq("id", roadmapId)
    .eq("user_id", user.id);

  if (updateError) {
    console.error("[actions.ts] Error updating roadmap:", updateError);
    throw new Error("Failed to save milestone progress.");
  }

  // Revalidate the roadmap page so changes are visible
  revalidatePath("/dashboard/roadmap");
}

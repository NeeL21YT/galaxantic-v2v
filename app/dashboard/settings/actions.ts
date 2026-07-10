"use server";

import { revalidatePath } from "next/cache";
import { updateProfile } from "@/lib/db/profiles";

export type UpdateSettingsProfileResult =
  | { success: true; fullName: string }
  | { success: false; error: string };

export async function updateSettingsProfileAction(input: {
  fullName: string;
}): Promise<UpdateSettingsProfileResult> {
  const fullName = input.fullName.replace(/\s+/g, " ").trim();

  if (!fullName) {
    return { success: false, error: "Full name is required." };
  }

  if (fullName.length > 120) {
    return { success: false, error: "Full name must be 120 characters or less." };
  }

  const profile = await updateProfile({ full_name: fullName });

  if (!profile?.full_name) {
    return { success: false, error: "Could not save your name. Please try again." };
  }

  revalidatePath("/dashboard");
  revalidatePath("/dashboard/settings");

  return { success: true, fullName: profile.full_name };
}

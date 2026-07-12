"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export async function toggleChecklistItem(stepId: string, completed: boolean) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "not_authenticated" };
  }

  if (completed) {
    const { error } = await supabase.from("checklist_progress").upsert(
      {
        user_id: user.id,
        step_id: stepId,
        completed_at: new Date().toISOString(),
      },
      { onConflict: "user_id,step_id" }
    );
    if (error) return { error: error.message };
  } else {
    const { error } = await supabase
      .from("checklist_progress")
      .delete()
      .eq("user_id", user.id)
      .eq("step_id", stepId);
    if (error) return { error: error.message };
  }

  revalidatePath("/dashboard");
  return { error: null };
}

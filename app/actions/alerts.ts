"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export async function dismissSmartAlert(alertId: string) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "not_authenticated" };
  }

  const { error } = await supabase.from("dismissed_alerts").upsert(
    { user_id: user.id, alert_id: alertId },
    { onConflict: "user_id,alert_id" }
  );
  if (error) return { error: error.message };

  revalidatePath("/dashboard");
  return { error: null };
}

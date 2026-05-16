"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function createCycle(data: {
  name: string;
  year: number;
  phase: string;
  window_opens: string;
  window_closes: string;
}) {
  const supabase = await createClient();
  const { error } = await supabase.from("cycles").insert(data);
  if (error) return { error: error.message };
  revalidatePath("/dashboard/cycles");
  return { success: true };
}

export async function toggleCycleActive(cycleId: string, isActive: boolean) {
  const supabase = await createClient();

  // If activating, deactivate all others first
  if (isActive) {
    const { error: err1 } = await supabase.from("cycles").update({ is_active: false }).neq("id", cycleId);
    if (err1) console.error("Error deactivating other cycles:", err1);
  }

  const { error } = await supabase
    .from("cycles")
    .update({ is_active: isActive })
    .eq("id", cycleId);

  if (error) {
    console.error("Error toggling cycle:", error);
    return { error: error.message };
  }
  revalidatePath("/dashboard/cycles");
  return { success: true };
}

export async function createEscalationRule(data: {
  rule_type: string;
  days_threshold: number;
}) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "Not authenticated" };

  const { error } = await supabase.from("escalation_rules").insert({
    ...data,
    created_by: user.id,
  });

  if (error) return { error: error.message };
  revalidatePath("/dashboard/escalation");
  return { success: true };
}

export async function toggleEscalationRule(ruleId: string, isActive: boolean) {
  const supabase = await createClient();
  const { error } = await supabase
    .from("escalation_rules")
    .update({ is_active: isActive })
    .eq("id", ruleId);

  if (error) return { error: error.message };
  revalidatePath("/dashboard/escalation");
  return { success: true };
}

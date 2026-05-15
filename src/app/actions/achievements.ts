"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { computeScore } from "@/lib/scoring";
import type { UoMType, Quarter } from "@/lib/types";

export async function updateAchievement(
  goalId: string,
  quarter: Quarter,
  data: {
    planned_value?: number;
    actual_value?: number;
    status: string;
  }
) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "Not authenticated" };

  // Get goal info for score computation
  const { data: goal } = await supabase
    .from("goals")
    .select("uom, target")
    .eq("id", goalId)
    .single();

  if (!goal) return { error: "Goal not found" };

  const score = computeScore(
    goal.uom as UoMType,
    Number(goal.target),
    data.actual_value ?? null
  );

  // Upsert achievement
  const { error } = await supabase
    .from("achievements")
    .upsert(
      {
        goal_id: goalId,
        quarter,
        planned_value: data.planned_value ?? null,
        actual_value: data.actual_value ?? null,
        status: data.status,
        score,
        updated_at: new Date().toISOString(),
      },
      { onConflict: "goal_id,quarter" }
    );

  if (error) return { error: error.message };

  // Audit log
  await supabase.from("audit_log").insert({
    table_name: "achievements",
    record_id: goalId,
    user_id: user.id,
    action: "update_achievement",
    field_name: quarter,
    new_value: JSON.stringify({ ...data, score }),
  });

  // Shared goal sync: if this goal is shared, sync achievements to all linked copies
  if (goal) {
    const { data: linkedGoals } = await supabase
      .from("goals")
      .select("id")
      .eq("is_shared", true)
      .eq("title", (await supabase.from("goals").select("title").eq("id", goalId).single()).data?.title || "")
      .neq("id", goalId);

    if (linkedGoals && linkedGoals.length > 0) {
      for (const linked of linkedGoals) {
        await supabase
          .from("achievements")
          .upsert(
            {
              goal_id: linked.id,
              quarter,
              planned_value: data.planned_value ?? null,
              actual_value: data.actual_value ?? null,
              status: data.status,
              score,
              updated_at: new Date().toISOString(),
            },
            { onConflict: "goal_id,quarter" }
          );
      }
    }
  }

  revalidatePath("/dashboard/checkins");
  revalidatePath("/dashboard/goals");
  return { success: true, score };
}

export async function addCheckIn(
  goalSheetId: string,
  quarter: Quarter,
  employeeId: string,
  comment: string
) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "Not authenticated" };

  const { error } = await supabase.from("check_ins").insert({
    goal_sheet_id: goalSheetId,
    quarter,
    manager_id: user.id,
    employee_id: employeeId,
    comment,
  });

  if (error) return { error: error.message };

  await supabase.from("audit_log").insert({
    table_name: "check_ins",
    record_id: goalSheetId,
    user_id: user.id,
    action: "check_in",
    field_name: quarter,
    new_value: comment,
  });

  revalidatePath("/dashboard/checkins");
  return { success: true };
}

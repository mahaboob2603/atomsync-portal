"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { computeScore } from "@/lib/scoring";
import type { UoMType, Quarter } from "@/lib/types";
import { sendTeamsNotification, getDeepLink } from "@/lib/teams";

// Map quarter to cycle phase
const quarterToPhase: Record<Quarter, string> = {
  Q1: "q1_checkin",
  Q2: "q2_checkin",
  Q3: "q3_checkin",
  Q4: "q4_annual",
};

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

  // Enforce check-in window dates
  const phase = quarterToPhase[quarter];
  const { data: checkinCycle } = await supabase
    .from("cycles")
    .select("window_opens, window_closes, name")
    .eq("phase", phase)
    .single();

  if (checkinCycle) {
    const now = new Date();
    const opens = new Date(checkinCycle.window_opens);
    const closes = new Date(checkinCycle.window_closes);
    closes.setHours(23, 59, 59, 999);

    if (now < opens) {
      return { error: `${quarter} check-in window opens on ${checkinCycle.window_opens}. Please wait.` };
    }
    if (now > closes) {
      return { error: `${quarter} check-in window closed on ${checkinCycle.window_closes}. The deadline has passed.` };
    }
  }

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

  // Enforce check-in window dates
  const phase = quarterToPhase[quarter];
  const { data: checkinCycle } = await supabase
    .from("cycles")
    .select("window_opens, window_closes, name")
    .eq("phase", phase)
    .single();

  if (checkinCycle) {
    const now = new Date();
    const opens = new Date(checkinCycle.window_opens);
    const closes = new Date(checkinCycle.window_closes);
    closes.setHours(23, 59, 59, 999);

    if (now < opens) {
      return { error: `${quarter} check-in window opens on ${checkinCycle.window_opens}. Please wait.` };
    }
    if (now > closes) {
      return { error: `${quarter} check-in window closed on ${checkinCycle.window_closes}. The deadline has passed.` };
    }
  }

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

  // Teams Integration Bonus
  if (process.env.TEAMS_WEBHOOK_URL) {
    const { data: manager } = await supabase.from("profiles").select("full_name").eq("id", user.id).single();
    await sendTeamsNotification(
      process.env.TEAMS_WEBHOOK_URL,
      `${quarter} Check-in Completed`,
      `**${manager?.full_name || "Manager"}** has completed the ${quarter} check-in for a team member.`,
      getDeepLink("/dashboard/checkins")
    );
  }

  revalidatePath("/dashboard/checkins");
  return { success: true };
}

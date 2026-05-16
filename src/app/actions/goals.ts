"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import type { GoalFormValues } from "@/lib/validations";
import { sendNotificationEmail, emailTemplates } from "@/lib/email";
import { sendTeamsNotification, getDeepLink } from "@/lib/teams";

// Helper: check if current date is within the cycle's active window
async function validateCycleWindow(supabase: Awaited<ReturnType<typeof createClient>>, cycleId: string) {
  const { data: cycle } = await supabase
    .from("cycles")
    .select("window_opens, window_closes, name, phase")
    .eq("id", cycleId)
    .single();

  if (!cycle) return { valid: false, error: "Cycle not found" };

  const now = new Date();
  const opens = new Date(cycle.window_opens);
  const closes = new Date(cycle.window_closes);
  // Set closes to end of day
  closes.setHours(23, 59, 59, 999);

  if (now < opens) {
    return { valid: false, error: `${cycle.name} window opens on ${cycle.window_opens}. Please wait until then.` };
  }
  if (now > closes) {
    return { valid: false, error: `${cycle.name} window closed on ${cycle.window_closes}. The deadline has passed.` };
  }
  return { valid: true, cycle };
}

export async function createGoalSheet(cycleId: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "Not authenticated" };

  // Enforce cycle window
  const windowCheck = await validateCycleWindow(supabase, cycleId);
  if (!windowCheck.valid) return { error: windowCheck.error };

  // Check if already exists
  const { data: existing } = await supabase
    .from("goal_sheets")
    .select("id")
    .eq("employee_id", user.id)
    .eq("cycle_id", cycleId)
    .single();

  if (existing) return { data: existing };

  const { data, error } = await supabase
    .from("goal_sheets")
    .insert({ employee_id: user.id, cycle_id: cycleId, status: "draft" })
    .select()
    .single();

  if (error) return { error: error.message };
  revalidatePath("/dashboard/goals");
  return { data };
}

export async function addGoal(goalSheetId: string, goal: GoalFormValues) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "Not authenticated" };

  // Enforce cycle window
  const { data: sheet } = await supabase
    .from("goal_sheets")
    .select("cycle_id")
    .eq("id", goalSheetId)
    .single();
  if (sheet) {
    const windowCheck = await validateCycleWindow(supabase, sheet.cycle_id);
    if (!windowCheck.valid) return { error: windowCheck.error };
  }

  // Check goal count
  const { count } = await supabase
    .from("goals")
    .select("*", { count: "exact", head: true })
    .eq("goal_sheet_id", goalSheetId);

  if ((count || 0) >= 8) {
    return { error: "Maximum 8 goals per goal sheet" };
  }

  const { data, error } = await supabase
    .from("goals")
    .insert({
      goal_sheet_id: goalSheetId,
      thrust_area_id: goal.thrust_area_id,
      title: goal.title,
      description: goal.description || null,
      uom: goal.uom,
      target: goal.target,
      weightage: goal.weightage,
    })
    .select()
    .single();

  if (error) return { error: error.message };

  // Log to audit
  await supabase.from("audit_log").insert({
    table_name: "goals",
    record_id: data.id,
    user_id: user.id,
    action: "create",
    field_name: "goal",
    new_value: JSON.stringify({ title: goal.title, weightage: goal.weightage }),
  });

  revalidatePath("/dashboard/goals");
  return { data };
}

export async function updateGoal(goalId: string, updates: Partial<GoalFormValues>) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "Not authenticated" };

  // Get old values for audit
  const { data: oldGoal } = await supabase
    .from("goals")
    .select("*")
    .eq("id", goalId)
    .single();

  // Shared goal enforcement: recipients can only edit weightage
  if (oldGoal?.is_shared) {
    const allowedFields = ["weightage"];
    const restrictedUpdates = Object.fromEntries(
      Object.entries(updates).filter(([key]) => allowedFields.includes(key))
    );
    if (Object.keys(restrictedUpdates).length === 0) {
      return { error: "Shared goals can only have their weightage adjusted" };
    }
    updates = restrictedUpdates as Partial<GoalFormValues>;
  }

  const { error } = await supabase
    .from("goals")
    .update(updates)
    .eq("id", goalId);

  if (error) return { error: error.message };

  // Audit log
  for (const [key, val] of Object.entries(updates)) {
    if (oldGoal && oldGoal[key as keyof typeof oldGoal] !== val) {
      await supabase.from("audit_log").insert({
        table_name: "goals",
        record_id: goalId,
        user_id: user.id,
        action: "update",
        field_name: key,
        old_value: String(oldGoal[key as keyof typeof oldGoal]),
        new_value: String(val),
      });
    }
  }

  revalidatePath("/dashboard/goals");
  revalidatePath("/dashboard/team-goals");
  return { success: true };
}

export async function deleteGoal(goalId: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "Not authenticated" };

  const { error } = await supabase
    .from("goals")
    .delete()
    .eq("id", goalId);

  if (error) return { error: error.message };

  await supabase.from("audit_log").insert({
    table_name: "goals",
    record_id: goalId,
    user_id: user.id,
    action: "delete",
  });

  revalidatePath("/dashboard/goals");
  return { success: true };
}

export async function submitGoalSheet(goalSheetId: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "Not authenticated" };

  // Enforce cycle window
  const { data: sheetInfo } = await supabase
    .from("goal_sheets")
    .select("cycle_id")
    .eq("id", goalSheetId)
    .single();
  if (sheetInfo) {
    const windowCheck = await validateCycleWindow(supabase, sheetInfo.cycle_id);
    if (!windowCheck.valid) return { error: windowCheck.error };
  }

  // Validate total weightage = 100%
  const { data: goals } = await supabase
    .from("goals")
    .select("weightage")
    .eq("goal_sheet_id", goalSheetId);

  if (!goals || goals.length === 0) {
    return { error: "Add at least one goal before submitting" };
  }

  const total = goals.reduce((sum, g) => sum + Number(g.weightage), 0);
  if (total !== 100) {
    return { error: `Total weightage must be 100%. Current: ${total}%` };
  }

  const { error } = await supabase
    .from("goal_sheets")
    .update({
      status: "pending_approval",
      submitted_at: new Date().toISOString(),
    })
    .eq("id", goalSheetId);

  if (error) return { error: error.message };

  await supabase.from("audit_log").insert({
    table_name: "goal_sheets",
    record_id: goalSheetId,
    user_id: user.id,
    action: "submit",
    new_value: "pending_approval",
  });

  // Fetch employee details to get manager email
  const { data: profile } = await supabase
    .from("profiles")
    .select("full_name, manager_id")
    .eq("id", user.id)
    .single();

  if (profile?.manager_id) {
    const { data: manager } = await supabase
      .from("profiles")
      .select("email")
      .eq("id", profile.manager_id)
      .single();

    if (manager?.email) {
      console.log(`[Email Attempt] Sending submission notification to manager: ${manager.email}`);
      await sendNotificationEmail(
        manager.email,
        "Goal Sheet Submitted for Approval",
        emailTemplates.goalSubmitted(profile.full_name)
      );
    } else {
      console.warn(`[Email Warning] No manager email found for manager_id: ${profile.manager_id}`);
    }
    
    // Teams Integration Bonus
    if (process.env.TEAMS_WEBHOOK_URL) {
      await sendTeamsNotification(
        process.env.TEAMS_WEBHOOK_URL,
        "Goal Sheet Submitted",
        `**${profile.full_name}** has submitted their goal sheet for approval.`,
        getDeepLink("/dashboard/team-goals")
      );
    }
  }

  revalidatePath("/dashboard/goals");
  return { success: true };
}

export async function approveGoalSheet(goalSheetId: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "Not authenticated" };

  const { error } = await supabase
    .from("goal_sheets")
    .update({
      status: "approved",
      approved_at: new Date().toISOString(),
      approved_by: user.id,
      locked: true,
    })
    .eq("id", goalSheetId);

  if (error) return { error: error.message };

  await supabase.from("audit_log").insert({
    table_name: "goal_sheets",
    record_id: goalSheetId,
    user_id: user.id,
    action: "approve",
    new_value: "approved",
  });

  // Fetch manager name and employee email
  const { data: managerProfile } = await supabase.from("profiles").select("full_name").eq("id", user.id).single();
  const { data: sheet } = await supabase.from("goal_sheets").select("employee_id").eq("id", goalSheetId).single();
  
  if (sheet?.employee_id && managerProfile) {
    const { data: employee } = await supabase.from("profiles").select("email").eq("id", sheet.employee_id).single();
    if (employee?.email) {
      console.log(`[Email Attempt] Sending approval notification to employee: ${employee.email}`);
      await sendNotificationEmail(
        employee.email,
        "Goal Sheet Approved",
        emailTemplates.goalApproved(managerProfile.full_name)
      );
    } else {
      console.warn(`[Email Warning] No employee email found for employee_id: ${sheet.employee_id}`);
    }

    // Teams Integration Bonus
    if (process.env.TEAMS_WEBHOOK_URL) {
      await sendTeamsNotification(
        process.env.TEAMS_WEBHOOK_URL,
        "Goal Sheet Approved",
        `**${managerProfile.full_name}** has approved the goal sheet for the team.`,
        getDeepLink("/dashboard/goals")
      );
    }
  }

  revalidatePath("/dashboard/team-goals");
  revalidatePath("/dashboard/goals");
  return { success: true };
}

export async function returnGoalSheet(goalSheetId: string, reason: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "Not authenticated" };

  const { error } = await supabase
    .from("goal_sheets")
    .update({
      status: "returned",
      return_reason: reason,
    })
    .eq("id", goalSheetId);

  if (error) return { error: error.message };

  await supabase.from("audit_log").insert({
    table_name: "goal_sheets",
    record_id: goalSheetId,
    user_id: user.id,
    action: "return",
    new_value: reason,
  });

  // Fetch manager name and employee email
  const { data: managerProfile } = await supabase.from("profiles").select("full_name").eq("id", user.id).single();
  const { data: sheet } = await supabase.from("goal_sheets").select("employee_id").eq("id", goalSheetId).single();
  
  if (sheet?.employee_id && managerProfile) {
    const { data: employee } = await supabase.from("profiles").select("email").eq("id", sheet.employee_id).single();
    if (employee?.email) {
      await sendNotificationEmail(
        employee.email,
        "Goal Sheet Returned for Rework",
        emailTemplates.goalReturned(managerProfile.full_name, reason)
      );
    }

    // Teams Integration Bonus
    if (process.env.TEAMS_WEBHOOK_URL) {
      await sendTeamsNotification(
        process.env.TEAMS_WEBHOOK_URL,
        "Goal Sheet Returned",
        `**${managerProfile.full_name}** has returned a goal sheet for rework. Reason: ${reason}`,
        getDeepLink("/dashboard/goals")
      );
    }
  }

  revalidatePath("/dashboard/team-goals");
  revalidatePath("/dashboard/goals");
  return { success: true };
}

export async function unlockGoalSheet(goalSheetId: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "Not authenticated" };

  const { error } = await supabase
    .from("goal_sheets")
    .update({ locked: false, status: "draft" })
    .eq("id", goalSheetId);

  if (error) return { error: error.message };

  await supabase.from("audit_log").insert({
    table_name: "goal_sheets",
    record_id: goalSheetId,
    user_id: user.id,
    action: "unlock",
    field_name: "locked",
    old_value: "true",
    new_value: "false",
  });

  revalidatePath("/dashboard/all-goals");
  revalidatePath("/dashboard/goals");
  return { success: true };
}

export async function createSharedGoal(
  goalData: GoalFormValues,
  employeeIds: string[],
  cycleId: string
) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "Not authenticated" };

  const results = [];

  for (const empId of employeeIds) {
    // Get or create goal sheet
    let { data: sheet } = await supabase
      .from("goal_sheets")
      .select("id")
      .eq("employee_id", empId)
      .eq("cycle_id", cycleId)
      .single();

    if (!sheet) {
      const { data: newSheet, error: sheetErr } = await supabase
        .from("goal_sheets")
        .insert({ employee_id: empId, cycle_id: cycleId, status: "draft" })
        .select()
        .single();
      if (sheetErr || !newSheet) continue;
      sheet = newSheet;
    }

    if (!sheet) continue;

    // Add goal
    const { data: goal, error: goalErr } = await supabase
      .from("goals")
      .insert({
        goal_sheet_id: sheet.id,
        thrust_area_id: goalData.thrust_area_id,
        title: goalData.title,
        description: goalData.description || null,
        uom: goalData.uom,
        target: goalData.target,
        weightage: goalData.weightage,
        is_shared: true,
      })
      .select()
      .single();

    if (!goalErr && goal) results.push(goal);
  }

  revalidatePath("/dashboard/all-goals");
  return { data: results };
}

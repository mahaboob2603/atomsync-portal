import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";
import { sendNotificationEmail, emailTemplates } from "@/lib/email";
import { sendTeamsNotification, getDeepLink } from "@/lib/teams";

// This endpoint is designed to be hit daily via Vercel Cron
export async function GET(request: Request) {
  // Validate cron secret if deployed to Vercel
  const authHeader = request.headers.get("authorization");
  if (
    process.env.CRON_SECRET &&
    authHeader !== `Bearer ${process.env.CRON_SECRET}`
  ) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const supabase = await createClient();
  const logs = [];

  try {
    // Fetch active rules
    const { data: rules } = await supabase
      .from("escalation_rules")
      .select("*")
      .eq("is_active", true);

    if (!rules || rules.length === 0) {
      return NextResponse.json({ message: "No active rules", logs: [] });
    }

    // Process each rule based on type
    for (const rule of rules) {
      if (rule.rule_type === "goal_submission") {
        // Find users who haven't submitted goals in the current active cycle
        const { data: activeCycle } = await supabase
          .from("cycles")
          .select("id, name, window_opens")
          .eq("is_active", true)
          .eq("phase", "goal_setting")
          .single();

        if (activeCycle) {
          const opens = new Date(activeCycle.window_opens);
          const daysSinceOpen = Math.floor((new Date().getTime() - opens.getTime()) / (1000 * 3600 * 24));

          if (daysSinceOpen >= rule.days_threshold) {
            // Get all employees who don't have a submitted goal sheet
            const { data: pendingEmployees } = await supabase
              .from("profiles")
              .select("id, full_name, email, manager_id")
              .eq("role", "employee");

            // Filter those out who have submitted
            if (pendingEmployees) {
              for (const emp of pendingEmployees) {
                const { data: sheet } = await supabase
                  .from("goal_sheets")
                  .select("status")
                  .eq("employee_id", emp.id)
                  .eq("cycle_id", activeCycle.id)
                  .single();

                if (!sheet || sheet.status === "draft" || sheet.status === "returned") {
                  // Trigger escalation!
                  await sendNotificationEmail(
                    emp.email,
                    "Action Required: Goal Submission Overdue",
                    emailTemplates.escalationWarning(emp.full_name, "Goal Submission Overdue", rule.days_threshold)
                  );

                  if (process.env.TEAMS_WEBHOOK_URL) {
                    await sendTeamsNotification(
                      process.env.TEAMS_WEBHOOK_URL,
                      "Escalation Alert: Missing Goals",
                      `**${emp.full_name}** has not submitted their goals for ${activeCycle.name} (${daysSinceOpen} days elapsed).`,
                      getDeepLink("/dashboard/goals")
                    );
                  }

                  // Log it
                  if (emp.manager_id) {
                    await supabase.from("escalation_logs").insert({
                      rule_id: rule.id,
                      target_user_id: emp.id,
                      escalated_to_id: emp.manager_id,
                      status: "pending",
                    });
                  }
                  logs.push(`Escalated goal submission for ${emp.full_name}`);
                }
              }
            }
          }
        }
      }
      
      // Similar logic would follow for 'goal_approval' and 'checkin_completion'
    }

    return NextResponse.json({ success: true, logs });
  } catch (error) {
    console.error("Cron failed:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

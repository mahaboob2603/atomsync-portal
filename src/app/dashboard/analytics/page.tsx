import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { AnalyticsClient } from "./analytics-client";

export default async function AnalyticsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  if (!profile || !["manager", "admin"].includes(profile.role)) redirect("/dashboard");

  // Goal distribution by thrust area
  const { data: goals } = await supabase
    .from("goals")
    .select("*, thrust_area:thrust_areas(name), achievements(*)");

  // All employees
  const { data: employees } = await supabase
    .from("profiles")
    .select("id, full_name, department")
    .eq("role", "employee");

  // Goal sheets
  const { data: goalSheets } = await supabase
    .from("goal_sheets")
    .select("*, employee:profiles!goal_sheets_employee_id_fkey(id, full_name, department)")
    .eq("status", "approved");

  // Check-ins per manager
  const { data: checkIns } = await supabase
    .from("check_ins")
    .select("*, manager:profiles!check_ins_manager_id_fkey(id, full_name)");

  return (
    <AnalyticsClient
      goals={goals || []}
      employees={employees || []}
      goalSheets={goalSheets || []}
      checkIns={checkIns || []}
    />
  );
}

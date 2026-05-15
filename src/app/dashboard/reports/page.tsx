import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { ReportsClient } from "./reports-client";

export default async function ReportsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  if (!profile || !["manager", "admin"].includes(profile.role)) redirect("/dashboard");

  // Get all goal sheets with achievements
  const { data: goalSheets } = await supabase
    .from("goal_sheets")
    .select(`
      *,
      employee:profiles!goal_sheets_employee_id_fkey(id, full_name, email, department),
      goals(*, thrust_area:thrust_areas(name), achievements(*))
    `)
    .eq("status", "approved")
    .order("created_at");

  // Check-in completion
  const { data: checkIns } = await supabase
    .from("check_ins")
    .select("employee_id, quarter")
    .order("created_at");

  return (
    <ReportsClient
      goalSheets={goalSheets || []}
      checkIns={checkIns || []}
    />
  );
}

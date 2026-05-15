import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { TeamGoalsClient } from "./team-goals-client";

export default async function TeamGoalsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  if (!profile || profile.role !== "manager") redirect("/dashboard");

  // Get all goal sheets with employee info and goals
  const { data: goalSheets } = await supabase
    .from("goal_sheets")
    .select(`
      *,
      employee:profiles!goal_sheets_employee_id_fkey(id, full_name, email, department, role),
      cycle:cycles(*),
      goals(*, thrust_area:thrust_areas(*))
    `)
    .order("created_at", { ascending: false });

  return <TeamGoalsClient profile={profile} goalSheets={goalSheets || []} />;
}

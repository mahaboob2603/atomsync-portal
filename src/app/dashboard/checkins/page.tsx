import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { CheckinsClient } from "./checkins-client";

export default async function CheckinsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  if (!profile) redirect("/login");

  // Get active cycle
  const { data: activeCycle } = await supabase
    .from("cycles")
    .select("*")
    .eq("is_active", true)
    .single();

  if (profile.role === "employee") {
    // Get own approved goal sheets with goals and achievements
    const { data: goalSheets } = await supabase
      .from("goal_sheets")
      .select(`
        *,
        cycle:cycles(*),
        goals(*, thrust_area:thrust_areas(*), achievements(*))
      `)
      .eq("employee_id", user.id)
      .eq("status", "approved")
      .order("created_at", { ascending: false });

    const { data: checkIns } = await supabase
      .from("check_ins")
      .select("*")
      .eq("employee_id", user.id)
      .order("created_at", { ascending: false });

    return (
      <CheckinsClient
        profile={profile}
        goalSheets={goalSheets || []}
        checkIns={checkIns || []}
        activeCycle={activeCycle}
      />
    );
  }

  // Manager: see all team goal sheets
  const { data: goalSheets } = await supabase
    .from("goal_sheets")
    .select(`
      *,
      employee:profiles!goal_sheets_employee_id_fkey(id, full_name, email, department),
      cycle:cycles(*),
      goals(*, thrust_area:thrust_areas(*), achievements(*))
    `)
    .eq("status", "approved")
    .order("created_at", { ascending: false });

  const { data: checkIns } = await supabase
    .from("check_ins")
    .select("*, manager:profiles!check_ins_manager_id_fkey(full_name)")
    .order("created_at", { ascending: false });

  return (
    <CheckinsClient
      profile={profile}
      goalSheets={goalSheets || []}
      checkIns={checkIns || []}
      activeCycle={activeCycle}
    />
  );
}

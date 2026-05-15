import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { GoalsClient } from "./goals-client";

export default async function GoalsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  if (!profile || profile.role !== "employee") redirect("/dashboard");

  // Get active cycle
  const { data: activeCycle } = await supabase
    .from("cycles")
    .select("*")
    .eq("is_active", true)
    .single();

  // Get thrust areas
  const { data: thrustAreas } = await supabase
    .from("thrust_areas")
    .select("*")
    .order("name");

  // Get goal sheet for current cycle
  let goalSheet = null;
  let goals: Array<{
    id: string;
    title: string;
    description: string | null;
    uom: string;
    target: number;
    weightage: number;
    is_shared: boolean;
    thrust_area: { id: string; name: string } | null;
    achievements: Array<{
      id: string;
      quarter: string;
      planned_value: number | null;
      actual_value: number | null;
      status: string;
      score: number | null;
    }>;
  }> = [];

  if (activeCycle) {
    const { data: sheet } = await supabase
      .from("goal_sheets")
      .select("*")
      .eq("employee_id", user.id)
      .eq("cycle_id", activeCycle.id)
      .single();

    goalSheet = sheet;

    if (sheet) {
      const { data: goalData } = await supabase
        .from("goals")
        .select("*, thrust_area:thrust_areas(*), achievements(*)")
        .eq("goal_sheet_id", sheet.id)
        .order("created_at");

      goals = goalData || [];
    }
  }

  return (
    <GoalsClient
      profile={profile}
      activeCycle={activeCycle}
      thrustAreas={thrustAreas || []}
      goalSheet={goalSheet}
      goals={goals}
    />
  );
}

import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { AllGoalsClient } from "./all-goals-client";

export default async function AllGoalsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  if (!profile || profile.role !== "admin") redirect("/dashboard");

  const { data: goalSheets } = await supabase
    .from("goal_sheets")
    .select(`
      *,
      employee:profiles!goal_sheets_employee_id_fkey(id, full_name, email, department, role),
      cycle:cycles(name),
      goals(*, thrust_area:thrust_areas(name))
    `)
    .order("created_at", { ascending: false });

  const { data: employees } = await supabase
    .from("profiles")
    .select("id, full_name, email, department")
    .eq("role", "employee");

  const { data: thrustAreas } = await supabase
    .from("thrust_areas")
    .select("*")
    .order("name");

  const { data: activeCycle } = await supabase
    .from("cycles")
    .select("*")
    .eq("is_active", true)
    .single();

  return (
    <AllGoalsClient
      goalSheets={goalSheets || []}
      employees={employees || []}
      thrustAreas={thrustAreas || []}
      activeCycle={activeCycle}
    />
  );
}

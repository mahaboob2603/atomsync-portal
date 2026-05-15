import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { CyclesClient } from "./cycles-client";

export default async function CyclesPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  if (!profile || profile.role !== "admin") redirect("/dashboard");

  const { data: cycles } = await supabase
    .from("cycles")
    .select("*")
    .order("year", { ascending: false })
    .order("window_opens", { ascending: true });

  return <CyclesClient cycles={cycles || []} />;
}

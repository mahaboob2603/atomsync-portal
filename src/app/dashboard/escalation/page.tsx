import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { EscalationClient } from "./escalation-client";

export default async function EscalationPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  if (!profile || profile.role !== "admin") redirect("/dashboard");

  const { data: rules } = await supabase
    .from("escalation_rules")
    .select("*")
    .order("created_at");

  const { data: logs } = await supabase
    .from("escalation_log")
    .select(`
      *,
      target_user:profiles!escalation_log_target_user_id_fkey(full_name),
      escalated_to:profiles!escalation_log_escalated_to_id_fkey(full_name),
      rule:escalation_rules(rule_type, days_threshold)
    `)
    .order("created_at", { ascending: false })
    .limit(50);

  return <EscalationClient rules={rules || []} logs={logs || []} />;
}

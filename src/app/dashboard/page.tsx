import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import {
  Target,
  CheckCircle2,
  Clock,
  TrendingUp,
  AlertCircle,
  Users,
  FileCheck,
  ArrowRight,
} from "lucide-react";
import Link from "next/link";

export default async function DashboardPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  if (!profile) redirect("/login");

  // Fetch stats based on role
  let stats = {
    totalGoals: 0,
    approvedGoals: 0,
    pendingApproval: 0,
    completionRate: 0,
    teamMembers: 0,
    checkInsCompleted: 0,
  };

  if (profile.role === "employee") {
    const { data: goalSheets } = await supabase
      .from("goal_sheets")
      .select("*, goals(*)")
      .eq("employee_id", user.id);

    const allGoals = goalSheets?.flatMap((gs) => gs.goals || []) || [];
    stats.totalGoals = allGoals.length;
    stats.approvedGoals = goalSheets?.filter((gs) => gs.status === "approved").length || 0;
    stats.pendingApproval = goalSheets?.filter((gs) => gs.status === "pending_approval").length || 0;

    const { count: checkInCount } = await supabase
      .from("check_ins")
      .select("*", { count: "exact", head: true })
      .eq("employee_id", user.id);
    stats.checkInsCompleted = checkInCount || 0;
  } else if (profile.role === "manager") {
    const { data: teamSheets } = await supabase
      .from("goal_sheets")
      .select("*, goals(*), employee:profiles!goal_sheets_employee_id_fkey(*)")
      .order("created_at", { ascending: false });

    stats.totalGoals = teamSheets?.reduce((sum, gs) => sum + (gs.goals?.length || 0), 0) || 0;
    stats.pendingApproval = teamSheets?.filter((gs) => gs.status === "pending_approval").length || 0;
    stats.approvedGoals = teamSheets?.filter((gs) => gs.status === "approved").length || 0;

    const { count: teamCount } = await supabase
      .from("profiles")
      .select("*", { count: "exact", head: true })
      .eq("role", "employee");
    stats.teamMembers = teamCount || 0;
  } else {
    // Admin
    const { count: totalGoals } = await supabase
      .from("goals")
      .select("*", { count: "exact", head: true });
    stats.totalGoals = totalGoals || 0;

    const { count: pendingCount } = await supabase
      .from("goal_sheets")
      .select("*", { count: "exact", head: true })
      .eq("status", "pending_approval");
    stats.pendingApproval = pendingCount || 0;

    const { count: approvedCount } = await supabase
      .from("goal_sheets")
      .select("*", { count: "exact", head: true })
      .eq("status", "approved");
    stats.approvedGoals = approvedCount || 0;

    const { count: userCount } = await supabase
      .from("profiles")
      .select("*", { count: "exact", head: true });
    stats.teamMembers = userCount || 0;
  }

  // Fetch recent activity (audit log for managers/admins)
  let recentActivity: Array<{ id: string; action: string; table_name: string; created_at: string; field_name: string | null }> = [];
  if (profile.role !== "employee") {
    const { data: logs } = await supabase
      .from("audit_log")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(5);
    recentActivity = logs || [];
  }

  // Active cycle
  const { data: activeCycle } = await supabase
    .from("cycles")
    .select("*")
    .eq("is_active", true)
    .single();

  const greeting = getGreeting();

  return (
    <div>
      {/* Page Header */}
      <div className="page-header">
        <div>
          <h1 className="text-2xl font-bold">{greeting}, {profile.full_name?.split(" ")[0]}</h1>
          <p className="text-sm mt-1" style={{ color: "var(--muted)" }}>
            {activeCycle
              ? `Active cycle: ${activeCycle.name}`
              : "No active cycle configured"}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <span className={`badge badge-${profile.role}`}>
            {profile.role.charAt(0).toUpperCase() + profile.role.slice(1)}
          </span>
        </div>
      </div>

      {/* Page Body */}
      <div className="page-body space-y-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="stat-card animate-fade-in stagger-1">
            <div className="stat-icon" style={{ background: "var(--accent-glow)" }}>
              <Target size={20} style={{ color: "var(--accent-light)" }} />
            </div>
            <div className="stat-value">{stats.totalGoals}</div>
            <div className="stat-label">Total Goals</div>
          </div>

          <div className="stat-card animate-fade-in stagger-2">
            <div className="stat-icon" style={{ background: "var(--success-bg)" }}>
              <CheckCircle2 size={20} style={{ color: "var(--success)" }} />
            </div>
            <div className="stat-value">{stats.approvedGoals}</div>
            <div className="stat-label">
              {profile.role === "employee" ? "Approved Sheets" : "Approved Sheets"}
            </div>
          </div>

          <div className="stat-card animate-fade-in stagger-3">
            <div className="stat-icon" style={{ background: "var(--warning-bg)" }}>
              <Clock size={20} style={{ color: "var(--warning)" }} />
            </div>
            <div className="stat-value">{stats.pendingApproval}</div>
            <div className="stat-label">Pending Approval</div>
          </div>

          <div className="stat-card animate-fade-in stagger-4">
            <div className="stat-icon" style={{ background: "var(--info-bg)" }}>
              {profile.role === "employee" ? (
                <FileCheck size={20} style={{ color: "var(--info)" }} />
              ) : (
                <Users size={20} style={{ color: "var(--info)" }} />
              )}
            </div>
            <div className="stat-value">
              {profile.role === "employee" ? stats.checkInsCompleted : stats.teamMembers}
            </div>
            <div className="stat-label">
              {profile.role === "employee" ? "Check-ins Done" : "Team Members"}
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="glass-card p-6 animate-fade-in">
          <h2 className="text-lg font-semibold mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {profile.role === "employee" && (
              <>
                <Link
                  href="/dashboard/goals"
                  className="flex items-center justify-between p-4 rounded-xl transition-all hover:scale-[1.01]"
                  style={{
                    background: "var(--card)",
                    border: "1px solid var(--border)",
                    textDecoration: "none",
                    color: "var(--foreground)",
                  }}
                >
                  <div className="flex items-center gap-3">
                    <Target size={20} style={{ color: "var(--accent-light)" }} />
                    <span className="font-medium text-sm">Create / View Goals</span>
                  </div>
                  <ArrowRight size={16} style={{ color: "var(--muted)" }} />
                </Link>
                <Link
                  href="/dashboard/checkins"
                  className="flex items-center justify-between p-4 rounded-xl transition-all hover:scale-[1.01]"
                  style={{
                    background: "var(--card)",
                    border: "1px solid var(--border)",
                    textDecoration: "none",
                    color: "var(--foreground)",
                  }}
                >
                  <div className="flex items-center gap-3">
                    <CheckCircle2 size={20} style={{ color: "var(--success)" }} />
                    <span className="font-medium text-sm">Log Achievement</span>
                  </div>
                  <ArrowRight size={16} style={{ color: "var(--muted)" }} />
                </Link>
              </>
            )}
            {profile.role === "manager" && (
              <>
                <Link
                  href="/dashboard/team-goals"
                  className="flex items-center justify-between p-4 rounded-xl transition-all hover:scale-[1.01]"
                  style={{
                    background: "var(--card)",
                    border: "1px solid var(--border)",
                    textDecoration: "none",
                    color: "var(--foreground)",
                  }}
                >
                  <div className="flex items-center gap-3">
                    <Users size={20} style={{ color: "var(--warning)" }} />
                    <span className="font-medium text-sm">Review Team Goals</span>
                  </div>
                  <ArrowRight size={16} style={{ color: "var(--muted)" }} />
                </Link>
                <Link
                  href="/dashboard/checkins"
                  className="flex items-center justify-between p-4 rounded-xl transition-all hover:scale-[1.01]"
                  style={{
                    background: "var(--card)",
                    border: "1px solid var(--border)",
                    textDecoration: "none",
                    color: "var(--foreground)",
                  }}
                >
                  <div className="flex items-center gap-3">
                    <CheckCircle2 size={20} style={{ color: "var(--success)" }} />
                    <span className="font-medium text-sm">Conduct Check-ins</span>
                  </div>
                  <ArrowRight size={16} style={{ color: "var(--muted)" }} />
                </Link>
                <Link
                  href="/dashboard/analytics"
                  className="flex items-center justify-between p-4 rounded-xl transition-all hover:scale-[1.01]"
                  style={{
                    background: "var(--card)",
                    border: "1px solid var(--border)",
                    textDecoration: "none",
                    color: "var(--foreground)",
                  }}
                >
                  <div className="flex items-center gap-3">
                    <TrendingUp size={20} style={{ color: "var(--info)" }} />
                    <span className="font-medium text-sm">View Analytics</span>
                  </div>
                  <ArrowRight size={16} style={{ color: "var(--muted)" }} />
                </Link>
              </>
            )}
            {profile.role === "admin" && (
              <>
                <Link
                  href="/dashboard/all-goals"
                  className="flex items-center justify-between p-4 rounded-xl transition-all hover:scale-[1.01]"
                  style={{
                    background: "var(--card)",
                    border: "1px solid var(--border)",
                    textDecoration: "none",
                    color: "var(--foreground)",
                  }}
                >
                  <div className="flex items-center gap-3">
                    <Target size={20} style={{ color: "var(--accent-light)" }} />
                    <span className="font-medium text-sm">All Goals</span>
                  </div>
                  <ArrowRight size={16} style={{ color: "var(--muted)" }} />
                </Link>
                <Link
                  href="/dashboard/cycles"
                  className="flex items-center justify-between p-4 rounded-xl transition-all hover:scale-[1.01]"
                  style={{
                    background: "var(--card)",
                    border: "1px solid var(--border)",
                    textDecoration: "none",
                    color: "var(--foreground)",
                  }}
                >
                  <div className="flex items-center gap-3">
                    <Clock size={20} style={{ color: "var(--warning)" }} />
                    <span className="font-medium text-sm">Manage Cycles</span>
                  </div>
                  <ArrowRight size={16} style={{ color: "var(--muted)" }} />
                </Link>
                <Link
                  href="/dashboard/audit"
                  className="flex items-center justify-between p-4 rounded-xl transition-all hover:scale-[1.01]"
                  style={{
                    background: "var(--card)",
                    border: "1px solid var(--border)",
                    textDecoration: "none",
                    color: "var(--foreground)",
                  }}
                >
                  <div className="flex items-center gap-3">
                    <AlertCircle size={20} style={{ color: "var(--danger)" }} />
                    <span className="font-medium text-sm">Audit Trail</span>
                  </div>
                  <ArrowRight size={16} style={{ color: "var(--muted)" }} />
                </Link>
              </>
            )}
          </div>
        </div>

        {/* Recent Activity (manager/admin) */}
        {recentActivity.length > 0 && (
          <div className="glass-card p-6 animate-fade-in">
            <h2 className="text-lg font-semibold mb-4">Recent Activity</h2>
            <div className="space-y-3">
              {recentActivity.map((log) => (
                <div
                  key={log.id}
                  className="flex items-center gap-4 p-3 rounded-lg"
                  style={{ background: "var(--card)" }}
                >
                  <div
                    className="w-8 h-8 rounded-lg flex items-center justify-center"
                    style={{ background: "var(--accent-glow)" }}
                  >
                    <FileCheck size={14} style={{ color: "var(--accent-light)" }} />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">
                      {log.action} on {log.table_name}
                      {log.field_name && ` (${log.field_name})`}
                    </p>
                    <p className="text-xs" style={{ color: "var(--muted)" }}>
                      {new Date(log.created_at).toLocaleString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function getGreeting() {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 17) return "Good afternoon";
  return "Good evening";
}

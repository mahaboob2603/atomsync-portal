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
  Zap,
  Award,
  BarChart3,
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

  // Atomberg brand pillars mapped to goal system
  const pillars = [
    { icon: Target, label: "Precision", desc: "Set & track goals", color: "#fdb913" },
    { icon: Zap, label: "Momentum", desc: "Regular check-ins", color: "#38bdf8" },
    { icon: BarChart3, label: "Efficiency", desc: "Measure impact", color: "#22c55e" },
  ];

  return (
    <div>
      {/* Page Header */}
      <div className="page-header">
        <div>
          <h1 style={{ fontSize: 24, fontWeight: 800, color: "#fff", letterSpacing: "-0.02em" }}>
            {greeting}, {profile.full_name?.split(" ")[0]}
          </h1>
          <p style={{ fontSize: 13, marginTop: 4, color: "#888" }}>
            {activeCycle
              ? `Active cycle: ${activeCycle.name}`
              : "No active cycle configured"}
            {" · "}
            <span style={{ color: "#fdb913", fontWeight: 600 }}>More Performance, Less Friction</span>
          </p>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <span className={`badge badge-${profile.role}`}>
            {profile.role.charAt(0).toUpperCase() + profile.role.slice(1)}
          </span>
        </div>
      </div>

      {/* Page Body */}
      <div className="page-body" style={{ display: "flex", flexDirection: "column", gap: 32 }}>

        {/* Atomberg Pillars Banner */}
        <div
          className="animate-fade-in"
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: 16,
          }}
        >
          {pillars.map((p, i) => {
            const Icon = p.icon;
            return (
              <div
                key={i}
                style={{
                  padding: "20px 24px",
                  borderRadius: 12,
                  background: `${p.color}08`,
                  border: `1px solid ${p.color}15`,
                  display: "flex",
                  alignItems: "center",
                  gap: 16,
                }}
              >
                <div
                  style={{
                    width: 40,
                    height: 40,
                    borderRadius: 10,
                    background: `${p.color}15`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Icon size={20} color={p.color} />
                </div>
                <div>
                  <p style={{ fontSize: 14, fontWeight: 700, color: "#fff" }}>{p.label}</p>
                  <p style={{ fontSize: 12, color: "#888" }}>{p.desc}</p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Stats Grid */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 16 }}>
          <div className="stat-card animate-fade-in stagger-1">
            <div className="stat-icon" style={{ background: "rgba(253,185,19,0.12)" }}>
              <Target size={20} color="#fdb913" />
            </div>
            <div className="stat-value" style={{ color: "#fff" }}>{stats.totalGoals}</div>
            <div className="stat-label">Total Goals</div>
          </div>

          <div className="stat-card animate-fade-in stagger-2">
            <div className="stat-icon" style={{ background: "var(--success-bg)" }}>
              <CheckCircle2 size={20} style={{ color: "var(--success)" }} />
            </div>
            <div className="stat-value" style={{ color: "#fff" }}>{stats.approvedGoals}</div>
            <div className="stat-label">Approved Sheets</div>
          </div>

          <div className="stat-card animate-fade-in stagger-3">
            <div className="stat-icon" style={{ background: "var(--warning-bg)" }}>
              <Clock size={20} style={{ color: "var(--warning)" }} />
            </div>
            <div className="stat-value" style={{ color: "#fff" }}>{stats.pendingApproval}</div>
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
            <div className="stat-value" style={{ color: "#fff" }}>
              {profile.role === "employee" ? stats.checkInsCompleted : stats.teamMembers}
            </div>
            <div className="stat-label">
              {profile.role === "employee" ? "Check-ins Done" : "Team Members"}
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="glass-card animate-fade-in" style={{ padding: 24 }}>
          <h2 style={{ fontSize: 18, fontWeight: 700, marginBottom: 16, color: "#fff" }}>Quick Actions</h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 12 }}>
            {profile.role === "employee" && (
              <>
                <ActionCard href="/dashboard/goals" icon={Target} iconColor="#fdb913" label="Create / View Goals" />
                <ActionCard href="/dashboard/checkins" icon={CheckCircle2} iconColor="#22c55e" label="Log Achievement" />
              </>
            )}
            {profile.role === "manager" && (
              <>
                <ActionCard href="/dashboard/team-goals" icon={Users} iconColor="#fdb913" label="Review Team Goals" />
                <ActionCard href="/dashboard/checkins" icon={CheckCircle2} iconColor="#22c55e" label="Conduct Check-ins" />
                <ActionCard href="/dashboard/analytics" icon={TrendingUp} iconColor="#38bdf8" label="View Analytics" />
              </>
            )}
            {profile.role === "admin" && (
              <>
                <ActionCard href="/dashboard/all-goals" icon={Target} iconColor="#fdb913" label="All Goals" />
                <ActionCard href="/dashboard/cycles" icon={Clock} iconColor="#f59e0b" label="Manage Cycles" />
                <ActionCard href="/dashboard/audit" icon={AlertCircle} iconColor="#ef4444" label="Audit Trail" />
              </>
            )}
          </div>
        </div>

        {/* Recent Activity (manager/admin) */}
        {recentActivity.length > 0 && (
          <div className="glass-card animate-fade-in" style={{ padding: 24 }}>
            <h2 style={{ fontSize: 18, fontWeight: 700, marginBottom: 16, color: "#fff" }}>Recent Activity</h2>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {recentActivity.map((log) => (
                <div
                  key={log.id}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 16,
                    padding: 12,
                    borderRadius: 10,
                    background: "rgba(255,255,255,0.02)",
                    border: "1px solid rgba(255,255,255,0.04)",
                  }}
                >
                  <div
                    style={{
                      width: 32,
                      height: 32,
                      borderRadius: 8,
                      background: "rgba(253,185,19,0.1)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexShrink: 0,
                    }}
                  >
                    <FileCheck size={14} color="#fdb913" />
                  </div>
                  <div style={{ flex: 1 }}>
                    <p style={{ fontSize: 14, fontWeight: 500, color: "#fff" }}>
                      {log.action} on {log.table_name}
                      {log.field_name && ` (${log.field_name})`}
                    </p>
                    <p style={{ fontSize: 12, color: "#888" }}>
                      {new Intl.DateTimeFormat('en-IN', {
                        dateStyle: 'short',
                        timeStyle: 'medium',
                        timeZone: 'Asia/Kolkata'
                      }).format(new Date(log.created_at))}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Atomberg Footer */}
        <div style={{ textAlign: "center", padding: "16px 0" }}>
          <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase", color: "#444" }}>
            Powered by AtomSync · Built with Engineering Excellence
          </p>
        </div>
      </div>
    </div>
  );
}

// Reusable action card component
function ActionCard({
  href,
  icon: Icon,
  iconColor,
  label,
}: {
  href: string;
  icon: React.ComponentType<{ size?: number; color?: string }>;
  iconColor: string;
  label: string;
}) {
  return (
    <Link
      href={href}
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: 16,
        borderRadius: 12,
        background: "#111",
        border: "1px solid rgba(255,255,255,0.06)",
        textDecoration: "none",
        color: "#fff",
        transition: "all 0.25s",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        <Icon size={20} color={iconColor} />
        <span style={{ fontSize: 14, fontWeight: 600 }}>{label}</span>
      </div>
      <ArrowRight size={16} color="#888" />
    </Link>
  );
}

function getGreeting() {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 17) return "Good afternoon";
  return "Good evening";
}

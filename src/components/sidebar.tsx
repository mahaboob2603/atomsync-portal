"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { Profile } from "@/lib/types";
import { logoutAction, switchDemoRole } from "@/app/actions/auth";
import {
  Target,
  LayoutDashboard,
  Goal,
  CheckSquare,
  BarChart3,
  FileText,
  Shield,
  Settings,
  LogOut,
  User,
  Crown,
  ChevronDown,
  AlertTriangle,
  Users,
  Zap,
} from "lucide-react";
import { useState } from "react";

interface SidebarProps {
  profile: Profile;
}

export function Sidebar({ profile }: SidebarProps) {
  const pathname = usePathname();
  const [showRoleSwitcher, setShowRoleSwitcher] = useState(false);
  const [switching, setSwitching] = useState<string | null>(null);

  const isActive = (path: string) => pathname === path || pathname.startsWith(path + "/");

  const roleIcon = {
    employee: User,
    manager: Shield,
    admin: Crown,
  };
  const RoleIcon = roleIcon[profile.role];

  const roleColor = {
    employee: "#38bdf8",
    manager: "#fdb913",
    admin: "#c084fc",
  };

  const navItems = [
    { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard, roles: ["employee", "manager", "admin"] },
    { label: "My Goals", href: "/dashboard/goals", icon: Goal, roles: ["employee"] },
    { label: "Team Goals", href: "/dashboard/team-goals", icon: Users, roles: ["manager"] },
    { label: "All Goals", href: "/dashboard/all-goals", icon: Goal, roles: ["admin"] },
    { label: "Check-ins", href: "/dashboard/checkins", icon: CheckSquare, roles: ["employee", "manager"] },
    { section: "Reports", roles: ["manager", "admin"] },
    { label: "Analytics", href: "/dashboard/analytics", icon: BarChart3, roles: ["manager", "admin"] },
    { label: "Reports", href: "/dashboard/reports", icon: FileText, roles: ["manager", "admin"] },
    { label: "Audit Trail", href: "/dashboard/audit", icon: Shield, roles: ["admin"] },
    { section: "Admin", roles: ["admin"] },
    { label: "Cycles", href: "/dashboard/cycles", icon: Settings, roles: ["admin"] },
    { label: "Escalation", href: "/dashboard/escalation", icon: AlertTriangle, roles: ["admin"] },
  ];

  async function handleSwitch(role: "employee" | "manager" | "admin") {
    setSwitching(role);
    await switchDemoRole(role);
  }

  return (
    <aside className="sidebar">
      {/* Brand Logo — Atomberg Identity */}
      <div className="sidebar-logo">
        <Link href="/dashboard" style={{ textDecoration: "none", display: "flex", alignItems: "center", gap: "12px" }}>
          <div
            style={{
              width: 38,
              height: 38,
              borderRadius: 10,
              background: "#fdb913",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: "0 0 20px rgba(253,185,19,0.15)",
            }}
          >
            <Target size={20} color="#000" strokeWidth={2.5} />
          </div>
          <div>
            <h1 style={{ fontSize: 16, fontWeight: 800, color: "#fff", letterSpacing: "-0.01em", lineHeight: 1.2 }}>
              AtomSync
            </h1>
            <p style={{ fontSize: 10, fontWeight: 600, color: "#fdb913", letterSpacing: "0.08em", textTransform: "uppercase" as const }}>
              Why Not?
            </p>
          </div>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="sidebar-nav">
        {navItems.map((item, i) => {
          if (!item.roles.includes(profile.role)) return null;

          if ("section" in item && item.section) {
            return (
              <div key={i} className="sidebar-section-title">
                {item.section}
              </div>
            );
          }

          if (!item.href || !item.icon) return null;
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`sidebar-link ${isActive(item.href) ? "active" : ""}`}
            >
              <Icon size={18} />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* Footer — Profile & Role Switcher */}
      <div className="sidebar-footer">
        {/* Atomberg Pillar Badge */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            padding: "8px 12px",
            marginBottom: 12,
            borderRadius: 8,
            background: "rgba(253,185,19,0.06)",
            border: "1px solid rgba(253,185,19,0.1)",
          }}
        >
          <Zap size={14} color="#fdb913" />
          <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase" as const, color: "#fdb913" }}>
            Engineering Excellence
          </span>
        </div>

        {/* Demo Role Switcher */}
        <div style={{ marginBottom: 12 }}>
          <button
            onClick={() => setShowRoleSwitcher(!showRoleSwitcher)}
            style={{
              width: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              padding: "8px 12px",
              borderRadius: 8,
              fontSize: 12,
              fontWeight: 600,
              background: "#111",
              border: "1px solid rgba(255,255,255,0.08)",
              color: "#888",
              cursor: "pointer",
              fontFamily: "inherit",
              transition: "all 0.2s",
            }}
          >
            <span>Switch Demo Role</span>
            <ChevronDown
              size={14}
              style={{ transition: "transform 0.2s", transform: showRoleSwitcher ? "rotate(180deg)" : "none" }}
            />
          </button>
          {showRoleSwitcher && (
            <div style={{ marginTop: 8, display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 8 }} className="animate-fade-in">
              {(["employee", "manager", "admin"] as const).map((role) => {
                const Icon = roleIcon[role];
                return (
                  <button
                    key={role}
                    onClick={() => handleSwitch(role)}
                    disabled={switching !== null}
                    style={{
                      display: "flex",
                      flexDirection: "column" as const,
                      alignItems: "center",
                      gap: 4,
                      padding: 8,
                      borderRadius: 8,
                      fontSize: 10,
                      fontWeight: 700,
                      textTransform: "uppercase" as const,
                      letterSpacing: "0.05em",
                      background: profile.role === role ? `${roleColor[role]}12` : "transparent",
                      border: `1px solid ${profile.role === role ? roleColor[role] : "rgba(255,255,255,0.08)"}`,
                      color: profile.role === role ? roleColor[role] : "#888",
                      opacity: switching !== null && switching !== role ? 0.5 : 1,
                      cursor: "pointer",
                      fontFamily: "inherit",
                      transition: "all 0.2s",
                    }}
                  >
                    <Icon size={14} />
                    {switching === role ? "..." : role.charAt(0).toUpperCase() + role.slice(1)}
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* User Profile */}
        <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "8px 4px" }}>
          <div
            style={{
              width: 32,
              height: 32,
              borderRadius: 8,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 14,
              fontWeight: 700,
              background: `${roleColor[profile.role]}15`,
              color: roleColor[profile.role],
            }}
          >
            {profile.full_name?.charAt(0) || "?"}
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <p style={{ fontSize: 14, fontWeight: 600, color: "#fff", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" as const }}>
              {profile.full_name}
            </p>
            <p style={{ fontSize: 11, color: "#888", textTransform: "capitalize" as const }}>
              {profile.role}
            </p>
          </div>
          <form action={logoutAction}>
            <button
              type="submit"
              className="btn-icon btn-ghost"
              title="Sign out"
              style={{ padding: 6, borderRadius: 8, background: "none", border: "none", color: "#666", cursor: "pointer" }}
            >
              <LogOut size={16} />
            </button>
          </form>
        </div>
      </div>
    </aside>
  );
}

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
  Bell,
  AlertTriangle,
  Users,
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
    employee: "var(--info)",
    manager: "var(--warning)",
    admin: "#a855f7",
  };

  // Navigation items based on role
  const navItems = [
    {
      label: "Dashboard",
      href: "/dashboard",
      icon: LayoutDashboard,
      roles: ["employee", "manager", "admin"],
    },
    {
      label: "My Goals",
      href: "/dashboard/goals",
      icon: Goal,
      roles: ["employee"],
    },
    {
      label: "Team Goals",
      href: "/dashboard/team-goals",
      icon: Users,
      roles: ["manager"],
    },
    {
      label: "All Goals",
      href: "/dashboard/all-goals",
      icon: Goal,
      roles: ["admin"],
    },
    {
      label: "Check-ins",
      href: "/dashboard/checkins",
      icon: CheckSquare,
      roles: ["employee", "manager"],
    },
    {
      section: "Reports",
      roles: ["manager", "admin"],
    },
    {
      label: "Analytics",
      href: "/dashboard/analytics",
      icon: BarChart3,
      roles: ["manager", "admin"],
    },
    {
      label: "Reports",
      href: "/dashboard/reports",
      icon: FileText,
      roles: ["manager", "admin"],
    },
    {
      label: "Audit Trail",
      href: "/dashboard/audit",
      icon: Shield,
      roles: ["admin"],
    },
    {
      section: "Admin",
      roles: ["admin"],
    },
    {
      label: "Cycles",
      href: "/dashboard/cycles",
      icon: Settings,
      roles: ["admin"],
    },
    {
      label: "Escalation",
      href: "/dashboard/escalation",
      icon: AlertTriangle,
      roles: ["admin"],
    },
  ];

  async function handleSwitch(role: "employee" | "manager" | "admin") {
    setSwitching(role);
    await switchDemoRole(role);
  }

  return (
    <aside className="sidebar">
      {/* Logo */}
      <div className="sidebar-logo">
        <Link href="/dashboard" className="flex items-center gap-3 text-decoration-none">
          <div
            className="w-9 h-9 rounded-xl flex items-center justify-center"
            style={{
              background: "linear-gradient(135deg, var(--accent), #8b5cf6)",
            }}
          >
            <Target size={20} color="white" />
          </div>
          <div>
            <h1 className="text-base font-bold tracking-tight" style={{ color: "var(--foreground)" }}>
              AtomQuest
            </h1>
            <p className="text-[10px] font-medium" style={{ color: "var(--muted-foreground)" }}>
              Goal Tracker
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

      {/* Footer - Profile & Role Switcher */}
      <div className="sidebar-footer">
        {/* Demo Role Switcher */}
        <div className="mb-3">
          <button
            onClick={() => setShowRoleSwitcher(!showRoleSwitcher)}
            className="w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-all"
            style={{
              background: "var(--card)",
              border: "1px solid var(--border)",
              color: "var(--muted)",
            }}
          >
            <span>Switch Demo Role</span>
            <ChevronDown
              size={14}
              className={`transition-transform ${showRoleSwitcher ? "rotate-180" : ""}`}
            />
          </button>
          {showRoleSwitcher && (
            <div className="mt-2 grid grid-cols-3 gap-2 animate-fade-in">
              {(["employee", "manager", "admin"] as const).map((role) => {
                const Icon = roleIcon[role];
                return (
                  <button
                    key={role}
                    onClick={() => handleSwitch(role)}
                    disabled={switching !== null}
                    className="flex flex-col items-center gap-1 p-2 rounded-lg text-[11px] font-medium transition-all"
                    style={{
                      background: profile.role === role ? `${roleColor[role]}15` : "transparent",
                      border: `1px solid ${profile.role === role ? roleColor[role] : "var(--border)"}`,
                      color: profile.role === role ? roleColor[role] : "var(--muted)",
                      opacity: switching !== null && switching !== role ? 0.5 : 1,
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
        <div className="flex items-center gap-3 px-3 py-2">
          <div
            className="w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold"
            style={{ background: `${roleColor[profile.role]}20`, color: roleColor[profile.role] }}
          >
            {profile.full_name?.charAt(0) || "?"}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate">{profile.full_name}</p>
            <p className="text-[11px] capitalize" style={{ color: "var(--muted)" }}>
              {profile.role}
            </p>
          </div>
          <form action={logoutAction}>
            <button
              type="submit"
              className="btn-icon btn-ghost p-1.5 rounded-lg"
              title="Sign out"
            >
              <LogOut size={16} />
            </button>
          </form>
        </div>
      </div>
    </aside>
  );
}

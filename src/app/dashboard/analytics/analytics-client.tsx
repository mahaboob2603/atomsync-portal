"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  Legend,
} from "recharts";
import { BarChart3, PieChart as PieChartIcon, TrendingUp, Users } from "lucide-react";

const COLORS = ["#6366f1", "#8b5cf6", "#22c55e", "#f59e0b", "#ef4444", "#3b82f6", "#ec4899", "#14b8a6"];

interface AnalyticsClientProps {
  goals: Array<{
    id: string;
    uom: string;
    thrust_area: { name: string } | null;
    achievements: Array<{
      quarter: string;
      score: number | null;
      status: string;
    }>;
  }>;
  employees: Array<{ id: string; full_name: string; department: string | null }>;
  goalSheets: Array<{
    id: string;
    employee: { id: string; full_name: string; department: string | null } | null;
  }>;
  checkIns: Array<{
    id: string;
    quarter: string;
    manager: { id: string; full_name: string } | null;
  }>;
}

export function AnalyticsClient({
  goals,
  employees,
  goalSheets,
  checkIns,
}: AnalyticsClientProps) {
  // Goal distribution by thrust area
  const thrustAreaDist = goals.reduce((acc, g) => {
    const name = g.thrust_area?.name || "Unknown";
    acc[name] = (acc[name] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const pieData = Object.entries(thrustAreaDist).map(([name, value]) => ({
    name,
    value,
  }));

  // UoM distribution
  const uomDist = goals.reduce((acc, g) => {
    acc[g.uom] = (acc[g.uom] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const uomData = Object.entries(uomDist).map(([name, value]) => ({
    name: name.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase()),
    value,
  }));

  // QoQ achievement trends
  const qoqData = ["Q1", "Q2", "Q3", "Q4"].map((q) => {
    const qAchievements = goals.flatMap((g) =>
      g.achievements.filter((a) => a.quarter === q && a.score !== null)
    );
    const avgScore =
      qAchievements.length > 0
        ? Math.round(
            qAchievements.reduce((s, a) => s + (a.score || 0), 0) / qAchievements.length
          )
        : 0;
    return { quarter: q, avgScore, count: qAchievements.length };
  });

  // Manager effectiveness (check-in count)
  const managerEffectiveness = checkIns.reduce((acc, ci) => {
    const name = ci.manager?.full_name || "Unknown";
    acc[name] = (acc[name] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const managerData = Object.entries(managerEffectiveness).map(([name, count]) => ({
    name,
    checkIns: count,
  }));

  // Completion heatmap data
  const heatmapData = employees.map((emp) => {
    const empGoals = goals.filter((g) =>
      goalSheets.some(
        (gs) => gs.employee?.id === emp.id && gs.id
      )
    );
    return {
      name: emp.full_name,
      ...["Q1", "Q2", "Q3", "Q4"].reduce((acc, q) => {
        const qAchs = empGoals.flatMap((g) =>
          g.achievements.filter((a) => a.quarter === q && a.score !== null)
        );
        acc[q] =
          qAchs.length > 0
            ? Math.round(qAchs.reduce((s, a) => s + (a.score || 0), 0) / qAchs.length)
            : 0;
        return acc;
      }, {} as Record<string, number>),
    };
  });

  return (
    <div>
      <div className="page-header">
        <h1 className="text-2xl font-bold">Analytics</h1>
      </div>

      <div className="page-body space-y-6">
        {/* Top Row - Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* QoQ Trends */}
          <div className="glass-card p-6 animate-fade-in">
            <div className="flex items-center gap-2 mb-4">
              <TrendingUp size={18} style={{ color: "var(--accent-light)" }} />
              <h3 className="font-semibold">Quarter-on-Quarter Trends</h3>
            </div>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={qoqData}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                <XAxis dataKey="quarter" stroke="var(--muted)" fontSize={12} />
                <YAxis stroke="var(--muted)" fontSize={12} />
                <Tooltip
                  contentStyle={{
                    background: "var(--card)",
                    border: "1px solid var(--border)",
                    borderRadius: 8,
                    color: "var(--foreground)",
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="avgScore"
                  stroke="#6366f1"
                  strokeWidth={3}
                  dot={{ fill: "#6366f1", r: 5 }}
                  name="Avg Score %"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Goal Distribution by Thrust Area */}
          <div className="glass-card p-6 animate-fade-in">
            <div className="flex items-center gap-2 mb-4">
              <PieChartIcon size={18} style={{ color: "var(--accent-light)" }} />
              <h3 className="font-semibold">Goals by Thrust Area</h3>
            </div>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  outerRadius={90}
                  dataKey="value"
                  label={({ name, percent }) =>
                    `${name} (${((percent ?? 0) * 100).toFixed(0)}%)`
                  }
                  labelLine={false}
                >
                  {pieData.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    background: "var(--card)",
                    border: "1px solid var(--border)",
                    borderRadius: 8,
                    color: "var(--foreground)",
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Second Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* UoM Distribution */}
          <div className="glass-card p-6 animate-fade-in">
            <div className="flex items-center gap-2 mb-4">
              <BarChart3 size={18} style={{ color: "var(--accent-light)" }} />
              <h3 className="font-semibold">Goal Distribution by UoM</h3>
            </div>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={uomData}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                <XAxis dataKey="name" stroke="var(--muted)" fontSize={10} angle={-25} textAnchor="end" height={60} />
                <YAxis stroke="var(--muted)" fontSize={12} />
                <Tooltip
                  contentStyle={{
                    background: "var(--card)",
                    border: "1px solid var(--border)",
                    borderRadius: 8,
                    color: "var(--foreground)",
                  }}
                />
                <Bar dataKey="value" fill="#6366f1" radius={[6, 6, 0, 0]} name="Goals" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Manager Effectiveness */}
          <div className="glass-card p-6 animate-fade-in">
            <div className="flex items-center gap-2 mb-4">
              <Users size={18} style={{ color: "var(--accent-light)" }} />
              <h3 className="font-semibold">Manager Effectiveness</h3>
            </div>
            {managerData.length > 0 ? (
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={managerData} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                  <XAxis type="number" stroke="var(--muted)" fontSize={12} />
                  <YAxis dataKey="name" type="category" stroke="var(--muted)" fontSize={12} width={120} />
                  <Tooltip
                    contentStyle={{
                      background: "var(--card)",
                      border: "1px solid var(--border)",
                      borderRadius: 8,
                      color: "var(--foreground)",
                    }}
                  />
                  <Bar dataKey="checkIns" fill="#22c55e" radius={[0, 6, 6, 0]} name="Check-ins" />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-[250px]" style={{ color: "var(--muted)" }}>
                No check-in data yet
              </div>
            )}
          </div>
        </div>

        {/* Completion Heatmap */}
        <div className="glass-card p-6 animate-fade-in">
          <h3 className="font-semibold mb-4">Completion Heatmap (Avg Score by Quarter)</h3>
          {heatmapData.length > 0 ? (
            <div className="table-wrapper">
              <table className="table">
                <thead>
                  <tr>
                    <th>Employee</th>
                    <th>Q1</th>
                    <th>Q2</th>
                    <th>Q3</th>
                    <th>Q4</th>
                  </tr>
                </thead>
                <tbody>
                  {heatmapData.map((row) => (
                    <tr key={row.name}>
                      <td className="font-medium">{row.name}</td>
                      {(["Q1", "Q2", "Q3", "Q4"] as const).map((q) => {
                        const val = (row as Record<string, number | string>)[q] as number;
                        const bg =
                          val >= 90
                            ? "var(--success-bg)"
                            : val >= 70
                            ? "var(--info-bg)"
                            : val >= 50
                            ? "var(--warning-bg)"
                            : val > 0
                            ? "var(--danger-bg)"
                            : "transparent";
                        const color =
                          val >= 90
                            ? "var(--success)"
                            : val >= 70
                            ? "var(--info)"
                            : val >= 50
                            ? "var(--warning)"
                            : val > 0
                            ? "var(--danger)"
                            : "var(--muted-foreground)";
                        return (
                          <td key={q}>
                            <div
                              className="w-12 h-8 rounded flex items-center justify-center text-xs font-bold"
                              style={{ background: bg, color }}
                            >
                              {val > 0 ? `${val}%` : "—"}
                            </div>
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-8" style={{ color: "var(--muted)" }}>
              No data available yet
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

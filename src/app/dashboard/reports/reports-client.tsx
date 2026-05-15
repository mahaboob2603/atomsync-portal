"use client";

import { useState } from "react";
import { getUoMLabel, formatStatus } from "@/lib/scoring";
import { Download, FileText, CheckCircle2, XCircle } from "lucide-react";

interface ReportsClientProps {
  goalSheets: Array<{
    id: string;
    employee: { id: string; full_name: string; email: string; department: string | null } | null;
    goals: Array<{
      id: string;
      title: string;
      uom: string;
      target: number;
      weightage: number;
      thrust_area: { name: string } | null;
      achievements: Array<{
        quarter: string;
        planned_value: number | null;
        actual_value: number | null;
        status: string;
        score: number | null;
      }>;
    }>;
  }>;
  checkIns: Array<{ employee_id: string; quarter: string }>;
}

export function ReportsClient({ goalSheets, checkIns }: ReportsClientProps) {
  const [view, setView] = useState<"achievement" | "completion">("achievement");

  function exportCSV() {
    const headers = [
      "Employee",
      "Department",
      "Goal",
      "Thrust Area",
      "UoM",
      "Target",
      "Weightage",
      "Q1 Planned",
      "Q1 Actual",
      "Q1 Score",
      "Q2 Planned",
      "Q2 Actual",
      "Q2 Score",
      "Q3 Planned",
      "Q3 Actual",
      "Q3 Score",
      "Q4 Planned",
      "Q4 Actual",
      "Q4 Score",
    ];

    const rows = goalSheets.flatMap((sheet) =>
      sheet.goals.map((goal) => {
        const getQ = (q: string) => goal.achievements?.find((a) => a.quarter === q);
        return [
          sheet.employee?.full_name,
          sheet.employee?.department,
          goal.title,
          goal.thrust_area?.name,
          getUoMLabel(goal.uom as Parameters<typeof getUoMLabel>[0]),
          goal.target,
          goal.weightage,
          ...(["Q1", "Q2", "Q3", "Q4"] as const).flatMap((q) => {
            const ach = getQ(q);
            return [ach?.planned_value ?? "", ach?.actual_value ?? "", ach?.score ?? ""];
          }),
        ].join(",");
      })
    );

    const csv = [headers.join(","), ...rows].join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "achievement_report.csv";
    a.click();
    URL.revokeObjectURL(url);
  }

  // Check-in completion data
  const employeeCheckIns = new Map<string, Set<string>>();
  checkIns.forEach((ci) => {
    if (!employeeCheckIns.has(ci.employee_id)) {
      employeeCheckIns.set(ci.employee_id, new Set());
    }
    employeeCheckIns.get(ci.employee_id)!.add(ci.quarter);
  });

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="text-2xl font-bold">Reports</h1>
          <p className="text-sm mt-1" style={{ color: "var(--muted)" }}>
            Achievement reports and completion dashboard
          </p>
        </div>
        <button onClick={exportCSV} className="btn btn-primary">
          <Download size={16} />
          Export CSV
        </button>
      </div>

      <div className="page-body space-y-6">
        {/* Tab Selector */}
        <div className="flex gap-2">
          <button
            onClick={() => setView("achievement")}
            className={`btn ${view === "achievement" ? "btn-primary" : "btn-secondary"}`}
          >
            <FileText size={16} />
            Achievement Report
          </button>
          <button
            onClick={() => setView("completion")}
            className={`btn ${view === "completion" ? "btn-primary" : "btn-secondary"}`}
          >
            <CheckCircle2 size={16} />
            Completion Dashboard
          </button>
        </div>

        {view === "achievement" ? (
          <div className="table-wrapper">
            <table className="table">
              <thead>
                <tr>
                  <th>Employee</th>
                  <th>Goal</th>
                  <th>Target</th>
                  <th>Wt%</th>
                  <th>Q1 Score</th>
                  <th>Q2 Score</th>
                  <th>Q3 Score</th>
                  <th>Q4 Score</th>
                </tr>
              </thead>
              <tbody>
                {goalSheets.flatMap((sheet) =>
                  sheet.goals.map((goal) => (
                    <tr key={goal.id}>
                      <td>
                        <div className="font-medium text-sm">
                          {sheet.employee?.full_name}
                        </div>
                        <div className="text-xs" style={{ color: "var(--muted)" }}>
                          {sheet.employee?.department}
                        </div>
                      </td>
                      <td>
                        <div className="text-sm">{goal.title}</div>
                        <div className="text-xs" style={{ color: "var(--muted)" }}>
                          {goal.thrust_area?.name}
                        </div>
                      </td>
                      <td>{goal.target}</td>
                      <td>{goal.weightage}%</td>
                      {(["Q1", "Q2", "Q3", "Q4"] as const).map((q) => {
                        const ach = goal.achievements?.find((a) => a.quarter === q);
                        return (
                          <td key={q}>
                            {ach?.score !== null && ach?.score !== undefined ? (
                              <span
                                style={{
                                  color:
                                    (ach.score ?? 0) >= 90
                                      ? "var(--success)"
                                      : (ach.score ?? 0) >= 70
                                      ? "var(--info)"
                                      : (ach.score ?? 0) >= 50
                                      ? "var(--warning)"
                                      : "var(--danger)",
                                  fontWeight: 600,
                                }}
                              >
                                {ach.score}%
                              </span>
                            ) : (
                              <span style={{ color: "var(--muted-foreground)" }}>—</span>
                            )}
                          </td>
                        );
                      })}
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="space-y-4">
            {goalSheets.map((sheet) => {
              const empCheckIns = employeeCheckIns.get(sheet.employee?.id || "") || new Set();
              return (
                <div key={sheet.id} className="glass-card p-5 animate-fade-in">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div
                        className="w-10 h-10 rounded-xl flex items-center justify-center text-sm font-bold"
                        style={{
                          background: "var(--accent-glow)",
                          color: "var(--accent-light)",
                        }}
                      >
                        {sheet.employee?.full_name?.charAt(0)}
                      </div>
                      <div>
                        <h3 className="font-semibold">{sheet.employee?.full_name}</h3>
                        <p className="text-xs" style={{ color: "var(--muted)" }}>
                          {sheet.employee?.department}
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-4">
                      {(["Q1", "Q2", "Q3", "Q4"] as const).map((q) => (
                        <div key={q} className="text-center">
                          <div className="text-xs mb-1" style={{ color: "var(--muted)" }}>
                            {q}
                          </div>
                          {empCheckIns.has(q) ? (
                            <CheckCircle2 size={20} style={{ color: "var(--success)" }} />
                          ) : (
                            <XCircle size={20} style={{ color: "var(--muted-foreground)" }} />
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

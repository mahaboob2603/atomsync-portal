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
      <div className="page-header relative">
        <div className="absolute left-0 top-0 h-full w-1 bg-gradient-to-b from-[#fdb913] to-transparent"></div>
        <div className="pl-4">
          <div className="flex items-center gap-3 mb-1">
            <span className="text-[10px] font-bold tracking-[0.2em] text-[#fdb913] uppercase">
              INSTITUTIONAL GRADE
            </span>
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight">Reports Intelligence</h1>
          <p className="text-sm mt-1" style={{ color: "var(--muted)" }}>
            Executive achievement reports and check-in completion dashboard
          </p>
        </div>
        <button onClick={exportCSV} className="btn text-[#fdb913] border border-[#fdb913]/30 hover:bg-[#fdb913]/10" style={{ background: "rgba(253, 185, 19, 0.05)" }}>
          <Download size={16} />
          Export CSV
        </button>
      </div>

      <div className="page-body space-y-6">
        {/* Tab Selector */}
        <div className="flex gap-2 p-1 rounded-lg w-max" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.05)" }}>
          <button
            onClick={() => setView("achievement")}
            className={`btn btn-sm ${view === "achievement" ? "bg-[#fdb913] text-black hover:bg-[#e5a610]" : "btn-ghost"}`}
          >
            <FileText size={16} />
            Achievement Report
          </button>
          <button
            onClick={() => setView("completion")}
            className={`btn btn-sm ${view === "completion" ? "bg-[#fdb913] text-black hover:bg-[#e5a610]" : "btn-ghost"}`}
          >
            <CheckCircle2 size={16} />
            Completion Dashboard
          </button>
        </div>

        {view === "achievement" ? (
          <div className="glass-module p-0 overflow-hidden border border-[#fdb913]/20">
            <div className="p-4 border-b border-[#fdb913]/20 bg-gradient-to-r from-[#fdb913]/5 to-transparent">
               <h3 className="text-sm font-bold tracking-[0.08em] uppercase flex items-center gap-2">
                 <FileText size={16} className="text-[#fdb913]" />
                 Enterprise Goal Achievements
               </h3>
            </div>
            <div className="table-wrapper">
              <table className="table">
                <thead>
                  <tr className="text-[#fdb913]">
                    <th className="tracking-[0.08em] uppercase text-xs">Employee</th>
                    <th className="tracking-[0.08em] uppercase text-xs">Goal</th>
                    <th className="tracking-[0.08em] uppercase text-xs">Target</th>
                    <th className="tracking-[0.08em] uppercase text-xs">Wt%</th>
                    <th className="tracking-[0.08em] uppercase text-xs">Q1 Score</th>
                    <th className="tracking-[0.08em] uppercase text-xs">Q2 Score</th>
                    <th className="tracking-[0.08em] uppercase text-xs">Q3 Score</th>
                    <th className="tracking-[0.08em] uppercase text-xs">Q4 Score</th>
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
          </div>
        ) : (
          <div className="space-y-4">
            {goalSheets.map((sheet) => {
              const empCheckIns = employeeCheckIns.get(sheet.employee?.id || "") || new Set();
              return (
                <div key={sheet.id} className="glass-module p-0 border border-[#fdb913]/10 overflow-hidden animate-fade-in group hover:border-[#fdb913]/30 transition-all duration-300">
                  <div className="p-5 flex items-center justify-between relative">
                    {/* Hover glow effect */}
                    <div className="absolute inset-0 bg-gradient-to-r from-[#fdb913]/0 via-[#fdb913]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>

                    <div className="flex items-center gap-4 relative z-10">
                      <div
                        className="w-12 h-12 rounded-lg flex items-center justify-center text-lg font-bold border border-[#fdb913]/30"
                        style={{
                          background: "linear-gradient(135deg, rgba(253, 185, 19, 0.2), rgba(0, 0, 0, 0.5))",
                          color: "#fdb913",
                        }}
                      >
                        {sheet.employee?.full_name?.charAt(0)}
                      </div>
                      <div>
                        <h3 className="font-semibold text-lg">{sheet.employee?.full_name}</h3>
                        <p className="text-xs uppercase tracking-wider text-[#fdb913]/70 font-mono mt-1">
                          {sheet.employee?.department}
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-6 relative z-10">
                      {(["Q1", "Q2", "Q3", "Q4"] as const).map((q) => (
                        <div key={q} className="text-center flex flex-col items-center">
                          <div className="text-[10px] font-bold tracking-[0.1em] mb-2 uppercase" style={{ color: "var(--muted)" }}>
                            {q}
                          </div>
                          {empCheckIns.has(q) ? (
                            <div className="relative">
                              <div className="absolute inset-0 bg-green-500 blur-[8px] opacity-30"></div>
                              <CheckCircle2 size={24} className="text-green-500 relative z-10 drop-shadow-[0_0_8px_rgba(34,197,94,0.5)]" />
                            </div>
                          ) : (
                            <XCircle size={24} style={{ color: "rgba(255, 255, 255, 0.1)" }} />
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

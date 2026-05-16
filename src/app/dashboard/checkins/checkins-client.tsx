"use client";

import { useState } from "react";
import { updateAchievement, addCheckIn } from "@/app/actions/achievements";
import { getUoMLabel, getScoreColor, formatStatus } from "@/lib/scoring";
import type { Profile, Quarter } from "@/lib/types";
import { useRouter } from "next/navigation";
import {
  CheckSquare,
  Save,
  MessageSquare,
  ChevronDown,
  ChevronUp,
  Send,
  Target,
} from "lucide-react";

interface CheckinsClientProps {
  profile: Profile;
  goalSheets: Array<{
    id: string;
    status: string;
    employee?: { id: string; full_name: string; department: string | null } | null;
    employee_id: string;
    cycle?: { name: string } | null;
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
  checkIns: Array<{
    id: string;
    quarter: string;
    comment: string;
    created_at: string;
    manager?: { full_name: string } | null;
  }>;
  activeCycle: { id: string; name: string; phase: string } | null;
}

const QUARTERS: Quarter[] = ["Q1", "Q2", "Q3", "Q4"];

export function CheckinsClient({
  profile,
  goalSheets,
  checkIns,
  activeCycle,
}: CheckinsClientProps) {
  const router = useRouter();
  const [selectedQuarter, setSelectedQuarter] = useState<Quarter>("Q1");
  const [expandedSheet, setExpandedSheet] = useState<string | null>(null);
  const [saving, setSaving] = useState<string | null>(null);
  const [checkInComment, setCheckInComment] = useState("");
  const [showCheckInModal, setShowCheckInModal] = useState<{
    sheetId: string;
    employeeId: string;
  } | null>(null);

  // Achievement form state
  const [achievementData, setAchievementData] = useState<
    Record<string, { planned_value: string; actual_value: string; status: string }>
  >({});

  function getAchievementForGoal(goal: (typeof goalSheets)[0]["goals"][0], quarter: Quarter) {
    return goal.achievements?.find((a) => a.quarter === quarter);
  }

  async function handleSaveAchievement(goalId: string) {
    const data = achievementData[goalId];
    if (!data) return;

    setSaving(goalId);
    await updateAchievement(goalId, selectedQuarter, {
      planned_value: data.planned_value ? Number(data.planned_value) : undefined,
      actual_value: data.actual_value ? Number(data.actual_value) : undefined,
      status: data.status || "not_started",
    });
    setSaving(null);
    router.refresh();
  }

  async function handleAddCheckIn() {
    if (!showCheckInModal || !checkInComment.trim()) return;
    setSaving("checkin");
    await addCheckIn(
      showCheckInModal.sheetId,
      selectedQuarter,
      showCheckInModal.employeeId,
      checkInComment
    );
    setShowCheckInModal(null);
    setCheckInComment("");
    setSaving(null);
    router.refresh();
  }

  const isEmployee = profile.role === "employee";

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
          <h1 className="text-3xl font-extrabold tracking-tight">
            {isEmployee ? "My Check-ins" : "Team Check-ins"}
          </h1>
          <p className="text-sm mt-1" style={{ color: "var(--muted)" }}>
            {isEmployee
              ? "Log your quarterly achievements"
              : "Review team achievements and add feedback"}
          </p>
        </div>
      </div>

      <div className="page-body space-y-6">
        {/* Quarter Selector */}
        <div className="flex gap-2 p-1 rounded-lg w-max" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.05)" }}>
          {QUARTERS.map((q) => (
            <button
              key={q}
              onClick={() => setSelectedQuarter(q)}
              className={`btn btn-sm ${selectedQuarter === q ? "bg-[#fdb913] text-black hover:bg-[#e5a610]" : "btn-ghost"}`}
            >
              {q}
            </button>
          ))}
        </div>

        {/* Goal Sheets */}
        {goalSheets.length === 0 ? (
          <div className="glass-module p-12 text-center border border-[#fdb913]/20">
            <Target size={48} className="mx-auto mb-4 text-[#fdb913]/40" />
            <h2 className="text-xl font-semibold mb-2">No Approved Goals</h2>
            <p style={{ color: "var(--muted)" }}>
              {isEmployee
                ? "Your goals need to be approved before you can log achievements."
                : "No approved goal sheets found for your team."}
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {goalSheets.map((sheet) => {
              const isExpanded = expandedSheet === sheet.id;
              const employeeName = isEmployee
                ? profile.full_name
                : sheet.employee?.full_name || "Unknown";

              return (
                <div key={sheet.id} className="glass-module p-0 overflow-hidden animate-fade-in border border-[#fdb913]/20 group hover:border-[#fdb913]/40 transition-colors duration-300">
                  <div
                    onClick={() => setExpandedSheet(isExpanded ? null : sheet.id)}
                    className="w-full p-5 flex items-center justify-between text-left cursor-pointer relative"
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") setExpandedSheet(isExpanded ? null : sheet.id); }}
                  >
                    {/* Subtle glow on hover */}
                    <div className="absolute inset-0 bg-gradient-to-r from-[#fdb913]/0 via-[#fdb913]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>

                    <div className="flex items-center gap-4 relative z-10">
                      <div
                        className="w-12 h-12 rounded-lg flex items-center justify-center text-lg font-bold border border-[#fdb913]/30"
                        style={{ background: "linear-gradient(135deg, rgba(253, 185, 19, 0.2), rgba(0, 0, 0, 0.5))", color: "#fdb913" }}
                      >
                        {employeeName.charAt(0)}
                      </div>
                      <div>
                        <h3 className="font-semibold">{employeeName}</h3>
                        <p className="text-xs" style={{ color: "var(--muted)" }}>
                          {sheet.goals.length} goals • {sheet.cycle?.name}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      {!isEmployee && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setShowCheckInModal({
                              sheetId: sheet.id,
                              employeeId: sheet.employee_id,
                            });
                          }}
                          className="btn btn-sm btn-primary"
                        >
                          <MessageSquare size={14} />
                          Check-in
                        </button>
                      )}
                      {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                    </div>
                  </div>

                  {isExpanded && (
                    <div className="px-5 pb-5 animate-fade-in">
                      <div style={{ borderTop: "1px solid var(--border)", paddingTop: "16px" }}>
                        <div className="table-wrapper">
                          <table className="table">
                            <thead>
                              <tr className="text-[#fdb913]">
                                <th className="tracking-[0.08em] uppercase text-xs">Goal</th>
                                <th className="tracking-[0.08em] uppercase text-xs">UoM</th>
                                <th className="tracking-[0.08em] uppercase text-xs">Target</th>
                                <th className="tracking-[0.08em] uppercase text-xs">Planned</th>
                                <th className="tracking-[0.08em] uppercase text-xs">Actual</th>
                                <th className="tracking-[0.08em] uppercase text-xs">Status</th>
                                <th className="tracking-[0.08em] uppercase text-xs">Score</th>
                                {isEmployee && <th className="tracking-[0.08em] uppercase text-xs">Actions</th>}
                              </tr>
                            </thead>
                            <tbody>
                              {sheet.goals.map((goal) => {
                                const ach = getAchievementForGoal(goal, selectedQuarter);
                                const formData = achievementData[goal.id] || {
                                  planned_value: ach?.planned_value?.toString() || "",
                                  actual_value: ach?.actual_value?.toString() || "",
                                  status: ach?.status || "not_started",
                                };

                                return (
                                  <tr key={goal.id}>
                                    <td>
                                      <div className="font-medium">{goal.title}</div>
                                      <div className="text-xs" style={{ color: "var(--muted)" }}>
                                        {goal.thrust_area?.name} • {goal.weightage}%
                                      </div>
                                    </td>
                                    <td className="text-xs">
                                      {getUoMLabel(goal.uom as Parameters<typeof getUoMLabel>[0])}
                                    </td>
                                    <td>{goal.target}</td>
                                    <td>
                                      {isEmployee ? (
                                        <input
                                          type="number"
                                          className="input"
                                          style={{ width: 80, padding: "4px 8px" }}
                                          value={formData.planned_value}
                                          onChange={(e) =>
                                            setAchievementData((prev) => ({
                                              ...prev,
                                              [goal.id]: {
                                                ...formData,
                                                planned_value: e.target.value,
                                              },
                                            }))
                                          }
                                        />
                                      ) : (
                                        ach?.planned_value ?? "—"
                                      )}
                                    </td>
                                    <td>
                                      {isEmployee ? (
                                        <input
                                          type="number"
                                          className="input"
                                          style={{ width: 80, padding: "4px 8px" }}
                                          value={formData.actual_value}
                                          onChange={(e) =>
                                            setAchievementData((prev) => ({
                                              ...prev,
                                              [goal.id]: {
                                                ...formData,
                                                actual_value: e.target.value,
                                              },
                                            }))
                                          }
                                        />
                                      ) : (
                                        ach?.actual_value ?? "—"
                                      )}
                                    </td>
                                    <td>
                                      {isEmployee ? (
                                        <select
                                          className="input select"
                                          style={{ width: 120, padding: "4px 8px", fontSize: 12 }}
                                          value={formData.status}
                                          onChange={(e) =>
                                            setAchievementData((prev) => ({
                                              ...prev,
                                              [goal.id]: {
                                                ...formData,
                                                status: e.target.value,
                                              },
                                            }))
                                          }
                                        >
                                          <option value="not_started">Not Started</option>
                                          <option value="on_track">On Track</option>
                                          <option value="completed">Completed</option>
                                        </select>
                                      ) : (
                                        <span
                                          className={`badge badge-${ach?.status || "not-started"}`}
                                        >
                                          {formatStatus(ach?.status || "not_started")}
                                        </span>
                                      )}
                                    </td>
                                    <td>
                                      <span className={getScoreColor(ach?.score ?? null)}>
                                        {ach?.score !== null && ach?.score !== undefined
                                          ? `${ach.score}%`
                                          : "—"}
                                      </span>
                                    </td>
                                    {isEmployee && (
                                      <td>
                                        <button
                                          onClick={() => handleSaveAchievement(goal.id)}
                                          className="btn btn-sm btn-primary"
                                          disabled={saving === goal.id}
                                        >
                                          {saving === goal.id ? "..." : <Save size={12} />}
                                        </button>
                                      </td>
                                    )}
                                  </tr>
                                );
                              })}
                            </tbody>
                          </table>
                        </div>

                        {/* Past check-ins for this sheet */}
                        {checkIns.filter(
                          (ci) =>
                            ci.quarter === selectedQuarter && (ci as any).employee_id === sheet.employee_id
                        ).length > 0 && (
                          <div className="mt-8">
                            <div className="flex items-center gap-2 mb-4">
                              <MessageSquare size={16} className="text-[#fdb913]" />
                              <h4 className="text-sm font-bold tracking-wide uppercase text-[#fdb913]">
                                {selectedQuarter} Check-in History
                              </h4>
                            </div>
                            <div className="table-wrapper">
                              <table className="table">
                                <thead>
                                  <tr className="text-[#fdb913]">
                                    <th className="tracking-[0.08em] uppercase text-xs" style={{ width: "20%" }}>Date & Time</th>
                                    <th className="tracking-[0.08em] uppercase text-xs" style={{ width: "20%" }}>Added By</th>
                                    <th className="tracking-[0.08em] uppercase text-xs">Discussion / Notes</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {checkIns
                                    .filter((ci) => ci.quarter === selectedQuarter && (ci as any).employee_id === sheet.employee_id)
                                    .map((ci) => (
                                      <tr key={ci.id}>
                                        <td className="text-xs font-mono" style={{ color: "var(--muted)" }}>
                                          {new Intl.DateTimeFormat('en-IN', {
                                            dateStyle: 'short',
                                            timeStyle: 'medium',
                                            timeZone: 'Asia/Kolkata'
                                          }).format(new Date(ci.created_at))}
                                        </td>
                                        <td className="text-xs font-medium">
                                          {ci.manager?.full_name || "Self"}
                                        </td>
                                        <td className="text-sm leading-relaxed" style={{ color: "var(--foreground)" }}>
                                          {ci.comment}
                                        </td>
                                      </tr>
                                    ))}
                                </tbody>
                              </table>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Check-in Comment Modal */}
      {showCheckInModal && (
        <div className="modal-overlay" onClick={() => setShowCheckInModal(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3 className="text-lg font-semibold">{selectedQuarter} Check-in</h3>
            </div>
            <div className="modal-body">
              <label className="label">Check-in Comment</label>
              <textarea
                className="input textarea"
                value={checkInComment}
                onChange={(e) => setCheckInComment(e.target.value)}
                placeholder="Document the discussion, feedback, and next steps..."
                rows={5}
              />
            </div>
            <div className="modal-footer">
              <button
                onClick={() => setShowCheckInModal(null)}
                className="btn btn-secondary"
              >
                Cancel
              </button>
              <button
                onClick={handleAddCheckIn}
                className="btn btn-primary"
                disabled={!checkInComment.trim() || saving === "checkin"}
              >
                <Send size={14} />
                Submit Check-in
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

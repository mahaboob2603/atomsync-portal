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
      <div className="page-header">
        <div>
          <h1 className="text-2xl font-bold">
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
        <div className="flex gap-2">
          {QUARTERS.map((q) => (
            <button
              key={q}
              onClick={() => setSelectedQuarter(q)}
              className={`btn ${selectedQuarter === q ? "btn-primary" : "btn-secondary"} btn-sm`}
            >
              {q}
            </button>
          ))}
        </div>

        {/* Goal Sheets */}
        {goalSheets.length === 0 ? (
          <div className="glass-card p-12 text-center">
            <Target size={48} className="mx-auto mb-4" style={{ color: "var(--muted)" }} />
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
                <div key={sheet.id} className="glass-card overflow-hidden animate-fade-in">
                  <button
                    onClick={() => setExpandedSheet(isExpanded ? null : sheet.id)}
                    className="w-full p-5 flex items-center justify-between text-left"
                  >
                    <div className="flex items-center gap-4">
                      <div
                        className="w-10 h-10 rounded-xl flex items-center justify-center text-sm font-bold"
                        style={{ background: "var(--accent-glow)", color: "var(--accent-light)" }}
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
                  </button>

                  {isExpanded && (
                    <div className="px-5 pb-5 animate-fade-in">
                      <div style={{ borderTop: "1px solid var(--border)", paddingTop: "16px" }}>
                        <div className="table-wrapper">
                          <table className="table">
                            <thead>
                              <tr>
                                <th>Goal</th>
                                <th>UoM</th>
                                <th>Target</th>
                                <th>Planned</th>
                                <th>Actual</th>
                                <th>Status</th>
                                <th>Score</th>
                                {isEmployee && <th>Actions</th>}
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
                            ci.quarter === selectedQuarter
                        ).length > 0 && (
                          <div className="mt-4">
                            <h4 className="text-sm font-semibold mb-2">
                              {selectedQuarter} Check-in Notes
                            </h4>
                            <div className="space-y-2">
                              {checkIns
                                .filter((ci) => ci.quarter === selectedQuarter)
                                .map((ci) => (
                                  <div
                                    key={ci.id}
                                    className="p-3 rounded-lg text-sm"
                                    style={{ background: "var(--card)" }}
                                  >
                                    <p>{ci.comment}</p>
                                    <p className="text-xs mt-1" style={{ color: "var(--muted)" }}>
                                      {ci.manager?.full_name && `By ${ci.manager.full_name} • `}
                                      {new Date(ci.created_at).toLocaleString()}
                                    </p>
                                  </div>
                                ))}
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

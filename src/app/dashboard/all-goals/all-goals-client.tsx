"use client";

import { useState } from "react";
import { unlockGoalSheet, createSharedGoal } from "@/app/actions/goals";
import { getUoMLabel, formatStatus } from "@/lib/scoring";
import type { ThrustArea, UoMType } from "@/lib/types";
import { useRouter } from "next/navigation";
import {
  Unlock,
  Lock,
  Share2,
  ChevronDown,
  ChevronUp,
  X,
  Plus,
  Users,
  Target,
} from "lucide-react";

interface AllGoalsClientProps {
  goalSheets: Array<{
    id: string;
    status: string;
    locked: boolean;
    employee: { id: string; full_name: string; email: string; department: string | null } | null;
    cycle: { name: string } | null;
    goals: Array<{
      id: string;
      title: string;
      uom: string;
      target: number;
      weightage: number;
      is_shared: boolean;
      thrust_area: { name: string } | null;
    }>;
  }>;
  employees: Array<{ id: string; full_name: string; email: string; department: string | null }>;
  thrustAreas: ThrustArea[];
  activeCycle: { id: string; name: string } | null;
}

export function AllGoalsClient({
  goalSheets,
  employees,
  thrustAreas,
  activeCycle,
}: AllGoalsClientProps) {
  const router = useRouter();
  const [expandedSheet, setExpandedSheet] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [showSharedGoalModal, setShowSharedGoalModal] = useState(false);
  const [selectedEmployees, setSelectedEmployees] = useState<string[]>([]);
  const [sharedGoalForm, setSharedGoalForm] = useState({
    title: "",
    description: "",
    thrust_area_id: "",
    uom: "numeric_min" as UoMType,
    target: 0,
    weightage: 10,
  });

  async function handleUnlock(sheetId: string) {
    if (!confirm("Unlock this goal sheet? This will set it back to draft status.")) return;
    setLoading(true);
    await unlockGoalSheet(sheetId);
    setLoading(false);
    router.refresh();
  }

  async function handleCreateSharedGoal() {
    if (!activeCycle || selectedEmployees.length === 0) return;
    setLoading(true);
    await createSharedGoal(sharedGoalForm, selectedEmployees, activeCycle.id);
    setShowSharedGoalModal(false);
    setSelectedEmployees([]);
    setLoading(false);
    router.refresh();
  }

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="text-2xl font-bold">All Goals (Admin)</h1>
          <p className="text-sm mt-1" style={{ color: "var(--muted)" }}>
            {goalSheets.length} goal sheets across the organization
          </p>
        </div>
        <button onClick={() => setShowSharedGoalModal(true)} className="btn btn-primary">
          <Share2 size={16} />
          Push Shared Goal
        </button>
      </div>

      <div className="page-body space-y-4">
        {goalSheets.map((sheet) => {
          const isExpanded = expandedSheet === sheet.id;
          const totalWeightage = sheet.goals.reduce((s, g) => s + Number(g.weightage), 0);

          return (
            <div key={sheet.id} className="glass-card overflow-hidden animate-fade-in">
              <div
                onClick={() => setExpandedSheet(isExpanded ? null : sheet.id)}
                className="w-full p-5 flex items-center justify-between text-left cursor-pointer transition-colors"
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    setExpandedSheet(isExpanded ? null : sheet.id);
                  }
                }}
              >
                <div className="flex items-center gap-4">
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center text-sm font-bold"
                    style={{ background: "var(--accent-glow)", color: "var(--accent-light)" }}
                  >
                    {sheet.employee?.full_name?.charAt(0) || "?"}
                  </div>
                  <div>
                    <h3 className="font-semibold">{sheet.employee?.full_name}</h3>
                    <p className="text-xs" style={{ color: "var(--muted)" }}>
                      {sheet.employee?.department} • {sheet.goals.length} goals • {totalWeightage}%
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  {sheet.locked && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleUnlock(sheet.id);
                      }}
                      className="btn btn-sm btn-secondary"
                      disabled={loading}
                    >
                      <Unlock size={12} />
                      Unlock
                    </button>
                  )}
                  <span
                    className={`badge badge-${
                      sheet.status === "pending_approval" ? "pending" : sheet.status
                    }`}
                  >
                    {sheet.locked && <Lock size={10} />}
                    {formatStatus(sheet.status)}
                  </span>
                  {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                </div>
              </div>

              {isExpanded && (
                <div className="px-5 pb-5 animate-fade-in">
                  <div style={{ borderTop: "1px solid var(--border)", paddingTop: "16px" }}>
                    <div className="table-wrapper">
                      <table className="table">
                        <thead>
                          <tr>
                            <th>Goal</th>
                            <th>Thrust Area</th>
                            <th>UoM</th>
                            <th>Target</th>
                            <th>Weightage</th>
                            <th>Shared</th>
                          </tr>
                        </thead>
                        <tbody>
                          {sheet.goals.map((goal) => (
                            <tr key={goal.id}>
                              <td className="font-medium">{goal.title}</td>
                              <td>{goal.thrust_area?.name}</td>
                              <td className="text-xs">
                                {getUoMLabel(goal.uom as Parameters<typeof getUoMLabel>[0])}
                              </td>
                              <td>{goal.target}</td>
                              <td>{goal.weightage}%</td>
                              <td>
                                {goal.is_shared && (
                                  <Share2 size={14} style={{ color: "#a855f7" }} />
                                )}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Shared Goal Modal */}
      {showSharedGoalModal && (
        <div className="modal-overlay" onClick={() => setShowSharedGoalModal(false)}>
          <div
            className="modal-content"
            style={{ maxWidth: 640 }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="modal-header">
              <h3 className="text-lg font-semibold">Push Shared Goal</h3>
              <button
                onClick={() => setShowSharedGoalModal(false)}
                className="btn btn-ghost btn-icon"
              >
                <X size={18} />
              </button>
            </div>
            <div className="modal-body space-y-4">
              <div>
                <label className="label">Goal Title</label>
                <input
                  className="input"
                  value={sharedGoalForm.title}
                  onChange={(e) =>
                    setSharedGoalForm((f) => ({ ...f, title: e.target.value }))
                  }
                  placeholder="e.g., Achieve team safety target of zero incidents"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="label">Thrust Area</label>
                  <select
                    className="input select"
                    value={sharedGoalForm.thrust_area_id}
                    onChange={(e) =>
                      setSharedGoalForm((f) => ({ ...f, thrust_area_id: e.target.value }))
                    }
                  >
                    <option value="">Select</option>
                    {thrustAreas.map((ta) => (
                      <option key={ta.id} value={ta.id}>
                        {ta.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="label">UoM</label>
                  <select
                    className="input select"
                    value={sharedGoalForm.uom}
                    onChange={(e) =>
                      setSharedGoalForm((f) => ({ ...f, uom: e.target.value as UoMType }))
                    }
                  >
                    {(["numeric_min", "numeric_max", "percentage_min", "percentage_max", "timeline", "zero"] as UoMType[]).map((u) => (
                      <option key={u} value={u}>{getUoMLabel(u)}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="label">Target</label>
                  <input
                    type="number"
                    className="input"
                    value={sharedGoalForm.target}
                    onChange={(e) =>
                      setSharedGoalForm((f) => ({ ...f, target: Number(e.target.value) }))
                    }
                  />
                </div>
                <div>
                  <label className="label">Default Weightage (%)</label>
                  <input
                    type="number"
                    className="input"
                    min={10}
                    max={100}
                    value={sharedGoalForm.weightage}
                    onChange={(e) =>
                      setSharedGoalForm((f) => ({ ...f, weightage: Number(e.target.value) }))
                    }
                  />
                </div>
              </div>
              <div>
                <label className="label">Assign to Employees</label>
                <div
                  className="max-h-48 overflow-y-auto rounded-lg p-2 space-y-1"
                  style={{ background: "var(--background)", border: "1px solid var(--border)" }}
                >
                  {employees.map((emp) => (
                    <label
                      key={emp.id}
                      className="flex items-center gap-3 p-2 rounded-lg cursor-pointer hover:bg-[var(--card)]"
                    >
                      <input
                        type="checkbox"
                        checked={selectedEmployees.includes(emp.id)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedEmployees((prev) => [...prev, emp.id]);
                          } else {
                            setSelectedEmployees((prev) => prev.filter((id) => id !== emp.id));
                          }
                        }}
                      />
                      <span className="text-sm">{emp.full_name}</span>
                      <span className="text-xs" style={{ color: "var(--muted)" }}>
                        {emp.department}
                      </span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button
                onClick={() => setShowSharedGoalModal(false)}
                className="btn btn-secondary"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateSharedGoal}
                className="btn btn-primary"
                disabled={
                  loading ||
                  !sharedGoalForm.title ||
                  !sharedGoalForm.thrust_area_id ||
                  selectedEmployees.length === 0
                }
              >
                <Share2 size={14} />
                Push to {selectedEmployees.length} Employee{selectedEmployees.length !== 1 ? "s" : ""}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

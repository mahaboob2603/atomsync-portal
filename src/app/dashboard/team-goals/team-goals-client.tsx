"use client";

import { useState } from "react";
import { approveGoalSheet, returnGoalSheet, updateGoal } from "@/app/actions/goals";
import { getUoMLabel, formatStatus } from "@/lib/scoring";
import type { Profile } from "@/lib/types";
import { useRouter } from "next/navigation";
import {
  CheckCircle2,
  RotateCcw,
  User,
  ChevronDown,
  ChevronUp,
  Lock,
  Edit3,
  Save,
  X,
} from "lucide-react";

interface TeamGoalsClientProps {
  profile: Profile;
  goalSheets: Array<{
    id: string;
    status: string;
    locked: boolean;
    submitted_at: string | null;
    employee: { id: string; full_name: string; email: string; department: string | null } | null;
    cycle: { name: string } | null;
    goals: Array<{
      id: string;
      title: string;
      uom: string;
      target: number;
      weightage: number;
      thrust_area: { name: string } | null;
    }>;
  }>;
}

export function TeamGoalsClient({ profile, goalSheets }: TeamGoalsClientProps) {
  const router = useRouter();
  const [expandedSheet, setExpandedSheet] = useState<string | null>(null);
  const [returnReason, setReturnReason] = useState("");
  const [showReturnModal, setShowReturnModal] = useState<string | null>(null);
  const [editingGoal, setEditingGoal] = useState<string | null>(null);
  const [editValues, setEditValues] = useState<{ target?: number; weightage?: number }>({});
  const [loading, setLoading] = useState(false);

  const pendingSheets = goalSheets.filter((s) => s.status === "pending_approval");
  const approvedSheets = goalSheets.filter((s) => s.status === "approved");
  const otherSheets = goalSheets.filter(
    (s) => !["pending_approval", "approved"].includes(s.status)
  );

  async function handleApprove(sheetId: string) {
    setLoading(true);
    await approveGoalSheet(sheetId);
    setLoading(false);
    router.refresh();
  }

  async function handleReturn(sheetId: string) {
    if (!returnReason.trim()) return;
    setLoading(true);
    await returnGoalSheet(sheetId, returnReason);
    setShowReturnModal(null);
    setReturnReason("");
    setLoading(false);
    router.refresh();
  }

  async function handleSaveGoalEdit(goalId: string) {
    setLoading(true);
    await updateGoal(goalId, editValues);
    setEditingGoal(null);
    setEditValues({});
    setLoading(false);
    router.refresh();
  }

  function renderSheetCard(sheet: (typeof goalSheets)[0]) {
    const isExpanded = expandedSheet === sheet.id;
    const totalWeightage = sheet.goals.reduce((s, g) => s + Number(g.weightage), 0);

    return (
      <div key={sheet.id} className="glass-module p-0 overflow-hidden animate-fade-in border border-[#fdb913]/20 group hover:border-[#fdb913]/40 transition-colors duration-300">
        {/* Header */}
        <button
          onClick={() => setExpandedSheet(isExpanded ? null : sheet.id)}
          className="w-full p-5 flex items-center justify-between text-left relative"
        >
          {/* Subtle glow on hover */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#fdb913]/0 via-[#fdb913]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
          
          <div className="flex items-center gap-4 relative z-10">
            <div
              className="w-12 h-12 rounded-lg flex items-center justify-center text-lg font-bold border border-[#fdb913]/30"
              style={{ background: "linear-gradient(135deg, rgba(253, 185, 19, 0.2), rgba(0, 0, 0, 0.5))", color: "#fdb913" }}
            >
              {sheet.employee?.full_name?.charAt(0) || "?"}
            </div>
            <div>
              <h3 className="font-semibold text-lg">{sheet.employee?.full_name}</h3>
              <p className="text-xs uppercase tracking-wider text-[#fdb913]/70 font-mono mt-1">
                {sheet.employee?.department || "—"} • {sheet.goals.length} goals • {totalWeightage}% weightage
              </p>
            </div>
          </div>
          <div className="flex items-center gap-4 relative z-10">
            <span
              className={`badge badge-${
                sheet.status === "pending_approval" ? "pending" : sheet.status
              }`}
            >
              {sheet.locked && <Lock size={10} />}
              {formatStatus(sheet.status)}
            </span>
            <div className="w-8 h-8 rounded-full border border-white/10 flex items-center justify-center group-hover:border-[#fdb913]/40 group-hover:text-[#fdb913] transition-colors">
              {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
            </div>
          </div>
        </button>

        {/* Expanded Content */}
        {isExpanded && (
          <div className="px-5 pb-5 animate-fade-in">
            <div style={{ borderTop: "1px solid var(--border)", paddingTop: "16px" }}>
              {/* Goals Table */}
              <div className="table-wrapper">
                <table className="table">
                  <thead>
                    <tr className="text-[#fdb913]">
                      <th className="tracking-[0.08em] uppercase text-xs">Goal Blueprint</th>
                      <th className="tracking-[0.08em] uppercase text-xs">Thrust Area</th>
                      <th className="tracking-[0.08em] uppercase text-xs">UoM</th>
                      <th className="tracking-[0.08em] uppercase text-xs">Target</th>
                      <th className="tracking-[0.08em] uppercase text-xs">Weightage</th>
                      {sheet.status === "pending_approval" && <th className="tracking-[0.08em] uppercase text-xs">Actions</th>}
                    </tr>
                  </thead>
                  <tbody>
                    {sheet.goals.map((goal) => (
                      <tr key={goal.id}>
                        <td className="font-medium">{goal.title}</td>
                        <td>{goal.thrust_area?.name || "—"}</td>
                        <td className="text-xs">{getUoMLabel(goal.uom as Parameters<typeof getUoMLabel>[0])}</td>
                        <td>
                          {editingGoal === goal.id ? (
                            <input
                              type="number"
                              className="input"
                              style={{ width: 80, padding: "4px 8px" }}
                              defaultValue={goal.target}
                              onChange={(e) =>
                                setEditValues((prev) => ({
                                  ...prev,
                                  target: Number(e.target.value),
                                }))
                              }
                            />
                          ) : (
                            goal.target
                          )}
                        </td>
                        <td>
                          {editingGoal === goal.id ? (
                            <input
                              type="number"
                              className="input"
                              style={{ width: 80, padding: "4px 8px" }}
                              defaultValue={goal.weightage}
                              onChange={(e) =>
                                setEditValues((prev) => ({
                                  ...prev,
                                  weightage: Number(e.target.value),
                                }))
                              }
                            />
                          ) : (
                            `${goal.weightage}%`
                          )}
                        </td>
                        {sheet.status === "pending_approval" && (
                          <td>
                            {editingGoal === goal.id ? (
                              <div className="flex gap-1">
                                <button
                                  onClick={() => handleSaveGoalEdit(goal.id)}
                                  className="btn btn-sm btn-success"
                                  disabled={loading}
                                >
                                  <Save size={12} />
                                </button>
                                <button
                                  onClick={() => {
                                    setEditingGoal(null);
                                    setEditValues({});
                                  }}
                                  className="btn btn-sm btn-secondary"
                                >
                                  <X size={12} />
                                </button>
                              </div>
                            ) : (
                              <button
                                onClick={() => setEditingGoal(goal.id)}
                                className="btn btn-sm btn-ghost"
                              >
                                <Edit3 size={12} />
                              </button>
                            )}
                          </td>
                        )}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Action Buttons */}
              {sheet.status === "pending_approval" && (
                <div className="flex gap-3 mt-4 justify-end">
                  <button
                    onClick={() => setShowReturnModal(sheet.id)}
                    className="btn btn-danger btn-sm"
                    disabled={loading}
                  >
                    <RotateCcw size={14} />
                    Return for Rework
                  </button>
                  <button
                    onClick={() => handleApprove(sheet.id)}
                    className="btn btn-success btn-sm"
                    disabled={loading}
                  >
                    <CheckCircle2 size={14} />
                    Approve & Lock
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div>
      <div className="page-header relative">
        <div className="absolute left-0 top-0 h-full w-1 bg-gradient-to-b from-[#fdb913] to-transparent"></div>
        <div className="pl-4">
          <div className="flex items-center gap-3 mb-1">
            <span className="text-[10px] font-bold tracking-[0.2em] text-[#fdb913] uppercase">
              INSTITUTIONAL GRADE
            </span>
            <span className="px-2 py-0.5 rounded-sm bg-[#fdb913]/10 text-[#fdb913] border border-[#fdb913]/20 text-[10px] font-bold tracking-wider">
              {pendingSheets.length} PENDING
            </span>
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight">Team Goal Architecture</h1>
          <p className="text-sm mt-1" style={{ color: "var(--muted)" }}>
            Review, approve, and direct team objectives
          </p>
        </div>
      </div>

      <div className="page-body space-y-6">
        {/* Pending Approval */}
        {pendingSheets.length > 0 && (
          <div>
            <h2 className="text-sm font-bold tracking-[0.1em] uppercase mb-4 flex items-center gap-2 text-white">
              <span className="w-1.5 h-1.5 rounded-full bg-[#f59e0b] animate-pulse shadow-[0_0_8px_#f59e0b]" />
              Awaiting Approval ({pendingSheets.length})
            </h2>
            <div className="space-y-4">
              {pendingSheets.map(renderSheetCard)}
            </div>
          </div>
        )}

        {/* Approved */}
        {approvedSheets.length > 0 && (
          <div>
            <h2 className="text-sm font-bold tracking-[0.1em] uppercase mb-4 flex items-center gap-2 text-white mt-8">
              <span className="w-1.5 h-1.5 rounded-full bg-[#22c55e] shadow-[0_0_8px_#22c55e]" />
              Active Blueprints ({approvedSheets.length})
            </h2>
            <div className="space-y-4">
              {approvedSheets.map(renderSheetCard)}
            </div>
          </div>
        )}

        {/* Others */}
        {otherSheets.length > 0 && (
          <div>
            <h2 className="text-sm font-bold tracking-[0.1em] uppercase mb-4 flex items-center gap-2 text-white mt-8">
              <span className="w-1.5 h-1.5 rounded-full bg-gray-500" />
              Drafts & Revisions ({otherSheets.length})
            </h2>
            <div className="space-y-4">
              {otherSheets.map(renderSheetCard)}
            </div>
          </div>
        )}

        {goalSheets.length === 0 && (
          <div className="glass-module p-12 text-center border border-[#fdb913]/20">
            <User size={48} className="mx-auto mb-4 text-[#fdb913]/40" />
            <h2 className="text-xl font-semibold mb-2">No Architectures Found</h2>
            <p style={{ color: "var(--muted)" }}>Team members have not yet submitted goal blueprints.</p>
          </div>
        )}
      </div>

      {/* Return Modal */}
      {showReturnModal && (
        <div className="modal-overlay" onClick={() => setShowReturnModal(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3 className="text-lg font-semibold">Return for Rework</h3>
              <button onClick={() => setShowReturnModal(null)} className="btn btn-ghost btn-icon">
                <X size={18} />
              </button>
            </div>
            <div className="modal-body">
              <label className="label">Reason for returning</label>
              <textarea
                className="input textarea"
                value={returnReason}
                onChange={(e) => setReturnReason(e.target.value)}
                placeholder="Explain what needs to be revised..."
              />
            </div>
            <div className="modal-footer">
              <button onClick={() => setShowReturnModal(null)} className="btn btn-secondary">
                Cancel
              </button>
              <button
                onClick={() => handleReturn(showReturnModal)}
                className="btn btn-danger"
                disabled={!returnReason.trim() || loading}
              >
                <RotateCcw size={14} />
                Return
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

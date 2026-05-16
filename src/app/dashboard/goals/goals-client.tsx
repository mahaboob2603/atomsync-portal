"use client";

import { useState } from "react";
import { GoalForm } from "@/components/goal-form";
import { createGoalSheet, submitGoalSheet, deleteGoal } from "@/app/actions/goals";
import { getUoMLabel, getScoreColor, formatStatus } from "@/lib/scoring";
import type { Profile, ThrustArea, Cycle } from "@/lib/types";
import { useRouter } from "next/navigation";
import {
  Target,
  Send,
  Trash2,
  AlertCircle,
  CheckCircle2,
  Clock,
  RotateCcw,
  Lock,
  Share2,
} from "lucide-react";

interface GoalsClientProps {
  profile: Profile;
  activeCycle: Cycle | null;
  thrustAreas: ThrustArea[];
  goalSheet: {
    id: string;
    status: string;
    locked: boolean;
    return_reason: string | null;
  } | null;
  goals: Array<{
    id: string;
    title: string;
    description: string | null;
    uom: string;
    target: number;
    weightage: number;
    is_shared: boolean;
    thrust_area: { id: string; name: string } | null;
    achievements: Array<{
      id: string;
      quarter: string;
      planned_value: number | null;
      actual_value: number | null;
      status: string;
      score: number | null;
    }>;
  }>;
}

export function GoalsClient({
  profile,
  activeCycle,
  thrustAreas,
  goalSheet,
  goals,
}: GoalsClientProps) {
  const router = useRouter();
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const totalWeightage = goals.reduce((sum, g) => sum + Number(g.weightage), 0);
  const canEdit =
    goalSheet && !goalSheet.locked && ["draft", "returned"].includes(goalSheet.status);

  async function handleCreateSheet() {
    if (!activeCycle) return;
    setError("");
    const result = await createGoalSheet(activeCycle.id);
    if (result.error) setError(result.error);
    router.refresh();
  }

  async function handleSubmit() {
    if (!goalSheet) return;
    setSubmitting(true);
    setError("");
    const result = await submitGoalSheet(goalSheet.id);
    if (result.error) {
      setError(result.error);
    }
    setSubmitting(false);
    router.refresh();
  }

  async function handleDeleteGoal(goalId: string) {
    if (!confirm("Delete this goal?")) return;
    const result = await deleteGoal(goalId);
    if (result.error) setError(result.error);
    router.refresh();
  }

  if (!activeCycle) {
    return (
      <div>
        <div className="page-header">
          <h1 className="text-2xl font-bold">My Goals</h1>
        </div>
        <div className="page-body">
          <div className="glass-card p-12 text-center">
            <Clock size={48} className="mx-auto mb-4" style={{ color: "var(--muted)" }} />
            <h2 className="text-xl font-semibold mb-2">No Active Cycle</h2>
            <p style={{ color: "var(--muted)" }}>
              There is no active goal-setting cycle. Contact your admin to configure one.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="page-header relative border-b border-[#fdb913]/10">
        <div className="absolute left-0 top-0 h-full w-1 bg-[#fdb913]"></div>
        <div className="pl-4">
          <div className="flex items-center gap-3 mb-1">
            <span className="institutional-label">
              Institutional Intelligence
            </span>
            <div className="h-1 w-8 bg-[#fdb913]/20 rounded-full"></div>
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight text-white">Personal Blueprint</h1>
          <p className="text-sm mt-1 font-mono uppercase tracking-widest text-[#fdb913]/60">
            {activeCycle.name} • Total Weightage: {totalWeightage}/100%
          </p>
        </div>
        <div className="flex items-center gap-3">
          {goalSheet && (
            <span
              className={`badge badge-${
                goalSheet.status === "pending_approval"
                  ? "pending"
                  : goalSheet.status
              } font-mono`}
            >
              {goalSheet.locked && <Lock size={12} />}
              {formatStatus(goalSheet.status).toUpperCase()}
            </span>
          )}
        </div>
      </div>

      <div className="page-body space-y-6">
        {error && (
          <div className="p-4 rounded-lg flex items-center gap-3 animate-fade-in" style={{
            background: "var(--danger-bg)",
            color: "var(--danger)",
            border: "1px solid rgba(239, 68, 68, 0.2)",
          }}>
            <AlertCircle size={18} />
            {error}
          </div>
        )}

        {/* Return reason */}
        {goalSheet?.status === "returned" && goalSheet.return_reason && (
          <div className="p-4 rounded-lg flex items-start gap-3 animate-fade-in" style={{
            background: "var(--warning-bg)",
            border: "1px solid rgba(245, 158, 11, 0.2)",
          }}>
            <RotateCcw size={18} style={{ color: "var(--warning)", marginTop: 2 }} />
            <div>
              <p className="font-medium text-sm" style={{ color: "var(--warning)" }}>
                Returned for Rework
              </p>
              <p className="text-sm mt-1" style={{ color: "var(--foreground)" }}>
                {goalSheet.return_reason}
              </p>
            </div>
          </div>
        )}

        {/* No goal sheet yet */}
        {!goalSheet && (
          <div className="glass-module p-12 text-center animate-fade-in border border-[#fdb913]/20 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-b from-[#fdb913]/5 to-transparent pointer-events-none"></div>
            <Target size={48} className="mx-auto mb-4 text-[#fdb913]/50 relative z-10" />
            <h2 className="text-xl font-semibold mb-2 relative z-10">Initialize Architecture Blueprint</h2>
            <p className="mb-6 relative z-10" style={{ color: "var(--muted)" }}>
              Create your goal sheet for {activeCycle.name} to begin planning execution.
            </p>
            <button onClick={handleCreateSheet} className="btn bg-[#fdb913] hover:bg-[#e5a610] text-black font-bold relative z-10">
              <Target size={18} />
              Initialize Blueprint
            </button>
          </div>
        )}

        {/* Weightage Progress */}
        {goalSheet && (
          <div className="glass-card p-4 animate-fade-in">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium">Weightage Progress</span>
              <span className="text-sm font-bold" style={{
                color: totalWeightage === 100 ? "var(--success)" : "var(--warning)",
              }}>
                {totalWeightage}%
              </span>
            </div>
            <div className="progress-bar bg-white/5 h-2">
              <div
                className={`progress-fill ${totalWeightage === 100 ? 'progress-fill-success' : ''}`}
                style={{
                  width: `${Math.min(totalWeightage, 100)}%`,
                  background:
                    totalWeightage > 100
                      ? "linear-gradient(90deg, var(--danger), #f87171)"
                      : undefined,
                }}
              />
            </div>
            <div className="flex justify-between mt-2">
              <span className="text-xs" style={{ color: "var(--muted)" }}>
                {goals.length} goal{goals.length !== 1 ? "s" : ""} (max 8)
              </span>
              <span className="text-xs" style={{ color: "var(--muted)" }}>
                {totalWeightage === 100
                  ? "✓ Ready to submit"
                  : `${100 - totalWeightage}% remaining`}
              </span>
            </div>
          </div>
        )}

        {/* Goal Form */}
        {canEdit && (
          <GoalForm
            goalSheetId={goalSheet!.id}
            thrustAreas={thrustAreas}
            currentGoalCount={goals.length}
            currentWeightage={totalWeightage}
            onGoalAdded={() => router.refresh()}
          />
        )}

        {/* Goals List */}
        {goals.length > 0 && (
          <div className="space-y-4">
            {goals.map((goal, idx) => (
              <div
                key={goal.id}
                className="glass-module p-0 overflow-hidden animate-fade-in border border-[#fdb913]/10"
                style={{ animationDelay: `${idx * 0.05}s` }}
              >
                <div className="p-5 flex items-start justify-between gap-4 bg-gradient-to-r from-[#fdb913]/5 to-transparent">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-semibold text-lg">{goal.title}</h3>
                      {goal.is_shared && (
                        <span className="badge" style={{
                          background: "rgba(168, 85, 247, 0.1)",
                          color: "#a855f7",
                        }}>
                          <Share2 size={10} />
                          Shared
                        </span>
                      )}
                    </div>
                    {goal.description && (
                      <p className="text-sm mb-3 text-white/60">
                        {goal.description}
                      </p>
                    )}
                    <div className="flex flex-wrap gap-3 text-xs">
                      <span className="badge border border-[#fdb913]/20 bg-[#fdb913]/10 text-[#fdb913] tracking-wider uppercase font-bold">
                        {goal.thrust_area?.name || "—"}
                      </span>
                      <span className="flex items-center px-2 py-0.5 rounded-sm bg-white/5 border border-white/10 uppercase tracking-wider font-mono">
                        UoM: {getUoMLabel(goal.uom as Parameters<typeof getUoMLabel>[0])}
                      </span>
                      <span className="flex items-center px-2 py-0.5 rounded-sm bg-white/5 border border-white/10 uppercase tracking-wider font-mono">
                        Target: {goal.target}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="text-right">
                      <div className="text-3xl font-bold text-[#fdb913] tabular-nums">
                        {goal.weightage}%
                      </div>
                      <div className="text-[10px] uppercase tracking-wider font-bold text-[#fdb913]/50">
                        weightage
                      </div>
                    </div>
                    {canEdit && !goal.is_shared && (
                      <button
                        onClick={() => handleDeleteGoal(goal.id)}
                        className="btn btn-ghost btn-icon hover:bg-red-500/10 hover:text-red-500 transition-colors"
                        title="Delete goal"
                      >
                        <Trash2 size={16} />
                      </button>
                    )}
                  </div>
                </div>

                {/* Achievement scores if any */}
                {goal.achievements && goal.achievements.length > 0 && (
                  <div className="border-t border-[#fdb913]/10 p-5 bg-black/40">
                    <div className="grid grid-cols-4 gap-3">
                      {["Q1", "Q2", "Q3", "Q4"].map((q) => {
                        const ach = goal.achievements?.find((a) => a.quarter === q);
                        return (
                          <div key={q} className="text-center p-3 rounded-lg border border-white/5 bg-white/5">
                            <div className="text-[10px] font-bold tracking-[0.1em] uppercase mb-1" style={{ color: "var(--muted)" }}>
                              {q}
                            </div>
                            {ach ? (
                              <>
                                <div className={`text-lg font-bold tabular-nums ${getScoreColor(ach.score)}`}>
                                  {ach.score !== null ? `${ach.score}%` : "—"}
                                </div>
                                <div className="text-[10px] uppercase tracking-wider mt-1" style={{ color: "var(--muted)" }}>
                                  {formatStatus(ach.status)}
                                </div>
                              </>
                            ) : (
                              <div className="text-xs" style={{ color: "var(--muted-foreground)" }}>
                                —
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Submit Button */}
        {canEdit && totalWeightage === 100 && goals.length > 0 && (
          <div className="flex justify-end pt-6 animate-fade-in">
            <button
              onClick={handleSubmit}
              className="btn btn-submit-glow btn-lg"
              disabled={submitting}
            >
              {submitting ? (
                "Processing Deployment..."
              ) : (
                <>
                  <Send size={18} />
                  Deploy Blueprint for Approval
                </>
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

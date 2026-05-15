"use client";

import { useState } from "react";
import { createEscalationRule, toggleEscalationRule } from "@/app/actions/admin";
import { useRouter } from "next/navigation";
import {
  AlertTriangle,
  Plus,
  X,
  ToggleLeft,
  ToggleRight,
  Clock,
  User,
  ArrowRight,
} from "lucide-react";

interface EscalationClientProps {
  rules: Array<{
    id: string;
    rule_type: string;
    days_threshold: number;
    is_active: boolean;
    created_at: string;
  }>;
  logs: Array<{
    id: string;
    status: string;
    created_at: string;
    target_user: { full_name: string } | null;
    escalated_to: { full_name: string } | null;
    rule: { rule_type: string; days_threshold: number } | null;
  }>;
}

export function EscalationClient({ rules, logs }: EscalationClientProps) {
  const router = useRouter();
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    rule_type: "goal_submission",
    days_threshold: 7,
  });

  async function handleCreate() {
    setLoading(true);
    await createEscalationRule(form);
    setShowForm(false);
    setLoading(false);
    router.refresh();
  }

  async function handleToggle(id: string, isActive: boolean) {
    setLoading(true);
    await toggleEscalationRule(id, !isActive);
    setLoading(false);
    router.refresh();
  }

  const ruleTypeLabels: Record<string, string> = {
    goal_submission: "Goal Not Submitted",
    goal_approval: "Goal Not Approved",
    checkin_completion: "Check-in Not Completed",
  };

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="text-2xl font-bold">Escalation Module</h1>
          <p className="text-sm mt-1" style={{ color: "var(--muted)" }}>
            Configure automated escalation rules
          </p>
        </div>
        <button onClick={() => setShowForm(true)} className="btn btn-primary">
          <Plus size={16} />
          Add Rule
        </button>
      </div>

      <div className="page-body space-y-6">
        {/* Add Rule Form */}
        {showForm && (
          <div className="glass-card p-6 animate-scale-in">
            <div className="flex justify-between mb-4">
              <h3 className="font-semibold">New Escalation Rule</h3>
              <button onClick={() => setShowForm(false)} className="btn btn-ghost btn-icon">
                <X size={18} />
              </button>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="label">Rule Type</label>
                <select
                  className="input select"
                  value={form.rule_type}
                  onChange={(e) => setForm((f) => ({ ...f, rule_type: e.target.value }))}
                >
                  <option value="goal_submission">Goal Not Submitted</option>
                  <option value="goal_approval">Goal Not Approved by Manager</option>
                  <option value="checkin_completion">Check-in Not Completed</option>
                </select>
              </div>
              <div>
                <label className="label">Days Threshold</label>
                <input
                  type="number"
                  className="input"
                  min={1}
                  value={form.days_threshold}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, days_threshold: Number(e.target.value) }))
                  }
                />
              </div>
            </div>
            <div className="flex justify-end mt-4 gap-3">
              <button onClick={() => setShowForm(false)} className="btn btn-secondary">
                Cancel
              </button>
              <button onClick={handleCreate} className="btn btn-primary" disabled={loading}>
                Create Rule
              </button>
            </div>
          </div>
        )}

        {/* Rules */}
        <div>
          <h2 className="text-lg font-semibold mb-4">Active Rules</h2>
          <div className="space-y-3">
            {rules.length === 0 ? (
              <div className="glass-card p-8 text-center">
                <AlertTriangle size={32} className="mx-auto mb-3" style={{ color: "var(--muted)" }} />
                <p style={{ color: "var(--muted)" }}>No escalation rules configured</p>
              </div>
            ) : (
              rules.map((rule) => (
                <div key={rule.id} className="glass-card p-4 flex items-center justify-between animate-fade-in">
                  <div className="flex items-center gap-4">
                    <div
                      className="w-10 h-10 rounded-xl flex items-center justify-center"
                      style={{
                        background: rule.is_active ? "var(--warning-bg)" : "var(--card)",
                        color: rule.is_active ? "var(--warning)" : "var(--muted)",
                      }}
                    >
                      <AlertTriangle size={18} />
                    </div>
                    <div>
                      <h3 className="font-medium text-sm">
                        {ruleTypeLabels[rule.rule_type] || rule.rule_type}
                      </h3>
                      <p className="text-xs flex items-center gap-1" style={{ color: "var(--muted)" }}>
                        <Clock size={12} />
                        Escalate after {rule.days_threshold} day{rule.days_threshold !== 1 ? "s" : ""}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => handleToggle(rule.id, rule.is_active)}
                    className="btn btn-ghost btn-icon"
                    disabled={loading}
                  >
                    {rule.is_active ? (
                      <ToggleRight size={24} style={{ color: "var(--success)" }} />
                    ) : (
                      <ToggleLeft size={24} style={{ color: "var(--muted)" }} />
                    )}
                  </button>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Escalation Log */}
        {logs.length > 0 && (
          <div>
            <h2 className="text-lg font-semibold mb-4">Escalation Log</h2>
            <div className="table-wrapper">
              <table className="table">
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Rule</th>
                    <th>Target</th>
                    <th>Escalated To</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {logs.map((log) => (
                    <tr key={log.id}>
                      <td className="text-xs">{new Date(log.created_at).toLocaleString()}</td>
                      <td className="text-sm">
                        {ruleTypeLabels[log.rule?.rule_type || ""] || log.rule?.rule_type}
                        <span className="text-xs ml-1" style={{ color: "var(--muted)" }}>
                          ({log.rule?.days_threshold}d)
                        </span>
                      </td>
                      <td>
                        <div className="flex items-center gap-2">
                          <User size={14} />
                          {log.target_user?.full_name}
                        </div>
                      </td>
                      <td>
                        <div className="flex items-center gap-2">
                          <ArrowRight size={14} style={{ color: "var(--warning)" }} />
                          {log.escalated_to?.full_name}
                        </div>
                      </td>
                      <td>
                        <span
                          className={`badge ${
                            log.status === "resolved" ? "badge-approved" : "badge-pending"
                          }`}
                        >
                          {log.status}
                        </span>
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
  );
}

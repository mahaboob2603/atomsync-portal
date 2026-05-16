"use client";

import { useState } from "react";
import { createCycle, toggleCycleActive } from "@/app/actions/admin";
import { useRouter } from "next/navigation";
import { Plus, X, Calendar, ToggleLeft, ToggleRight } from "lucide-react";

interface CyclesClientProps {
  cycles: Array<{
    id: string;
    name: string;
    year: number;
    phase: string;
    window_opens: string;
    window_closes: string;
    is_active: boolean;
  }>;
}

export function CyclesClient({ cycles }: CyclesClientProps) {
  const router = useRouter();
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: "",
    year: new Date().getFullYear(),
    phase: "goal_setting",
    window_opens: "",
    window_closes: "",
  });

  async function handleCreate() {
    setLoading(true);
    await createCycle(form);
    setShowForm(false);
    setForm({
      name: "",
      year: new Date().getFullYear(),
      phase: "goal_setting",
      window_opens: "",
      window_closes: "",
    });
    setLoading(false);
    router.refresh();
  }

  async function handleToggle(id: string, isActive: boolean) {
    setLoading(true);
    try {
      const res = await toggleCycleActive(id, !isActive);
      if (res?.error) {
        alert("Failed to toggle cycle: " + res.error);
      }
    } catch (err) {
      console.error(err);
      alert("An unexpected error occurred while toggling the cycle.");
    } finally {
      setLoading(false);
      router.refresh();
    }
  }

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="text-2xl font-bold">Cycle Management</h1>
          <p className="text-sm mt-1" style={{ color: "var(--muted)" }}>
            Configure goal setting and check-in windows
          </p>
        </div>
        <button onClick={() => setShowForm(true)} className="btn btn-primary">
          <Plus size={16} />
          Add Cycle
        </button>
      </div>

      <div className="page-body space-y-6">
        {showForm && (
          <div className="glass-card p-6 animate-scale-in">
            <div className="flex justify-between mb-4">
              <h3 className="font-semibold">New Cycle</h3>
              <button onClick={() => setShowForm(false)} className="btn btn-ghost btn-icon">
                <X size={18} />
              </button>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="label">Name</label>
                <input
                  className="input"
                  value={form.name}
                  onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                  placeholder="FY 2026-27 Goal Setting"
                />
              </div>
              <div>
                <label className="label">Year</label>
                <input
                  type="number"
                  className="input"
                  value={form.year}
                  onChange={(e) => setForm((f) => ({ ...f, year: Number(e.target.value) }))}
                />
              </div>
              <div>
                <label className="label">Phase</label>
                <select
                  className="input select"
                  value={form.phase}
                  onChange={(e) => setForm((f) => ({ ...f, phase: e.target.value }))}
                >
                  <option value="goal_setting">Goal Setting</option>
                  <option value="q1_checkin">Q1 Check-in</option>
                  <option value="q2_checkin">Q2 Check-in</option>
                  <option value="q3_checkin">Q3 Check-in</option>
                  <option value="q4_annual">Q4 / Annual</option>
                </select>
              </div>
              <div>
                <label className="label">Window Opens</label>
                <input
                  type="date"
                  className="input"
                  value={form.window_opens}
                  onChange={(e) => setForm((f) => ({ ...f, window_opens: e.target.value }))}
                />
              </div>
              <div>
                <label className="label">Window Closes</label>
                <input
                  type="date"
                  className="input"
                  value={form.window_closes}
                  onChange={(e) => setForm((f) => ({ ...f, window_closes: e.target.value }))}
                />
              </div>
            </div>
            <div className="flex justify-end mt-4 gap-3">
              <button onClick={() => setShowForm(false)} className="btn btn-secondary">
                Cancel
              </button>
              <button
                onClick={handleCreate}
                className="btn btn-primary"
                disabled={loading || !form.name || !form.window_opens || !form.window_closes}
              >
                Create Cycle
              </button>
            </div>
          </div>
        )}

        <div className="space-y-3">
          {cycles.map((cycle) => (
            <div
              key={cycle.id}
              className={`glass-card p-4 flex items-center justify-between animate-fade-in ${
                cycle.is_active ? "border-l-2 border-[#fdb913]" : ""
              }`}
            >
              <div className="flex items-center gap-4">
                <div
                  className="w-10 h-10 rounded-lg flex items-center justify-center"
                  style={{
                    background: cycle.is_active ? "rgba(253,185,19,0.1)" : "var(--card)",
                    color: cycle.is_active ? "#fdb913" : "var(--muted)",
                  }}
                >
                  <Calendar size={18} />
                </div>
                <div>
                  <h3 className="font-semibold">{cycle.name}</h3>
                  <p className="text-xs" style={{ color: "var(--muted)" }}>
                    {cycle.phase.replace(/_/g, " ")} • {cycle.window_opens} → {cycle.window_closes}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                {cycle.is_active && (
                  <span className="badge badge-approved">Active</span>
                )}
                <button
                  onClick={() => handleToggle(cycle.id, cycle.is_active)}
                  className="btn btn-sm btn-ghost"
                  disabled={loading}
                  title={cycle.is_active ? "Deactivate" : "Activate"}
                >
                  {cycle.is_active ? (
                    <ToggleRight size={24} color="#fdb913" />
                  ) : (
                    <ToggleLeft size={24} style={{ color: "var(--muted)" }} />
                  )}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { goalSchema, type GoalFormValues } from "@/lib/validations";
import { getUoMLabel } from "@/lib/scoring";
import type { ThrustArea, UoMType } from "@/lib/types";
import { addGoal } from "@/app/actions/goals";
import { Plus, X } from "lucide-react";

interface GoalFormProps {
  goalSheetId: string;
  thrustAreas: ThrustArea[];
  currentGoalCount: number;
  currentWeightage: number;
  onGoalAdded?: () => void;
}

export function GoalForm({
  goalSheetId,
  thrustAreas,
  currentGoalCount,
  currentWeightage,
  onGoalAdded,
}: GoalFormProps) {
  const [open, setOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm<GoalFormValues>({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolver: zodResolver(goalSchema) as any,
    defaultValues: {
      weightage: Math.min(100 - currentWeightage, 100),
    },
  });

  const remainingWeightage = 100 - currentWeightage;
  const selectedUom = watch("uom");

  async function onSubmit(data: GoalFormValues) {
    setSubmitting(true);
    setError("");

    if (currentGoalCount >= 8) {
      setError("Maximum 8 goals allowed");
      setSubmitting(false);
      return;
    }

    if (data.weightage > remainingWeightage) {
      setError(`Maximum weightage available: ${remainingWeightage}%`);
      setSubmitting(false);
      return;
    }

    const result = await addGoal(goalSheetId, data);
    if (result.error) {
      setError(result.error);
    } else {
      reset();
      setOpen(false);
      onGoalAdded?.();
    }
    setSubmitting(false);
  }

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="btn btn-primary"
        disabled={currentGoalCount >= 8}
      >
        <Plus size={18} />
        Add Goal ({currentGoalCount}/8)
      </button>
    );
  }

  return (
    <div className="glass-card p-6 animate-scale-in">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold">Add New Goal</h3>
        <button onClick={() => { setOpen(false); reset(); }} className="btn btn-ghost btn-icon">
          <X size={18} />
        </button>
      </div>

      {error && (
        <div className="mb-4 p-3 rounded-lg text-sm" style={{
          background: "var(--danger-bg)",
          color: "var(--danger)",
          border: "1px solid rgba(239, 68, 68, 0.2)",
        }}>
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Thrust Area */}
          <div>
            <label className="label">Thrust Area *</label>
            <select {...register("thrust_area_id")} className="input select">
              <option value="">Select Thrust Area</option>
              {thrustAreas.map((ta) => (
                <option key={ta.id} value={ta.id}>{ta.name}</option>
              ))}
            </select>
            {errors.thrust_area_id && (
              <p className="error-text">{errors.thrust_area_id.message}</p>
            )}
          </div>

          {/* UoM */}
          <div>
            <label className="label">Unit of Measurement *</label>
            <select {...register("uom")} className="input select">
              <option value="">Select UoM</option>
              {(["numeric_min", "numeric_max", "percentage_min", "percentage_max", "timeline", "zero"] as UoMType[]).map((uom) => (
                <option key={uom} value={uom}>{getUoMLabel(uom)}</option>
              ))}
            </select>
            {errors.uom && <p className="error-text">{errors.uom.message}</p>}
          </div>
        </div>

        {/* Title */}
        <div>
          <label className="label">Goal Title *</label>
          <input
            {...register("title")}
            className="input"
            placeholder="e.g., Increase quarterly sales revenue by 20%"
          />
          {errors.title && <p className="error-text">{errors.title.message}</p>}
        </div>

        {/* Description */}
        <div>
          <label className="label">Description (Optional)</label>
          <textarea
            {...register("description")}
            className="input textarea"
            placeholder="Add details about how this goal will be measured..."
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Target */}
          <div>
            <label className="label">
              Target * {selectedUom === "timeline" && "(Days)"}{" "}
              {selectedUom === "zero" && "(Expected: 0)"}
              {(selectedUom === "percentage_min" || selectedUom === "percentage_max") && "(%)"}
            </label>
            <input
              {...register("target")}
              type="number"
              step="any"
              className="input"
              placeholder={selectedUom === "zero" ? "0" : "Enter target value"}
            />
            {errors.target && <p className="error-text">{errors.target.message}</p>}
          </div>

          {/* Weightage */}
          <div>
            <label className="label">
              Weightage * (Remaining: {remainingWeightage}%)
            </label>
            <input
              {...register("weightage")}
              type="number"
              min={10}
              max={remainingWeightage}
              className="input"
              placeholder="Min 10%"
            />
            {errors.weightage && <p className="error-text">{errors.weightage.message}</p>}
          </div>
        </div>

        {/* Hint */}
        <div className="p-3 rounded-lg text-xs" style={{
          background: "var(--info-bg)",
          color: "var(--info)",
          border: "1px solid rgba(59, 130, 246, 0.2)",
        }}>
          💡 Total weightage across all goals must equal 100%. Minimum 10% per goal, maximum 8 goals.
        </div>

        <div className="flex gap-3 justify-end">
          <button type="button" onClick={() => { setOpen(false); reset(); }} className="btn btn-secondary">
            Cancel
          </button>
          <button type="submit" className="btn btn-primary" disabled={submitting}>
            {submitting ? "Adding..." : "Add Goal"}
          </button>
        </div>
      </form>
    </div>
  );
}

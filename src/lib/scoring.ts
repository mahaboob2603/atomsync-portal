import type { UoMType } from "./types";

/**
 * Compute achievement score based on UoM type
 *
 * UoM Formulas:
 * - numeric_min / percentage_min (Higher is better): Achievement ÷ Target
 * - numeric_max / percentage_max (Lower is better): Target ÷ Achievement
 * - timeline: Based on completion date vs deadline
 * - zero: If actual = 0 → 100%, else 0%
 */
export function computeScore(
  uom: UoMType,
  target: number,
  actual: number | null
): number | null {
  if (actual === null || actual === undefined) return null;

  switch (uom) {
    case "numeric_min":
    case "percentage_min":
      // Higher is better — e.g., Sales Revenue
      if (target === 0) return actual > 0 ? 100 : 0;
      return Math.min(Math.round((actual / target) * 100), 200); // Cap at 200%

    case "numeric_max":
    case "percentage_max":
      // Lower is better — e.g., TAT, Cost
      if (actual === 0) return 200; // Perfect score
      if (target === 0) return 0;
      return Math.min(Math.round((target / actual) * 100), 200);

    case "timeline":
      // Date-based: actual = days taken, target = days allowed
      // Score = target / actual * 100 (completed faster = higher score)
      if (actual === 0) return 100;
      if (target === 0) return 0;
      return Math.min(Math.round((target / actual) * 100), 200);

    case "zero":
      // Zero = Success — e.g., Safety incidents
      return actual === 0 ? 100 : 0;

    default:
      return null;
  }
}

/**
 * Compute weighted score for a goal
 */
export function computeWeightedScore(
  uom: UoMType,
  target: number,
  actual: number | null,
  weightage: number
): number | null {
  const score = computeScore(uom, target, actual);
  if (score === null) return null;
  return Math.round((score * weightage) / 100);
}

/**
 * Get UoM display label
 */
export function getUoMLabel(uom: UoMType): string {
  switch (uom) {
    case "numeric_min":
      return "Numeric (Higher is better)";
    case "numeric_max":
      return "Numeric (Lower is better)";
    case "percentage_min":
      return "Percentage (Higher is better)";
    case "percentage_max":
      return "Percentage (Lower is better)";
    case "timeline":
      return "Timeline (Days)";
    case "zero":
      return "Zero-Based";
    default:
      return uom;
  }
}

/**
 * Get score color class
 */
export function getScoreColor(score: number | null): string {
  if (score === null) return "text-[var(--muted)]";
  if (score >= 90) return "text-[var(--success)]";
  if (score >= 70) return "text-[var(--info)]";
  if (score >= 50) return "text-[var(--warning)]";
  return "text-[var(--danger)]";
}

/**
 * Get status badge class
 */
export function getStatusBadge(status: string): string {
  switch (status) {
    case "draft":
      return "badge-draft";
    case "pending_approval":
      return "badge-pending";
    case "approved":
      return "badge-approved";
    case "returned":
      return "badge-returned";
    case "not_started":
      return "badge-not-started";
    case "on_track":
      return "badge-on-track";
    case "completed":
      return "badge-completed";
    default:
      return "badge-draft";
  }
}

/**
 * Format status for display
 */
export function formatStatus(status: string): string {
  return status
    .replace(/_/g, " ")
    .replace(/\b\w/g, (l) => l.toUpperCase());
}

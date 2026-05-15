// ==========================================
// Database Types for AtomQuest Portal
// ==========================================

export type UserRole = "employee" | "manager" | "admin";

export type GoalSheetStatus =
  | "draft"
  | "pending_approval"
  | "approved"
  | "returned";

export type UoMType =
  | "numeric_min"
  | "numeric_max"
  | "percentage_min"
  | "percentage_max"
  | "timeline"
  | "zero";

export type GoalStatus = "not_started" | "on_track" | "completed";

export type Quarter = "Q1" | "Q2" | "Q3" | "Q4";

// ==========================================
// Database Row Types
// ==========================================

export interface Profile {
  id: string;
  email: string;
  full_name: string;
  role: UserRole;
  manager_id: string | null;
  department: string | null;
  avatar_url: string | null;
  created_at: string;
}

export interface Cycle {
  id: string;
  name: string;
  year: number;
  phase: string;
  window_opens: string;
  window_closes: string;
  is_active: boolean;
  created_at: string;
}

export interface ThrustArea {
  id: string;
  name: string;
  description: string | null;
  created_at: string;
}

export interface GoalSheet {
  id: string;
  employee_id: string;
  cycle_id: string;
  status: GoalSheetStatus;
  submitted_at: string | null;
  approved_at: string | null;
  approved_by: string | null;
  locked: boolean;
  return_reason: string | null;
  created_at: string;
  // Joined
  employee?: Profile;
  cycle?: Cycle;
  goals?: Goal[];
}

export interface Goal {
  id: string;
  goal_sheet_id: string;
  thrust_area_id: string;
  title: string;
  description: string | null;
  uom: UoMType;
  target: number;
  weightage: number;
  is_shared: boolean;
  shared_from_id: string | null;
  created_at: string;
  // Joined
  thrust_area?: ThrustArea;
  achievements?: Achievement[];
}

export interface Achievement {
  id: string;
  goal_id: string;
  quarter: Quarter;
  planned_value: number | null;
  actual_value: number | null;
  status: GoalStatus;
  score: number | null;
  updated_at: string;
  created_at: string;
}

export interface CheckIn {
  id: string;
  goal_sheet_id: string;
  quarter: Quarter;
  manager_id: string;
  employee_id: string;
  comment: string;
  created_at: string;
  // Joined
  manager?: Profile;
  employee?: Profile;
}

export interface AuditLog {
  id: string;
  table_name: string;
  record_id: string;
  user_id: string;
  action: string;
  field_name: string | null;
  old_value: string | null;
  new_value: string | null;
  created_at: string;
  // Joined
  user?: Profile;
}

export interface EscalationRule {
  id: string;
  rule_type: string;
  days_threshold: number;
  is_active: boolean;
  created_by: string;
  created_at: string;
}

export interface EscalationLogEntry {
  id: string;
  rule_id: string;
  target_user_id: string;
  escalated_to_id: string;
  status: string;
  resolved_at: string | null;
  created_at: string;
  // Joined
  target_user?: Profile;
  escalated_to?: Profile;
  rule?: EscalationRule;
}

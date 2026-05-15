-- ==========================================
-- AtomQuest Hackathon 1.0 — Full DB Schema
-- Goal Setting & Tracking Portal
-- ==========================================

-- 1. Profiles (extends Supabase auth.users)
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  full_name TEXT NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('employee', 'manager', 'admin')) DEFAULT 'employee',
  manager_id UUID REFERENCES profiles(id),
  department TEXT,
  avatar_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Cycles
CREATE TABLE IF NOT EXISTS cycles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  year INTEGER NOT NULL,
  phase TEXT NOT NULL,
  window_opens DATE NOT NULL,
  window_closes DATE NOT NULL,
  is_active BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Thrust Areas
CREATE TABLE IF NOT EXISTS thrust_areas (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Goal Sheets
CREATE TABLE IF NOT EXISTS goal_sheets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  employee_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  cycle_id UUID NOT NULL REFERENCES cycles(id) ON DELETE CASCADE,
  status TEXT NOT NULL CHECK (status IN ('draft', 'pending_approval', 'approved', 'returned')) DEFAULT 'draft',
  submitted_at TIMESTAMPTZ,
  approved_at TIMESTAMPTZ,
  approved_by UUID REFERENCES profiles(id),
  locked BOOLEAN DEFAULT FALSE,
  return_reason TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(employee_id, cycle_id)
);

-- 5. Goals
CREATE TABLE IF NOT EXISTS goals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  goal_sheet_id UUID NOT NULL REFERENCES goal_sheets(id) ON DELETE CASCADE,
  thrust_area_id UUID NOT NULL REFERENCES thrust_areas(id),
  title TEXT NOT NULL,
  description TEXT,
  uom TEXT NOT NULL CHECK (uom IN ('numeric_min', 'numeric_max', 'percentage_min', 'percentage_max', 'timeline', 'zero')),
  target NUMERIC NOT NULL,
  weightage NUMERIC NOT NULL CHECK (weightage >= 10 AND weightage <= 100),
  is_shared BOOLEAN DEFAULT FALSE,
  shared_from_id UUID REFERENCES goals(id),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. Achievements
CREATE TABLE IF NOT EXISTS achievements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  goal_id UUID NOT NULL REFERENCES goals(id) ON DELETE CASCADE,
  quarter TEXT NOT NULL CHECK (quarter IN ('Q1', 'Q2', 'Q3', 'Q4')),
  planned_value NUMERIC,
  actual_value NUMERIC,
  status TEXT NOT NULL CHECK (status IN ('not_started', 'on_track', 'completed')) DEFAULT 'not_started',
  score NUMERIC,
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(goal_id, quarter)
);

-- 7. Check-ins
CREATE TABLE IF NOT EXISTS check_ins (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  goal_sheet_id UUID NOT NULL REFERENCES goal_sheets(id) ON DELETE CASCADE,
  quarter TEXT NOT NULL CHECK (quarter IN ('Q1', 'Q2', 'Q3', 'Q4')),
  manager_id UUID NOT NULL REFERENCES profiles(id),
  employee_id UUID NOT NULL REFERENCES profiles(id),
  comment TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 8. Audit Log
CREATE TABLE IF NOT EXISTS audit_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  table_name TEXT NOT NULL,
  record_id TEXT NOT NULL,
  user_id UUID NOT NULL REFERENCES profiles(id),
  action TEXT NOT NULL,
  field_name TEXT,
  old_value TEXT,
  new_value TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 9. Escalation Rules
CREATE TABLE IF NOT EXISTS escalation_rules (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  rule_type TEXT NOT NULL,
  days_threshold INTEGER NOT NULL,
  is_active BOOLEAN DEFAULT TRUE,
  created_by UUID NOT NULL REFERENCES profiles(id),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 10. Escalation Log
CREATE TABLE IF NOT EXISTS escalation_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  rule_id UUID NOT NULL REFERENCES escalation_rules(id),
  target_user_id UUID NOT NULL REFERENCES profiles(id),
  escalated_to_id UUID NOT NULL REFERENCES profiles(id),
  status TEXT DEFAULT 'pending',
  resolved_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==========================================
-- Row Level Security Policies
-- ==========================================
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE cycles ENABLE ROW LEVEL SECURITY;
ALTER TABLE thrust_areas ENABLE ROW LEVEL SECURITY;
ALTER TABLE goal_sheets ENABLE ROW LEVEL SECURITY;
ALTER TABLE goals ENABLE ROW LEVEL SECURITY;
ALTER TABLE achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE check_ins ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_log ENABLE ROW LEVEL SECURITY;
ALTER TABLE escalation_rules ENABLE ROW LEVEL SECURITY;
ALTER TABLE escalation_log ENABLE ROW LEVEL SECURITY;

-- Profiles: everyone can read, users can update own
CREATE POLICY "profiles_select" ON profiles FOR SELECT USING (true);
CREATE POLICY "profiles_update" ON profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "profiles_insert" ON profiles FOR INSERT WITH CHECK (true);

-- Cycles: everyone can read, admin can write
CREATE POLICY "cycles_select" ON cycles FOR SELECT USING (true);
CREATE POLICY "cycles_insert" ON cycles FOR INSERT WITH CHECK (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);
CREATE POLICY "cycles_update" ON cycles FOR UPDATE USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);

-- Thrust areas: everyone can read
CREATE POLICY "thrust_areas_select" ON thrust_areas FOR SELECT USING (true);
CREATE POLICY "thrust_areas_insert" ON thrust_areas FOR INSERT WITH CHECK (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);

-- Goal sheets: employee sees own, manager sees team, admin sees all
CREATE POLICY "goal_sheets_select" ON goal_sheets FOR SELECT USING (
  employee_id = auth.uid()
  OR EXISTS (
    SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('manager', 'admin')
  )
);
CREATE POLICY "goal_sheets_insert" ON goal_sheets FOR INSERT WITH CHECK (
  employee_id = auth.uid()
);
CREATE POLICY "goal_sheets_update" ON goal_sheets FOR UPDATE USING (
  employee_id = auth.uid()
  OR EXISTS (
    SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('manager', 'admin')
  )
);

-- Goals: tied to goal_sheets access
CREATE POLICY "goals_select" ON goals FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM goal_sheets gs WHERE gs.id = goal_sheet_id AND (
      gs.employee_id = auth.uid()
      OR EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('manager', 'admin'))
    )
  )
);
CREATE POLICY "goals_insert" ON goals FOR INSERT WITH CHECK (
  EXISTS (
    SELECT 1 FROM goal_sheets gs WHERE gs.id = goal_sheet_id AND (
      gs.employee_id = auth.uid()
      OR EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('manager', 'admin'))
    )
  )
);
CREATE POLICY "goals_update" ON goals FOR UPDATE USING (
  EXISTS (
    SELECT 1 FROM goal_sheets gs WHERE gs.id = goal_sheet_id AND (
      gs.employee_id = auth.uid()
      OR EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('manager', 'admin'))
    )
  )
);
CREATE POLICY "goals_delete" ON goals FOR DELETE USING (
  EXISTS (
    SELECT 1 FROM goal_sheets gs WHERE gs.id = goal_sheet_id AND gs.employee_id = auth.uid() AND gs.locked = false
  )
);

-- Achievements: same as goals
CREATE POLICY "achievements_select" ON achievements FOR SELECT USING (true);
CREATE POLICY "achievements_insert" ON achievements FOR INSERT WITH CHECK (true);
CREATE POLICY "achievements_update" ON achievements FOR UPDATE USING (true);

-- Check-ins
CREATE POLICY "check_ins_select" ON check_ins FOR SELECT USING (true);
CREATE POLICY "check_ins_insert" ON check_ins FOR INSERT WITH CHECK (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('manager', 'admin'))
);

-- Audit log: admin and managers can read, system inserts
CREATE POLICY "audit_log_select" ON audit_log FOR SELECT USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('manager', 'admin'))
);
CREATE POLICY "audit_log_insert" ON audit_log FOR INSERT WITH CHECK (true);

-- Escalation rules: admin only
CREATE POLICY "escalation_rules_select" ON escalation_rules FOR SELECT USING (true);
CREATE POLICY "escalation_rules_insert" ON escalation_rules FOR INSERT WITH CHECK (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);
CREATE POLICY "escalation_rules_update" ON escalation_rules FOR UPDATE USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);

-- Escalation log
CREATE POLICY "escalation_log_select" ON escalation_log FOR SELECT USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('manager', 'admin'))
);
CREATE POLICY "escalation_log_insert" ON escalation_log FOR INSERT WITH CHECK (true);

-- ==========================================
-- Seed: Thrust Areas
-- ==========================================
INSERT INTO thrust_areas (name, description) VALUES
  ('Revenue Growth', 'Goals related to increasing revenue and sales targets'),
  ('Operational Excellence', 'Goals focused on improving operational efficiency'),
  ('Customer Satisfaction', 'Goals aimed at enhancing customer experience'),
  ('Innovation & Technology', 'Goals driving technological advancement'),
  ('People & Culture', 'Goals for team development and organizational culture'),
  ('Cost Optimization', 'Goals for reducing costs and improving margins'),
  ('Quality & Compliance', 'Goals ensuring quality standards and regulatory compliance'),
  ('Market Expansion', 'Goals for entering new markets and growing market share');

-- ==========================================
-- Seed: Default Cycle (FY 2026-27)
-- ==========================================
INSERT INTO cycles (name, year, phase, window_opens, window_closes, is_active) VALUES
  ('FY 2026-27 Goal Setting', 2026, 'goal_setting', '2026-05-01', '2026-06-30', true),
  ('FY 2026-27 Q1 Check-in', 2026, 'q1_checkin', '2026-07-01', '2026-07-31', false),
  ('FY 2026-27 Q2 Check-in', 2026, 'q2_checkin', '2026-10-01', '2026-10-31', false),
  ('FY 2026-27 Q3 Check-in', 2026, 'q3_checkin', '2027-01-01', '2027-01-31', false),
  ('FY 2026-27 Q4 / Annual', 2026, 'q4_annual', '2027-03-01', '2027-04-30', false);

-- ==========================================
-- NOTE: Demo users are created via /api/seed endpoint
-- Credentials:
--   employee@atomquest.com / demo123456
--   manager@atomquest.com  / demo123456
--   admin@atomquest.com    / demo123456
-- ==========================================

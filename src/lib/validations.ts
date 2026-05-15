import { z } from "zod";

// ==========================================
// Goal Form Validation Schema
// ==========================================

export const goalSchema = z.object({
  thrust_area_id: z.string().min(1, "Thrust area is required"),
  title: z.string().min(3, "Title must be at least 3 characters").max(200),
  description: z.string().optional(),
  uom: z.enum([
    "numeric_min",
    "numeric_max",
    "percentage_min",
    "percentage_max",
    "timeline",
    "zero",
  ], { required_error: "Unit of measurement is required" }),
  target: z.preprocess((v) => Number(v), z.number().positive("Target must be positive")),
  weightage: z.preprocess(
    (v) => Number(v),
    z.number()
      .min(10, "Minimum weightage is 10%")
      .max(100, "Maximum weightage is 100%")
  ),
});

export type GoalFormValues = z.infer<typeof goalSchema>;

// ==========================================
// Goal Sheet Validation (cross-goal rules)
// ==========================================

export function validateGoalSheet(goals: GoalFormValues[]): string[] {
  const errors: string[] = [];

  if (goals.length === 0) {
    errors.push("At least one goal is required");
    return errors;
  }

  if (goals.length > 8) {
    errors.push("Maximum 8 goals allowed per employee");
  }

  const totalWeightage = goals.reduce((sum, g) => sum + g.weightage, 0);
  if (totalWeightage !== 100) {
    errors.push(
      `Total weightage must equal 100%. Current total: ${totalWeightage}%`
    );
  }

  goals.forEach((g, i) => {
    if (g.weightage < 10) {
      errors.push(`Goal ${i + 1} "${g.title}": Minimum weightage is 10%`);
    }
  });

  return errors;
}

// ==========================================
// Achievement Validation Schema
// ==========================================

export const achievementSchema = z.object({
  planned_value: z.preprocess((v) => (v ? Number(v) : undefined), z.number().optional()),
  actual_value: z.preprocess((v) => (v ? Number(v) : undefined), z.number().optional()),
  status: z.enum(["not_started", "on_track", "completed"]),
});

export type AchievementFormValues = z.infer<typeof achievementSchema>;

// ==========================================
// Check-in Validation Schema
// ==========================================

export const checkInSchema = z.object({
  comment: z.string().min(10, "Comment must be at least 10 characters").max(2000),
});

export type CheckInFormValues = z.infer<typeof checkInSchema>;

// ==========================================
// Login Validation Schema
// ==========================================

export const loginSchema = z.object({
  email: z.string().email("Valid email is required"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export type LoginFormValues = z.infer<typeof loginSchema>;

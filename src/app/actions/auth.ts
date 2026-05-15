"use server";

import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export async function loginAction(formData: FormData) {
  const supabase = await createClient();

  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    return { error: error.message };
  }

  redirect("/dashboard");
}

export async function logoutAction() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/login");
}

export async function switchDemoRole(role: "employee" | "manager" | "admin") {
  const supabase = await createClient();

  // First sign out
  await supabase.auth.signOut();

  // Sign in with demo credentials
  const demoCredentials: Record<string, { email: string; password: string }> = {
    employee: { email: "employee@atomquest.demo", password: "demo123456" },
    manager: { email: "manager@atomquest.demo", password: "demo123456" },
    admin: { email: "admin@atomquest.demo", password: "demo123456" },
  };

  const creds = demoCredentials[role];
  const { error } = await supabase.auth.signInWithPassword(creds);

  if (error) {
    return { error: error.message };
  }

  redirect("/dashboard");
}

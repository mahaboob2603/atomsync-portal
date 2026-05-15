import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";

export async function GET() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const supabaseKey =
    process.env.SUPABASE_SERVICE_ROLE_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

  const supabase = createClient(supabaseUrl, supabaseKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });

  const results: string[] = [];

  const demoUsers = [
    {
      email: "employee@atomquest.com",
      password: "demo123456",
      full_name: "Alex Johnson",
      role: "employee",
      department: "Engineering",
    },
    {
      email: "manager@atomquest.com",
      password: "demo123456",
      full_name: "Sarah Williams",
      role: "manager",
      department: "Engineering",
    },
    {
      email: "admin@atomquest.com",
      password: "demo123456",
      full_name: "Mike Chen",
      role: "admin",
      department: "HR",
    },
  ];

  const createdIds: Record<string, string> = {};

  for (const user of demoUsers) {
    const { data, error } = await supabase.auth.signUp({
      email: user.email,
      password: user.password,
      options: {
        data: { full_name: user.full_name, role: user.role },
        emailRedirectTo: undefined,
      },
    });

    if (error) {
      results.push(`❌ ${user.email}: ${error.message}`);
      const { data: existingUsers } = await supabase
        .from("profiles")
        .select("id")
        .eq("email", user.email)
        .single();
      if (existingUsers?.id) {
        createdIds[user.role] = existingUsers.id;
        results.push(`   ↳ Found existing profile: ${existingUsers.id}`);
      }
      continue;
    }

    if (data.user) {
      createdIds[user.role] = data.user.id;
      results.push(`✅ ${user.email}: Created (ID: ${data.user.id})`);

      const { error: profileError } = await supabase.from("profiles").upsert({
        id: data.user.id,
        email: user.email,
        full_name: user.full_name,
        role: user.role,
        department: user.department,
      });

      if (profileError) {
        results.push(`   ↳ Profile error: ${profileError.message}`);
      } else {
        results.push(`   ↳ Profile created`);
      }
    }
  }

  // Set manager relationship
  if (createdIds.employee && createdIds.manager) {
    const { error: updateError } = await supabase
      .from("profiles")
      .update({ manager_id: createdIds.manager })
      .eq("id", createdIds.employee);

    if (updateError) {
      results.push(`❌ Manager link: ${updateError.message}`);
    } else {
      results.push(`✅ Employee → Manager relationship set`);
    }
  }

  return NextResponse.json({
    message: "Seed completed",
    results,
    ids: createdIds,
    loginCredentials: {
      employee: { email: "employee@atomquest.com", password: "demo123456" },
      manager: { email: "manager@atomquest.com", password: "demo123456" },
      admin: { email: "admin@atomquest.com", password: "demo123456" },
    },
  });
}

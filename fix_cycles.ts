import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

async function main() {
  console.log("Logging in as admin...");
  const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
    email: "admin@atomquest.com",
    password: "demo123456"
  });

  if (authError) {
    console.error("Auth error:", authError);
    return;
  }

  console.log("Fixing cycles...");
  // Make goal setting active and check-ins inactive
  const e1 = await supabase.from("cycles").update({ is_active: true, window_opens: '2026-01-01', window_closes: '2026-12-31' }).eq("phase", "goal_setting");
  if(e1.error) console.error("e1", e1.error);
  
  const e2 = await supabase.from("cycles").update({ is_active: false, window_opens: '2026-01-01', window_closes: '2026-12-31' }).eq("phase", "q1_checkin");
  if(e2.error) console.error("e2", e2.error);

  const e3 = await supabase.from("cycles").update({ is_active: false, window_opens: '2026-01-01', window_closes: '2026-12-31' }).eq("phase", "q2_checkin");
  const e4 = await supabase.from("cycles").update({ is_active: false, window_opens: '2026-01-01', window_closes: '2026-12-31' }).eq("phase", "q3_checkin");
  const e5 = await supabase.from("cycles").update({ is_active: false, window_opens: '2026-01-01', window_closes: '2026-12-31' }).eq("phase", "q4_annual");

  const { data } = await supabase.from("cycles").select("*");
  console.log(data);
}

main();

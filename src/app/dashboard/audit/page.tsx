import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { Shield, FileText, Filter } from "lucide-react";

export default async function AuditPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  if (!profile || profile.role !== "admin") redirect("/dashboard");

  const { data: logs } = await supabase
    .from("audit_log")
    .select("*, user:profiles!audit_log_user_id_fkey(full_name, email, role)")
    .order("created_at", { ascending: false })
    .limit(200);

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="text-2xl font-bold">Audit Trail</h1>
          <p className="text-sm mt-1" style={{ color: "var(--muted)" }}>
            Complete log of all goal changes and system actions
          </p>
        </div>
      </div>

      <div className="page-body">
        {(!logs || logs.length === 0) ? (
          <div className="glass-card p-12 text-center">
            <Shield size={48} className="mx-auto mb-4" style={{ color: "var(--muted)" }} />
            <h2 className="text-xl font-semibold mb-2">No Audit Entries</h2>
            <p style={{ color: "var(--muted)" }}>Changes will be logged here automatically.</p>
          </div>
        ) : (
          <div className="table-wrapper">
            <table className="table">
              <thead>
                <tr>
                  <th>Timestamp</th>
                  <th>User</th>
                  <th>Action</th>
                  <th>Table</th>
                  <th>Field</th>
                  <th>Old Value</th>
                  <th>New Value</th>
                </tr>
              </thead>
              <tbody>
                {logs.map((log) => (
                  <tr key={log.id} className="animate-fade-in">
                    <td className="text-xs whitespace-nowrap font-mono">
                      {new Intl.DateTimeFormat('en-IN', {
                        dateStyle: 'short',
                        timeStyle: 'medium',
                        timeZone: 'Asia/Kolkata'
                      }).format(new Date(log.created_at))}
                    </td>
                    <td>
                      <div className="text-sm font-medium">
                        {log.user?.full_name || "System"}
                      </div>
                      <div className="text-xs" style={{ color: "var(--muted)" }}>
                        {log.user?.role}
                      </div>
                    </td>
                    <td>
                      <span className="badge badge-draft">{log.action}</span>
                    </td>
                    <td className="text-xs">{log.table_name}</td>
                    <td className="text-xs">{log.field_name || "—"}</td>
                    <td className="text-xs max-w-[150px] truncate" title={log.old_value || ""}>
                      {log.old_value || "—"}
                    </td>
                    <td className="text-xs max-w-[150px] truncate" title={log.new_value || ""}>
                      {log.new_value || "—"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

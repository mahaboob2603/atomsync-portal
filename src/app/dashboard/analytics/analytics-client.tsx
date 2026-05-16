"use client";

import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, LineChart, Line, Cell, Area, AreaChart,
} from "recharts";
import { BarChart3, TrendingUp, Users, Wind, Target, Activity, Gauge } from "lucide-react";
import { useEffect, useState } from "react";

const GOLD = "#fdb913";
const GOLD_DIM = "#c49210";
const COLORS = ["#fdb913", "#ffca4d", "#d99d0f", "#38bdf8", "#22c55e", "#c084fc", "#f59e0b", "#14b8a6"];

interface AnalyticsClientProps {
  goals: Array<{
    id: string; uom: string;
    thrust_area: { name: string } | null;
    achievements: Array<{ quarter: string; score: number | null; status: string }>;
  }>;
  employees: Array<{ id: string; full_name: string; department: string | null }>;
  goalSheets: Array<{
    id: string;
    employee: { id: string; full_name: string; department: string | null } | null;
  }>;
  checkIns: Array<{
    id: string; quarter: string;
    manager: { id: string; full_name: string } | null;
  }>;
}

export function AnalyticsClient({ goals, employees, goalSheets, checkIns }: AnalyticsClientProps) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  // --- Data Processing ---
  const thrustAreaDist = goals.reduce((acc, g) => {
    const name = g.thrust_area?.name || "Unknown";
    acc[name] = (acc[name] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
  const fanData = Object.entries(thrustAreaDist).map(([name, value]) => ({ name, value }));
  const totalGoals = fanData.reduce((a, c) => a + c.value, 0);

  const uomDist = goals.reduce((acc, g) => { acc[g.uom] = (acc[g.uom] || 0) + 1; return acc; }, {} as Record<string, number>);
  const uomData = Object.entries(uomDist).map(([name, value]) => ({
    name: name.replace(/_/g, " ").replace(/\b\w/g, l => l.toUpperCase()), value,
  }));

  const qoqData = ["Q1", "Q2", "Q3", "Q4"].map(q => {
    const qA = goals.flatMap(g => g.achievements.filter(a => a.quarter === q && a.score !== null));
    const avg = qA.length > 0 ? Math.round(qA.reduce((s, a) => s + (a.score || 0), 0) / qA.length) : 0;
    return { quarter: q, avgScore: avg, count: qA.length };
  });

  const managerEff = checkIns.reduce((acc, ci) => {
    const n = ci.manager?.full_name || "Unknown"; acc[n] = (acc[n] || 0) + 1; return acc;
  }, {} as Record<string, number>);
  const managerData = Object.entries(managerEff).map(([name, count]) => ({ name, checkIns: count }));

  const heatmapData = employees.map(emp => {
    const empGoals = goals.filter(g => goalSheets.some(gs => gs.employee?.id === emp.id));
    return {
      name: emp.full_name,
      ...["Q1", "Q2", "Q3", "Q4"].reduce((acc, q) => {
        const qA = empGoals.flatMap(g => g.achievements.filter(a => a.quarter === q && a.score !== null));
        acc[q] = qA.length > 0 ? Math.round(qA.reduce((s, a) => s + (a.score || 0), 0) / qA.length) : 0;
        return acc;
      }, {} as Record<string, number>),
    };
  });

  // Computed KPIs
  const completionRate = goals.length > 0
    ? Math.round((goals.filter(g => g.achievements.some(a => a.score !== null)).length / goals.length) * 100) : 0;
  const avgScore = (() => {
    const all = goals.flatMap(g => g.achievements.filter(a => a.score !== null).map(a => a.score!));
    return all.length > 0 ? Math.round(all.reduce((a, b) => a + b, 0) / all.length) : 0;
  })();

  return (
    <div>
      <style dangerouslySetInnerHTML={{ __html: fanCSS }} />

      {/* Page Header */}
      <div className="page-header">
        <div>
          <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: GOLD, marginBottom: 4 }}>
            INSTITUTIONAL GRADE
          </p>
          <h1 style={{ fontSize: 24, fontWeight: 800, color: "#fff", letterSpacing: "-0.02em" }}>
            Analytics Intelligence
          </h1>
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          <span style={{ fontSize: 10, padding: "4px 10px", borderRadius: 4, background: "rgba(253,185,19,0.08)", border: "1px solid rgba(253,185,19,0.2)", color: GOLD, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase" }}>
            LIVE
          </span>
        </div>
      </div>

      <div className="page-body" style={{ display: "flex", flexDirection: "column", gap: 20 }}>

        {/* KPI Ribbon */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16 }}>
          <KPICard icon={Target} label="Strategic Goals" value={totalGoals} color={GOLD} />
          <KPICard icon={Gauge} label="Mission Velocity" value={`${completionRate}%`} color="#22c55e" sub="Completion rate" />
          <KPICard icon={Users} label="Active Operatives" value={employees.length} color="#38bdf8" />
          <KPICard icon={Activity} label="Impact Quotient" value={avgScore > 0 ? `${avgScore}%` : "—"} color="#c084fc" sub="Avg achievement" />
        </div>

        {/* Row 1: Fan + QoQ */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
          {/* Thrust Area Fan */}
          <GlassModule icon={Wind} title="Thrust Area Momentum" badge="Hover to accelerate">
            <div className="fan-container">
              <div className="fan-ring" />
              <div className="fan-assembly">
                <div className="fan-motor" />
                {(fanData.length > 0 ? fanData : [{ name: "A", value: 1 }, { name: "B", value: 1 }, { name: "C", value: 1 }]).map((d, i, arr) => {
                  const angle = (360 / arr.length) * i;
                  const ratio = d.value / (totalGoals || 1);
                  const len = 55 + ratio * 35;
                  return (
                    <div key={d.name} className="fan-blade" style={{
                      transform: `rotate(${angle}deg)`,
                      background: `linear-gradient(180deg, ${COLORS[i % COLORS.length]}cc 0%, ${COLORS[i % COLORS.length]}22 100%)`,
                      height: `${len}px`,
                    }} title={`${d.name}: ${d.value}`} />
                  );
                })}
              </div>
            </div>
            {/* Stats under fan */}
            <div style={{ display: "flex", justifyContent: "center", gap: 32, marginTop: 16 }}>
              {fanData.slice(0, 3).map((d, i) => (
                <div key={d.name} style={{ textAlign: "center" }}>
                  <div style={{ width: 8, height: 8, borderRadius: 2, background: COLORS[i], margin: "0 auto 6px" }} />
                  <p style={{ fontSize: 11, fontWeight: 600, color: "#ccc" }}>{d.name}</p>
                  <p style={{ fontSize: 18, fontWeight: 800, color: "#fff", fontFeatureSettings: "'tnum'" }}>{d.value}</p>
                </div>
              ))}
            </div>
          </GlassModule>

          {/* QoQ Velocity */}
          <GlassModule icon={TrendingUp} title="Velocity Index (QoQ)">
            {mounted && (
              <ResponsiveContainer width="100%" height={280}>
                <AreaChart data={qoqData}>
                  <defs>
                    <linearGradient id="goldArea" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor={GOLD} stopOpacity={0.3} />
                      <stop offset="100%" stopColor={GOLD} stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" vertical={false} />
                  <XAxis dataKey="quarter" stroke="#555" fontSize={11} tickLine={false} axisLine={false} fontWeight={600} />
                  <YAxis stroke="#555" fontSize={11} tickLine={false} axisLine={false} />
                  <Tooltip contentStyle={tooltipStyle} />
                  <Area type="monotone" dataKey="avgScore" stroke={GOLD} strokeWidth={3} fill="url(#goldArea)" name="Avg Score %" />
                  <Line type="monotone" dataKey="avgScore" stroke={GOLD} strokeWidth={3}
                    dot={{ fill: "#0a0a0a", stroke: GOLD, strokeWidth: 2, r: 5 }}
                    activeDot={{ r: 7, fill: GOLD, stroke: "#fff", strokeWidth: 2 }} />
                </AreaChart>
              </ResponsiveContainer>
            )}
          </GlassModule>
        </div>

        {/* Row 2: UoM + Leadership */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
          <GlassModule icon={BarChart3} title="Metrics Topology">
            {mounted && (
              <ResponsiveContainer width="100%" height={260}>
                <BarChart data={uomData}>
                  <defs>
                    <linearGradient id="barGold" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor={GOLD} />
                      <stop offset="100%" stopColor={GOLD_DIM} stopOpacity={0.4} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" vertical={false} />
                  <XAxis dataKey="name" stroke="#555" fontSize={10} angle={-20} textAnchor="end" height={55} tickLine={false} axisLine={false} />
                  <YAxis stroke="#555" fontSize={11} tickLine={false} axisLine={false} />
                  <Tooltip cursor={{ fill: "rgba(255,255,255,0.02)" }} contentStyle={tooltipStyle} />
                  <Bar dataKey="value" fill="url(#barGold)" radius={[4, 4, 0, 0]} name="Goals" />
                </BarChart>
              </ResponsiveContainer>
            )}
          </GlassModule>

          <GlassModule icon={Users} title="Leadership Impact Score">
            {managerData.length > 0 && mounted ? (
              <ResponsiveContainer width="100%" height={260}>
                <BarChart data={managerData} layout="vertical">
                  <defs>
                    <linearGradient id="barGreen" x1="0" y1="0" x2="1" y2="0">
                      <stop offset="0%" stopColor="#16a34a" />
                      <stop offset="100%" stopColor="#4ade80" />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" horizontal={false} />
                  <XAxis type="number" stroke="#555" fontSize={11} tickLine={false} axisLine={false} />
                  <YAxis dataKey="name" type="category" stroke="#888" fontSize={12} width={100} tickLine={false} axisLine={false} />
                  <Tooltip cursor={{ fill: "rgba(255,255,255,0.02)" }} contentStyle={tooltipStyle} />
                  <Bar dataKey="checkIns" fill="url(#barGreen)" radius={[0, 4, 4, 0]} name="Check-ins">
                    {managerData.map((_, i) => <Cell key={i} fill="url(#barGreen)" />)}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: 260, color: "#555" }}>
                No check-in data yet
              </div>
            )}
          </GlassModule>
        </div>

        {/* Enterprise Heatmap */}
        <div style={{
          background: "rgba(17,17,17,0.6)", backdropFilter: "blur(20px)",
          border: "1px solid rgba(253,185,19,0.08)", borderRadius: 8,
          overflow: "hidden",
        }}>
          <div style={{ padding: "16px 20px", borderBottom: "1px solid rgba(255,255,255,0.06)", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <Activity size={16} color={GOLD} />
              <h3 style={{ fontSize: 14, fontWeight: 700, color: "#fff" }}>Enterprise Topology Heatmap</h3>
            </div>
            <span style={{ fontSize: 10, color: "#666", fontWeight: 600, letterSpacing: "0.05em", textTransform: "uppercase" }}>
              Performance by operative
            </span>
          </div>
          {heatmapData.length > 0 ? (
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
              <thead>
                <tr>
                  {["OPERATIVE", "Q1", "Q2", "Q3", "Q4"].map(h => (
                    <th key={h} style={{ padding: "10px 16px", textAlign: "left", fontSize: 10, fontWeight: 700, letterSpacing: "0.1em", color: "#666", borderBottom: "1px solid rgba(255,255,255,0.04)" }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {heatmapData.map(row => (
                  <tr key={row.name} style={{ transition: "background 0.2s" }}
                    onMouseEnter={e => (e.currentTarget.style.background = "rgba(253,185,19,0.03)")}
                    onMouseLeave={e => (e.currentTarget.style.background = "transparent")}>
                    <td style={{ padding: "10px 16px", fontWeight: 600, color: "#ddd", borderBottom: "1px solid rgba(255,255,255,0.03)" }}>{row.name}</td>
                    {(["Q1", "Q2", "Q3", "Q4"] as const).map(q => {
                      const val = (row as Record<string, number | string>)[q] as number;
                      const { bg, fg } = heatColor(val);
                      return (
                        <td key={q} style={{ padding: "10px 16px", borderBottom: "1px solid rgba(255,255,255,0.03)" }}>
                          <div style={{
                            display: "inline-flex", alignItems: "center", justifyContent: "center",
                            width: 52, height: 28, borderRadius: 4, fontSize: 12, fontWeight: 700,
                            background: bg, color: fg, fontFeatureSettings: "'tnum'",
                            boxShadow: val > 0 ? `0 0 12px ${bg}` : "none",
                            transition: "transform 0.2s",
                          }}>
                            {val > 0 ? `${val}%` : "—"}
                          </div>
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div style={{ padding: 48, textAlign: "center", color: "#555" }}>No data available</div>
          )}
        </div>

        {/* Footer */}
        <p style={{ textAlign: "center", fontSize: 10, fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase", color: "#333", padding: "8px 0" }}>
          AtomSync · Precision Analytics · Engineering Excellence
        </p>
      </div>
    </div>
  );
}

// --- Sub-components ---

function KPICard({ icon: Icon, label, value, color, sub }: {
  icon: React.ComponentType<{ size?: number; color?: string }>;
  label: string; value: string | number; color: string; sub?: string;
}) {
  return (
    <div style={{
      padding: "16px 20px", borderRadius: 8,
      background: "rgba(17,17,17,0.6)", backdropFilter: "blur(20px)",
      border: "1px solid rgba(253,185,19,0.08)",
      borderLeft: `3px solid ${color}`,
      boxShadow: `0 0 20px ${color}08`,
      transition: "all 0.3s",
    }}>
      <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 8 }}>
        <Icon size={14} color={color} />
        <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: "#888" }}>{label}</span>
      </div>
      <p style={{ fontSize: 28, fontWeight: 800, color: "#fff", letterSpacing: "-0.02em", fontFeatureSettings: "'tnum'" }}>{value}</p>
      {sub && <p style={{ fontSize: 10, color: "#555", marginTop: 2 }}>{sub}</p>}
    </div>
  );
}

function GlassModule({ icon: Icon, title, badge, children }: {
  icon: React.ComponentType<{ size?: number; color?: string }>;
  title: string; badge?: string; children: React.ReactNode;
}) {
  return (
    <div style={{
      background: "rgba(17,17,17,0.6)", backdropFilter: "blur(20px)",
      border: "1px solid rgba(253,185,19,0.08)", borderRadius: 8,
      overflow: "hidden", transition: "border-color 0.3s",
    }} className="group">
      <div style={{
        padding: "14px 20px", borderBottom: "1px solid rgba(255,255,255,0.06)",
        display: "flex", alignItems: "center", justifyContent: "space-between",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <Icon size={16} color={GOLD} />
          <h3 style={{ fontSize: 14, fontWeight: 700, color: "#fff" }}>{title}</h3>
        </div>
        {badge && (
          <span style={{ fontSize: 9, padding: "3px 8px", borderRadius: 4, background: "rgba(253,185,19,0.08)", color: GOLD, fontWeight: 700, letterSpacing: "0.05em", textTransform: "uppercase" }}>
            {badge}
          </span>
        )}
      </div>
      <div style={{ padding: "16px 20px" }}>{children}</div>
    </div>
  );
}

const tooltipStyle = {
  background: "rgba(10,10,10,0.95)", border: "1px solid rgba(253,185,19,0.2)",
  borderRadius: 8, color: "#fff", fontSize: 12, boxShadow: "0 8px 32px rgba(0,0,0,0.6)",
};

function heatColor(val: number) {
  if (val >= 90) return { bg: "rgba(34,197,94,0.18)", fg: "#4ade80" };
  if (val >= 70) return { bg: "rgba(253,185,19,0.18)", fg: GOLD };
  if (val >= 50) return { bg: "rgba(245,158,11,0.15)", fg: "#fbbf24" };
  if (val > 0) return { bg: "rgba(239,68,68,0.15)", fg: "#f87171" };
  return { bg: "transparent", fg: "#444" };
}

const fanCSS = `
.fan-container { perspective:800px; display:flex; align-items:center; justify-content:center; height:220px; position:relative; }
.fan-ring { position:absolute; width:180px; height:180px; border-radius:50%; border:1px solid rgba(253,185,19,0.12);
  box-shadow:0 0 40px rgba(253,185,19,0.06), inset 0 0 40px rgba(253,185,19,0.03); pointer-events:none; }
.fan-assembly { width:160px; height:160px; position:relative; transform-style:preserve-3d;
  transform:rotateX(18deg); animation:spin 10s linear infinite; }
.fan-container:hover .fan-assembly { animation:spin 2.5s linear infinite; }
@keyframes spin { from{transform:rotateX(18deg) rotateZ(0)} to{transform:rotateX(18deg) rotateZ(360deg)} }
.fan-motor { position:absolute; top:50%; left:50%; width:36px; height:36px; margin:-18px 0 0 -18px;
  background:radial-gradient(circle at 35% 35%, #fdb913, #8c6508); border-radius:50%;
  box-shadow:0 0 20px rgba(253,185,19,0.35), inset 0 0 8px rgba(0,0,0,0.5); z-index:10; }
.fan-motor::after { content:''; position:absolute; top:50%; left:50%; width:10px; height:10px;
  margin:-5px 0 0 -5px; background:#0a0a0a; border-radius:50%; border:1.5px solid #666; }
.fan-blade { position:absolute; top:50%; left:50%; width:20px; margin-left:-10px;
  transform-origin:50% 0; border-radius:40px 40px 3px 3px;
  box-shadow:inset -3px 0 10px rgba(0,0,0,0.5), 3px 3px 12px rgba(0,0,0,0.4); }
`;

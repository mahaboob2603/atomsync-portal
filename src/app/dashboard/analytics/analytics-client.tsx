"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  Cell,
} from "recharts";
import { BarChart3, TrendingUp, Users, Wind } from "lucide-react";
import { useEffect, useState } from "react";

// Atomberg Gold & Industrial Palette
const COLORS = ["#fdb913", "#d99d0f", "#ffca4d", "#b5830a", "#e8a710", "#8c6508", "#ffda73", "#fdb913"];

interface AnalyticsClientProps {
  goals: Array<{
    id: string;
    uom: string;
    thrust_area: { name: string } | null;
    achievements: Array<{
      quarter: string;
      score: number | null;
      status: string;
    }>;
  }>;
  employees: Array<{ id: string; full_name: string; department: string | null }>;
  goalSheets: Array<{
    id: string;
    employee: { id: string; full_name: string; department: string | null } | null;
  }>;
  checkIns: Array<{
    id: string;
    quarter: string;
    manager: { id: string; full_name: string } | null;
  }>;
}

export function AnalyticsClient({
  goals,
  employees,
  goalSheets,
  checkIns,
}: AnalyticsClientProps) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  // Goal distribution by thrust area
  const thrustAreaDist = goals.reduce((acc, g) => {
    const name = g.thrust_area?.name || "Unknown";
    acc[name] = (acc[name] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const fanData = Object.entries(thrustAreaDist).map(([name, value]) => ({
    name,
    value,
  }));
  
  const totalGoals = fanData.reduce((acc, curr) => acc + curr.value, 0);

  // UoM distribution
  const uomDist = goals.reduce((acc, g) => {
    acc[g.uom] = (acc[g.uom] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const uomData = Object.entries(uomDist).map(([name, value]) => ({
    name: name.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase()),
    value,
  }));

  // QoQ achievement trends
  const qoqData = ["Q1", "Q2", "Q3", "Q4"].map((q) => {
    const qAchievements = goals.flatMap((g) =>
      g.achievements.filter((a) => a.quarter === q && a.score !== null)
    );
    const avgScore =
      qAchievements.length > 0
        ? Math.round(
            qAchievements.reduce((s, a) => s + (a.score || 0), 0) / qAchievements.length
          )
        : 0;
    return { quarter: q, avgScore, count: qAchievements.length };
  });

  // Manager effectiveness (check-in count)
  const managerEffectiveness = checkIns.reduce((acc, ci) => {
    const name = ci.manager?.full_name || "Unknown";
    acc[name] = (acc[name] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const managerData = Object.entries(managerEffectiveness).map(([name, count]) => ({
    name,
    checkIns: count,
  }));

  // Completion heatmap data
  const heatmapData = employees.map((emp) => {
    const empGoals = goals.filter((g) =>
      goalSheets.some(
        (gs) => gs.employee?.id === emp.id && gs.id
      )
    );
    return {
      name: emp.full_name,
      ...["Q1", "Q2", "Q3", "Q4"].reduce((acc, q) => {
        const qAchs = empGoals.flatMap((g) =>
          g.achievements.filter((a) => a.quarter === q && a.score !== null)
        );
        acc[q] =
          qAchs.length > 0
            ? Math.round(qAchs.reduce((s, a) => s + (a.score || 0), 0) / qAchs.length)
            : 0;
        return acc;
      }, {} as Record<string, number>),
    };
  });

  // Custom 3D Fan CSS injected via style tag
  const fanStyles = `
    .fan-container {
      perspective: 1000px;
      display: flex;
      align-items: center;
      justify-content: center;
      height: 250px;
      position: relative;
    }
    .fan-assembly {
      width: 180px;
      height: 180px;
      position: relative;
      transform-style: preserve-3d;
      transform: rotateX(20deg) rotateY(-10deg);
      animation: fanSpin 8s linear infinite;
    }
    .fan-container:hover .fan-assembly {
      animation: fanSpin 2s linear infinite;
    }
    @keyframes fanSpin {
      0% { transform: rotateX(20deg) rotateY(-10deg) rotateZ(0deg); }
      100% { transform: rotateX(20deg) rotateY(-10deg) rotateZ(360deg); }
    }
    .fan-motor {
      position: absolute;
      top: 50%;
      left: 50%;
      width: 40px;
      height: 40px;
      margin: -20px 0 0 -20px;
      background: radial-gradient(circle at 30% 30%, #fdb913, #b5830a);
      border-radius: 50%;
      box-shadow: 0 0 15px rgba(253, 185, 19, 0.4), inset 0 0 10px rgba(0,0,0,0.5);
      z-index: 10;
      transform: translateZ(10px);
    }
    .fan-motor::after {
      content: '';
      position: absolute;
      top: 50%;
      left: 50%;
      width: 12px;
      height: 12px;
      margin: -6px 0 0 -6px;
      background: #111;
      border-radius: 50%;
      border: 2px solid #555;
    }
    .fan-blade {
      position: absolute;
      top: 50%;
      left: 50%;
      width: 16px;
      height: 90px;
      margin-left: -8px;
      transform-origin: 50% 0;
      border-radius: 50px 50px 4px 4px;
      box-shadow: inset -2px 0 8px rgba(0,0,0,0.4), 5px 5px 15px rgba(0,0,0,0.6);
      backface-visibility: visible;
    }
    .blade-label {
      position: absolute;
      top: 100px;
      left: 50%;
      transform: translateX(-50%) rotate(90deg);
      font-size: 10px;
      font-weight: 700;
      white-space: nowrap;
      color: #fff;
      text-shadow: 0 1px 3px rgba(0,0,0,0.8);
      pointer-events: none;
    }
  `;

  return (
    <div>
      <style dangerouslySetInnerHTML={{ __html: fanStyles }} />
      <div className="page-header">
        <div>
          <h1 className="text-2xl font-bold text-white">Analytics Intelligence</h1>
          <p className="text-sm" style={{ color: "#888", marginTop: 4 }}>
            3D Precision Tracking & Momentum Insights
          </p>
        </div>
      </div>

      <div className="page-body space-y-6">
        {/* Top Row - Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Goal Distribution by Thrust Area — 3D FAN */}
          <div className="glass-card p-6 animate-fade-in relative overflow-hidden group">
            {/* Background ambient glow */}
            <div style={{
              position: 'absolute', top: '50%', left: '50%', width: '150%', height: '150%',
              background: 'radial-gradient(circle, rgba(253,185,19,0.05) 0%, transparent 60%)',
              transform: 'translate(-50%, -50%)', zIndex: 0, pointerEvents: 'none'
            }} />
            
            <div className="flex items-center gap-2 mb-4 relative z-10">
              <Wind size={18} style={{ color: "#fdb913" }} />
              <h3 className="font-semibold text-white">Thrust Area Momentum</h3>
              <span className="text-xs px-2 py-1 ml-auto rounded" style={{ background: "rgba(253,185,19,0.1)", color: "#fdb913" }}>
                Hover to accelerate
              </span>
            </div>
            
            <div className="fan-container">
              <div className="fan-assembly">
                <div className="fan-motor" />
                {fanData.map((data, i) => {
                  const numBlades = fanData.length || 3;
                  const angle = (360 / numBlades) * i;
                  // Base blade length is 90px. Vary length slightly based on data value to show distribution visually
                  const ratio = data.value / (totalGoals || 1);
                  const length = 60 + (ratio * 40); 
                  
                  return (
                    <div 
                      key={data.name} 
                      className="fan-blade"
                      style={{
                        transform: `rotate(${angle}deg) rotateX(15deg)`,
                        background: `linear-gradient(to bottom, ${COLORS[i % COLORS.length]}, #111)`,
                        height: `${length}px`
                      }}
                      title={`${data.name}: ${data.value} Goals`}
                    >
                      <div className="blade-label opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-100">
                        {data.name}
                      </div>
                    </div>
                  );
                })}
                {/* Fallback empty blades if no data */}
                {fanData.length === 0 && [0, 1, 2].map((i) => (
                   <div 
                    key={i} 
                    className="fan-blade"
                    style={{
                      transform: `rotate(${i * 120}deg) rotateX(15deg)`,
                      background: `linear-gradient(to bottom, #333, #111)`,
                    }}
                  />
                ))}
              </div>
            </div>
            
            {/* Custom Legend */}
            <div className="flex flex-wrap gap-3 mt-4 justify-center relative z-10">
              {fanData.map((d, i) => (
                <div key={d.name} className="flex items-center gap-1.5 text-xs text-gray-400">
                  <div className="w-2 h-2 rounded-full" style={{ background: COLORS[i % COLORS.length] }} />
                  {d.name} ({d.value})
                </div>
              ))}
            </div>
          </div>

          {/* QoQ Trends */}
          <div className="glass-card p-6 animate-fade-in stagger-1">
            <div className="flex items-center gap-2 mb-4">
              <TrendingUp size={18} style={{ color: "#fdb913" }} />
              <h3 className="font-semibold text-white">Quarter-on-Quarter Velocity</h3>
            </div>
            {mounted && (
              <ResponsiveContainer width="100%" height={250}>
                <LineChart data={qoqData}>
                  <defs>
                    <linearGradient id="goldGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#fdb913" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#fdb913" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                  <XAxis dataKey="quarter" stroke="#666" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis stroke="#666" fontSize={12} tickLine={false} axisLine={false} />
                  <Tooltip
                    contentStyle={{
                      background: "rgba(17,17,17,0.9)",
                      border: "1px solid rgba(253,185,19,0.3)",
                      borderRadius: 12,
                      color: "#fff",
                      boxShadow: "0 8px 32px rgba(0,0,0,0.5)"
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey="avgScore"
                    stroke="#fdb913"
                    strokeWidth={4}
                    dot={{ fill: "#0a0a0a", stroke: "#fdb913", strokeWidth: 2, r: 6 }}
                    activeDot={{ r: 8, fill: "#fdb913", stroke: "#fff", strokeWidth: 2 }}
                    name="Avg Score %"
                  />
                </LineChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        {/* Second Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* UoM Distribution */}
          <div className="glass-card p-6 animate-fade-in stagger-2">
            <div className="flex items-center gap-2 mb-4">
              <BarChart3 size={18} style={{ color: "#fdb913" }} />
              <h3 className="font-semibold text-white">Metrics Topology</h3>
            </div>
            {mounted && (
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={uomData}>
                  <defs>
                    <linearGradient id="barGold" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#fdb913" />
                      <stop offset="100%" stopColor="#8c6508" />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                  <XAxis dataKey="name" stroke="#666" fontSize={10} angle={-25} textAnchor="end" height={60} tickLine={false} axisLine={false} />
                  <YAxis stroke="#666" fontSize={12} tickLine={false} axisLine={false} />
                  <Tooltip
                    cursor={{ fill: 'rgba(255,255,255,0.02)' }}
                    contentStyle={{
                      background: "rgba(17,17,17,0.9)",
                      border: "1px solid rgba(253,185,19,0.3)",
                      borderRadius: 12,
                      color: "#fff",
                    }}
                  />
                  <Bar dataKey="value" fill="url(#barGold)" radius={[6, 6, 0, 0]} name="Goals" />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>

          {/* Manager Effectiveness */}
          <div className="glass-card p-6 animate-fade-in stagger-3">
            <div className="flex items-center gap-2 mb-4">
              <Users size={18} style={{ color: "#fdb913" }} />
              <h3 className="font-semibold text-white">Leadership Impact</h3>
            </div>
            {managerData.length > 0 ? (
              mounted && (
                <ResponsiveContainer width="100%" height={250}>
                  <BarChart data={managerData} layout="vertical">
                    <defs>
                       <linearGradient id="barGreen" x1="0" y1="0" x2="1" y2="0">
                        <stop offset="0%" stopColor="#16a34a" />
                        <stop offset="100%" stopColor="#22c55e" />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" horizontal={false} />
                    <XAxis type="number" stroke="#666" fontSize={12} tickLine={false} axisLine={false} />
                    <YAxis dataKey="name" type="category" stroke="#888" fontSize={12} width={100} tickLine={false} axisLine={false} />
                    <Tooltip
                      cursor={{ fill: 'rgba(255,255,255,0.02)' }}
                      contentStyle={{
                        background: "rgba(17,17,17,0.9)",
                        border: "1px solid rgba(34,197,94,0.3)",
                        borderRadius: 12,
                        color: "#fff",
                      }}
                    />
                    <Bar dataKey="checkIns" fill="url(#barGreen)" radius={[0, 6, 6, 0]} name="Check-ins">
                      {managerData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill="url(#barGreen)" />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              )
            ) : (
              <div className="flex items-center justify-center h-[250px] text-gray-500">
                No check-in data yet
              </div>
            )}
          </div>
        </div>

        {/* Completion Heatmap */}
        <div className="glass-card p-6 animate-fade-in stagger-4">
          <h3 className="font-semibold mb-4 text-white">Enterprise Heatmap (Avg Score by Quarter)</h3>
          {heatmapData.length > 0 ? (
            <div className="table-wrapper" style={{ border: '1px solid rgba(255,255,255,0.05)' }}>
              <table className="table">
                <thead>
                  <tr>
                    <th style={{ color: '#888' }}>Employee</th>
                    <th style={{ color: '#888' }}>Q1</th>
                    <th style={{ color: '#888' }}>Q2</th>
                    <th style={{ color: '#888' }}>Q3</th>
                    <th style={{ color: '#888' }}>Q4</th>
                  </tr>
                </thead>
                <tbody>
                  {heatmapData.map((row) => (
                    <tr key={row.name}>
                      <td className="font-medium text-gray-300">{row.name}</td>
                      {(["Q1", "Q2", "Q3", "Q4"] as const).map((q) => {
                        const val = (row as Record<string, number | string>)[q] as number;
                        
                        // Atomberg Premium heatmap colors
                        const bg =
                          val >= 90
                            ? "rgba(34, 197, 94, 0.15)"
                            : val >= 70
                            ? "rgba(253, 185, 19, 0.15)"
                            : val >= 50
                            ? "rgba(245, 158, 11, 0.1)"
                            : val > 0
                            ? "rgba(239, 68, 68, 0.1)"
                            : "transparent";
                        const color =
                          val >= 90
                            ? "#4ade80"
                            : val >= 70
                            ? "#fdb913"
                            : val >= 50
                            ? "#fbbf24"
                            : val > 0
                            ? "#f87171"
                            : "#555";
                        return (
                          <td key={q}>
                            <div
                              className="w-14 h-8 rounded flex items-center justify-center text-xs font-bold transition-all duration-300 hover:scale-110"
                              style={{ background: bg, color, boxShadow: val > 0 ? `0 0 10px ${bg}` : 'none' }}
                            >
                              {val > 0 ? `${val}%` : "—"}
                            </div>
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              No data available yet
            </div>
          )}
        </div>
      </div>
    </div>
  );
}


"use client";

import { useState } from "react";
import { loginAction, signUpAction, switchDemoRole } from "@/app/actions/auth";
import { Eye, EyeOff, User, Shield, Crown, LogIn, BarChart3, Target, Users, Lock, ChevronRight } from "lucide-react";

export default function LoginPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [switchingRole, setSwitchingRole] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);

  async function handleSubmit(formData: FormData) {
    setLoading(true);
    setError("");
    const result = isLogin ? await loginAction(formData) : await signUpAction(formData);
    if (result?.error) { setError(result.error); setLoading(false); }
  }

  async function handleDemoSwitch(role: "employee" | "manager" | "admin") {
    setSwitchingRole(role);
    setError("");
    const result = await switchDemoRole(role);
    if (result?.error) { setError(result.error); setSwitchingRole(null); }
  }

  const inputClass = "w-full bg-[#0e0e0e] border border-white/10 rounded px-4 py-3 text-white text-sm focus:border-[#fdb913] focus:outline-none transition-colors";

  return (
    <div style={{ fontFamily: "'Inter', sans-serif", background: "#0a0a0a", color: "#e5e2e1", minHeight: "100vh" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;900&display=swap');
        @keyframes scan { 0%,100%{transform:translateY(0);opacity:0} 50%{opacity:1} 100%{transform:translateY(40px)} }
        @keyframes spin { to{transform:rotate(360deg)} }
        @keyframes float { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-8px)} }
        @keyframes pulse-gold { 0%,100%{box-shadow:0 0 0 0 rgba(253,185,19,0.3)} 50%{box-shadow:0 0 20px 4px rgba(253,185,19,0.15)} }
        .grid-bg {
          background-image: linear-gradient(rgba(253,185,19,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(253,185,19,0.03) 1px, transparent 1px);
          background-size: 60px 60px;
        }
        .glass { background:rgba(255,255,255,0.04); backdrop-filter:blur(12px); border:1px solid rgba(255,255,255,0.08); }
        .glass:hover { background:rgba(255,255,255,0.07); border-color:rgba(253,185,19,0.3); }
        .gold-glow { box-shadow:0 0 30px rgba(253,185,19,0.15),0 0 60px rgba(253,185,19,0.05); }
        .scan-line { height:2px; background:linear-gradient(to right,transparent,#fdb913,transparent); animation:scan 3s ease-in-out infinite; }
      `}</style>

      {/* NAV */}
      <nav style={{ position:"fixed", top:0, left:0, right:0, zIndex:50, display:"flex", alignItems:"center", justifyContent:"space-between", padding:"16px 40px", background:"rgba(10,10,10,0.85)", backdropFilter:"blur(12px)", borderBottom:"1px solid rgba(255,255,255,0.05)" }}>
        <div style={{ display:"flex", alignItems:"center", gap:12 }}>
          <div style={{ width:36, height:36, background:"#fdb913", borderRadius:8, display:"flex", alignItems:"center", justifyContent:"center" }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#000" strokeWidth="2.5"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/></svg>
          </div>
          <span style={{ fontSize:18, fontWeight:700, color:"#fdb913", letterSpacing:"0.08em", textTransform:"uppercase" }}>AtomSync</span>
        </div>
        <div style={{ display:"flex", gap:32, alignItems:"center" }}>
          {["Solutions","Platform","Performance"].map(t => (
            <a key={t} href="#" style={{ fontSize:14, fontWeight:500, color:"rgba(255,255,255,0.5)", textDecoration:"none" }}>{t}</a>
          ))}
          <a href="#auth" style={{ fontSize:14, fontWeight:600, color:"#0a0a0a", background:"#fdb913", padding:"8px 20px", borderRadius:4, textDecoration:"none" }}>Get Started</a>
        </div>
      </nav>

      {/* SECTION 1: HERO */}
      <section className="grid-bg" style={{ minHeight:"100vh", display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", textAlign:"center", padding:"120px 40px 80px", position:"relative" }}>
        <div style={{ position:"absolute", top:"20%", left:"50%", transform:"translateX(-50%)", width:500, height:500, background:"radial-gradient(circle, rgba(253,185,19,0.08) 0%, transparent 70%)", pointerEvents:"none" }} />
        <div style={{ animation:"float 6s ease-in-out infinite", marginBottom:32 }}>
          <div style={{ width:80, height:80, background:"#fdb913", borderRadius:16, display:"flex", alignItems:"center", justifyContent:"center", margin:"0 auto" }} className="gold-glow">
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#000" strokeWidth="2"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/></svg>
          </div>
        </div>
        <h1 style={{ fontSize:56, fontWeight:900, lineHeight:1.1, maxWidth:700, marginBottom:24, letterSpacing:"-0.02em" }}>
          Precision in Every <span style={{ color:"#fdb913" }}>Synchronization</span>
        </h1>
        <p style={{ fontSize:18, color:"rgba(255,255,255,0.5)", maxWidth:560, lineHeight:1.7, marginBottom:40 }}>
          Industrial-grade performance tracking for modern systems. Align global teams with nanosecond accuracy and real-time operational oversight.
        </p>
        <a href="#auth" style={{ display:"inline-flex", alignItems:"center", gap:8, background:"#fdb913", color:"#000", fontWeight:700, fontSize:16, padding:"14px 32px", borderRadius:4, textDecoration:"none", transition:"all 0.2s" }} className="gold-glow">
          Get Started <ChevronRight size={18} />
        </a>
      </section>

      {/* SECTION 2: FEATURES */}
      <section style={{ padding:"100px 40px", maxWidth:1200, margin:"0 auto" }}>
        <p style={{ fontSize:12, fontWeight:700, color:"#fdb913", letterSpacing:"0.15em", textTransform:"uppercase", textAlign:"center", marginBottom:12 }}>CORE CAPABILITIES</p>
        <h2 style={{ fontSize:36, fontWeight:700, textAlign:"center", marginBottom:60 }}>Built for Industrial Scale</h2>
        <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:24 }}>
          {[
            { icon: <BarChart3 size={28} />, title:"Real-Time Analytics", desc:"Stream live telemetry from every edge device directly to your command center with zero latency buffering." },
            { icon: <Target size={28} />, title:"Goal Alignment", desc:"Cascade high-level industrial objectives down to individual machine tasks with precise tracking logic." },
            { icon: <Users size={28} />, title:"Team Synchronization", desc:"Maintain operational harmony across global shifts and departments through unified protocol enforcement." },
          ].map(f => (
            <div key={f.title} className="glass" style={{ padding:32, borderRadius:8, transition:"all 0.3s", cursor:"default" }}>
              <div style={{ color:"#fdb913", marginBottom:16 }}>{f.icon}</div>
              <h3 style={{ fontSize:20, fontWeight:600, marginBottom:8 }}>{f.title}</h3>
              <p style={{ fontSize:14, color:"rgba(255,255,255,0.5)", lineHeight:1.7 }}>{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* SECTION 3: STATS */}
      <section style={{ padding:"80px 40px", borderTop:"1px solid rgba(255,255,255,0.05)", borderBottom:"1px solid rgba(255,255,255,0.05)" }}>
        <div style={{ maxWidth:1000, margin:"0 auto", display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:32, textAlign:"center" }}>
          {[
            { val:"99.9%", label:"Uptime" },
            { val:"10K+", label:"Goals Tracked" },
            { val:"500+", label:"Teams" },
            { val:"Tier-4", label:"Security" },
          ].map(s => (
            <div key={s.label}>
              <div style={{ fontSize:40, fontWeight:900, color:"#fdb913", letterSpacing:"-0.02em" }}>{s.val}</div>
              <div style={{ fontSize:14, color:"rgba(255,255,255,0.4)", marginTop:4, fontWeight:500 }}>{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* SECTION 4: HOW IT WORKS */}
      <section style={{ padding:"100px 40px", maxWidth:1000, margin:"0 auto" }}>
        <p style={{ fontSize:12, fontWeight:700, color:"#fdb913", letterSpacing:"0.15em", textTransform:"uppercase", textAlign:"center", marginBottom:12 }}>OPERATIONAL WORKFLOW</p>
        <h2 style={{ fontSize:36, fontWeight:700, textAlign:"center", marginBottom:60 }}>Three Steps to Excellence</h2>
        <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:40 }}>
          {[
            { n:"1", title:"Set Goals", desc:"Define KPIs and operational benchmarks through our high-level administrative interface." },
            { n:"2", title:"Track Progress", desc:"Monitor real-time data streams as your systems execute against defined parameters." },
            { n:"3", title:"Achieve Results", desc:"Optimize performance based on historical analytics and predictive modeling outputs." },
          ].map(s => (
            <div key={s.n} style={{ textAlign:"center" }}>
              <div style={{ width:56, height:56, borderRadius:"50%", border:"2px solid #fdb913", display:"flex", alignItems:"center", justifyContent:"center", margin:"0 auto 20px", fontSize:22, fontWeight:700, color:"#fdb913" }}>{s.n}</div>
              <h3 style={{ fontSize:18, fontWeight:600, marginBottom:8 }}>{s.title}</h3>
              <p style={{ fontSize:14, color:"rgba(255,255,255,0.45)", lineHeight:1.7 }}>{s.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* SECTION 5: LOGIN SPLIT */}
      <section id="auth" style={{ display:"flex", minHeight:"100vh", borderTop:"1px solid rgba(255,255,255,0.05)" }}>
        {/* LEFT */}
        <div className="grid-bg" style={{ flex:"0 0 58%", padding:"80px 60px", display:"flex", flexDirection:"column", justifyContent:"center", position:"relative" }}>
          <div style={{ position:"absolute", top:0, left:0, right:0, bottom:0, background:"radial-gradient(ellipse at 30% 50%, rgba(253,185,19,0.05) 0%, transparent 70%)", pointerEvents:"none" }} />
          <div style={{ position:"relative", zIndex:1 }}>
            <p style={{ fontSize:12, fontWeight:700, color:"#fdb913", letterSpacing:"0.15em", textTransform:"uppercase", marginBottom:16 }}>PORTAL ACCESS</p>
            <h2 style={{ fontSize:44, fontWeight:900, lineHeight:1.15, marginBottom:16, letterSpacing:"-0.02em" }}>
              Ready to <span style={{ color:"#fdb913" }}>Synchronize</span>?
            </h2>
            <p style={{ fontSize:16, color:"rgba(255,255,255,0.45)", lineHeight:1.7, maxWidth:440, marginBottom:48 }}>
              Access your industrial command center. Monitor, align, and optimize your operations in real time.
            </p>

            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:20, maxWidth:480 }}>
              {/* System Reliability Card */}
              <div className="glass" style={{ padding:24, borderRadius:8, borderTop:"2px solid #fdb913" }}>
                <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:16 }}>
                  <span style={{ fontSize:11, fontWeight:700, color:"rgba(255,255,255,0.4)", letterSpacing:"0.1em", textTransform:"uppercase" }}>System Reliability</span>
                  <Shield size={16} color="#fdb913" />
                </div>
                <div style={{ display:"flex", alignItems:"center", gap:16 }}>
                  <div style={{ position:"relative", width:52, height:52, flexShrink:0 }}>
                    <svg width="52" height="52" style={{ transform:"rotate(-90deg)" }}>
                      <circle cx="26" cy="26" r="22" fill="transparent" stroke="rgba(255,255,255,0.08)" strokeWidth="4" />
                      <circle cx="26" cy="26" r="22" fill="transparent" stroke="#fdb913" strokeWidth="4" strokeDasharray="138.2" strokeDashoffset="1.4" strokeLinecap="round" />
                    </svg>
                    <span style={{ position:"absolute", inset:0, display:"flex", alignItems:"center", justifyContent:"center", fontSize:10, fontWeight:700 }}>99.9%</span>
                  </div>
                  <div>
                    <div style={{ fontSize:16, fontWeight:600 }}>Operational</div>
                    <div style={{ fontSize:11, color:"rgba(255,255,255,0.35)" }}>Global Node Status</div>
                  </div>
                </div>
              </div>

              {/* Protocol Security Card */}
              <div className="glass" style={{ padding:24, borderRadius:8, borderTop:"2px solid #fdb913", overflow:"hidden", position:"relative" }}>
                <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:16 }}>
                  <span style={{ fontSize:11, fontWeight:700, color:"rgba(255,255,255,0.4)", letterSpacing:"0.1em", textTransform:"uppercase" }}>Protocol Security</span>
                  <Lock size={16} color="#fdb913" />
                </div>
                <div style={{ fontSize:16, fontWeight:600, marginBottom:12 }}>Tier-4 Encrypted</div>
                <div style={{ width:"100%", background:"rgba(255,255,255,0.06)", height:36, borderRadius:4, position:"relative", overflow:"hidden", display:"flex", alignItems:"center", padding:"0 12px" }}>
                  <div className="scan-line" style={{ position:"absolute", insetInline:0, width:"100%" }} />
                  <div style={{ display:"flex", gap:3 }}>
                    {[16,24,12,20,16].map((h,i) => <div key={i} style={{ width:3, height:h, background:`rgba(253,185,19,${0.2+i*0.2})`, borderRadius:2 }} />)}
                  </div>
                  <span style={{ marginLeft:"auto", fontSize:10, fontWeight:700, color:"#fdb913", fontFamily:"monospace", letterSpacing:"0.05em" }}>ACTIVE SCAN</span>
                </div>
              </div>
            </div>

            <div style={{ marginTop:48, fontSize:11, color:"rgba(255,255,255,0.2)", fontWeight:500 }}>
              © 2024 AtomSync Industrial Systems. Engineered for precision.
            </div>
          </div>
        </div>

        {/* RIGHT: AUTH FORM */}
        <div style={{ flex:"0 0 42%", background:"#111111", display:"flex", flexDirection:"column", justifyContent:"center", padding:"60px 48px", borderLeft:"1px solid rgba(255,255,255,0.05)", position:"relative" }}>
          <div style={{ position:"absolute", top:"10%", right:"-10%", width:300, height:300, background:"radial-gradient(circle, rgba(253,185,19,0.06) 0%, transparent 70%)", pointerEvents:"none" }} />

          <div style={{ maxWidth:380, width:"100%", margin:"0 auto", position:"relative", zIndex:1 }}>
            <h3 style={{ fontSize:28, fontWeight:700, marginBottom:4 }}>{isLogin ? "Portal Access" : "Initialize Profile"}</h3>
            <p style={{ fontSize:14, color:"rgba(255,255,255,0.4)", marginBottom:28 }}>{isLogin ? "Enter your industrial credentials." : "Join the AtomSync data grid."}</p>

            {/* Tabs */}
            <div style={{ display:"flex", gap:4, background:"rgba(255,255,255,0.04)", padding:4, borderRadius:4, marginBottom:24, border:"1px solid rgba(255,255,255,0.06)" }}>
              <button onClick={() => { setIsLogin(true); setError(""); }} style={{ flex:1, padding:"8px 0", fontSize:13, fontWeight:600, borderRadius:3, border:"none", cursor:"pointer", background:isLogin?"#fdb913":"transparent", color:isLogin?"#000":"rgba(255,255,255,0.4)", transition:"all 0.2s" }}>Sign In</button>
              <button onClick={() => { setIsLogin(false); setError(""); }} style={{ flex:1, padding:"8px 0", fontSize:13, fontWeight:600, borderRadius:3, border:"none", cursor:"pointer", background:!isLogin?"#fdb913":"transparent", color:!isLogin?"#000":"rgba(255,255,255,0.4)", transition:"all 0.2s" }}>Register</button>
            </div>

            {error && (
              <div style={{ padding:"10px 14px", background:"rgba(239,68,68,0.08)", border:"1px solid rgba(239,68,68,0.2)", borderRadius:4, display:"flex", alignItems:"center", gap:8, marginBottom:16 }}>
                <div style={{ width:6, height:6, borderRadius:"50%", background:"#ef4444", flexShrink:0 }} />
                <span style={{ fontSize:13, color:"#f87171" }}>{error}</span>
              </div>
            )}

            <form action={handleSubmit} style={{ display:"flex", flexDirection:"column", gap:16 }}>
              {!isLogin && (
                <>
                  <div>
                    <label style={{ fontSize:11, fontWeight:700, color:"rgba(255,255,255,0.4)", letterSpacing:"0.1em", textTransform:"uppercase", display:"block", marginBottom:6 }}>Full Name</label>
                    <input name="full_name" className={inputClass} placeholder="John Doe" required={!isLogin} />
                  </div>
                  <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12 }}>
                    <div>
                      <label style={{ fontSize:11, fontWeight:700, color:"rgba(255,255,255,0.4)", letterSpacing:"0.1em", textTransform:"uppercase", display:"block", marginBottom:6 }}>Role</label>
                      <select name="role" style={{ width:"100%", background:"#0e0e0e", border:"1px solid rgba(255,255,255,0.1)", borderRadius:4, padding:"12px 16px", color:"#fff", fontSize:14, appearance:"none" as const, outline:"none" }}>
                        <option value="employee">Employee</option>
                        <option value="manager">Manager</option>
                      </select>
                    </div>
                    <div>
                      <label style={{ fontSize:11, fontWeight:700, color:"rgba(255,255,255,0.4)", letterSpacing:"0.1em", textTransform:"uppercase", display:"block", marginBottom:6 }}>Dept</label>
                      <input name="department" className={inputClass} placeholder="Engineering" required={!isLogin} />
                    </div>
                  </div>
                </>
              )}

              <div>
                <label style={{ fontSize:11, fontWeight:700, color:"rgba(255,255,255,0.4)", letterSpacing:"0.1em", textTransform:"uppercase", display:"block", marginBottom:6 }}>Corporate Email</label>
                <input name="email" type="email" className={inputClass} placeholder="name@atomsync.industrial" required />
              </div>

              <div>
                <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:6 }}>
                  <label style={{ fontSize:11, fontWeight:700, color:"rgba(255,255,255,0.4)", letterSpacing:"0.1em", textTransform:"uppercase" }}>Password</label>
                  {isLogin && <a href="#" style={{ fontSize:11, fontWeight:700, color:"#fdb913", textDecoration:"none" }}>Forgot?</a>}
                </div>
                <div style={{ position:"relative" }}>
                  <input name="password" type={showPassword ? "text" : "password"} className={inputClass} placeholder="••••••••" required minLength={6} style={{ paddingRight:46 }} />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} style={{ position:"absolute", right:14, top:"50%", transform:"translateY(-50%)", background:"none", border:"none", cursor:"pointer", color:"rgba(255,255,255,0.3)", display:"flex" }}>
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              {isLogin && (
                <label style={{ display:"flex", alignItems:"center", gap:8, cursor:"pointer" }}>
                  <input type="checkbox" style={{ width:14, height:14, accentColor:"#fdb913" }} />
                  <span style={{ fontSize:12, color:"rgba(255,255,255,0.35)" }}>Stay authenticated for 24 hours</span>
                </label>
              )}

              <button type="submit" disabled={loading} style={{ width:"100%", marginTop:4, background:"#fdb913", color:"#000", fontWeight:700, fontSize:14, padding:"12px 0", borderRadius:4, border:"none", cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center", gap:8, opacity:loading?0.6:1, transition:"all 0.2s" }}>
                {loading ? <div style={{ width:18, height:18, border:"2px solid rgba(0,0,0,0.15)", borderTopColor:"#000", borderRadius:"50%", animation:"spin 0.6s linear infinite" }} /> : <><span>{isLogin ? "Sign In" : "Initialize Profile"}</span><LogIn size={16} strokeWidth={2.5} /></>}
              </button>
            </form>

            {/* Demo Login */}
            <div style={{ display:"flex", alignItems:"center", gap:12, margin:"24px 0 16px" }}>
              <div style={{ flex:1, height:1, background:"rgba(255,255,255,0.06)" }} />
              <span style={{ fontSize:10, fontWeight:700, color:"rgba(255,255,255,0.2)", letterSpacing:"0.15em", textTransform:"uppercase" }}>Quick Demo Login</span>
              <div style={{ flex:1, height:1, background:"rgba(255,255,255,0.06)" }} />
            </div>

            <div style={{ display:"flex", gap:8 }}>
              {([
                { role: "employee" as const, label: "Employee", Icon: User },
                { role: "manager" as const, label: "Manager", Icon: Shield },
                { role: "admin" as const, label: "Admin", Icon: Crown },
              ]).map(({ role, label, Icon }) => (
                <button key={role} onClick={() => handleDemoSwitch(role)} disabled={switchingRole !== null} style={{ flex:1, display:"flex", flexDirection:"column", alignItems:"center", gap:6, padding:"12px 0", background:"rgba(255,255,255,0.04)", border:"1px solid rgba(255,255,255,0.08)", borderRadius:4, color:"rgba(255,255,255,0.5)", cursor:"pointer", transition:"all 0.2s", opacity:switchingRole!==null?0.5:1 }}>
                  {switchingRole === role
                    ? <div style={{ width:16, height:16, border:"2px solid rgba(253,185,19,0.2)", borderTopColor:"#fdb913", borderRadius:"50%", animation:"spin 0.6s linear infinite" }} />
                    : <Icon size={16} />
                  }
                  <span style={{ fontSize:10, fontWeight:700, letterSpacing:"0.08em", textTransform:"uppercase" }}>{label}</span>
                </button>
              ))}
            </div>

            <div style={{ display:"flex", justifyContent:"center", gap:16, marginTop:24 }}>
              {["Security","Compliance","Documentation","Status"].map(l => (
                <a key={l} href="#" style={{ fontSize:11, fontWeight:500, color:"rgba(255,255,255,0.2)", textDecoration:"none" }}>{l}</a>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

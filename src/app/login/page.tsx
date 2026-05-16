"use client";

import { useState, useEffect } from "react";
import { loginAction, signUpAction, switchDemoRole } from "@/app/actions/auth";
import { Eye, EyeOff, Zap, Shield, User, Crown, LogIn } from "lucide-react";

export default function LoginPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [switchingRole, setSwitchingRole] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [rotation, setRotation] = useState(0);

  useEffect(() => {
    let angle = 0;
    const interval = setInterval(() => {
      angle += 0.4;
      setRotation(angle);
    }, 16);
    return () => clearInterval(interval);
  }, []);

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

  return (
    <main style={{ minHeight: "100vh", display: "flex", background: "#050505", fontFamily: "'Inter', sans-serif", overflow: "hidden", position: "relative" }}>

      {/* ── GLOBAL STYLES ── */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap');

        * { box-sizing: border-box; margin: 0; padding: 0; }

        /* Rotating fan blades */
        @keyframes fanSpin {
          from { transform: rotate(0deg); }
          to   { transform: rotate(360deg); }
        }
        @keyframes pulseRing {
          0%,100% { opacity: 0.15; transform: scale(1); }
          50%      { opacity: 0.35; transform: scale(1.08); }
        }
        @keyframes floatUp {
          0%,100% { transform: translateY(0px); }
          50%      { transform: translateY(-12px); }
        }
        @keyframes shimmer {
          0%   { background-position: -400px 0; }
          100% { background-position: 400px 0; }
        }
        @keyframes fadeSlideUp {
          from { opacity: 0; transform: translateY(24px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes scanLine {
          0%,100% { top: 0%; opacity: 0; }
          10%      { opacity: 1; }
          90%      { opacity: 1; }
          100%     { top: 100%; opacity: 0; }
        }
        @keyframes blink {
          0%,100% { opacity: 1; } 50% { opacity: 0; }
        }
        @keyframes dash {
          to { stroke-dashoffset: 0; }
        }

        .fade-up { animation: fadeSlideUp 0.7s cubic-bezier(.22,1,.36,1) both; }
        .fade-up-1 { animation-delay: 0.1s; }
        .fade-up-2 { animation-delay: 0.2s; }
        .fade-up-3 { animation-delay: 0.3s; }
        .fade-up-4 { animation-delay: 0.4s; }
        .fade-up-5 { animation-delay: 0.5s; }

        .inp {
          width: 100%;
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.1);
          border-radius: 14px;
          padding: 14px 18px;
          color: #fff;
          font-size: 14px;
          outline: none;
          transition: border-color .25s, box-shadow .25s;
          font-family: 'Inter', sans-serif;
        }
        .inp:focus {
          border-color: #fdb913;
          box-shadow: 0 0 0 3px rgba(253,185,19,0.12);
        }
        .inp::placeholder { color: rgba(255,255,255,0.2); }

        .sel {
          appearance: none;
          background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' fill='none' viewBox='0 0 24 24' stroke='%23888' stroke-width='2'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' d='M19 9l-7 7-7-7'/%3E%3C/svg%3E");
          background-repeat: no-repeat;
          background-position: right 14px center;
          background-color: rgba(255,255,255,0.04);
        }
        .sel option { background: #111; }

        .cta-btn {
          width: 100%;
          background: linear-gradient(135deg, #fdb913 0%, #f5a500 100%);
          color: #000;
          font-weight: 800;
          font-size: 15px;
          padding: 16px;
          border: none;
          border-radius: 14px;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          transition: all .25s;
          box-shadow: 0 8px 32px rgba(253,185,19,0.25);
          letter-spacing: 0.02em;
          font-family: 'Inter', sans-serif;
        }
        .cta-btn:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 16px 48px rgba(253,185,19,0.35);
          background: linear-gradient(135deg, #ffc62d 0%, #fdb913 100%);
        }
        .cta-btn:active:not(:disabled) { transform: translateY(0); }
        .cta-btn:disabled { opacity: 0.6; cursor: not-allowed; }

        .tab-pill {
          flex: 1;
          padding: 10px 20px;
          border: none;
          border-radius: 10px;
          font-size: 13px;
          font-weight: 700;
          cursor: pointer;
          transition: all .2s;
          font-family: 'Inter', sans-serif;
          letter-spacing: 0.02em;
        }
        .tab-active { background: #fdb913; color: #000; }
        .tab-inactive { background: transparent; color: rgba(255,255,255,0.4); }
        .tab-inactive:hover { color: rgba(255,255,255,0.7); }

        .demo-btn {
          flex: 1;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 8px;
          padding: 14px 10px;
          background: rgba(255,255,255,0.03);
          border: 1px solid rgba(255,255,255,0.07);
          border-radius: 14px;
          cursor: pointer;
          transition: all .25s;
          font-family: 'Inter', sans-serif;
          color: rgba(255,255,255,0.5);
        }
        .demo-btn:hover {
          background: rgba(253,185,19,0.07);
          border-color: rgba(253,185,19,0.25);
          color: #fdb913;
          transform: translateY(-2px);
        }
        .demo-btn:disabled { opacity: 0.5; cursor: not-allowed; }

        .metric-chip {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 12px 18px;
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 100px;
          backdrop-filter: blur(12px);
        }
      `}</style>

      {/* ─────────────────────────────────────── */}
      {/* LEFT BRAND PANEL                        */}
      {/* ─────────────────────────────────────── */}
      <section style={{
        display: "none",
        position: "relative",
        width: "58%",
        flexDirection: "column",
        justifyContent: "space-between",
        padding: "48px 56px",
        overflow: "hidden",
        background: "linear-gradient(135deg, #070707 0%, #0e0e0e 50%, #060606 100%)",
        borderRight: "1px solid rgba(255,255,255,0.05)",
      }} className="md-brand-panel">
        <style>{`@media(min-width:768px){.md-brand-panel{display:flex!important;}}`}</style>

        {/* Background: gold noise + grid */}
        <div style={{ position:"absolute", inset:0, backgroundImage:"radial-gradient(circle at 20% 80%, rgba(253,185,19,0.06) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(253,185,19,0.04) 0%, transparent 50%)", pointerEvents:"none" }} />
        <div style={{ position:"absolute", inset:0, backgroundImage:"linear-gradient(rgba(255,255,255,0.015) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.015) 1px, transparent 1px)", backgroundSize:"60px 60px", pointerEvents:"none" }} />

        {/* Scanning line */}
        <div style={{ position:"absolute", left:0, right:0, height:"1px", background:"linear-gradient(90deg, transparent, rgba(253,185,19,0.4), transparent)", animation:"scanLine 6s ease-in-out infinite", pointerEvents:"none", zIndex:1 }} />

        {/* ── LOGO ── */}
        <div className="fade-up fade-up-1" style={{ position:"relative", zIndex:10, display:"flex", alignItems:"center", gap:"14px" }}>
          <div style={{
            width:44, height:44,
            background:"linear-gradient(135deg,#fdb913,#f5a500)",
            borderRadius:12,
            display:"flex", alignItems:"center", justifyContent:"center",
            boxShadow:"0 8px 24px rgba(253,185,19,0.3)"
          }}>
            <Zap size={22} color="#000" strokeWidth={3} />
          </div>
          <div>
            <div style={{ fontSize:20, fontWeight:900, color:"#fff", letterSpacing:"-0.02em", lineHeight:1 }}>AtomSync</div>
            <div style={{ fontSize:10, fontWeight:600, color:"rgba(255,255,255,0.3)", letterSpacing:"0.18em", textTransform:"uppercase", marginTop:2 }}>by Atomberg</div>
          </div>
        </div>

        {/* ── HERO CENTER ── */}
        <div style={{ position:"relative", zIndex:10, display:"flex", flexDirection:"column", gap:40, flex:1, justifyContent:"center", paddingTop:48 }}>

          {/* Giant rotating fan ring */}
          <div className="fade-up fade-up-2" style={{ position:"relative", width:320, height:320, margin:"0 auto" }}>
            {/* Outer glow rings */}
            {[1,2,3].map(i => (
              <div key={i} style={{
                position:"absolute",
                inset: `${(i-1)*24}px`,
                borderRadius:"50%",
                border:`1px solid rgba(253,185,19,${0.08 - i*0.02})`,
                animation:`pulseRing ${2+i}s ease-in-out infinite`,
                animationDelay:`${i*0.3}s`
              }} />
            ))}

            {/* Fan SVG — rotating blades */}
            <svg
              viewBox="0 0 200 200"
              style={{ width:"100%", height:"100%", position:"absolute", inset:0 }}
            >
              <defs>
                <radialGradient id="fanGold" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor="#fdb913" stopOpacity="0.9" />
                  <stop offset="100%" stopColor="#f5a500" stopOpacity="0.6" />
                </radialGradient>
                <radialGradient id="fanDim" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor="#fdb913" stopOpacity="0.25" />
                  <stop offset="100%" stopColor="#f5a500" stopOpacity="0.05" />
                </radialGradient>
                <filter id="glow">
                  <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
                  <feMerge><feMergeNode in="coloredBlur"/><feMergeNode in="SourceGraphic"/></feMerge>
                </filter>
              </defs>

              {/* Outer track ring */}
              <circle cx="100" cy="100" r="90" fill="none" stroke="rgba(253,185,19,0.08)" strokeWidth="1" />
              <circle cx="100" cy="100" r="70" fill="none" stroke="rgba(253,185,19,0.05)" strokeWidth="1" />

              {/* Fan blades group — rotated via inline style */}
              <g transform={`rotate(${rotation}, 100, 100)`} filter="url(#glow)">
                {/* 5 fan blades */}
                {[0,72,144,216,288].map((angle, i) => (
                  <g key={i} transform={`rotate(${angle}, 100, 100)`}>
                    <path
                      d="M100,100 Q90,60 100,30 Q110,60 100,100"
                      fill={i % 2 === 0 ? "url(#fanGold)" : "url(#fanDim)"}
                    />
                  </g>
                ))}
                {/* Center hub */}
                <circle cx="100" cy="100" r="14" fill="#fdb913" />
                <circle cx="100" cy="100" r="7" fill="#000" />
              </g>

              {/* Tick marks around ring */}
              {Array.from({length:24}).map((_,i) => {
                const a = (i / 24) * Math.PI * 2;
                const r1 = 88, r2 = 92;
                return (
                  <line key={i}
                    x1={100 + r1*Math.cos(a)} y1={100 + r1*Math.sin(a)}
                    x2={100 + r2*Math.cos(a)} y2={100 + r2*Math.sin(a)}
                    stroke="rgba(253,185,19,0.3)" strokeWidth={i%6===0?1.5:0.7}
                  />
                );
              })}
            </svg>

            {/* Center label */}
            <div style={{ position:"absolute", inset:0, display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", gap:4 }}>
              <div style={{ fontSize:11, fontWeight:700, color:"rgba(255,255,255,0.3)", letterSpacing:"0.2em", textTransform:"uppercase", marginTop:8 }}>BLDC</div>
            </div>
          </div>

          {/* Headline */}
          <div className="fade-up fade-up-3" style={{ textAlign:"center" }}>
            <div style={{ fontSize:11, fontWeight:700, color:"#fdb913", letterSpacing:"0.25em", textTransform:"uppercase", marginBottom:16 }}>
              Why Not?
            </div>
            <h1 style={{ fontSize:42, fontWeight:900, lineHeight:1.1, letterSpacing:"-0.03em", color:"#fff", marginBottom:16 }}>
              Engineering<br />
              <span style={{ background:"linear-gradient(135deg,#fdb913,#ffd04d)", WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent" }}>
                Excellence
              </span>
              <br />Redefined.
            </h1>
            <p style={{ fontSize:14, color:"rgba(255,255,255,0.35)", lineHeight:1.7, maxWidth:360, margin:"0 auto" }}>
              The central intelligence platform for Atomberg's precision-engineered ecosystem. Fleet diagnostics, real-time sync, enterprise-grade control.
            </p>
          </div>

          {/* Metric chips */}
          <div className="fade-up fade-up-4" style={{ display:"flex", flexWrap:"wrap", gap:12, justifyContent:"center" }}>
            <div className="metric-chip">
              <div style={{ width:8, height:8, borderRadius:"50%", background:"#22c55e", boxShadow:"0 0 8px rgba(34,197,94,0.6)" }} />
              <span style={{ fontSize:12, fontWeight:600, color:"rgba(255,255,255,0.7)" }}>Systems Online</span>
            </div>
            <div className="metric-chip">
              <Shield size={14} color="#fdb913" strokeWidth={2} />
              <span style={{ fontSize:12, fontWeight:600, color:"rgba(255,255,255,0.7)" }}>Tier-4 Secured</span>
            </div>
            <div className="metric-chip">
              <span style={{ fontSize:12, fontWeight:800, color:"#fdb913" }}>99.9%</span>
              <span style={{ fontSize:12, fontWeight:600, color:"rgba(255,255,255,0.5)" }}>Uptime SLA</span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="fade-up fade-up-5" style={{ position:"relative", zIndex:10, fontSize:10, color:"rgba(255,255,255,0.2)", fontWeight:600, letterSpacing:"0.1em", textTransform:"uppercase" }}>
          © 2024 Atomberg Technologies · "Why Not?" · v4.2.0
        </div>
      </section>

      {/* ─────────────────────────────────────── */}
      {/* RIGHT AUTH PANEL                        */}
      {/* ─────────────────────────────────────── */}
      <section style={{
        flex:1,
        display:"flex",
        flexDirection:"column",
        justifyContent:"center",
        alignItems:"center",
        padding:"32px 24px",
        background:"#080808",
        position:"relative",
        overflowY:"auto"
      }}>
        {/* BG glow */}
        <div style={{ position:"absolute", top:"10%", right:"-10%", width:400, height:400, background:"radial-gradient(circle, rgba(253,185,19,0.04) 0%, transparent 70%)", pointerEvents:"none" }} />

        <div style={{ width:"100%", maxWidth:400, display:"flex", flexDirection:"column", gap:28 }}>

          {/* Mobile logo */}
          <div className="fade-up" style={{ display:"flex", alignItems:"center", gap:12 }}>
            <div style={{ width:36, height:36, background:"linear-gradient(135deg,#fdb913,#f5a500)", borderRadius:10, display:"flex", alignItems:"center", justifyContent:"center" }}>
              <Zap size={18} color="#000" strokeWidth={3} />
            </div>
            <div style={{ fontSize:18, fontWeight:900, color:"#fff", letterSpacing:"-0.02em" }}>AtomSync</div>
          </div>

          {/* Tabs */}
          <div className="fade-up fade-up-1" style={{ display:"flex", gap:4, background:"rgba(255,255,255,0.04)", padding:4, borderRadius:14, border:"1px solid rgba(255,255,255,0.06)" }}>
            <button className={`tab-pill ${isLogin ? "tab-active" : "tab-inactive"}`} onClick={() => { setIsLogin(true); setError(""); }}>Sign In</button>
            <button className={`tab-pill ${!isLogin ? "tab-active" : "tab-inactive"}`} onClick={() => { setIsLogin(false); setError(""); }}>Register</button>
          </div>

          {/* Heading */}
          <div className="fade-up fade-up-2">
            <h2 style={{ fontSize:26, fontWeight:800, color:"#fff", letterSpacing:"-0.02em", marginBottom:6 }}>
              {isLogin ? "Welcome back" : "Create account"}
            </h2>
            <p style={{ fontSize:13, color:"rgba(255,255,255,0.35)", lineHeight:1.6 }}>
              {isLogin ? "Sign in to your AtomSync industrial portal." : "Join the Atomberg engineering intelligence platform."}
            </p>
          </div>

          {/* Error */}
          {error && (
            <div style={{ padding:"12px 16px", background:"rgba(239,68,68,0.08)", border:"1px solid rgba(239,68,68,0.2)", borderRadius:12, display:"flex", alignItems:"center", gap:10 }}>
              <div style={{ width:6, height:6, borderRadius:"50%", background:"#ef4444", flexShrink:0 }} />
              <span style={{ fontSize:13, color:"#f87171", fontWeight:500 }}>{error}</span>
            </div>
          )}

          {/* Form */}
          <form action={handleSubmit} style={{ display:"flex", flexDirection:"column", gap:16 }} className="fade-up fade-up-3">
            {!isLogin && (
              <>
                <div style={{ display:"flex", flexDirection:"column", gap:6 }}>
                  <label style={{ fontSize:11, fontWeight:700, color:"rgba(255,255,255,0.4)", letterSpacing:"0.15em", textTransform:"uppercase" }}>Full Name</label>
                  <input name="full_name" className="inp" placeholder="John Doe" required={!isLogin} />
                </div>
                <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12 }}>
                  <div style={{ display:"flex", flexDirection:"column", gap:6 }}>
                    <label style={{ fontSize:11, fontWeight:700, color:"rgba(255,255,255,0.4)", letterSpacing:"0.15em", textTransform:"uppercase" }}>Role</label>
                    <select name="role" className="inp sel" required={!isLogin}>
                      <option value="employee">Employee</option>
                      <option value="manager">Manager</option>
                    </select>
                  </div>
                  <div style={{ display:"flex", flexDirection:"column", gap:6 }}>
                    <label style={{ fontSize:11, fontWeight:700, color:"rgba(255,255,255,0.4)", letterSpacing:"0.15em", textTransform:"uppercase" }}>Department</label>
                    <input name="department" className="inp" placeholder="Engineering" required={!isLogin} />
                  </div>
                </div>
              </>
            )}

            <div style={{ display:"flex", flexDirection:"column", gap:6 }}>
              <label style={{ fontSize:11, fontWeight:700, color:"rgba(255,255,255,0.4)", letterSpacing:"0.15em", textTransform:"uppercase" }}>Email</label>
              <input name="email" type="email" className="inp" placeholder="you@atomberg.com" required />
            </div>

            <div style={{ display:"flex", flexDirection:"column", gap:6 }}>
              <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center" }}>
                <label style={{ fontSize:11, fontWeight:700, color:"rgba(255,255,255,0.4)", letterSpacing:"0.15em", textTransform:"uppercase" }}>Password</label>
                {isLogin && <a href="#" style={{ fontSize:11, fontWeight:600, color:"#fdb913", textDecoration:"none", opacity:0.8 }}>Forgot?</a>}
              </div>
              <div style={{ position:"relative" }}>
                <input name="password" type={showPassword ? "text" : "password"} className="inp" placeholder="••••••••" required minLength={6} style={{ paddingRight:48 }} />
                <button type="button" onClick={() => setShowPassword(!showPassword)} style={{ position:"absolute", right:16, top:"50%", transform:"translateY(-50%)", background:"none", border:"none", cursor:"pointer", color:"rgba(255,255,255,0.3)", display:"flex" }}>
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {isLogin && (
              <label style={{ display:"flex", alignItems:"center", gap:10, cursor:"pointer" }}>
                <input type="checkbox" style={{ width:16, height:16, accentColor:"#fdb913", borderRadius:4 }} />
                <span style={{ fontSize:13, color:"rgba(255,255,255,0.35)", fontWeight:500 }}>Keep me signed in for 24 hours</span>
              </label>
            )}

            <button type="submit" className="cta-btn" disabled={loading} style={{ marginTop:4 }}>
              {loading ? (
                <div style={{ width:20, height:20, border:"2.5px solid rgba(0,0,0,0.2)", borderTopColor:"#000", borderRadius:"50%", animation:"fanSpin 0.7s linear infinite" }} />
              ) : (
                <>
                  <LogIn size={18} strokeWidth={2.5} />
                  <span>{isLogin ? "Sign In to Portal" : "Create Account"}</span>
                </>
              )}
            </button>
          </form>

          {/* Divider */}
          <div style={{ display:"flex", alignItems:"center", gap:12 }}>
            <div style={{ flex:1, height:1, background:"rgba(255,255,255,0.06)" }} />
            <span style={{ fontSize:10, fontWeight:700, color:"rgba(255,255,255,0.2)", letterSpacing:"0.15em", textTransform:"uppercase", whiteSpace:"nowrap" }}>Quick Demo</span>
            <div style={{ flex:1, height:1, background:"rgba(255,255,255,0.06)" }} />
          </div>

          {/* Demo buttons */}
          <div className="fade-up fade-up-5" style={{ display:"flex", gap:10 }}>
            {[
              { role:"employee" as const, label:"Employee", icon: User },
              { role:"manager" as const, label:"Manager", icon: Shield },
              { role:"admin" as const, label:"Admin", icon: Crown }
            ].map(({ role, label, icon: Icon }) => (
              <button key={role} className="demo-btn" onClick={() => handleDemoSwitch(role)} disabled={switchingRole !== null}>
                {switchingRole === role ? (
                  <div style={{ width:18, height:18, border:"2px solid rgba(253,185,19,0.2)", borderTopColor:"#fdb913", borderRadius:"50%", animation:"fanSpin 0.7s linear infinite" }} />
                ) : (
                  <Icon size={18} strokeWidth={1.5} />
                )}
                <span style={{ fontSize:10, fontWeight:700, letterSpacing:"0.08em", textTransform:"uppercase" }}>{label}</span>
              </button>
            ))}
          </div>

          {/* Footer links */}
          <div style={{ display:"flex", gap:20, flexWrap:"wrap" }}>
            {["Privacy", "Security", "API Docs", "Status"].map(l => (
              <a key={l} href="#" style={{ fontSize:11, fontWeight:600, color:"rgba(255,255,255,0.2)", textDecoration:"none", letterSpacing:"0.05em", transition:"color .2s" }}
                onMouseEnter={e => (e.currentTarget.style.color="#fdb913")}
                onMouseLeave={e => (e.currentTarget.style.color="rgba(255,255,255,0.2)")}
              >
                {l}
              </a>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}

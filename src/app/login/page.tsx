"use client";

import { useState } from "react";
import { loginAction, signUpAction, switchDemoRole } from "@/app/actions/auth";
import { Eye, EyeOff, User, Shield, Crown, LogIn, CheckCircle2, Lock, Settings } from "lucide-react";

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

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700;900&display=swap');

        * { box-sizing: border-box; margin: 0; padding: 0; }

        body { font-family: 'Inter', sans-serif; }

        .glass-card {
          background: rgba(255,255,255,0.05);
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
          border: 1px solid rgba(255,255,255,0.1);
          border-top: 2px solid #fdb913;
          border-radius: 14px;
          transition: all 0.3s ease;
        }
        .glass-card:hover {
          background: rgba(255,255,255,0.08);
          border-color: #fdb913;
        }

        .isometric-bg {
          background-color: #050505;
          background-image:
            linear-gradient(30deg, #0a0a0a 12%, transparent 12.5%, transparent 87%, #0a0a0a 87.5%, #0a0a0a),
            linear-gradient(150deg, #0a0a0a 12%, transparent 12.5%, transparent 87%, #0a0a0a 87.5%, #0a0a0a),
            linear-gradient(30deg, #0a0a0a 12%, transparent 12.5%, transparent 87%, #0a0a0a 87.5%, #0a0a0a),
            linear-gradient(150deg, #0a0a0a 12%, transparent 12.5%, transparent 87%, #0a0a0a 87.5%, #0a0a0a),
            linear-gradient(60deg, #111111 25%, transparent 25.5%, transparent 75%, #111111 75%, #111111),
            linear-gradient(60deg, #111111 25%, transparent 25.5%, transparent 75%, #111111 75%, #111111);
          background-size: 80px 140px;
        }

        @keyframes scan {
          0%, 100% { transform: translateY(0); opacity: 0; }
          50% { opacity: 1; }
          100% { transform: translateY(40px); }
        }
        .scan-line {
          height: 2px;
          background: linear-gradient(to right, transparent, #fdb913, transparent);
          animation: scan 3s ease-in-out infinite;
          position: absolute;
          inset: 0;
        }

        .auth-inp {
          width: 100%;
          background: rgba(255,255,255,0.05);
          border: 1px solid rgba(255,255,255,0.1);
          border-radius: 12px;
          padding: 13px 16px;
          color: #fff;
          font-size: 14px;
          outline: none;
          transition: border-color .2s, box-shadow .2s;
          font-family: 'Inter', sans-serif;
        }
        .auth-inp:focus {
          border-color: #fdb913;
          box-shadow: 0 0 10px rgba(253,185,19,0.2);
        }
        .auth-inp::placeholder { color: rgba(255,255,255,0.25); }
        .auth-inp option { background: #111; }

        .cta-btn {
          width: 100%;
          background: #fdb913;
          color: #000;
          font-weight: 800;
          font-size: 15px;
          padding: 15px;
          border: none;
          border-radius: 12px;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          transition: all .25s;
          font-family: 'Inter', sans-serif;
          box-shadow: 0 0 20px rgba(253,185,19,0.3);
          letter-spacing: 0.01em;
        }
        .cta-btn:hover:not(:disabled) {
          background: #ffc62d;
          transform: translateY(-2px);
          box-shadow: 0 0 30px rgba(253,185,19,0.5);
        }
        .cta-btn:disabled { opacity: 0.6; cursor: not-allowed; }

        .demo-btn {
          flex: 1;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 6px;
          padding: 12px 8px;
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 12px;
          cursor: pointer;
          transition: all .2s;
          font-family: 'Inter', sans-serif;
          color: rgba(255,255,255,0.5);
        }
        .demo-btn:hover:not(:disabled) {
          background: rgba(253,185,19,0.07);
          border-color: rgba(253,185,19,0.2);
          color: #fdb913;
          transform: translateY(-2px);
        }
        .demo-btn:disabled { opacity: 0.5; cursor: not-allowed; }

        .tab-btn {
          flex: 1;
          padding: 10px;
          border: none;
          border-radius: 8px;
          font-size: 13px;
          font-weight: 700;
          cursor: pointer;
          transition: all .2s;
          font-family: 'Inter', sans-serif;
        }

        @keyframes spin {
          to { transform: rotate(360deg); }
        }
        .spinner {
          width: 18px; height: 18px;
          border: 2px solid rgba(0,0,0,0.15);
          border-top-color: #000;
          border-radius: 50%;
          animation: spin 0.6s linear infinite;
        }
      `}</style>

      <main style={{ minHeight:"100vh", display:"flex", justifyContent:"center", alignItems:"center", overflow:"hidden", fontFamily:"'Inter', sans-serif", borderTop:"2px solid #fdb913", position:"relative" }}>
        
        {/* Background */}
        <div style={{ position:"absolute", inset:0, zIndex:0 }}>
          <img
            src="https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&q=80&w=1400"
            alt=""
            style={{ width:"100%", height:"100%", objectFit:"cover", opacity:0.15 }}
          />
          <div style={{ position:"absolute", inset:0, background:"linear-gradient(to bottom, rgba(0,0,0,0.8) 0%, rgba(5,5,5,0.95) 100%)" }} />
          <div className="isometric-bg" style={{ position:"absolute", inset:0, opacity:0.4, mixBlendMode:"overlay" }} />
        </div>

        {/* Subtle gold glow behind card */}
        <div style={{ position:"absolute", top:"50%", left:"50%", transform:"translate(-50%, -50%)", width:600, height:600, background:"radial-gradient(circle, rgba(253,185,19,0.06) 0%, transparent 60%)", pointerEvents:"none", zIndex:1 }} />

        {/* Center Card */}
        <section className="glass-card" style={{
          width:"100%",
          maxWidth:440,
          display:"flex",
          flexDirection:"column",
          gap:24,
          padding:"40px",
          position:"relative",
          zIndex:10,
          margin: "20px"
        }}>
          {/* Logo and Branding */}
          <div style={{ display:"flex", flexDirection:"column", alignItems:"center", gap:16, marginBottom: 8 }}>
            <div style={{
              width:56, height:56,
              background:"#fdb913",
              borderRadius:16,
              display:"flex", alignItems:"center", justifyContent:"center",
              boxShadow:"0 0 20px rgba(253,185,19,0.3)"
            }}>
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#000" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10"/>
                <circle cx="12" cy="12" r="6"/>
                <circle cx="12" cy="12" r="2"/>
              </svg>
            </div>
            <div style={{ textAlign:"center" }}>
              <h1 style={{ fontSize:24, fontWeight:900, color:"#fff", letterSpacing:"0.1em", textTransform:"uppercase" }}>AtomSync</h1>
              <p style={{ fontSize:13, color:"rgba(255,255,255,0.5)", marginTop:4 }}>Precision Synchronization</p>
            </div>
          </div>

          {/* Tab switcher */}
          <div style={{ display:"flex", gap:4, background:"rgba(255,255,255,0.04)", padding:4, borderRadius:12, border:"1px solid rgba(255,255,255,0.06)" }}>
            <button
              className="tab-btn"
              onClick={() => { setIsLogin(true); setError(""); }}
              style={{ background: isLogin ? "#fdb913" : "transparent", color: isLogin ? "#000" : "rgba(255,255,255,0.4)" }}
            >
              Sign In
            </button>
            <button
              className="tab-btn"
              onClick={() => { setIsLogin(false); setError(""); }}
              style={{ background: !isLogin ? "#fdb913" : "transparent", color: !isLogin ? "#000" : "rgba(255,255,255,0.4)" }}
            >
              Register
            </button>
          </div>

          {/* Error */}
          {error && (
            <div style={{ padding:"12px 16px", background:"rgba(239,68,68,0.08)", border:"1px solid rgba(239,68,68,0.2)", borderRadius:12, display:"flex", alignItems:"center", gap:10 }}>
              <div style={{ width:6, height:6, borderRadius:"50%", background:"#ef4444", flexShrink:0 }} />
              <span style={{ fontSize:13, color:"#f87171" }}>{error}</span>
            </div>
          )}

          {/* Form */}
          <form action={handleSubmit} style={{ display:"flex", flexDirection:"column", gap:16 }}>
            {!isLogin && (
              <>
                <div style={{ display:"flex", flexDirection:"column", gap:6 }}>
                  <label style={{ fontSize:11, fontWeight:700, color:"rgba(255,255,255,0.4)", letterSpacing:"0.12em", textTransform:"uppercase" }}>Full Name</label>
                  <input name="full_name" className="auth-inp" placeholder="John Doe" required={!isLogin} />
                </div>
                <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12 }}>
                  <div style={{ display:"flex", flexDirection:"column", gap:6 }}>
                    <label style={{ fontSize:11, fontWeight:700, color:"rgba(255,255,255,0.4)", letterSpacing:"0.12em", textTransform:"uppercase" }}>Role</label>
                    <select name="role" className="auth-inp" style={{ appearance:"none", backgroundImage:`url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' fill='none' viewBox='0 0 24 24' stroke='%23888' stroke-width='2'%3E%3Cpath d='M19 9l-7 7-7-7'/%3E%3C/svg%3E")`, backgroundRepeat:"no-repeat", backgroundPosition:"right 12px center" }}>
                      <option value="employee">Employee</option>
                      <option value="manager">Manager</option>
                    </select>
                  </div>
                  <div style={{ display:"flex", flexDirection:"column", gap:6 }}>
                    <label style={{ fontSize:11, fontWeight:700, color:"rgba(255,255,255,0.4)", letterSpacing:"0.12em", textTransform:"uppercase" }}>Dept</label>
                    <input name="department" className="auth-inp" placeholder="Engineering" required={!isLogin} />
                  </div>
                </div>
              </>
            )}

            <div style={{ display:"flex", flexDirection:"column", gap:6 }}>
              <label style={{ fontSize:11, fontWeight:700, color:"rgba(255,255,255,0.4)", letterSpacing:"0.12em", textTransform:"uppercase" }}>Corporate Email</label>
              <input name="email" type="email" className="auth-inp" placeholder="name@atomsync.industrial" required />
            </div>

            <div style={{ display:"flex", flexDirection:"column", gap:6 }}>
              <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center" }}>
                <label style={{ fontSize:11, fontWeight:700, color:"rgba(255,255,255,0.4)", letterSpacing:"0.12em", textTransform:"uppercase" }}>Password</label>
                {isLogin && <a href="#" style={{ fontSize:11, fontWeight:700, color:"#fdb913", textDecoration:"none" }}>Forgot?</a>}
              </div>
              <div style={{ position:"relative" }}>
                <input name="password" type={showPassword ? "text" : "password"} className="auth-inp" placeholder="••••••••" required minLength={6} style={{ paddingRight:46 }} />
                <button type="button" onClick={() => setShowPassword(!showPassword)} style={{ position:"absolute", right:14, top:"50%", transform:"translateY(-50%)", background:"none", border:"none", cursor:"pointer", color:"rgba(255,255,255,0.3)", display:"flex", alignItems:"center" }}>
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {isLogin && (
              <label style={{ display:"flex", alignItems:"center", gap:10, cursor:"pointer" }}>
                <input type="checkbox" id="remember" style={{ width:15, height:15, accentColor:"#fdb913" }} />
                <span style={{ fontSize:12, color:"rgba(255,255,255,0.35)" }}>Stay authenticated for 24 hours</span>
              </label>
            )}

            <button type="submit" className="cta-btn" disabled={loading} style={{ marginTop: 8 }}>
              {loading
                ? <div className="spinner" />
                : <><LogIn size={16} strokeWidth={2.5} /><span>{isLogin ? "Sign In" : "Initialize Profile"}</span></>
              }
            </button>
          </form>

          {/* Divider */}
          <div style={{ display:"flex", alignItems:"center", gap:12, marginTop: 8 }}>
            <div style={{ flex:1, height:1, background:"rgba(255,255,255,0.06)" }} />
            <span style={{ fontSize:10, fontWeight:700, color:"rgba(255,255,255,0.2)", letterSpacing:"0.18em", textTransform:"uppercase" }}>Quick Demo Login</span>
            <div style={{ flex:1, height:1, background:"rgba(255,255,255,0.06)" }} />
          </div>

          {/* Demo buttons */}
          <div style={{ display:"flex", gap:10 }}>
            {([
              { role:"employee" as const, label:"Employee", Icon: User },
              { role:"manager"  as const, label:"Manager",  Icon: Shield },
              { role:"admin"    as const, label:"Admin",    Icon: Crown },
            ]).map(({ role, label, Icon }) => (
              <button key={role} className="demo-btn" onClick={() => handleDemoSwitch(role)} disabled={switchingRole !== null}>
                {switchingRole === role
                  ? <div style={{ width:18, height:18, border:"2px solid rgba(253,185,19,0.2)", borderTopColor:"#fdb913", borderRadius:"50%", animation:"spin 0.6s linear infinite" }} />
                  : <Icon size={18} strokeWidth={1.5} />
                }
                <span style={{ fontSize:10, fontWeight:700, letterSpacing:"0.08em", textTransform:"uppercase", marginTop: 4 }}>{label}</span>
              </button>
            ))}
          </div>
          
          {/* Footer links */}
          <div style={{ display:"flex", justifyContent:"center", gap:16, flexWrap:"wrap", marginTop: 8 }}>
            {["Security", "API", "Support"].map(l => (
              <a key={l} href="#" style={{ fontSize:11, fontWeight:600, color:"rgba(255,255,255,0.2)", textDecoration:"none", transition:"color .2s" }}
                onMouseEnter={e => (e.currentTarget.style.color="#fdb913")}
                onMouseLeave={e => (e.currentTarget.style.color="rgba(255,255,255,0.2)")}
              >
                {l}
              </a>
            ))}
          </div>

        </section>
      </main>
    </>
  );
}

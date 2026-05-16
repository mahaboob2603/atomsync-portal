"use client";

import { useState } from "react";
import { loginAction, signUpAction, switchDemoRole } from "@/app/actions/auth";
import { Eye, EyeOff, User, Shield, Crown, LogIn, Lock, Settings } from "lucide-react";

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
    <main className="min-h-screen flex flex-col md:flex-row overflow-hidden bg-[#0a0a0a] text-white font-sans selection:bg-[#fdb913] selection:text-black">
      <style>{`
        .isometric-bg {
            background-color: #050505;
            background-image: linear-gradient(30deg, #0a0a0a 12%, transparent 12.5%, transparent 87%, #0a0a0a 87.5%, #0a0a0a),
            linear-gradient(150deg, #0a0a0a 12%, transparent 12.5%, transparent 87%, #0a0a0a 87.5%, #0a0a0a),
            linear-gradient(30deg, #0a0a0a 12%, transparent 12.5%, transparent 87%, #0a0a0a 87.5%, #0a0a0a),
            linear-gradient(150deg, #0a0a0a 12%, transparent 12.5%, transparent 87%, #0a0a0a 87.5%, #0a0a0a),
            linear-gradient(60deg, #111111 25%, transparent 25.5%, transparent 75%, #111111 75%, #111111),
            linear-gradient(60deg, #111111 25%, transparent 25.5%, transparent 75%, #111111 75%, #111111);
            background-size: 80px 140px;
        }
        .scan-line {
            height: 2px;
            background: linear-gradient(to right, transparent, #fdb913, transparent);
            animation: scan 3s ease-in-out infinite;
        }
        @keyframes scan {
            0%, 100% { transform: translateY(0); opacity: 0; }
            50% { opacity: 1; }
            100% { transform: translateY(40px); }
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

      {/* LEFT SIDE: BRANDING */}
      <section className="relative w-full md:w-3/5 lg:w-[65%] isometric-bg flex flex-col justify-between p-6 md:p-12 lg:p-16 min-h-[512px] md:min-h-screen border-r border-white/5">
        {/* Branding/Logo */}
        <div className="z-10 flex items-center gap-3">
          <div className="w-12 h-12 bg-[#fdb913] rounded-xl flex items-center justify-center">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#000" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10"/>
              <circle cx="12" cy="12" r="6"/>
              <circle cx="12" cy="12" r="2"/>
            </svg>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-[#fdb913] uppercase tracking-widest">AtomSync</h1>
        </div>

        {/* Hero Image Overlay (Subtle) */}
        <div className="absolute inset-0 z-0 opacity-20 pointer-events-none overflow-hidden">
          <img alt="Industrial Microchip" className="w-full h-full object-cover mix-blend-overlay" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBhhf0KL3mKEQP2m4U0KghEl01fo9mST30zWkdks_1sCnEPZi1Css8RXHI12RYDF7IJjNP81OiIJMFnMsyKRNHMObv4JI3VODEMiVt2schX1RzXWcGQ2S3Ne4LVazz0IMaU4Xy5MScm6npxVfHuPAS4ZQdehDCFAZKHKx4aF3TyetCQOrCg3HGbH1avxrYAzAinLICHwBHzAwQywS6iHIDTZjPI_iHzTs3MTDBQQbYDCKoik6Oum4NEkLLBeX21EElwwG56mymAqu88" />
        </div>

        {/* Center Content */}
        <div className="z-10 max-w-xl my-12 md:my-0">
          <h2 className="text-4xl md:text-5xl font-bold tracking-tight leading-tight mb-8">
            Precision in every <span className="text-[#fdb913]">Synchronization</span>.
          </h2>

          {/* Status Cards Bento Layout */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Card 1 */}
            <div className="bg-white/5 backdrop-blur-md border border-white/10 p-6 rounded-xl flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-semibold tracking-wide text-gray-400">SYSTEM RELIABILITY</span>
                <Shield className="text-[#fdb913]" size={20} />
              </div>
              <div className="flex items-center gap-4">
                <div className="relative w-16 h-16 flex items-center justify-center">
                  <svg className="w-full h-full transform -rotate-90">
                    <circle className="text-white/10" cx="32" cy="32" fill="transparent" r="28" stroke="currentColor" strokeWidth="4"></circle>
                    <circle className="text-[#fdb913]" cx="32" cy="32" fill="transparent" r="28" stroke="currentColor" strokeDasharray="176" strokeDashoffset="1.76" strokeWidth="4"></circle>
                  </svg>
                  <span className="absolute text-[10px] font-bold">99.9%</span>
                </div>
                <div>
                  <p className="text-2xl font-semibold text-white">Operational</p>
                  <p className="text-xs text-gray-400">Global Node Status</p>
                </div>
              </div>
            </div>

            {/* Card 2 */}
            <div className="bg-white/5 backdrop-blur-md border border-white/10 p-6 rounded-xl flex flex-col gap-4 relative overflow-hidden">
              <div className="flex items-center justify-between">
                <span className="text-sm font-semibold tracking-wide text-gray-400">PROTOCOL SECURITY</span>
                <Lock className="text-[#fdb913]" size={20} />
              </div>
              <div className="flex flex-col gap-2">
                <p className="text-2xl font-semibold text-white">Tier-4 Encrypted</p>
                <div className="w-full bg-white/10 h-10 rounded-lg relative overflow-hidden flex items-center px-3 mt-2">
                  <div className="scan-line absolute inset-x-0 w-full"></div>
                  <div className="flex gap-1">
                    <div className="w-1 h-4 bg-[#fdb913]/40 rounded-full"></div>
                    <div className="w-1 h-6 bg-[#fdb913]/60 rounded-full"></div>
                    <div className="w-1 h-3 bg-[#fdb913]/20 rounded-full"></div>
                    <div className="w-1 h-5 bg-[#fdb913]/80 rounded-full"></div>
                    <div className="w-1 h-4 bg-[#fdb913] rounded-full"></div>
                  </div>
                  <span className="ml-auto text-xs text-[#fdb913] font-mono font-semibold">ACTIVE SCAN</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Left Footer */}
        <div className="z-10 text-xs text-gray-500 font-medium hidden md:block">
          © 2024 AtomSync Industrial Systems. v4.2.0-Alpha. Security Clearance Required.
        </div>
      </section>

      {/* RIGHT SIDE: AUTH */}
      <section className="w-full md:w-2/5 lg:w-[35%] bg-[#0f0f0f] flex flex-col justify-center p-6 md:p-12 lg:p-16 relative">
        <div className="absolute top-[5%] right-[-5%] w-[350px] h-[350px] bg-[radial-gradient(circle,rgba(253,185,19,0.05)_0%,transparent_70%)] pointer-events-none" />

        <div className="w-full max-w-sm mx-auto flex flex-col gap-8 relative z-10">
          <header className="flex flex-col gap-2">
            <h3 className="text-3xl font-bold tracking-tight text-white">
              {isLogin ? "Portal Access" : "Initialize Profile"}
            </h3>
            <p className="text-gray-400 text-base">
              {isLogin ? "Enter your industrial credentials to continue." : "Join the AtomSync data grid."}
            </p>
          </header>

          <div className="flex gap-2 bg-white/5 p-1 rounded-lg border border-white/10">
            <button
              className={\`flex-1 py-2 text-sm font-semibold rounded-md transition-all \${isLogin ? 'bg-[#fdb913] text-black' : 'text-gray-400 hover:text-white'}\`}
              onClick={() => { setIsLogin(true); setError(""); }}
            >
              Sign In
            </button>
            <button
              className={\`flex-1 py-2 text-sm font-semibold rounded-md transition-all \${!isLogin ? 'bg-[#fdb913] text-black' : 'text-gray-400 hover:text-white'}\`}
              onClick={() => { setIsLogin(false); setError(""); }}
            >
              Register
            </button>
          </div>

          {error && (
            <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg flex items-center gap-3">
              <div className="w-1.5 h-1.5 rounded-full bg-red-500 flex-shrink-0" />
              <span className="text-sm text-red-400">{error}</span>
            </div>
          )}

          <form action={handleSubmit} className="flex flex-col gap-5">
            {!isLogin && (
              <>
                <div className="flex flex-col gap-2">
                  <label className="text-xs font-semibold tracking-wide text-gray-400 uppercase">Full Name</label>
                  <input name="full_name" className="w-full bg-[#1a1a1a] border border-white/10 rounded-lg px-4 py-3 text-white focus:border-[#fdb913] focus:ring-1 focus:ring-[#fdb913] transition-all outline-none" placeholder="John Doe" required={!isLogin} />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex flex-col gap-2">
                    <label className="text-xs font-semibold tracking-wide text-gray-400 uppercase">Role</label>
                    <select name="role" className="w-full bg-[#1a1a1a] border border-white/10 rounded-lg px-4 py-3 text-white focus:border-[#fdb913] focus:ring-1 focus:ring-[#fdb913] transition-all outline-none appearance-none" style={{ backgroundImage:\`url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' fill='none' viewBox='0 0 24 24' stroke='%23888' stroke-width='2'%3E%3Cpath d='M19 9l-7 7-7-7'/%3E%3C/svg%3E")\`, backgroundRepeat:"no-repeat", backgroundPosition:"right 16px center" }}>
                      <option value="employee">Employee</option>
                      <option value="manager">Manager</option>
                    </select>
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="text-xs font-semibold tracking-wide text-gray-400 uppercase">Dept</label>
                    <input name="department" className="w-full bg-[#1a1a1a] border border-white/10 rounded-lg px-4 py-3 text-white focus:border-[#fdb913] focus:ring-1 focus:ring-[#fdb913] transition-all outline-none" placeholder="Engineering" required={!isLogin} />
                  </div>
                </div>
              </>
            )}

            <div className="flex flex-col gap-2">
              <label className="text-xs font-semibold tracking-wide text-gray-400 uppercase">Corporate Email</label>
              <input name="email" type="email" className="w-full bg-[#1a1a1a] border border-white/10 rounded-lg px-4 py-3 text-white focus:border-[#fdb913] focus:ring-1 focus:ring-[#fdb913] transition-all outline-none" placeholder="name@atomsync.industrial" required />
            </div>

            <div className="flex flex-col gap-2">
              <div className="flex justify-between items-center">
                <label className="text-xs font-semibold tracking-wide text-gray-400 uppercase">Password</label>
                {isLogin && <a className="text-xs text-[#fdb913] hover:underline font-medium" href="#">Forgot?</a>}
              </div>
              <div className="relative">
                <input name="password" type={showPassword ? "text" : "password"} className="w-full bg-[#1a1a1a] border border-white/10 rounded-lg px-4 py-3 text-white focus:border-[#fdb913] focus:ring-1 focus:ring-[#fdb913] transition-all outline-none" placeholder="••••••••" required minLength={6} style={{ paddingRight: 46 }} />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300 transition-colors">
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {isLogin && (
              <div className="flex items-center gap-3 mt-1">
                <input className="w-4 h-4 rounded border-white/10 bg-[#1a1a1a] text-[#fdb913] focus:ring-offset-[#0f0f0f] focus:ring-[#fdb913] accent-[#fdb913]" id="remember" type="checkbox" />
                <label className="text-sm text-gray-400 cursor-pointer" htmlFor="remember">Stay authenticated for 24 hours</label>
              </div>
            )}

            <button type="submit" disabled={loading} className="w-full mt-2 bg-[#fdb913] hover:bg-[#ffca4d] disabled:opacity-50 active:scale-[0.98] transition-all text-black font-bold py-3.5 rounded-lg flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(253,185,19,0.2)] hover:shadow-[0_0_25px_rgba(253,185,19,0.3)]">
              {loading ? (
                <div className="spinner" />
              ) : (
                <>
                  <span>{isLogin ? "Sign In" : "Initialize Profile"}</span>
                  <LogIn size={18} strokeWidth={2.5} />
                </>
              )}
            </button>
          </form>

          <div className="relative py-2">
            <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-white/5"></div></div>
            <div className="relative flex justify-center"><span className="bg-[#0f0f0f] px-4 text-gray-500 text-[10px] font-bold tracking-widest uppercase">Quick Demo Login</span></div>
          </div>

          <div className="flex gap-3">
            {([
              { role:"employee" as const, label:"Employee", Icon: User },
              { role:"manager"  as const, label:"Manager",  Icon: Shield },
              { role:"admin"    as const, label:"Admin",    Icon: Crown },
            ]).map(({ role, label, Icon }) => (
              <button key={role} onClick={() => handleDemoSwitch(role)} disabled={switchingRole !== null} className="flex-1 flex flex-col items-center gap-1.5 bg-white/5 hover:bg-white/10 border border-white/10 py-3 rounded-lg text-gray-300 hover:text-[#fdb913] hover:border-[#fdb913]/30 transition-all disabled:opacity-50 disabled:hover:bg-white/5 disabled:hover:border-white/10 disabled:hover:text-gray-300">
                {switchingRole === role
                  ? <div style={{ width:16, height:16, border:"2px solid rgba(253,185,19,0.2)", borderTopColor:"#fdb913", borderRadius:"50%", animation:"spin 0.6s linear infinite" }} />
                  : <Icon size={16} strokeWidth={2} />
                }
                <span className="text-[11px] font-bold tracking-wider uppercase">{label}</span>
              </button>
            ))}
          </div>

          <footer className="mt-4 flex flex-wrap gap-4 text-gray-600 text-[11px] font-medium justify-center md:justify-start">
            {["Security Policy", "API Documentation", "Support", "System Status"].map(link => (
              <a key={link} className="hover:text-gray-300 transition-colors" href="#">{link}</a>
            ))}
          </footer>
        </div>
      </section>
    </main>
  );
}

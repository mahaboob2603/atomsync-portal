"use client";

import { useState } from "react";
import { loginAction, signUpAction, switchDemoRole } from "@/app/actions/auth";
import { Target, Shield, Eye, EyeOff, Activity, Hub, Lock, User, Crown, LogIn, ChevronRight, CheckCircle2 } from "lucide-react";

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
    if (result?.error) {
      setError(result.error);
      setLoading(false);
    }
  }

  async function handleDemoSwitch(role: "employee" | "manager" | "admin") {
    setSwitchingRole(role);
    setError("");
    const result = await switchDemoRole(role);
    if (result?.error) {
      setError(result.error);
      setSwitchingRole(null);
    }
  }

  return (
    <main className="min-h-screen flex flex-col md:flex-row overflow-hidden bg-[#050505]">
      {/* Custom Styles for Stitch Design */}
      <style jsx global>{`
        .glass-card {
          background: rgba(255, 255, 255, 0.03);
          backdrop-filter: blur(16px);
          -webkit-backdrop-filter: blur(16px);
          border: 1px solid rgba(255, 255, 255, 0.08);
          transition: all 0.3s ease;
        }
        .glass-card:hover {
          background: rgba(255, 255, 255, 0.05);
          border-color: rgba(253, 185, 19, 0.2);
          transform: translateY(-2px);
        }
        .isometric-bg {
          background-color: #050505;
          background-image: 
            linear-gradient(30deg, #0a0a0a 12%, transparent 12.5%, transparent 87%, #0a0a0a 87.5%, #0a0a0a),
            linear-gradient(150deg, #0a0a0a 12%, transparent 12.5%, transparent 87%, #0a0a0a 87.5%, #0a0a0a),
            linear-gradient(60deg, #111111 25%, transparent 25.5%, transparent 75%, #111111 75%, #111111);
          background-size: 80px 140px;
        }
        .scan-line {
          height: 2px;
          background: linear-gradient(to right, transparent, #fdb913, transparent);
          animation: scan 4s ease-in-out infinite;
        }
        @keyframes scan {
          0%, 100% { transform: translateY(0); opacity: 0; }
          50% { opacity: 1; }
          100% { transform: translateY(40px); }
        }
        .text-glow {
          text-shadow: 0 0 20px rgba(253, 185, 19, 0.3);
        }
      `}</style>

      {/* LEFT SIDE: BRANDING */}
      <section className="relative w-full md:w-3/5 lg:w-[65%] isometric-bg flex flex-col justify-between p-8 md:p-12 min-h-[512px] md:min-h-screen border-r border-white/5">
        {/* Branding/Logo */}
        <div className="z-10 flex items-center gap-3 animate-fade-in">
          <div className="w-10 h-10 bg-[#fdb913] rounded flex items-center justify-center shadow-[0_0_20px_rgba(253,185,19,0.3)]">
            <Activity className="text-black" size={24} />
          </div>
          <h1 className="text-2xl font-black tracking-tighter text-[#fdb913]">AtomSync</h1>
        </div>

        {/* Hero Image Overlay (Subtle) */}
        <div className="absolute inset-0 z-0 opacity-10 pointer-events-none overflow-hidden">
          <img 
            alt="Industrial Tech" 
            className="w-full h-full object-cover mix-blend-overlay scale-110"
            src="https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&q=80&w=2070" 
          />
        </div>

        {/* Center Content */}
        <div className="z-10 max-w-xl animate-slide-in-left">
          <h2 className="text-5xl md:text-6xl font-bold leading-[1.1] mb-8 text-white">
            Precision in every <br />
            <span className="text-[#fdb913] text-glow italic">Synchronization</span>.
          </h2>
          
          {/* Status Cards Bento Layout */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-12">
            {/* Card 1 */}
            <div className="glass-card p-6 rounded-2xl flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold tracking-[0.2em] text-[#888] uppercase">SYSTEM RELIABILITY</span>
                <CheckCircle2 className="text-[#fdb913]" size={16} />
              </div>
              <div className="flex items-center gap-4">
                <div className="relative w-16 h-16 flex items-center justify-center">
                  <svg className="w-full h-full transform -rotate-90">
                    <circle className="text-white/5" cx="32" cy="32" r="28" stroke="currentColor" strokeWidth="4" fill="transparent" />
                    <circle className="text-[#fdb913]" cx="32" cy="32" r="28" stroke="currentColor" strokeDasharray="176" strokeDashoffset="1.76" strokeWidth="4" fill="transparent" strokeLinecap="round" />
                  </svg>
                  <span className="absolute text-[10px] font-black text-white">99.9%</span>
                </div>
                <div>
                  <p className="text-xl font-bold text-white">Operational</p>
                  <p className="text-xs text-[#666]">Global Node Status</p>
                </div>
              </div>
            </div>

            {/* Card 2 */}
            <div className="glass-card p-6 rounded-2xl flex flex-col gap-4 relative overflow-hidden">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold tracking-[0.2em] text-[#888] uppercase">PROTOCOL SECURITY</span>
                <Lock className="text-[#fdb913]" size={16} />
              </div>
              <div className="flex flex-col gap-2">
                <p className="text-xl font-bold text-white">Tier-4 Encrypted</p>
                <div className="w-full bg-white/5 h-10 rounded-lg relative overflow-hidden flex items-center px-3 border border-white/5">
                  <div className="scan-line absolute inset-x-0 w-full z-0 opacity-50"></div>
                  <div className="flex gap-1 items-end h-4 z-10">
                    <div className="w-1 h-2 bg-[#fdb913]/30 rounded-full animate-pulse"></div>
                    <div className="w-1 h-4 bg-[#fdb913]/60 rounded-full animate-pulse delay-75"></div>
                    <div className="w-1 h-3 bg-[#fdb913]/20 rounded-full animate-pulse delay-150"></div>
                    <div className="w-1 h-5 bg-[#fdb913]/80 rounded-full animate-pulse delay-200"></div>
                  </div>
                  <span className="ml-auto text-[9px] font-bold text-[#fdb913] tracking-widest uppercase z-10">ACTIVE_SCAN</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Left Footer */}
        <div className="z-10 text-[10px] font-medium text-[#444] tracking-wider uppercase">
          © 2024 AtomSync Industrial Systems. v4.2.0-Alpha. Security Clearance Required.
        </div>
      </section>

      {/* RIGHT SIDE: AUTH */}
      <section className="w-full md:w-2/5 lg:w-[35%] bg-[#080808] flex flex-col justify-center p-8 md:p-12 relative">
        <div className="w-full max-w-sm mx-auto flex flex-col gap-8 animate-slide-in-right">
          
          {/* Tab Switcher */}
          <div className="flex p-1 bg-white/5 rounded-xl border border-white/5 self-start">
            <button 
              onClick={() => { setIsLogin(true); setError(""); }}
              className={`px-6 py-2 rounded-lg text-xs font-bold transition-all ${isLogin ? 'bg-[#fdb913] text-black' : 'text-[#888] hover:text-white'}`}
            >
              Sign In
            </button>
            <button 
              onClick={() => { setIsLogin(false); setError(""); }}
              className={`px-6 py-2 rounded-lg text-xs font-bold transition-all ${!isLogin ? 'bg-[#fdb913] text-black' : 'text-[#888] hover:text-white'}`}
            >
              Register
            </button>
          </div>

          <header className="flex flex-col gap-2">
            <h3 className="text-3xl font-bold text-white tracking-tight">
              {isLogin ? "Portal Access" : "Initialize Profile"}
            </h3>
            <p className="text-[#888] text-sm">
              {isLogin ? "Enter your industrial credentials to continue." : "Join the AtomSync data grid."}
            </p>
          </header>

          {error && (
            <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl flex items-center gap-3 animate-shake">
              <div className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse"></div>
              <span className="text-red-400 text-xs font-medium">{error}</span>
            </div>
          )}

          <form action={handleSubmit} className="flex flex-col gap-6">
            {!isLogin && (
              <div className="space-y-4">
                <div className="flex flex-col gap-2">
                  <label className="text-[10px] font-bold tracking-[0.1em] text-[#888] uppercase">FULL NAME</label>
                  <div className="relative group">
                    <input 
                      name="full_name"
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3.5 text-sm text-white focus:border-[#fdb913] focus:ring-1 focus:ring-[#fdb913]/20 transition-all outline-none" 
                      placeholder="John Doe" 
                      required={!isLogin}
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex flex-col gap-2">
                    <label className="text-[10px] font-bold tracking-[0.1em] text-[#888] uppercase">ROLE</label>
                    <select name="role" className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3.5 text-sm text-white focus:border-[#fdb913] outline-none appearance-none">
                      <option value="employee">Employee</option>
                      <option value="manager">Manager</option>
                    </select>
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="text-[10px] font-bold tracking-[0.1em] text-[#888] uppercase">DEPT</label>
                    <input name="department" className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3.5 text-sm text-white focus:border-[#fdb913] outline-none" placeholder="ENG" />
                  </div>
                </div>
              </div>
            )}

            <div className="flex flex-col gap-2">
              <label className="text-[10px] font-bold tracking-[0.1em] text-[#888] uppercase">CORPORATE EMAIL</label>
              <input 
                type="email" 
                name="email"
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3.5 text-sm text-white focus:border-[#fdb913] focus:ring-1 focus:ring-[#fdb913]/20 transition-all outline-none" 
                placeholder="name@atomsync.industrial" 
                required 
              />
            </div>

            <div className="flex flex-col gap-2">
              <div className="flex justify-between items-center">
                <label className="text-[10px] font-bold tracking-[0.1em] text-[#888] uppercase">PASSWORD</label>
                {isLogin && <a className="text-[10px] font-bold text-[#fdb913] hover:underline" href="#">FORGOT?</a>}
              </div>
              <div className="relative">
                <input 
                  type={showPassword ? "text" : "password"} 
                  name="password"
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3.5 text-sm text-white focus:border-[#fdb913] focus:ring-1 focus:ring-[#fdb913]/20 transition-all outline-none pr-12" 
                  placeholder="••••••••" 
                  required 
                />
                <button 
                  type="button" 
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-[#444] hover:text-[#fdb913] transition-colors"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {isLogin && (
              <div className="flex items-center gap-3">
                <input type="checkbox" id="remember" className="w-4 h-4 rounded border-white/10 bg-white/5 text-[#fdb913] focus:ring-offset-[#080808] focus:ring-[#fdb913]" />
                <label className="text-xs text-[#666] cursor-pointer hover:text-[#888]" htmlFor="remember">Stay authenticated for 24 hours</label>
              </div>
            )}

            <button 
              type="submit" 
              disabled={loading}
              className="w-full bg-[#fdb913] hover:bg-[#ffca4d] active:scale-[0.98] disabled:opacity-50 disabled:scale-100 transition-all text-black font-black py-4 rounded-xl flex items-center justify-center gap-2 shadow-[0_10px_30px_rgba(253,185,19,0.2)]"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-black/20 border-t-black rounded-full animate-spin"></div>
              ) : (
                <>
                  <span>{isLogin ? "Sign In" : "Initialize Profile"}</span>
                  <LogIn size={18} strokeWidth={3} />
                </>
              )}
            </button>
          </form>

          {/* Quick Demo Login Section */}
          <div className="relative py-4">
            <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-white/5"></div></div>
            <div className="relative flex justify-center text-[10px] font-bold tracking-[0.2em]"><span className="bg-[#080808] px-4 text-[#444] uppercase">QUICK DEMO ACCESS</span></div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            {[
              { role: "employee" as const, label: "User", icon: User },
              { role: "manager" as const, label: "Lead", icon: Shield },
              { role: "admin" as const, label: "Admin", icon: Crown }
            ].map((btn) => (
              <button 
                key={btn.role}
                onClick={() => handleDemoSwitch(btn.role)}
                disabled={switchingRole !== null}
                className="flex flex-col items-center gap-2 p-3 bg-white/5 hover:bg-white/10 border border-white/5 hover:border-white/10 rounded-xl transition-all group"
              >
                {switchingRole === btn.role ? (
                  <div className="w-5 h-5 border-2 border-white/10 border-t-[#fdb913] rounded-full animate-spin"></div>
                ) : (
                  <btn.icon size={20} className="text-[#888] group-hover:text-[#fdb913] transition-colors" strokeWidth={1.5} />
                )}
                <span className="text-[9px] font-bold text-[#888] group-hover:text-white uppercase tracking-wider">{btn.label}</span>
              </button>
            ))}
          </div>

          <footer className="mt-8 flex flex-wrap gap-x-6 gap-y-2 text-[#444] font-bold text-[10px] justify-center md:justify-start uppercase tracking-widest">
            <a className="hover:text-[#fdb913] transition-colors" href="#">Security</a>
            <a className="hover:text-[#fdb913] transition-colors" href="#">API</a>
            <a className="hover:text-[#fdb913] transition-colors" href="#">Status</a>
            <a className="hover:text-[#fdb913] transition-colors" href="#">Support</a>
          </footer>
        </div>
      </section>

      {/* Decorative Blur Orbs */}
      <div className="absolute -top-[10%] -right-[5%] w-[400px] h-[400px] bg-[#fdb913] opacity-[0.03] blur-[120px] rounded-full pointer-events-none"></div>
      <div className="absolute -bottom-[10%] -left-[5%] w-[500px] h-[500px] bg-[#00677d] opacity-[0.03] blur-[150px] rounded-full pointer-events-none"></div>
    </main>
  );
}

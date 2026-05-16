"use client";

import { useState, useEffect } from "react";
import { loginAction, signUpAction, switchDemoRole } from "@/app/actions/auth";
import { Target, User, Shield, Crown, LogIn, ChevronRight, Eye, EyeOff, Factory, ShieldCheck, Mail, Lock, Briefcase, Building2 } from "lucide-react";

export default function LoginPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [switchingRole, setSwitchingRole] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);

  // Apply autofill fix dynamically
  useEffect(() => {
    const style = document.createElement('style');
    style.innerHTML = `
      input:-webkit-autofill,
      input:-webkit-autofill:hover, 
      input:-webkit-autofill:focus, 
      input:-webkit-autofill:active{
          -webkit-box-shadow: 0 0 0 30px #111 inset !important;
          -webkit-text-fill-color: white !important;
          transition: background-color 5000s ease-in-out 0s;
      }
    `;
    document.head.appendChild(style);
    return () => {
      document.head.removeChild(style);
    };
  }, []);

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
    <main className="min-h-screen flex flex-col md:flex-row bg-[#050505] text-white font-sans selection:bg-[#fdb913] selection:text-black">
      
      {/* Left Side: Cinematic Brand Experience */}
      <section className="relative hidden md:flex md:w-[45%] lg:w-[55%] bg-black items-center justify-center p-12 overflow-hidden border-r border-white/5">
        <div className="absolute inset-0 z-0">
          <img 
            className="w-full h-full object-cover opacity-40 mix-blend-luminosity scale-105 hover:scale-100 transition-transform duration-[10s] ease-in-out" 
            alt="Atomberg Engineering Background" 
            src="https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?q=80&w=2070&auto=format&fit=crop"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-[#050505]"></div>
        </div>
        
        <div className="relative z-10 w-full max-w-xl text-white">
          <div className="mb-12 flex items-center gap-3">
            <div className="w-12 h-12 bg-[#fdb913] rounded-xl flex items-center justify-center shadow-[0_0_30px_rgba(253,185,19,0.2)]">
              <Target className="text-black" size={26} strokeWidth={2.5} />
            </div>
            <span className="text-white font-bold text-2xl tracking-widest uppercase">AtomSync</span>
          </div>
          
          <h1 className="text-5xl lg:text-6xl font-extrabold mb-6 text-white leading-[1.1] tracking-tight">
            Engineering<br />
            <span className="text-[#fdb913]">Synchronization.</span>
          </h1>
          <p className="text-lg text-gray-400 leading-relaxed mb-12 max-w-md font-light">
            The central nervous system for your operational dashboard. Manage fleet diagnostics and team OKRs with atomic precision.
          </p>
          
          <div className="flex gap-8 border-t border-white/10 pt-8">
            <div>
              <div className="flex items-center gap-2 mb-2 text-[#fdb913]">
                <Factory size={20} />
                <span className="font-bold uppercase tracking-wider text-xs">Uptime</span>
              </div>
              <p className="text-2xl font-light">99.99%</p>
            </div>
            <div className="w-px bg-white/10"></div>
            <div>
              <div className="flex items-center gap-2 mb-2 text-[#fdb913]">
                <ShieldCheck size={20} />
                <span className="font-bold uppercase tracking-wider text-xs">Security</span>
              </div>
              <p className="text-2xl font-light">Tier-4</p>
            </div>
          </div>
        </div>
      </section>

      {/* Right Side: Premium Auth Form */}
      <section className="flex-1 flex flex-col items-center justify-center p-6 md:p-12 relative overflow-y-auto bg-[#050505]">
        
        {/* Subtle background glow */}
        <div className="absolute top-1/4 right-0 w-96 h-96 bg-[#fdb913]/5 blur-[120px] rounded-full pointer-events-none"></div>

        <div className="w-full max-w-[420px] z-10">
          
          <div className="mb-8 text-center md:text-left">
            <h2 className="text-3xl font-bold text-white mb-2 tracking-tight">
              {isLogin ? "Welcome Back" : "Initialize Profile"}
            </h2>
            <p className="text-gray-400 text-sm font-medium">
              {isLogin ? "Authenticate to access the operational network." : "Join the AtomSync data grid."}
            </p>
          </div>

          {/* Premium Tab Toggle */}
          <div className="flex p-1 bg-white/5 rounded-xl mb-8 border border-white/10">
            <button 
              type="button"
              onClick={() => { setIsLogin(true); setError(""); }}
              className={`flex-1 py-2.5 rounded-lg text-sm font-bold transition-all duration-300 ${isLogin ? 'bg-[#1a1a1a] text-white shadow-lg border border-white/10' : 'text-gray-500 hover:text-gray-300'}`}
            >
              Sign In
            </button>
            <button 
              type="button"
              onClick={() => { setIsLogin(false); setError(""); }}
              className={`flex-1 py-2.5 rounded-lg text-sm font-bold transition-all duration-300 ${!isLogin ? 'bg-[#1a1a1a] text-white shadow-lg border border-white/10' : 'text-gray-500 hover:text-gray-300'}`}
            >
              Register
            </button>
          </div>

          {error && (
            <div className="mb-6 p-4 rounded-xl text-sm font-medium bg-red-950/30 text-red-400 border border-red-900/50 flex items-center gap-3 animate-fade-in">
              <div className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse"></div>
              <span>{error}</span>
            </div>
          )}

          <form action={handleSubmit} className="space-y-5">
            {!isLogin && (
              <div className="space-y-5 animate-fade-in">
                
                {/* Full Name */}
                <div className="space-y-2">
                  <label htmlFor="full_name" className="text-xs font-semibold text-gray-400 uppercase tracking-wider block">Full Name</label>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-500 group-focus-within:text-[#fdb913] transition-colors">
                      <User size={18} />
                    </div>
                    <input
                      id="full_name"
                      name="full_name"
                      type="text"
                      placeholder="John Doe"
                      className="block w-full pl-11 pr-4 py-3.5 text-sm text-white bg-[#111] rounded-xl border border-white/10 focus:outline-none focus:border-[#fdb913] focus:ring-1 focus:ring-[#fdb913] transition-all shadow-inner placeholder:text-gray-600"
                      required={!isLogin}
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  {/* Role */}
                  <div className="space-y-2">
                    <label htmlFor="role" className="text-xs font-semibold text-gray-400 uppercase tracking-wider block">Role</label>
                    <div className="relative group">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-500 group-focus-within:text-[#fdb913] transition-colors">
                        <Briefcase size={18} />
                      </div>
                      <select 
                        id="role" 
                        name="role" 
                        className="block w-full pl-11 pr-10 py-3.5 text-sm text-white bg-[#111] rounded-xl border border-white/10 focus:outline-none focus:border-[#fdb913] focus:ring-1 focus:ring-[#fdb913] transition-all shadow-inner appearance-none cursor-pointer" 
                        required={!isLogin}
                      >
                        <option value="employee" className="bg-[#111] text-white">Employee</option>
                        <option value="manager" className="bg-[#111] text-white">Manager</option>
                      </select>
                      <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none text-gray-500">
                        <svg className="w-4 h-4 fill-current" viewBox="0 0 20 20"><path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"/></svg>
                      </div>
                    </div>
                  </div>
                  
                  {/* Department */}
                  <div className="space-y-2">
                    <label htmlFor="department" className="text-xs font-semibold text-gray-400 uppercase tracking-wider block">Department</label>
                    <div className="relative group">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-500 group-focus-within:text-[#fdb913] transition-colors">
                        <Building2 size={18} />
                      </div>
                      <input
                        id="department"
                        name="department"
                        type="text"
                        placeholder="Engineering"
                        className="block w-full pl-11 pr-4 py-3.5 text-sm text-white bg-[#111] rounded-xl border border-white/10 focus:outline-none focus:border-[#fdb913] focus:ring-1 focus:ring-[#fdb913] transition-all shadow-inner placeholder:text-gray-600"
                        required={!isLogin}
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Email */}
            <div className="space-y-2">
              <label htmlFor="email" className="text-xs font-semibold text-gray-400 uppercase tracking-wider block">Corporate Email</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-500 group-focus-within:text-[#fdb913] transition-colors">
                  <Mail size={18} />
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="name@atomsync.com"
                  className="block w-full pl-11 pr-4 py-3.5 text-sm text-white bg-[#111] rounded-xl border border-white/10 focus:outline-none focus:border-[#fdb913] focus:ring-1 focus:ring-[#fdb913] transition-all shadow-inner placeholder:text-gray-600"
                  required
                />
              </div>
            </div>

            {/* Password */}
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <label htmlFor="password" className="text-xs font-semibold text-gray-400 uppercase tracking-wider block">Password</label>
                {isLogin && <a className="text-xs font-medium text-[#fdb913] hover:text-[#ffca4d] transition-colors cursor-pointer">Forgot password?</a>}
              </div>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-500 group-focus-within:text-[#fdb913] transition-colors">
                  <Lock size={18} />
                </div>
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  className="block w-full pl-11 pr-12 py-3.5 text-sm text-white bg-[#111] rounded-xl border border-white/10 focus:outline-none focus:border-[#fdb913] focus:ring-1 focus:ring-[#fdb913] transition-all shadow-inner placeholder:text-gray-600"
                  required
                  minLength={6}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-500 hover:text-white transition-colors focus:outline-none"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {isLogin && (
              <div className="pt-2">
                <label className="flex items-center gap-3 cursor-pointer group w-fit">
                  <div className="relative flex items-center justify-center">
                    <input type="checkbox" className="peer appearance-none w-4 h-4 border border-white/20 rounded bg-white/5 focus:ring-0 checked:bg-[#fdb913] checked:border-[#fdb913] transition-all cursor-pointer" />
                    <svg className="absolute w-2.5 h-2.5 text-black opacity-0 peer-checked:opacity-100 pointer-events-none transition-opacity" viewBox="0 0 14 10" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M1 5L4.5 8.5L13 1" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                  <span className="text-sm font-medium text-gray-400 group-hover:text-white transition-colors">Remember my device</span>
                </label>
              </div>
            )}

            <button
              type="submit"
              className="group w-full bg-[#fdb913] hover:bg-[#ffca4d] text-black font-bold py-3.5 rounded-xl shadow-[0_0_15px_rgba(253,185,19,0.15)] hover:shadow-[0_0_20px_rgba(253,185,19,0.25)] active:scale-[0.98] transition-all flex justify-center items-center gap-2 mt-6 overflow-hidden relative"
              disabled={loading}
            >
              {loading ? (
                <>
                  <svg className="animate-spin h-5 w-5 text-black" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  <span className="tracking-wide text-sm">Authenticating...</span>
                </>
              ) : (
                <>
                  <span className="tracking-wide text-sm">{isLogin ? "Access Network" : "Initialize Profile"}</span>
                  <ChevronRight size={18} strokeWidth={2.5} className="group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </form>

          {/* Premium Divider */}
          <div className="mt-10 mb-6 relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-white/10"></div>
            </div>
            <div className="relative flex justify-center">
              <span className="bg-[#050505] px-4 text-[10px] font-bold uppercase tracking-[0.15em] text-gray-500">
                Quick Demo Login
              </span>
            </div>
          </div>
            
          <div className="grid grid-cols-3 gap-3">
            {[
              { role: "employee" as const, label: "Employee", icon: User },
              { role: "manager" as const, label: "Manager", icon: Shield },
              { role: "admin" as const, label: "Admin", icon: Crown },
            ].map(({ role, label, icon: Icon }) => (
              <button
                key={role}
                type="button"
                onClick={() => handleDemoSwitch(role)}
                disabled={switchingRole !== null}
                className={`flex flex-col items-center justify-center gap-2 py-3.5 rounded-xl transition-all border ${
                  switchingRole === role 
                    ? 'border-[#fdb913] bg-[#fdb913]/10 text-[#fdb913] shadow-[0_0_15px_rgba(253,185,19,0.15)]' 
                    : 'border-white/10 bg-[#111] text-gray-400 hover:border-white/20 hover:bg-white/5 hover:text-white'
                }`}
              >
                {switchingRole === role ? (
                  <svg className="animate-spin h-5 w-5 text-[#fdb913]" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                ) : (
                  <Icon size={18} strokeWidth={1.5} />
                )}
                <span className="text-[10px] font-bold uppercase tracking-wider">
                  {label}
                </span>
              </button>
            ))}
          </div>

          <div className="mt-10 text-center">
            <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">
              © 2024 AtomSync Portal. Secure Access.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}

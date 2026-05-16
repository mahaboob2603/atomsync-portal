"use client";

import { useState } from "react";
import { loginAction, signUpAction, switchDemoRole } from "@/app/actions/auth";
import { Target, User, Shield, Crown, LogIn, Zap, Eye, EyeOff, Factory, ShieldCheck, Mail, Lock, Briefcase, Building2, ChevronRight } from "lucide-react";

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
    <main className="min-h-screen flex flex-col md:flex-row bg-[#f8f9fa] text-gray-900 font-sans selection:bg-[#fdb913] selection:text-black">
      
      {/* Left Side: Cinematic Brand Experience */}
      <section className="relative hidden md:flex md:w-[45%] lg:w-[55%] bg-black items-center justify-center p-12 overflow-hidden">
        <div className="absolute inset-0 z-0">
          {/* A high-end dark industrial background */}
          <img 
            className="w-full h-full object-cover opacity-50 mix-blend-luminosity scale-105 hover:scale-100 transition-transform duration-[10s] ease-in-out" 
            alt="Atomberg Engineering Background" 
            src="https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?q=80&w=2070&auto=format&fit=crop"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black via-black/80 to-transparent"></div>
        </div>
        
        <div className="relative z-10 w-full max-w-xl text-white">
          <div className="mb-12 flex items-center gap-3">
            <div className="w-12 h-12 bg-[#fdb913] rounded-xl flex items-center justify-center shadow-[0_0_30px_rgba(253,185,19,0.3)]">
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
      <section className="flex-1 flex flex-col items-center justify-center p-6 md:p-12 relative overflow-y-auto">
        
        {/* Mobile Header */}
        <div className="absolute top-6 left-6 md:hidden flex items-center gap-2">
          <div className="w-8 h-8 bg-[#fdb913] rounded-lg flex items-center justify-center">
            <Target className="text-black" size={18} strokeWidth={2.5} />
          </div>
          <span className="font-bold text-lg text-black tracking-widest uppercase">AtomSync</span>
        </div>

        <div className="w-full max-w-[440px] mt-12 md:mt-0">
          
          <div className="mb-8">
            <h2 className="text-3xl font-extrabold text-black mb-2 tracking-tight">
              {isLogin ? "Welcome back" : "Create account"}
            </h2>
            <p className="text-gray-500 font-medium">
              {isLogin ? "Enter your credentials to access the portal." : "Join the AtomSync operational network."}
            </p>
          </div>

          {/* Premium Tab Toggle */}
          <div className="flex p-1 bg-gray-200/60 rounded-xl mb-8 shadow-inner">
            <button 
              type="button"
              onClick={() => { setIsLogin(true); setError(""); }}
              className={`flex-1 py-2.5 rounded-lg text-sm font-bold transition-all duration-300 ${isLogin ? 'bg-white text-black shadow-sm scale-100' : 'text-gray-500 hover:text-black scale-95 hover:scale-100'}`}
            >
              Sign In
            </button>
            <button 
              type="button"
              onClick={() => { setIsLogin(false); setError(""); }}
              className={`flex-1 py-2.5 rounded-lg text-sm font-bold transition-all duration-300 ${!isLogin ? 'bg-white text-black shadow-sm scale-100' : 'text-gray-500 hover:text-black scale-95 hover:scale-100'}`}
            >
              Register
            </button>
          </div>

          {error && (
            <div className="mb-6 p-4 rounded-xl text-sm font-semibold bg-red-50 text-red-600 border border-red-100 flex items-start gap-3 animate-slide-in-right">
              <Lock size={18} className="mt-0.5 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form action={handleSubmit} className="space-y-5">
            {!isLogin && (
              <div className="space-y-5 animate-fade-in">
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400 group-focus-within:text-[#fdb913] transition-colors">
                    <User size={18} />
                  </div>
                  <input
                    id="full_name"
                    name="full_name"
                    type="text"
                    placeholder="Full Name"
                    className="w-full bg-white border-2 border-gray-200 pl-11 pr-4 py-3.5 rounded-xl text-black font-medium placeholder:text-gray-400 placeholder:font-normal focus:ring-0 focus:border-[#fdb913] outline-none transition-all shadow-sm"
                    required={!isLogin}
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400 group-focus-within:text-[#fdb913] transition-colors">
                      <Briefcase size={18} />
                    </div>
                    <select 
                      id="role" 
                      name="role" 
                      className="w-full bg-white border-2 border-gray-200 pl-11 pr-10 py-3.5 rounded-xl text-black font-medium focus:ring-0 focus:border-[#fdb913] outline-none transition-all shadow-sm appearance-none cursor-pointer" 
                      required={!isLogin}
                    >
                      <option value="employee">Employee</option>
                      <option value="manager">Manager</option>
                    </select>
                    <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none text-gray-400">
                      <svg className="w-4 h-4 fill-current" viewBox="0 0 20 20"><path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"/></svg>
                    </div>
                  </div>
                  
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400 group-focus-within:text-[#fdb913] transition-colors">
                      <Building2 size={18} />
                    </div>
                    <input
                      id="department"
                      name="department"
                      type="text"
                      placeholder="Department"
                      className="w-full bg-white border-2 border-gray-200 pl-11 pr-4 py-3.5 rounded-xl text-black font-medium placeholder:text-gray-400 placeholder:font-normal focus:ring-0 focus:border-[#fdb913] outline-none transition-all shadow-sm"
                      required={!isLogin}
                    />
                  </div>
                </div>
              </div>
            )}

            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400 group-focus-within:text-[#fdb913] transition-colors">
                <Mail size={18} />
              </div>
              <input
                id="email"
                name="email"
                type="email"
                placeholder="Corporate Email"
                className="w-full bg-white border-2 border-gray-200 pl-11 pr-4 py-3.5 rounded-xl text-black font-medium placeholder:text-gray-400 placeholder:font-normal focus:ring-0 focus:border-[#fdb913] outline-none transition-all shadow-sm"
                required
              />
            </div>

            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400 group-focus-within:text-[#fdb913] transition-colors">
                <Lock size={18} />
              </div>
              <input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                className="w-full bg-white border-2 border-gray-200 pl-11 pr-12 py-3.5 rounded-xl text-black font-medium placeholder:text-gray-400 placeholder:font-normal focus:ring-0 focus:border-[#fdb913] outline-none transition-all shadow-sm"
                required
                minLength={6}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-700 transition-colors"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>

            {isLogin && (
              <div className="flex justify-between items-center px-1">
                <label className="flex items-center gap-2 cursor-pointer group">
                  <div className="relative flex items-center justify-center">
                    <input type="checkbox" className="peer appearance-none w-5 h-5 border-2 border-gray-300 rounded focus:ring-0 checked:bg-[#fdb913] checked:border-[#fdb913] transition-all cursor-pointer" />
                    <svg className="absolute w-3 h-3 text-black opacity-0 peer-checked:opacity-100 pointer-events-none transition-opacity" viewBox="0 0 14 10" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M1 5L4.5 8.5L13 1" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                  <span className="text-sm font-medium text-gray-600 group-hover:text-black transition-colors">Remember me</span>
                </label>
                <a className="text-sm font-bold text-gray-500 hover:text-black transition-colors cursor-pointer">
                  Forgot password?
                </a>
              </div>
            )}

            <button
              type="submit"
              className="group w-full bg-[#fdb913] hover:bg-[#e5a60b] text-black font-extrabold py-4 rounded-xl shadow-[0_4px_14px_rgba(253,185,19,0.3)] hover:shadow-[0_6px_20px_rgba(253,185,19,0.4)] hover:-translate-y-0.5 active:scale-[0.98] transition-all flex justify-center items-center gap-2 mt-4 overflow-hidden relative"
              disabled={loading}
            >
              {loading ? (
                <>
                  <svg className="animate-spin h-5 w-5 text-black" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Authenticating...
                </>
              ) : (
                <>
                  <span className="tracking-wide">{isLogin ? "Access Portal" : "Create Account"}</span>
                  <ChevronRight size={18} strokeWidth={3} className="group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </form>

          {/* Quick Demo Access Header - Redesigned as Premium Tags */}
          <div className="mt-10">
            <div className="flex items-center gap-4 mb-6">
              <div className="h-px bg-gray-200 flex-1"></div>
              <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400 bg-white px-2">Demo Credentials</span>
              <div className="h-px bg-gray-200 flex-1"></div>
            </div>
            
            <div className="flex flex-wrap justify-center gap-3">
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
                  className={`flex items-center gap-2 px-4 py-2 rounded-full font-bold text-xs uppercase tracking-wider transition-all border-2 ${
                    switchingRole === role 
                      ? 'border-black bg-black text-white shadow-md' 
                      : 'border-gray-200 bg-white text-gray-600 hover:border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  {switchingRole === role ? (
                    <svg className="animate-spin h-3.5 w-3.5 text-white" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                  ) : (
                    <Icon size={14} strokeWidth={2.5} />
                  )}
                  {label}
                </button>
              ))}
            </div>
          </div>

          <div className="mt-12 text-center">
            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">
              © 2024 AtomSync Portal. Secure Access.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}

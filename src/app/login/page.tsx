"use client";

import { useState } from "react";
import { loginAction, signUpAction, switchDemoRole } from "@/app/actions/auth";
import { Target, User, Shield, Crown, LogIn, UserPlus, Zap, Eye, EyeOff } from "lucide-react";

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
    <div className="min-h-screen flex items-center justify-center p-4" style={{
      background: "radial-gradient(ellipse at 30% 20%, rgba(99, 102, 241, 0.08) 0%, transparent 50%), radial-gradient(ellipse at 70% 80%, rgba(139, 92, 246, 0.06) 0%, transparent 50%), var(--background)"
    }}>
      <div className="w-full max-w-[440px] animate-fade-in">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl mb-4" style={{
            background: "linear-gradient(135deg, var(--accent), #8b5cf6)",
            boxShadow: "0 8px 32px rgba(99, 102, 241, 0.3)"
          }}>
            <Target size={32} color="white" />
          </div>
          <h1 className="text-3xl font-bold tracking-tight">AtomQuest</h1>
          <p className="text-sm mt-2" style={{ color: "var(--muted)" }}>
            Goal Setting & Tracking Portal
          </p>
        </div>

        {/* Login/Signup Card */}
        <div className="glass-card p-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold">
              {isLogin ? "Sign In" : "Create Account"}
            </h2>
            <button
              onClick={() => {
                setIsLogin(!isLogin);
                setError("");
              }}
              className="text-sm text-indigo-500 hover:underline"
            >
              {isLogin ? "Need an account?" : "Already have an account?"}
            </button>
          </div>

          {error && (
            <div className="mb-4 p-3 rounded-lg text-sm" style={{
              background: "var(--danger-bg)",
              color: "var(--danger)",
              border: "1px solid rgba(239, 68, 68, 0.2)"
            }}>
              {error}
            </div>
          )}

          <form action={handleSubmit} className="space-y-4">
            {!isLogin && (
              <>
                <div>
                  <label className="label" htmlFor="full_name">Full Name</label>
                  <input
                    id="full_name"
                    name="full_name"
                    type="text"
                    placeholder="John Doe"
                    className="input"
                    required={!isLogin}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="label" htmlFor="role">Role</label>
                    <select id="role" name="role" className="input" required={!isLogin}>
                      <option value="employee">Employee</option>
                      <option value="manager">Manager</option>
                    </select>
                  </div>
                  <div>
                    <label className="label" htmlFor="department">Department</label>
                    <input
                      id="department"
                      name="department"
                      type="text"
                      placeholder="e.g. Engineering"
                      className="input"
                      required={!isLogin}
                    />
                  </div>
                </div>
              </>
            )}

            <div>
              <label className="label" htmlFor="email">Email</label>
              <input
                id="email"
                name="email"
                type="email"
                placeholder="you@company.com"
                className="input"
                required
              />
            </div>

            <div>
              <label className="label" htmlFor="password">Password</label>
              <div className="relative">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  className="input"
                  style={{ paddingRight: "40px" }}
                  required
                  minLength={6}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2"
                  style={{ color: "var(--muted)" }}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="btn btn-primary w-full btn-lg mt-2"
              disabled={loading}
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  {isLogin ? "Signing in..." : "Creating account..."}
                </span>
              ) : (
                <span className="flex items-center justify-center gap-2">
                  {isLogin ? <LogIn size={18} /> : <UserPlus size={18} />}
                  {isLogin ? "Sign In" : "Sign Up"}
                </span>
              )}
            </button>
          </form>
        </div>

        {/* Demo Role Switcher */}
        <div className="glass-card p-6 mt-4">
          <div className="flex items-center gap-2 mb-4">
            <Zap size={16} style={{ color: "var(--accent-light)" }} />
            <span className="text-sm font-medium">Quick Demo Access</span>
          </div>
          <div className="grid grid-cols-3 gap-3">
            {[
              { role: "employee" as const, label: "Employee", icon: User, color: "var(--info)" },
              { role: "manager" as const, label: "Manager", icon: Shield, color: "var(--warning)" },
              { role: "admin" as const, label: "Admin", icon: Crown, color: "#a855f7" },
            ].map(({ role, label, icon: Icon, color }) => (
              <button
                key={role}
                onClick={() => handleDemoSwitch(role)}
                disabled={switchingRole !== null}
                className="flex flex-col items-center gap-2 p-4 rounded-xl transition-all hover:scale-[1.02]"
                style={{
                  background: switchingRole === role ? `${color}15` : "var(--card)",
                  border: `1px solid ${switchingRole === role ? color : "var(--border)"}`,
                }}
              >
                <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{
                  background: `${color}15`,
                }}>
                  <Icon size={20} style={{ color }} />
                </div>
                <span className="text-xs font-medium">{label}</span>
                {switchingRole === role && (
                  <svg className="animate-spin h-3 w-3" style={{ color }} viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                )}
              </button>
            ))}
          </div>
        </div>

        <p className="text-center text-xs mt-6" style={{ color: "var(--muted-foreground)" }}>
          AtomQuest Hackathon 1.0 • Built with Next.js & Supabase
        </p>
      </div>
    </div>
  );
}

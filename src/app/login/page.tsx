"use client";

import { useState } from "react";
import { loginAction, signUpAction, switchDemoRole } from "@/app/actions/auth";
import { Target, User, Shield, Crown, ChevronRight, Eye, EyeOff } from "lucide-react";

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
    <main className="login-shell">
      {/* Left Panel: Cinematic Brand */}
      <section className="login-brand-panel">
        <div className="login-brand-bg">
          <img
            className="login-brand-img"
            alt="Atomberg Engineering"
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuDjr_cbxinEExfAg1n4vQgj7Vy0Jt3muIUfMHWrfZ16C5p8mVuBIv9WJKAu28YPScTNp_fWPT9914S5WBWD-N2IZ0IwXrxSJcySnbVezDvMRGqnmZ3Nb4crPR9PENZtnQlXfE3Jan5FuGopBh13CJDJAQynwhd3CF8Q_Q4AmtUvDAKOl5O16fqwCA4AoAc1-_3aexcAxnohstv1HkZKmEjBpacW0FuIpN8jL_Pmv9OAqjUxxe7uJ-vgjEPcLPxyaZgGm3HXCpzOTfYZ"
          />
          <div className="login-brand-overlay"></div>
        </div>
        <div className="login-brand-content">
          <div className="login-brand-logo">
            <div className="login-logo-icon">
              <Target color="#000" size={26} strokeWidth={2.5} />
            </div>
            <span className="login-logo-text">AtomSync</span>
          </div>
          <h1 className="login-brand-title">
            Precision in every <span className="login-gold">Synchronization</span>.
          </h1>
          <p className="login-brand-desc">
            Welcome to the central portal for high-performance engineering data and collaborative industrial intelligence. Manage fleet diagnostics with atomic precision.
          </p>
          <div className="login-stats-row">
            <div className="login-stat-card">
              <span className="login-stat-icon">⚙️</span>
              <h3 className="login-stat-label">RELIABILITY</h3>
              <p className="login-stat-value">99.9% Uptime</p>
            </div>
            <div className="login-stat-card">
              <span className="login-stat-icon">🔐</span>
              <h3 className="login-stat-label">SECURITY</h3>
              <p className="login-stat-value">Tier-4 Encrypted</p>
            </div>
          </div>
        </div>
      </section>

      {/* Right Panel: Clean Auth Form */}
      <section className="login-form-panel">
        <div className="login-form-wrapper">
          {/* Tab Toggle */}
          <div className="login-tab-bar">
            <button
              type="button"
              onClick={() => { setIsLogin(true); setError(""); }}
              className={`login-tab ${isLogin ? "login-tab-active" : ""}`}
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={() => { setIsLogin(false); setError(""); }}
              className={`login-tab ${!isLogin ? "login-tab-active" : ""}`}
            >
              Register
            </button>
          </div>

          {/* Header */}
          <div className="login-form-header">
            <h2 className="login-form-title">
              {isLogin ? "Portal Access" : "Initialize Profile"}
            </h2>
            <p className="login-form-subtitle">
              {isLogin
                ? "Enter your enterprise credentials to continue."
                : "Join the AtomSync data grid."}
            </p>
          </div>

          {error && (
            <div className="login-error">
              <div className="login-error-dot"></div>
              <span>{error}</span>
            </div>
          )}

          <form action={handleSubmit} className="login-form">
            {!isLogin && (
              <div className="login-reg-fields">
                <div className="login-field">
                  <label htmlFor="full_name" className="login-label">Full Name</label>
                  <input
                    id="full_name"
                    name="full_name"
                    type="text"
                    placeholder="John Doe"
                    className="login-input"
                    required={!isLogin}
                  />
                </div>
                <div className="login-field-row">
                  <div className="login-field">
                    <label htmlFor="role" className="login-label">Role</label>
                    <select id="role" name="role" className="login-input login-select" required={!isLogin}>
                      <option value="employee">Employee</option>
                      <option value="manager">Manager</option>
                    </select>
                  </div>
                  <div className="login-field">
                    <label htmlFor="department" className="login-label">Department</label>
                    <input
                      id="department"
                      name="department"
                      type="text"
                      placeholder="Engineering"
                      className="login-input"
                      required={!isLogin}
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Email */}
            <div className="login-field">
              <label htmlFor="email" className="login-label">Corporate Email</label>
              <input
                id="email"
                name="email"
                type="email"
                placeholder="name@atomsync.com"
                className="login-input"
                required
              />
            </div>

            {/* Password */}
            <div className="login-field">
              <div className="login-label-row">
                <label htmlFor="password" className="login-label">Password</label>
                {isLogin && (
                  <a className="login-forgot" href="#">Forgot?</a>
                )}
              </div>
              <div className="login-password-wrap">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  className="login-input"
                  required
                  minLength={6}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="login-eye-btn"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {isLogin && (
              <div className="login-remember">
                <input type="checkbox" id="remember" className="login-checkbox" />
                <label htmlFor="remember" className="login-remember-text">Remember this workstation</label>
              </div>
            )}

            <button type="submit" className="login-submit" disabled={loading}>
              {loading ? (
                <>
                  <svg className="login-spinner" viewBox="0 0 24 24">
                    <circle className="login-spinner-bg" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="login-spinner-fg" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  <span>Authenticating...</span>
                </>
              ) : (
                <>
                  <span>{isLogin ? "Sign In" : "Initialize Profile"}</span>
                  <ChevronRight size={18} strokeWidth={2.5} />
                </>
              )}
            </button>
          </form>

          {/* Demo Divider */}
          <div className="login-divider">
            <div className="login-divider-line"></div>
            <span className="login-divider-text">Quick Demo Login</span>
          </div>

          <div className="login-demo-grid">
            {([
              { role: "employee" as const, label: "Employee", icon: User },
              { role: "manager" as const, label: "Manager", icon: Shield },
              { role: "admin" as const, label: "Admin", icon: Crown },
            ]).map(({ role, label, icon: Icon }) => (
              <button
                key={role}
                type="button"
                onClick={() => handleDemoSwitch(role)}
                disabled={switchingRole !== null}
                className={`login-demo-btn ${switchingRole === role ? "login-demo-active" : ""}`}
              >
                {switchingRole === role ? (
                  <svg className="login-spinner" viewBox="0 0 24 24">
                    <circle className="login-spinner-bg" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="login-spinner-fg" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                ) : (
                  <Icon size={18} strokeWidth={1.5} />
                )}
                <span className="login-demo-label">{label}</span>
              </button>
            ))}
          </div>

          <div className="login-footer">
            <p>Engineering Precision © 2024 AtomSync Portal.</p>
            <p>Authorized access only. Subject to monitoring.</p>
          </div>
        </div>
      </section>

      {/* Ambient Glows */}
      <div className="login-glow login-glow-gold"></div>
      <div className="login-glow login-glow-teal"></div>

      <style jsx>{`
        /* ======= SHELL ======= */
        .login-shell {
          min-height: 100vh;
          display: flex;
          flex-direction: row;
          background: #0a0a0a;
          color: #fff;
          font-family: 'Inter', system-ui, sans-serif;
        }

        /* ======= LEFT BRAND PANEL ======= */
        .login-brand-panel {
          display: none;
          position: relative;
          width: 55%;
          align-items: center;
          justify-content: center;
          padding: 3rem;
          overflow: hidden;
        }
        @media (min-width: 768px) {
          .login-brand-panel { display: flex; }
        }
        .login-brand-bg {
          position: absolute;
          inset: 0;
          z-index: 0;
        }
        .login-brand-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          opacity: 0.5;
          filter: grayscale(0.3);
        }
        .login-brand-overlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(135deg, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.4) 50%, rgba(10,10,10,1) 100%);
        }
        .login-brand-content {
          position: relative;
          z-index: 10;
          max-width: 520px;
        }
        .login-brand-logo {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          margin-bottom: 2.5rem;
        }
        .login-logo-icon {
          width: 48px;
          height: 48px;
          background: #fdb913;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 0 30px rgba(253,185,19,0.2);
        }
        .login-logo-text {
          font-weight: 800;
          font-size: 1.5rem;
          letter-spacing: 0.15em;
          text-transform: uppercase;
          color: #fff;
        }
        .login-brand-title {
          font-size: clamp(2.2rem, 4vw, 3.2rem);
          font-weight: 800;
          line-height: 1.1;
          margin-bottom: 1.5rem;
          color: #fff;
          letter-spacing: -0.02em;
        }
        .login-gold { color: #fdb913; }
        .login-brand-desc {
          font-size: 1rem;
          color: #999;
          line-height: 1.7;
          margin-bottom: 2.5rem;
        }
        .login-stats-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1rem;
        }
        .login-stat-card {
          padding: 1.25rem;
          background: rgba(255,255,255,0.04);
          backdrop-filter: blur(12px);
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 12px;
        }
        .login-stat-icon { font-size: 1.2rem; display: block; margin-bottom: 0.5rem; }
        .login-stat-label {
          font-size: 0.65rem;
          font-weight: 700;
          letter-spacing: 0.1em;
          color: #fdb913;
          margin-bottom: 0.25rem;
        }
        .login-stat-value { font-size: 0.85rem; color: #ccc; }

        /* ======= RIGHT FORM PANEL ======= */
        .login-form-panel {
          flex: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 2rem;
          background: #0a0a0a;
          position: relative;
          overflow-y: auto;
        }
        .login-form-wrapper {
          width: 100%;
          max-width: 440px;
          z-index: 10;
        }

        /* Tab Bar */
        .login-tab-bar {
          display: flex;
          padding: 4px;
          background: rgba(255,255,255,0.05);
          border-radius: 12px;
          margin-bottom: 2rem;
          border: 1px solid rgba(255,255,255,0.08);
        }
        .login-tab {
          flex: 1;
          padding: 0.65rem 1rem;
          border-radius: 10px;
          font-size: 0.8rem;
          font-weight: 700;
          letter-spacing: 0.03em;
          color: #666;
          background: none;
          border: none;
          cursor: pointer;
          transition: all 0.3s;
        }
        .login-tab:hover { color: #aaa; }
        .login-tab-active {
          background: #1a1a1a;
          color: #fff;
          box-shadow: 0 2px 8px rgba(0,0,0,0.3);
          border: 1px solid rgba(255,255,255,0.08);
        }

        /* Form Header */
        .login-form-header { margin-bottom: 1.75rem; }
        .login-form-title {
          font-size: 1.75rem;
          font-weight: 800;
          color: #fff;
          margin: 0 0 0.5rem 0;
          letter-spacing: -0.02em;
        }
        .login-form-subtitle {
          font-size: 0.9rem;
          color: #777;
          margin: 0;
        }

        /* Error */
        .login-error {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          padding: 0.85rem 1rem;
          margin-bottom: 1.25rem;
          border-radius: 12px;
          background: rgba(220,38,38,0.08);
          border: 1px solid rgba(220,38,38,0.2);
          color: #f87171;
          font-size: 0.85rem;
          font-weight: 500;
        }
        .login-error-dot {
          width: 6px; height: 6px;
          border-radius: 50%;
          background: #ef4444;
          animation: pulse 2s infinite;
          flex-shrink: 0;
        }

        /* Form Fields */
        .login-form { display: flex; flex-direction: column; gap: 1.25rem; }
        .login-reg-fields { display: flex; flex-direction: column; gap: 1.25rem; }
        .login-field { display: flex; flex-direction: column; gap: 0.5rem; }
        .login-field-row { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; }
        .login-label {
          font-size: 0.7rem;
          font-weight: 700;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          color: #888;
          display: block;
        }
        .login-label-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        .login-forgot {
          font-size: 0.7rem;
          font-weight: 700;
          letter-spacing: 0.03em;
          color: #fdb913;
          text-decoration: none;
          transition: color 0.2s;
        }
        .login-forgot:hover { color: #ffca4d; }

        /* Clean Inputs - NO icons inside */
        .login-input {
          width: 100%;
          padding: 0.85rem 1rem;
          font-size: 0.9rem;
          color: #fff;
          background: #111;
          border: 1px solid rgba(255,255,255,0.1);
          border-radius: 10px;
          outline: none;
          transition: all 0.25s ease;
          font-family: inherit;
          box-sizing: border-box;
        }
        .login-input::placeholder { color: #444; }
        .login-input:focus {
          border-color: #fdb913;
          box-shadow: 0 0 0 3px rgba(253,185,19,0.1);
        }
        .login-input:-webkit-autofill,
        .login-input:-webkit-autofill:hover,
        .login-input:-webkit-autofill:focus {
          -webkit-box-shadow: 0 0 0 30px #111 inset !important;
          -webkit-text-fill-color: #fff !important;
          transition: background-color 5000s ease-in-out 0s;
          border-color: rgba(255,255,255,0.1);
        }
        .login-select {
          appearance: none;
          cursor: pointer;
          background-image: url("data:image/svg+xml,%3Csvg width='12' height='8' viewBox='0 0 12 8' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M1 1.5L6 6.5L11 1.5' stroke='%23666' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E");
          background-repeat: no-repeat;
          background-position: right 1rem center;
          padding-right: 2.5rem;
        }
        .login-select option { background: #111; color: #fff; }

        /* Password wrapper */
        .login-password-wrap { position: relative; }
        .login-password-wrap .login-input { padding-right: 3rem; }
        .login-eye-btn {
          position: absolute;
          top: 50%;
          right: 0.85rem;
          transform: translateY(-50%);
          background: none;
          border: none;
          color: #555;
          cursor: pointer;
          padding: 4px;
          transition: color 0.2s;
          display: flex;
          align-items: center;
        }
        .login-eye-btn:hover { color: #fff; }

        /* Remember */
        .login-remember {
          display: flex;
          align-items: center;
          gap: 0.65rem;
        }
        .login-checkbox {
          width: 16px; height: 16px;
          border-radius: 4px;
          border: 1px solid rgba(255,255,255,0.2);
          background: rgba(255,255,255,0.04);
          accent-color: #fdb913;
          cursor: pointer;
        }
        .login-remember-text {
          font-size: 0.85rem;
          color: #888;
          cursor: pointer;
        }

        /* Submit */
        .login-submit {
          width: 100%;
          padding: 0.9rem 1.5rem;
          margin-top: 0.5rem;
          font-size: 0.9rem;
          font-weight: 700;
          letter-spacing: 0.02em;
          color: #000;
          background: #fdb913;
          border: none;
          border-radius: 12px;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          transition: all 0.25s;
          box-shadow: 0 0 20px rgba(253,185,19,0.12);
        }
        .login-submit:hover {
          background: #ffca4d;
          box-shadow: 0 0 30px rgba(253,185,19,0.2);
        }
        .login-submit:active { transform: scale(0.98); }
        .login-submit:disabled { opacity: 0.7; cursor: wait; }

        /* Divider */
        .login-divider {
          position: relative;
          margin: 2rem 0 1.5rem;
          text-align: center;
        }
        .login-divider-line {
          position: absolute;
          top: 50%;
          left: 0; right: 0;
          height: 1px;
          background: rgba(255,255,255,0.08);
        }
        .login-divider-text {
          position: relative;
          background: #0a0a0a;
          padding: 0 1rem;
          font-size: 0.6rem;
          font-weight: 700;
          letter-spacing: 0.15em;
          text-transform: uppercase;
          color: #555;
        }

        /* Demo Buttons */
        .login-demo-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 0.75rem;
        }
        .login-demo-btn {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          padding: 0.85rem 0.5rem;
          border-radius: 12px;
          border: 1px solid rgba(255,255,255,0.08);
          background: #111;
          color: #777;
          cursor: pointer;
          transition: all 0.25s;
          font-family: inherit;
        }
        .login-demo-btn:hover {
          border-color: rgba(255,255,255,0.15);
          background: rgba(255,255,255,0.04);
          color: #fff;
        }
        .login-demo-active {
          border-color: #fdb913 !important;
          background: rgba(253,185,19,0.08) !important;
          color: #fdb913 !important;
          box-shadow: 0 0 15px rgba(253,185,19,0.1);
        }
        .login-demo-label {
          font-size: 0.6rem;
          font-weight: 700;
          letter-spacing: 0.1em;
          text-transform: uppercase;
        }

        /* Footer */
        .login-footer {
          margin-top: 2rem;
          text-align: center;
        }
        .login-footer p {
          font-size: 0.6rem;
          color: #444;
          font-weight: 600;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          margin: 0;
          line-height: 1.8;
        }

        /* Ambient Glows */
        .login-glow {
          position: fixed;
          border-radius: 50%;
          pointer-events: none;
          z-index: 0;
        }
        .login-glow-gold {
          top: -200px; right: -200px;
          width: 500px; height: 500px;
          background: rgba(253,185,19,0.06);
          filter: blur(120px);
        }
        .login-glow-teal {
          bottom: -200px; left: -200px;
          width: 400px; height: 400px;
          background: rgba(0,180,220,0.04);
          filter: blur(100px);
        }

        /* Spinner */
        .login-spinner {
          width: 20px; height: 20px;
          animation: spin 1s linear infinite;
        }
        .login-spinner-bg { opacity: 0.25; }
        .login-spinner-fg { opacity: 0.75; }

        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.4; } }

        /* Mobile */
        @media (max-width: 767px) {
          .login-form-panel { padding: 1.5rem; }
          .login-field-row { grid-template-columns: 1fr; }
        }
      `}</style>
    </main>
  );
}

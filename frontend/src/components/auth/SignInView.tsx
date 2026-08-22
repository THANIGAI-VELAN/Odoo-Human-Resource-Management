'use client';

import React, { useState } from 'react';

interface SignInViewProps {
  onSignInSuccess: (role: 'super_admin' | 'hr_admin' | 'employee', userKey: string) => void;
  onCancel?: () => void;
}

export const SignInView: React.FC<SignInViewProps> = ({ onSignInSuccess, onCancel }) => {
  const [email, setEmail] = useState('arjun.desai@dayflow.internal');
  const [password, setPassword] = useState('••••••••');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [loading, setLoading] = useState(false);

  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg(null);

    try {
      const formData = new URLSearchParams();
      formData.append('username', email);
      formData.append('password', password === '••••••••' ? 'demopassword123' : password);

      const res = await fetch('http://localhost:8000/api/v1/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: formData
      });

      if (res.ok) {
        const data = await res.json();
        localStorage.setItem('auth_token', data.access_token);
        localStorage.setItem('auth_email', email);
        if (email.includes('admin') || email.includes('sarah')) {
          onSignInSuccess('super_admin', 'admin');
        } else {
          onSignInSuccess('employee', 'arjun');
        }
      } else {
        const err = await res.json();
        setErrorMsg(err.detail || 'Incorrect email or password.');
      }
    } catch (err) {
      console.error(err);
      setErrorMsg('Could not connect to authentication server.');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickLogin = async (role: 'super_admin' | 'hr_admin' | 'employee', userKey: string, demoEmail: string) => {
    setEmail(demoEmail);
    setPassword('demopassword123');
    setLoading(true);
    setErrorMsg(null);

    try {
      const formData = new URLSearchParams();
      formData.append('username', demoEmail);
      formData.append('password', 'demopassword123');

      const res = await fetch('http://localhost:8000/api/v1/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: formData
      });

      if (res.ok) {
        const data = await res.json();
        localStorage.setItem('auth_token', data.access_token);
        localStorage.setItem('auth_email', demoEmail);
        onSignInSuccess(role, userKey);
      } else {
        const err = await res.json();
        setErrorMsg(err.detail || 'Failed to authenticate quick persona.');
      }
    } catch (err) {
      console.error(err);
      setErrorMsg('Could not connect to authentication server.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#faf8ff] flex flex-col justify-center items-center p-4 sm:p-6 relative">
      {/* Background soft geometric accents */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-[#d9e2ff]/40 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-[#90efef]/20 rounded-full blur-3xl pointer-events-none"></div>

      {onCancel && (
        <button
          onClick={onCancel}
          className="absolute top-6 left-6 flex items-center gap-1.5 text-xs font-semibold text-[#003c90] hover:underline"
        >
          <span className="material-symbols-outlined text-[18px]">arrow_back</span>
          <span>Back to App</span>
        </button>
      )}

      {/* Main Container */}
      <div className="w-full max-w-md bg-white border border-[#E5E7EB] rounded-2xl shadow-xl p-8 relative z-10">
        {/* Brand Header */}
        <div className="text-center mb-6">
          <div className="w-12 h-12 rounded-xl bg-[#003c90] text-white flex items-center justify-center mx-auto mb-3 shadow-md">
            <span className="material-symbols-outlined text-[28px]" data-fill="1">
              corporate_fare
            </span>
          </div>
          <h1 className="text-2xl font-bold text-[#003c90] tracking-tight">Dayflow</h1>
          <p className="text-xs font-semibold text-[#737784] tracking-widest uppercase mt-0.5">HR Management</p>
        </div>

        {/* Card Title */}
        <div className="text-center mb-6">
          <h2 className="text-xl font-bold text-[#191b22]">Sign In</h2>
          <p className="text-xs text-[#434653] mt-1">Access your workforce management portal</p>
        </div>

        {errorMsg && (
          <div className="mb-4 p-3 bg-red-50 border border-red-150 rounded-xl text-xs font-semibold text-red-700">
            {errorMsg}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-[#191b22] uppercase tracking-wider mb-1.5">
              Email / Login ID
            </label>
            <div className="relative">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[#737784] text-[20px]">
                mail
              </span>
              <input
                type="text"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@company.com"
                className="w-full pl-10 pr-4 py-2.5 bg-white border border-[#E5E7EB] rounded-lg text-sm text-[#191b22] focus:outline-none focus:border-[#003c90] focus:ring-1 focus:ring-[#003c90] transition-colors"
              />
            </div>
          </div>

          <div>
            <div className="flex justify-between items-center mb-1.5">
              <label className="text-xs font-bold text-[#191b22] uppercase tracking-wider">Password</label>
              <a
                href="#forgot"
                onClick={(e) => {
                  e.preventDefault();
                  alert('Password reset instructions sent to registered internal email.');
                }}
                className="text-xs font-semibold text-[#003c90] hover:underline"
              >
                Forgot Password?
              </a>
            </div>
            <div className="relative">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[#737784] text-[20px]">
                lock
              </span>
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-10 pr-10 py-2.5 bg-white border border-[#E5E7EB] rounded-lg text-sm text-[#191b22] focus:outline-none focus:border-[#003c90] focus:ring-1 focus:ring-[#003c90] transition-colors"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#737784] hover:text-[#191b22]"
              >
                <span className="material-symbols-outlined text-[18px]">
                  {showPassword ? 'visibility_off' : 'visibility'}
                </span>
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between pt-1">
            <label className="flex items-center gap-2 text-xs text-[#434653] cursor-pointer">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="w-4 h-4 text-[#003c90] rounded border-gray-300 focus:ring-[#003c90]"
              />
              <span>Remember ID</span>
            </label>
            <span className="text-[11px] font-mono text-[#737784]">v2.4.0 (Enterprise)</span>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-[#003c90] hover:bg-[#0f52ba] text-white font-bold text-sm rounded-lg transition-all shadow-md active:scale-98 flex items-center justify-center gap-2"
          >
            {loading ? (
              <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
            ) : (
              <>
                <span>Sign In</span>
                <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
              </>
            )}
          </button>
        </form>

        {/* Demo Fast Logins */}
        <div className="mt-6 pt-5 border-t border-[#E5E7EB]">
          <p className="text-[11px] font-mono font-bold text-[#737784] uppercase tracking-wider text-center mb-3">
            Quick Persona Logins
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            <button
              onClick={() => handleQuickLogin('super_admin', 'admin', 'admin@dayflow.internal')}
              className="p-2 bg-[#f3f3fc] hover:bg-[#e7e7f1] border border-[#E5E7EB] rounded-lg text-left transition-colors"
            >
              <div className="flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[16px] text-[#003c90]">admin_panel_settings</span>
                <span className="text-xs font-bold text-[#191b22]">HR Director</span>
              </div>
              <p className="text-[10px] text-[#737784]">Full Admin & Salary Mode</p>
            </button>

            <button
              onClick={() => handleQuickLogin('employee', 'arjun', 'arjun.desai@dayflow.internal')}
              className="p-2 bg-[#f3f3fc] hover:bg-[#e7e7f1] border border-[#E5E7EB] rounded-lg text-left transition-colors"
            >
              <div className="flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[16px] text-[#003c90]">person</span>
                <span className="text-xs font-bold text-[#191b22]">Arjun Desai</span>
              </div>
              <p className="text-[10px] text-[#737784]">Senior Software Engineer</p>
            </button>
          </div>
        </div>
      </div>

      {/* Footer info */}
      <div className="mt-6 text-center text-xs text-[#737784] flex items-center gap-2">
        <span className="material-symbols-outlined text-sm text-[#22C55E]">verified_user</span>
        <span>Secured with 256-bit enterprise token encryption & RBAC</span>
      </div>
    </div>
  );
};

'use client';

import React, { useState } from 'react';

interface SignInViewProps {
  onSignInSuccess: (role: 'super_admin' | 'hr_admin' | 'employee', userKey: string, loginId?: string, email?: string) => void;
  onCancel?: () => void;
}

export const SignInView: React.FC<SignInViewProps> = ({ onSignInSuccess, onCancel }) => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Sign up fields
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phone, setPhone] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg(null);
    setSuccessMsg(null);

    try {
      const formData = new URLSearchParams();
      formData.append('username', email);
      formData.append('password', password);

      const res = await fetch('http://localhost:8000/api/v1/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: formData
      });

      if (res.ok) {
        const data = await res.json();
        localStorage.setItem('auth_token', data.access_token);
        localStorage.setItem('auth_email', data.email || email);
        localStorage.setItem('auth_login_id', data.login_id || '');
        localStorage.setItem('auth_role', data.role || 'Employee');
        localStorage.setItem('auth_employee_id', data.employee_id || '');

        const mappedRole = (data.role === 'Admin' || data.role === 'HR Super Admin') ? 'super_admin' : 'employee';
        onSignInSuccess(mappedRole, data.login_id || 'employee', data.login_id, data.email);
      } else {
        const err = await res.json();
        setErrorMsg(err.detail || 'Incorrect Login ID/email or password.');
      }
    } catch (err) {
      console.error(err);
      setErrorMsg('Could not connect to authentication server.');
    } finally {
      setLoading(false);
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setErrorMsg('Passwords do not match.');
      return;
    }

    setLoading(true);
    setErrorMsg(null);
    setSuccessMsg(null);

    try {
      const payload = {
        first_name: firstName,
        last_name: lastName,
        email: email,
        phone: phone || null,
        password: password,
        confirm_password: confirmPassword,
        role: email.includes('admin') ? 'Admin' : 'Employee',
        year_of_joining: new Date().getFullYear()
      };

      const res = await fetch('http://localhost:8000/api/v1/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        const data = await res.json();
        setSuccessMsg(`Account created! Your automatically generated Login ID is: ${data.login_id}. Please use this ID to sign in.`);
        setIsSignUp(false);
        setEmail(data.login_id);
        setPassword('');
        setConfirmPassword('');
      } else {
        const err = await res.json();
        setErrorMsg(err.detail || 'Failed to sign up.');
      }
    } catch (err) {
      console.error(err);
      setErrorMsg('Could not connect to authentication server.');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickLogin = async (role: 'super_admin' | 'hr_admin' | 'employee', userKey: string, demoEmail: string) => {
    setLoading(true);
    setErrorMsg(null);
    setSuccessMsg(null);

    try {
      const formData = new URLSearchParams();
      formData.append('username', demoEmail);
      formData.append('password', 'password123');

      const res = await fetch('http://localhost:8000/api/v1/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: formData
      });

      if (res.ok) {
        const data = await res.json();
        localStorage.setItem('auth_token', data.access_token);
        localStorage.setItem('auth_email', data.email || demoEmail);
        localStorage.setItem('auth_login_id', data.login_id || '');
        localStorage.setItem('auth_role', data.role || 'Employee');
        localStorage.setItem('auth_employee_id', data.employee_id || '');

        onSignInSuccess(role, userKey, data.login_id, data.email);
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
          <h1 className="text-2xl font-bold text-[#003c90] tracking-tight">Odoo India</h1>
          <p className="text-xs font-semibold text-[#737784] tracking-widest uppercase mt-0.5">HR Management System</p>
        </div>

        {/* Card Title */}
        <div className="text-center mb-6">
          <h2 className="text-xl font-bold text-[#191b22]">{isSignUp ? 'Sign Up' : 'Sign In'}</h2>
          <p className="text-xs text-[#434653] mt-1">
            {isSignUp ? 'Enroll yourself in the employee directory' : 'Access your workforce management portal'}
          </p>
        </div>

        {errorMsg && (
          <div className="mb-4 p-3 bg-red-50 border border-red-150 rounded-xl text-xs font-semibold text-red-700">
            {errorMsg}
          </div>
        )}

        {successMsg && (
          <div className="mb-4 p-3 bg-green-50 border border-green-150 rounded-xl text-xs font-semibold text-green-700">
            {successMsg}
          </div>
        )}

        {/* Forms */}
        {!isSignUp ? (
          <form onSubmit={handleSignIn} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-[#191b22] uppercase tracking-wider mb-1.5">
                Login ID / Email
              </label>
              <div className="relative">
                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[#737784] text-[20px]">
                  person
                </span>
                <input
                  type="text"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="e.g. OIARDE20220001 or email@odoo.internal"
                  className="w-full pl-10 pr-4 py-2.5 bg-white border border-[#E5E7EB] rounded-lg text-sm text-[#191b22] focus:outline-none focus:border-[#003c90] focus:ring-1 focus:ring-[#003c90] transition-colors"
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-1.5">
                <label className="text-xs font-bold text-[#191b22] uppercase tracking-wider">Password</label>
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
              <span className="text-[11px] font-mono text-[#737784]">v3.0.0 (Enterprise)</span>
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

            <div className="text-center pt-2">
              <p className="text-xs text-[#434653]">
                Don't have an account?{' '}
                <button
                  type="button"
                  onClick={() => {
                    setIsSignUp(true);
                    setErrorMsg(null);
                    setSuccessMsg(null);
                  }}
                  className="font-bold text-[#003c90] hover:underline"
                >
                  Sign Up
                </button>
              </p>
            </div>
          </form>
        ) : (
          <form onSubmit={handleSignUp} className="space-y-3.5">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-[#191b22] uppercase tracking-wider mb-1">
                  First Name
                </label>
                <input
                  type="text"
                  required
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  placeholder="John"
                  className="w-full px-3 py-2 bg-white border border-[#E5E7EB] rounded-lg text-sm text-[#191b22] focus:outline-none focus:border-[#003c90]"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-[#191b22] uppercase tracking-wider mb-1">
                  Last Name
                </label>
                <input
                  type="text"
                  required
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  placeholder="Doe"
                  className="w-full px-3 py-2 bg-white border border-[#E5E7EB] rounded-lg text-sm text-[#191b22] focus:outline-none focus:border-[#003c90]"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#191b22] uppercase tracking-wider mb-1">
                Email Address
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="john.doe@odoo.internal"
                className="w-full px-3 py-2 bg-white border border-[#E5E7EB] rounded-lg text-sm text-[#191b22] focus:outline-none focus:border-[#003c90]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#191b22] uppercase tracking-wider mb-1">
                Phone / Mobile
              </label>
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+91 98765 43210"
                className="w-full px-3 py-2 bg-white border border-[#E5E7EB] rounded-lg text-sm text-[#191b22] focus:outline-none focus:border-[#003c90]"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-[#191b22] uppercase tracking-wider mb-1">
                  Password
                </label>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-3 py-2 bg-white border border-[#E5E7EB] rounded-lg text-sm text-[#191b22] focus:outline-none focus:border-[#003c90]"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-[#191b22] uppercase tracking-wider mb-1">
                  Confirm
                </label>
                <input
                  type="password"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-3 py-2 bg-white border border-[#E5E7EB] rounded-lg text-sm text-[#191b22] focus:outline-none focus:border-[#003c90]"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 bg-[#003c90] hover:bg-[#0f52ba] text-white font-bold text-sm rounded-lg transition-all shadow-md mt-2"
            >
              {loading ? (
                <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin inline-block"></span>
              ) : (
                'Sign Up & Generate Login ID'
              )}
            </button>

            <div className="text-center pt-1">
              <p className="text-xs text-[#434653]">
                Already have an account?{' '}
                <button
                  type="button"
                  onClick={() => {
                    setIsSignUp(false);
                    setErrorMsg(null);
                    setSuccessMsg(null);
                  }}
                  className="font-bold text-[#003c90] hover:underline"
                >
                  Sign In
                </button>
              </p>
            </div>
          </form>
        )}

        {/* Demo Fast Logins */}
        <div className="mt-5 pt-4 border-t border-[#E5E7EB]">
          <p className="text-[11px] font-mono font-bold text-[#737784] uppercase tracking-wider text-center mb-2">
            Quick Persona Logins
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            <button
              onClick={() => handleQuickLogin('super_admin', 'admin', 'sarah.jenkins@odoo.internal')}
              className="p-2 bg-[#f3f3fc] hover:bg-[#e7e7f1] border border-[#E5E7EB] rounded-lg text-left transition-colors"
            >
              <div className="flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[16px] text-[#003c90]">admin_panel_settings</span>
                <span className="text-xs font-bold text-[#191b22]">HR Director</span>
              </div>
              <p className="text-[10px] text-[#737784]">Sarah Jenkins (Admin)</p>
            </button>

            <button
              onClick={() => handleQuickLogin('employee', 'arjun', 'arjun.desai@odoo.internal')}
              className="p-2 bg-[#f3f3fc] hover:bg-[#e7e7f1] border border-[#E5E7EB] rounded-lg text-left transition-colors"
            >
              <div className="flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[16px] text-[#003c90]">person</span>
                <span className="text-xs font-bold text-[#191b22]">Arjun Desai</span>
              </div>
              <p className="text-[10px] text-[#737784]">OIARDE20220001 (Emp)</p>
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

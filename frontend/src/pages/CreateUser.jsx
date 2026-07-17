import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function CreateUser({ onRegisterSuccess, onBackToLogin }) {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [role, setRole] = useState('user'); // Defaulting role to 'user'
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    if (password !== confirmPassword) {
      setErrorMsg('Verification keys do not match.');
      return;
    }

    setIsLoading(true);

    // Retrieve active token from storage to pass backend authentication
    const adminToken = localStorage.getItem('token');

    try {
      const response = await fetch('http://localhost:8000/user/create/', {
        method: 'POST',
        credentials: 'include',  
        headers: {
          'Content-Type': 'application/json',
          // Fixes 401 Unauthorized
        },
        body: JSON.stringify({ username, password, role }),
      });

      const contentType = response.headers.get("content-type");
      let data = {};
      if (contentType && contentType.includes("application/json")) {
        data = await response.json();
      } else {
        throw new Error("Server returned an invalid response.");
      }

      if (!response.ok) {
        throw new Error(data.detail || 'Could not initialize profile. User ID might be taken.');
      }

      setSuccessMsg('Profile successfully established.');
      
      setTimeout(() => {
        if (onRegisterSuccess) {
          onRegisterSuccess(data);
        } else if (onBackToLogin) {
          onBackToLogin();
        } else {
          navigate('/dashboard'); // Fallback routing
        }
      }, 1500);

    } catch (err) {
      setErrorMsg(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    if (onBackToLogin) {
      onBackToLogin();
    } else {
      navigate(-1); // Returns back to previous view (dashboard)
    }
  };

  return (
    <div className="relative min-h-screen bg-white text-slate-900 flex items-center justify-center overflow-hidden font-mono select-none">
      
      {/* BACKGROUND WATERMARK */}
      <div className="absolute inset-5 flex items-center justify-center pointer-events-none z-0">
        <h1 className="text-[25vw] md:text-[30vw] font-black tracking-tighter text-emerald-80/80 font-sans leading-none select-none">
          ADMIN
        </h1>
      </div>

      {/* Retro matrix cyber-grid effect overlay (Light Mode Green) */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#f0fdf4_2px,transparent_2px),linear-gradient(to_bottom,#f0fdf4_2px,transparent_2px)] bg-[size:4rem_4rem] pointer-events-none opacity-80 z-0"></div>

      {/* Cyberpunk container card (White theme) */}
      <div className="relative w-full max-w-md mx-4 bg-white border-2 border-emerald-500 rounded-none p-8 shadow-[0_0_30px_rgba(16,185,129,0.1)] z-10">
        
        {/* Terminal Header */}
        <div className="flex items-center justify-between border-b-2 border-emerald-500 pb-4 mb-6">
          <div className="flex items-center gap-2">
            <span className="h-3 w-3 rounded-full bg-emerald-500 animate-pulse"></span>
            <span className="text-emerald-600 font-bold tracking-widest text-sm">ADMIN_PROVISION.EXE</span>
          </div>
          <span className="text-xs text-slate-400 font-bold">V1.0.0</span>
        </div>

        <h2 className="text-2xl font-black text-slate-900 uppercase tracking-wider mb-2">
          Provision User
        </h2>

        {errorMsg && (
          <div className="mb-6 p-3 bg-red-50 border border-red-500 text-red-600 text-xs font-semibold uppercase tracking-wide">
            [ERROR]: {errorMsg}
          </div>
        )}

        {successMsg && (
          <div className="mb-6 p-3 bg-emerald-50 border border-emerald-500 text-emerald-600 text-xs font-semibold uppercase tracking-wide">
            [SUCCESS]: {successMsg}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Username Input Box */}
          <div>
            <label className="block text-emerald-700 text-xs font-bold uppercase tracking-widest mb-1.5">
              Target User ID
            </label>
            <input
              type="text"
              placeholder="e.g. recruit_operator"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-4 py-2.5 bg-white border border-emerald-200 focus:border-emerald-500 text-slate-900 rounded-none focus:outline-none focus:ring-0 placeholder-slate-300 text-sm transition-colors"
              required
            />
          </div>

          {/* Role Selection Drop-Down */}
          <div>
            <label className="block text-emerald-700 text-xs font-bold uppercase tracking-widest mb-1.5">
              System Authorization level
            </label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="w-full px-4 py-2.5 bg-white border border-emerald-200 focus:border-emerald-500 text-slate-900 rounded-none focus:outline-none focus:ring-0 text-sm transition-colors cursor-pointer"
            >
              <option value="user" className="bg-white text-slate-900">STANDARD_OPERATOR (USER)</option>
              <option value="admin" className="bg-white text-slate-900">ROOT_ADMINISTRATOR (ADMIN)</option>
            </select>
          </div>

          {/* Password Input Box */}
          <div>
            <label className="block text-emerald-700 text-xs font-bold uppercase tracking-widest mb-1.5">
              Verification Key
            </label>
            <input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2.5 bg-white border border-emerald-200 focus:border-emerald-500 text-slate-900 rounded-none focus:outline-none focus:ring-0 placeholder-slate-300 text-sm transition-colors"
              required
            />
          </div>

          {/* Confirm Password Input Box */}
          <div>
            <label className="block text-emerald-700 text-xs font-bold uppercase tracking-widest mb-1.5">
              Confirm Verification Key
            </label>
            <input
              type="password"
              placeholder="••••••••"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full px-4 py-2.5 bg-white border border-emerald-200 focus:border-emerald-500 text-slate-900 rounded-none focus:outline-none focus:ring-0 placeholder-slate-300 text-sm transition-colors"
              required
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 bg-emerald-500 hover:bg-emerald-400 active:bg-slate-900 active:text-white text-white font-extrabold uppercase tracking-widest text-xs transition-colors duration-150 disabled:opacity-50 disabled:pointer-events-none shadow-[0_4px_14px_rgba(16,185,129,0.2)] mt-2"
          >
            {isLoading ? 'Compiling Security clearance...' : 'Provision Access'}
          </button>
        </form>

        {/* Back to Admin Panel Link */}
        <div className="mt-5 text-center border-t border-emerald-100 pt-3">
          <button
            onClick={handleCancel}
            type="button"
            className="text-[11px] text-emerald-600 hover:text-emerald-500 transition-colors uppercase tracking-widest font-bold focus:outline-none"
          >
            [ Cancel / Abort Operation ]
          </button>
        </div>

        {/* Footer styling detail */}
        <div className="mt-4 text-center">
          <p className="text-[10px] text-slate-400 tracking-widest uppercase">
            System network restricted. Unauthorized trace is active.
          </p>
        </div>
      </div>
    </div>
  );
}
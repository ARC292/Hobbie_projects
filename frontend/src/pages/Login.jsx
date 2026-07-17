import React, { useState } from 'react';

// Added onCreateUserClick to handle navigation/switching
export default function Login({ onLogin, onLoginSuccess, onCreateUserClick }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setIsLoading(true);

    try {
      const response = await fetch('http://localhost:8000/user/login/', {
    method: 'POST',
    credentials: 'include',
    headers: {
        'Content-Type': 'application/json',
    },
    body: JSON.stringify({ username, password }),
});
      const contentType = response.headers.get("content-type");
      let data = {};

      if (contentType && contentType.includes("application/json")) {
        data = await response.json();
      } else {
        throw new Error("Server returned an invalid response.");
      }

      if (!response.ok) {
        throw new Error(data.detail || 'Invalid credentials provided.');
      }

      // No localStorage or sessionStorage.
      // Cookies are handled automatically by the browser.

      // Execute whichever login callback prop the parent App is using
if (onLoginSuccess) {
    onLoginSuccess(data);
} else if (onLogin) {
    onLogin(data);
}

    } catch (err) {
      setErrorMsg(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen bg-black text-white flex items-center justify-center overflow-hidden font-mono select-none">

      <div className="absolute inset-5 flex items-center justify-center pointer-events-none z-0">
        <h1 className="text-[28vw] md:text-[35vw] font-black tracking-tighter text-emerald-950/900 font-sans leading-none select-none">
          JWT
        </h1>
      </div>

      <div className="absolute inset-0 bg-[linear-gradient(to_right,#022c22_1px,transparent_1px),linear-gradient(to_bottom,#022c22_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] pointer-events-none opacity-40 z-0"></div>

      <div className="relative w-full max-w-md mx-4 bg-black/85 border-2 border-emerald-500 rounded-none p-8 shadow-[0_0_30px_rgba(16,185,129,0.15)] z-10 backdrop-blur-sm">

        <div className="flex items-center justify-between border-b-2 border-emerald-500 pb-4 mb-6">
          <div className="flex items-center gap-2">
            <span className="h-3 w-3 rounded-full bg-emerald-500 animate-pulse"></span>
            <span className="text-emerald-400 font-bold tracking-widest text-sm">
              AUTH_GATE.EXE
            </span>
          </div>
          <span className="text-xs text-emerald-600 font-bold">V1.0.0</span>
        </div>

        <h2 className="text-2xl font-black text-white uppercase tracking-wider mb-2">
          Secure Access
        </h2>

        {errorMsg && (
          <div className="mb-6 p-3 bg-red-950/40 border border-red-600 text-red-400 text-xs font-semibold uppercase tracking-wide">
            [ERROR]: {errorMsg}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-emerald-400 text-xs font-bold uppercase tracking-widest mb-2">
              User ID / Account
            </label>

            <input
              type="text"
              placeholder="e.g. admin_operator"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-4 py-3 bg-black border border-emerald-800 focus:border-emerald-400 text-white rounded-none focus:outline-none placeholder-emerald-950 text-sm"
              required
            />
          </div>

          <div>
            <label className="block text-emerald-400 text-xs font-bold uppercase tracking-widest mb-2">
              Verification Key
            </label>

            <input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 bg-black border border-emerald-800 focus:border-emerald-400 text-white rounded-none focus:outline-none placeholder-emerald-950 text-sm"
              required
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3.5 bg-emerald-500 hover:bg-emerald-400 active:bg-white active:text-black text-black font-extrabold uppercase tracking-widest text-xs transition-colors duration-150 disabled:opacity-50"
          >
            {isLoading ? 'Decrypting Session...' : 'Establish Connection'}
          </button>
        </form>

        <div className="mt-6 text-center border-t border-emerald-950 pt-4">
          <button
            onClick={onCreateUserClick}
            type="button"
            className="text-xs text-emerald-400 hover:text-emerald-300 uppercase tracking-widest font-bold"
          >
            [ Request New Access Profile ]
          </button>
        </div>

        <div className="mt-6 text-center">
          <p className="text-[10px] text-emerald-700 tracking-widest uppercase">
            System network restricted. Unauthorized trace is active.
          </p>
        </div>

      </div>
    </div>
  );
}
import React, { useState, useEffect } from 'react';

export default function UserDashboard({ user, onLogout, onUserUpdate }) {
  const [email, setEmail] = useState(user.email || '');
  const [phone, setPhone] = useState(user.phone || '');
  const [updateMsg, setUpdateMsg] = useState({ type: '', text: '' });

  // Sync state if user prop updates from the parent
  useEffect(() => {
    if (user) {
      setEmail(user.email || '');
      setPhone(user.phone || '');
    }
  }, [user]);

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    setUpdateMsg({ type: '', text: '' });

    try {
      const response = await fetch(`http://localhost:8000/user/update/${user.id}/`, {
        method: 'PATCH',
        credentials: "include",
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, phone })
      });

      const contentType = response.headers.get("content-type");
      let data = {};
      if (contentType && contentType.includes("application/json")) {
        data = await response.json();
      } else {
        throw new Error(`Server returned unexpected layout (${response.status})`);
      }

      if (!response.ok) throw new Error(data.detail || 'Could not update data.');

      // Safely pass the updated user data back up to parent state
      if (data.user) {
        onUserUpdate(data.user);
      } else {
        // Fallback: merge changes manually if backend returns a success message
        onUserUpdate({ ...user, email, phone });
      }

      setUpdateMsg({ type: 'success', text: 'Profile updated successfully!' });
    } catch (err) {
      setUpdateMsg({ type: 'error', text: err.message });
    }
  };

  return (
    <div className="min-h-screen bg-black text-neutral-100">
      <header className="border-b border-neutral-900 bg-neutral-950/80 backdrop-blur px-6 py-4 flex justify-between items-center">
        <h1 className="text-xl font-bold tracking-tight text-emerald-400 font-mono">My Workspace</h1>
        <button 
          onClick={onLogout}
          className="px-3.5 py-1.5 bg-neutral-900 hover:bg-red-950/40 hover:text-red-400 border border-neutral-800 hover:border-red-900 rounded-lg text-xs font-medium transition"
        >
          Sign Out
        </button>
      </header>

      <main className="p-6 max-w-2xl mx-auto mt-12">
        <div className="bg-neutral-950 border border-neutral-900 rounded-2xl p-8 shadow-2xl space-y-6">
          <div className="border-b border-neutral-900 pb-5">
            <h2 className="text-2xl font-bold text-white mb-1">User Account Details</h2>
            <p className="text-sm text-neutral-500 font-mono">Status: Connected</p>
          </div>

          {/* System metadata cards */}
          <div className="grid grid-cols-2 gap-4 bg-black p-4 rounded-xl border border-neutral-900">
            <div>
              <span className="text-neutral-600 text-xs uppercase tracking-wider block mb-1">Database ID</span>
              <span className="font-mono text-neutral-300 text-sm">{user.id}</span>
            </div>
            <div>
              <span className="text-neutral-600 text-xs uppercase tracking-wider block mb-1">System Role</span>
              <span className="text-emerald-400 font-bold text-sm uppercase">{user.role}</span>
            </div>
          </div>

          {/* Status Message Area */}
          {updateMsg.text && (
            <div className={`p-4 rounded-lg text-xs font-bold uppercase tracking-wider text-center border ${
              updateMsg.type === 'success' 
                ? 'bg-emerald-950/20 border-emerald-500/30 text-emerald-400' 
                : 'bg-red-950/20 border-red-500/30 text-red-400'
            }`}>
              [{updateMsg.type === 'success' ? 'SUCCESS' : 'ERROR'}]: {updateMsg.text}
            </div>
          )}

          {/* Settings Form */}
          <form onSubmit={handleProfileUpdate} className="space-y-4 pt-2">
            <div className="flex flex-col gap-1.5 py-2.5 border-b border-neutral-900/60">
              <span className="text-neutral-400 text-sm font-medium">Username</span>
              <span className="text-neutral-500 text-sm select-all">{user.username}</span>
            </div>

            <div className="flex flex-col gap-1.5 py-2.5 border-b border-neutral-900/60">
              <label className="text-neutral-400 text-sm font-medium">Email Address</label>
              <input 
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-3 py-2 bg-neutral-900 border border-neutral-800 rounded-lg text-sm text-neutral-200 focus:outline-none focus:border-emerald-500 transition-colors"
              />
            </div>

            <div className="flex flex-col gap-1.5 py-2.5 border-b border-neutral-900/60">
              <label className="text-neutral-400 text-sm font-medium">Phone Number</label>
              <input 
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="No phone registered"
                className="w-full px-3 py-2 bg-neutral-900 border border-neutral-800 rounded-lg text-sm text-neutral-200 focus:outline-none focus:border-emerald-500 transition-colors"
              />
            </div>

            <button 
              type="submit" 
              className="w-full mt-4 py-2.5 bg-emerald-500 hover:bg-emerald-400 active:bg-emerald-600 text-black font-bold rounded-lg text-xs uppercase tracking-wider transition duration-150 shadow-[0_4px_12px_rgba(16,185,129,0.15)]"
            >
              Update Profile Information
            </button>
          </form>

        </div>
      </main>
    </div>
  );
}
import React from 'react';

export default function UserDashboard({ user, onLogout }) {
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

          <div className="space-y-4">
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

            <div className="space-y-3 px-1">
              <div className="flex justify-between border-b border-neutral-900/60 py-2.5">
                <span className="text-neutral-400 text-sm font-medium">Username</span>
                <span className="text-neutral-200 text-sm">{user.username}</span>
              </div>
              <div className="flex justify-between border-b border-neutral-900/60 py-2.5">
                <span className="text-neutral-400 text-sm font-medium">Email Address</span>
                <span className="text-neutral-200 text-sm">{user.email || 'No email registered'}</span>
              </div>
              <div className="flex justify-between border-b border-neutral-900/60 py-2.5">
                <span className="text-neutral-400 text-sm font-medium">Phone Number</span>
                <span className="text-neutral-200 text-sm">{user.phone || 'No phone registered'}</span>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
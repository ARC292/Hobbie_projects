import React, { useState, useEffect } from 'react'; // 👈 IMPORTED useEffect TO PREVENT CRASH
import { useNavigate } from 'react-router-dom';

export default function AdminDashboard({ user, onLogout, onUserUpdate }) {
  const navigate = useNavigate();
  const [email, setEmail] = useState(user.email || '');
  const [phone, setPhone] = useState(user.phone || '');
  const [updateMsg, setUpdateMsg] = useState({ type: '', text: '' });

  const [searchId, setSearchId] = useState('');
  const [searchedUser, setSearchedUser] = useState(null);
  const [searchError, setSearchError] = useState('');

  // Listen for user prop updates and update local form inputs
  useEffect(() => {
    if (user) {
      setEmail(user.email || '');
      setPhone(user.phone || '');
    }
  }, [user]);

  // Cleaned and de-duplicated handler
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

      // Safely pass the updated user data back up to your parent state
      if (data.user) {
        onUserUpdate(data.user); 
      } else {
        // Fallback: merge changes manually if backend returns a success message instead of the full object
        onUserUpdate({ ...user, email, phone });
      }
      
      setUpdateMsg({ type: 'success', text: 'Admin profile updated successfully!' });
    } catch (err) {
      setUpdateMsg({ type: 'error', text: err.message });
    }
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    setSearchError('');
    setSearchedUser(null);

    if (!searchId.trim()) return;

    try {
      const response = await fetch(`http://localhost:8000/user/userdata/${searchId}/`, {
        credentials: "include",
        headers: {
          'Content-Type': 'application/json'
        }
      });

      const contentType = response.headers.get("content-type");
      let data = {};
      if (contentType && contentType.includes("application/json")) {
        data = await response.json();
      } else {
        throw new Error(`Session expired or server error (Status: ${response.status}). Try logging in again.`);
      }

      if (!response.ok) {
        throw new Error(data.detail || data.error || 'User entry not found');
      }

      const targetUser = data["user data"] ? data["user data"] : data;
      setSearchedUser(targetUser);
    } catch (err) {
      setSearchError(err.message);
    }
  };

  return (
    <div className="min-h-screen bg-white text-slate-900 pb-12 font-mono relative select-none">
      
      {/* Combined Background Container (Z-0) */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
        {/* 1. Large Watermark Text */}
        <div className="absolute inset-0 flex items-center justify-center">
          <h1 className="text-[25vw] md:text-[30vw] font-black tracking-tighter text-emerald-70/75 font-sans leading-none select-none">
            ADMIN
          </h1>
        </div>
        {/* 2. Grid Overlay */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#f0fdf4_2px,transparent_2px),linear-gradient(to_bottom,#f0fdf4_2px,transparent_2px)] bg-[size:4rem_4rem] opacity-80"></div>
      </div>
      
      {/* Header with White/Green Terminal Aesthetic */}
      <header className="relative border-b-2 border-emerald-500 bg-white/95 backdrop-blur px-6 py-4 flex justify-between items-center z-10 shadow-[0_2px_15px_rgba(16,185,129,0.05)]">
        <div className="flex items-center gap-3">
          <span className="h-3.5 w-3.5 rounded-full bg-emerald-500 animate-pulse"></span>
          <h1 className="text-xl font-black text-emerald-600 tracking-tight">ADMIN_TERMINAL.EXE</h1>
        </div>
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate('/register')}
            className="px-4 py-1.5 bg-emerald-500 hover:bg-emerald-400 text-white border-2 border-emerald-600 font-bold text-xs uppercase tracking-wider transition duration-150 shadow-[0_2px_8px_rgba(16,185,129,0.2)]"
          >
            + Create New User
          </button>
          <button
            onClick={async () => {
              await fetch("http://localhost:8000/user/logout/", {
                method: "POST",
                credentials: "include",
              });
              onLogout();
              navigate("/login");
            }}
            className="px-4 py-1.5 bg-white hover:bg-red-50 hover:text-red-600 border-2 border-red-600 text-red-500 font-bold text-xs uppercase tracking-wider transition"
          >
            Disconnect
          </button>
        </div>
      </header>

      {/* Main Panel Content */}
      <main className="relative p-6 max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8 z-10">
        
        {/* Profile Details (Admin Settings Card) */}
        <section className="bg-white border-2 border-emerald-500 rounded-none p-6 shadow-[0_0_25px_rgba(16,185,129,0.08)] space-y-6">
          <div className="border-b border-emerald-100 pb-4">
            <h2 className="text-xl font-black text-emerald-600 uppercase tracking-wide">Admin Credentials</h2>
            <p className="text-xs text-slate-400 mt-1">Operator Profile: ID {user.id}</p>
          </div>

          <div className="p-4 bg-emerald-50/30 rounded-none border border-emerald-200 space-y-2 text-sm">
            <p><span className="text-emerald-700 font-bold uppercase tracking-wider text-xs">Ident_Name:</span> <span className="text-slate-800 font-semibold">{user.username}</span></p>
            <p><span className="text-emerald-700 font-bold uppercase tracking-wider text-xs">Auth_Level:</span> <span className="text-emerald-600 font-bold uppercase">{user.role}</span></p>
          </div>

          <form onSubmit={handleProfileUpdate} className="space-y-4 pt-4 border-t-2 border-emerald-500">
            <h3 className="text-sm font-bold text-emerald-600 uppercase tracking-wider">Modify Security Fields</h3>

            {updateMsg.text && (
              <div className={`p-3 text-xs font-bold uppercase tracking-wider text-center ${updateMsg.type === 'success' ? 'bg-emerald-50 border border-emerald-500 text-emerald-600' : 'bg-red-50 border border-red-500 text-red-600'}`}>
                [{updateMsg.type === 'success' ? 'SUCCESS' : 'ERROR'}]: {updateMsg.text}
              </div>
            )}

            <div>
              <label className="block text-emerald-700 text-xs font-bold uppercase tracking-widest mb-1.5">Secure Email</label>
              <input 
                type="email" 
                className="w-full px-4 py-2.5 bg-white border border-emerald-200 focus:border-emerald-500 text-slate-900 rounded-none focus:outline-none focus:ring-0 text-sm transition-colors"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div>
              <label className="block text-emerald-700 text-xs font-bold uppercase tracking-widest mb-1.5">Comm Line (Phone)</label>
              <input 
                type="text" 
                className="w-full px-4 py-2.5 bg-white border border-emerald-200 focus:border-emerald-500 text-slate-900 rounded-none focus:outline-none focus:ring-0 text-sm transition-colors"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
            </div>

            <button type="submit" className="w-full py-3 bg-emerald-500 hover:bg-emerald-400 active:bg-slate-900 active:text-white text-black font-extrabold uppercase tracking-widest text-xs transition duration-150 shadow-[0_4px_14px_rgba(16,185,129,0.2)]">
              Commit Database Changes
            </button>
          </form>
        </section>

        {/* Database Search Area */}
        <section className="bg-white border-2 border-emerald-500 rounded-none p-6 shadow-[0_0_25px_rgba(16,185,129,0.08)] space-y-6">
          <div className="border-b border-emerald-100 pb-4">
            <h2 className="text-xl font-black text-emerald-600 uppercase tracking-wide">Registry Lookup</h2>
            <p className="text-xs text-slate-400 mt-1">Retrieve active nodes across internal cluster</p>
          </div>

          <form onSubmit={handleSearch} className="flex gap-2">
            <input 
              type="number" 
              placeholder="Query User ID..."
              className="flex-1 px-4 py-2.5 bg-white border border-emerald-200 focus:border-emerald-500 text-slate-900 rounded-none focus:outline-none focus:ring-0 text-sm transition-colors"
              value={searchId}
              onChange={(e) => setSearchId(e.target.value)}
              required
            />
            <button type="submit" className="px-6 bg-emerald-500 hover:bg-emerald-400 text-black font-extrabold uppercase tracking-widest text-xs transition border-2 border-emerald-500">
              Query
            </button>
          </form>

          {searchError && (
            <div className="p-4 bg-red-50 border border-red-500 text-red-600 text-xs font-bold uppercase tracking-wider text-center">
              [CRITICAL ERROR]: {searchError}
            </div>
          )}

          {searchedUser ? (
            <div className="p-5 bg-emerald-50/20 border border-emerald-500 rounded-none space-y-3">
              <div className="flex justify-between items-center border-b border-emerald-200 pb-3">
                <span className="text-xs font-bold text-emerald-700 uppercase tracking-widest">Registry Element Matches</span>
                <span className="px-3 py-0.5 border-2 border-emerald-600 text-emerald-700 text-xs font-black uppercase">
                  {searchedUser.role || 'user'}
                </span>
              </div>
              
              <div className="grid grid-cols-2 gap-4 text-xs">
                <div>
                  <span className="text-emerald-700 block font-bold uppercase tracking-widest mb-1">ID</span>
                  <span className="font-bold text-slate-800 text-sm">{searchedUser.id}</span>
                </div>
                <div>
                  <span className="text-emerald-700 block font-bold uppercase tracking-widest mb-1">User Handle</span>
                  <span className="text-slate-800 text-sm font-semibold">{searchedUser.username}</span>
                </div>
                <div>
                  <span className="text-emerald-700 block font-bold uppercase tracking-widest mb-1">Email Node</span>
                  <span className="text-slate-800 text-sm">{searchedUser.email || 'None Registered'}</span>
                </div>
                <div>
                  <span className="text-emerald-700 block font-bold uppercase tracking-widest mb-1">Comm Line</span>
                  <span className="text-slate-800 text-sm">{searchedUser.phone || 'None Registered'}</span>
                </div>
              </div>
            </div>
          ) : (
            <div className="h-44 flex flex-col items-center justify-center border-2 border-dashed border-emerald-200 rounded-none text-slate-400 text-xs uppercase tracking-widest text-center space-y-2">
              <span className="h-2 w-2 rounded-full bg-emerald-300"></span>
              <p>System idle. Request database indexing via query field.</p>
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
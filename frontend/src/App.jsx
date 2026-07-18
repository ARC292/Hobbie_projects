import React, { useState, useEffect } from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useNavigate,
} from 'react-router-dom';

import Login from "./pages/Login";
import AdminDashboard from "./pages/AdminDashboard";
import UserDashboard from "./pages/UserDashboard";
import CreateUser from "./pages/CreateUser";

function LoginWrapper({ handleLogin }) {
  const navigate = useNavigate();

  return (
    <Login
      onLogin={handleLogin}
      onCreateUserClick={() => navigate("/register")}
    />
  );
}

function CreateUserWrapper() {
  const navigate = useNavigate();

  return (
    <CreateUser
      onBackToLogin={() => navigate("/admin")}
      onRegisterSuccess={() => navigate("/admin")}
    />
  );
}

// 🌟 THE FIX: ProtectedRoute is now defined OUTSIDE the App component!
const ProtectedRoute = ({ children, allowedRoles, user }) => {
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  const userRole = user.role;

  if (allowedRoles && !allowedRoles.includes(userRole)) {
    return (
      <Navigate
        to={userRole === "admin" ? "/admin" : "/dashboard"}
        replace
      />
    );
  }

  return children;
};

export default function App() {
  const [user, setUser] = useState(() => {
    const savedUser = sessionStorage.getItem("user");

    try {
      return savedUser ? JSON.parse(savedUser) : null;
    } catch {
      sessionStorage.removeItem("user");
      return null;
    }
  });

  // Login
  const handleLogin = (userData) => {
    setUser(userData);
    sessionStorage.setItem("user", JSON.stringify(userData));
  };

  // Logout
  const handleLogout = async () => {
    try {
      await fetch("http://localhost:8000/user/logout/", {
        method: "POST",
        credentials: "include",
      });
    } catch (err) {
      console.log(err);
    }

    setUser(null);
    sessionStorage.removeItem("user");
  };

  // Update user
  const handleUserUpdate = (updatedUser) => {
    setUser(updatedUser);
    sessionStorage.setItem("user", JSON.stringify(updatedUser));
  };

  return (
    <Router>
      <Routes>

        <Route
          path="/login"
          element={
            user ? (
              <Navigate
                to={user.role === "admin" ? "/admin" : "/dashboard"}
                replace
              />
            ) : (
              <LoginWrapper handleLogin={handleLogin} />
            )
          }
        />

        <Route
          path="/register"
          element={
            <ProtectedRoute allowedRoles={["admin"]} user={user}>
              <CreateUserWrapper />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin"
          element={
            <ProtectedRoute allowedRoles={["admin"]} user={user}>
              <AdminDashboard
                user={user}
                onLogout={handleLogout}
                onUserUpdate={handleUserUpdate}
              />
            </ProtectedRoute>
          }
        />

        <Route
          path="/dashboard"
          element={
            <ProtectedRoute allowedRoles={["user"]} user={user}>
              <UserDashboard
                user={user}
                onLogout={handleLogout}
                onUserUpdate={handleUserUpdate}
              />
            </ProtectedRoute>
          }
        />

        <Route
          path="*"
          element={<Navigate to="/login" replace />}
        />

      </Routes>
    </Router>
  );
}
import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Login        from "../pages/Login";
import Signup       from "../pages/Signup";
import Dashboard    from "../pages/Dashboard";
import Patients     from "../pages/Patients";
import Doctors      from "../pages/Doctors";
import Appointments from "../pages/Appointments";
import Billing      from "../pages/Billing";
import Inventory    from "../pages/Inventory";

// Check token exists AND is not the old skip-auth dummy
function isAuthenticated() {
  const token = localStorage.getItem("token");
  return !!token && token !== "skip-auth";
}

function Protected({ children }) {
  if (!isAuthenticated()) {
    return <Navigate to="/login" replace />;
  }
  return children;
}

function PublicOnly({ children }) {
  // If already logged in, redirect away from login/signup
  if (isAuthenticated()) {
    return <Navigate to="/" replace />;
  }
  return children;
}

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/login"  element={<PublicOnly><Login /></PublicOnly>} />
      <Route path="/signup" element={<PublicOnly><Signup /></PublicOnly>} />

      <Route path="/"             element={<Protected><Dashboard /></Protected>} />
      <Route path="/patients"     element={<Protected><Patients /></Protected>} />
      <Route path="/doctors"      element={<Protected><Doctors /></Protected>} />
      <Route path="/appointments" element={<Protected><Appointments /></Protected>} />
      <Route path="/billing"      element={<Protected><Billing /></Protected>} />
      <Route path="/inventory"    element={<Protected><Inventory /></Protected>} />

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Login         from "../pages/Login";
import Signup        from "../pages/Signup";
import Dashboard     from "../pages/Dashboard";
import Patients      from "../pages/Patients";
import Doctors       from "../pages/Doctors";
import Nurses        from "../pages/Nurses";
import Appointments  from "../pages/Appointments";
import Billing       from "../pages/Billing";
import Inventory     from "../pages/Inventory";
import Diagnosis     from "../pages/Diagnosis";
import Prescriptions from "../pages/Prescriptions";

function isAuthenticated() {
  const token = localStorage.getItem("token");
  return !!token && token !== "skip-auth";
}

function Protected({ children }) {
  return isAuthenticated() ? children : <Navigate to="/login" replace />;
}

function PublicOnly({ children }) {
  return isAuthenticated() ? <Navigate to="/" replace /> : children;
}

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/login"  element={<PublicOnly><Login /></PublicOnly>} />
      <Route path="/signup" element={<PublicOnly><Signup /></PublicOnly>} />

      <Route path="/"               element={<Protected><Dashboard /></Protected>} />
      <Route path="/patients"       element={<Protected><Patients /></Protected>} />
      <Route path="/doctors"        element={<Protected><Doctors /></Protected>} />
      <Route path="/nurses"         element={<Protected><Nurses /></Protected>} />
      <Route path="/appointments"   element={<Protected><Appointments /></Protected>} />
      <Route path="/diagnoses"      element={<Protected><Diagnosis /></Protected>} />
      <Route path="/prescriptions"  element={<Protected><Prescriptions /></Protected>} />
      <Route path="/billing"        element={<Protected><Billing /></Protected>} />
      <Route path="/inventory"      element={<Protected><Inventory /></Protected>} />

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

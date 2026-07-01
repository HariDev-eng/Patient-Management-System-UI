import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { isAuthenticated, getPortal } from "../utils/auth";

import Login         from "../pages/Login";
import Signup        from "../pages/Signup";
import Dashboard     from "../pages/Dashboard";
import Patients      from "../pages/Patients";
import Doctors       from "../pages/Doctors";
import Nurses        from "../pages/Nurses";
import Appointments  from "../pages/Appointments";
import Diagnosis     from "../pages/Diagnosis";
import Prescriptions from "../pages/Prescriptions";
import Billing       from "../pages/Billing";
import Inventory     from "../pages/Inventory";

import AdminDashboard        from "../portals/admin/AdminDashboard";
import DoctorDashboard       from "../portals/doctor/DoctorDashboard";
import NurseDashboard        from "../portals/nurse/NurseDashboard";
import PatientDashboard      from "../portals/patient/PatientDashboard";
import ReceptionistDashboard from "../portals/receptionist/ReceptionistDashboard";

function Protected({ children }) {
    return isAuthenticated() ? children : <Navigate to="/login" replace />;
}

function PublicOnly({ children }) {
    return isAuthenticated() ? <Navigate to="/" replace /> : children;
}

function RootRedirect() {
    const portal = getPortal();
    const map = {
        admin: "/admin", doctor: "/doctor", nurse: "/nurse",
        patient: "/patient", receptionist: "/receptionist",
    };
    return <Navigate to={map[portal] ?? "/admin"} replace />;
}

export default function AppRoutes() {
    return (
        <Routes>
            <Route path="/login"  element={<PublicOnly><Login /></PublicOnly>} />
            <Route path="/signup" element={<PublicOnly><Signup /></PublicOnly>} />

            <Route path="/" element={<Protected><RootRedirect /></Protected>} />

            {/* Admin */}
            <Route path="/admin"               element={<Protected><AdminDashboard /></Protected>} />
            <Route path="/admin/patients"      element={<Protected><Patients /></Protected>} />
            <Route path="/admin/doctors"       element={<Protected><Doctors /></Protected>} />
            <Route path="/admin/nurses"        element={<Protected><Nurses /></Protected>} />
            <Route path="/admin/appointments"  element={<Protected><Appointments /></Protected>} />
            <Route path="/admin/diagnoses"     element={<Protected><Diagnosis /></Protected>} />
            <Route path="/admin/prescriptions" element={<Protected><Prescriptions /></Protected>} />
            <Route path="/admin/billing"       element={<Protected><Billing /></Protected>} />
            <Route path="/admin/inventory"     element={<Protected><Inventory /></Protected>} />

            {/* Doctor */}
            <Route path="/doctor"               element={<Protected><DoctorDashboard /></Protected>} />
            <Route path="/doctor/appointments"  element={<Protected><Appointments /></Protected>} />
            <Route path="/doctor/patients"      element={<Protected><Patients /></Protected>} />
            <Route path="/doctor/diagnoses"     element={<Protected><Diagnosis /></Protected>} />
            <Route path="/doctor/prescriptions" element={<Protected><Prescriptions /></Protected>} />

            {/* Nurse */}
            <Route path="/nurse"          element={<Protected><NurseDashboard /></Protected>} />
            <Route path="/nurse/patients" element={<Protected><Patients /></Protected>} />
            <Route path="/nurse/vitals"   element={<Protected><Nurses /></Protected>} />

            {/* Patient */}
            <Route path="/patient"               element={<Protected><PatientDashboard /></Protected>} />
            <Route path="/patient/appointments"  element={<Protected><Appointments /></Protected>} />
            <Route path="/patient/prescriptions" element={<Protected><Prescriptions /></Protected>} />
            <Route path="/patient/records"       element={<Protected><Diagnosis /></Protected>} />
            <Route path="/patient/vitals"        element={<Protected><Nurses /></Protected>} />

            {/* Receptionist */}
            <Route path="/receptionist"              element={<Protected><ReceptionistDashboard /></Protected>} />
            <Route path="/receptionist/patients"     element={<Protected><Patients /></Protected>} />
            <Route path="/receptionist/appointments" element={<Protected><Appointments /></Protected>} />
            <Route path="/receptionist/billing"      element={<Protected><Billing /></Protected>} />
            <Route path="/receptionist/doctors"      element={<Protected><Doctors /></Protected>} />

            <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
    );
}
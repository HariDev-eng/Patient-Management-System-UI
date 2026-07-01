import React from "react";
import { Box } from "@mui/material";
import Navbar from "./Navbar";
import { getPortal } from "../../utils/auth";
import AdminSidebar        from "../../portals/admin/AdminSidebar";
import DoctorSidebar       from "../../portals/doctor/DoctorSidebar";
import NurseSidebar        from "../../portals/nurse/NurseSidebar";
import PatientSidebar      from "../../portals/patient/PatientSidebar";
import ReceptionistSidebar from "../../portals/receptionist/ReceptionistSidebar";

const SIDEBAR_MAP = {
    admin:        AdminSidebar,
    doctor:       DoctorSidebar,
    nurse:        NurseSidebar,
    patient:      PatientSidebar,
    receptionist: ReceptionistSidebar,
};

export default function MainLayout({ children }) {
    const portal  = getPortal();
    const Sidebar = SIDEBAR_MAP[portal] ?? AdminSidebar;

    return (
        <Box sx={{ display: "flex", width: "100vw", height: "100vh", overflow: "hidden", background: "#f1f5f9" }}>
            <Box sx={{ width: 220, minWidth: 220, height: "100vh", flexShrink: 0,
                overflowY: "auto", "&::-webkit-scrollbar": { display: "none" } }}>
                <Sidebar />
            </Box>
            <Box sx={{ flex: 1, display: "flex", flexDirection: "column", height: "100vh",
                overflow: "hidden", minWidth: 0, width: "calc(100vw - 220px)" }}>
                <Navbar />
                <Box sx={{ flex: 1, overflowY: "auto", p: 2.5, background: "#f1f5f9",
                    "&::-webkit-scrollbar": { width: "5px" },
                    "&::-webkit-scrollbar-thumb": { background: "#e2e8f0", borderRadius: "3px" } }}>
                    {children}
                </Box>
            </Box>
        </Box>
    );
}
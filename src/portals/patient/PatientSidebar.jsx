import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Box, List, ListItemButton, ListItemIcon, ListItemText, Typography, Divider } from "@mui/material";
import HomeIcon            from "@mui/icons-material/Home";
import CalendarMonthIcon   from "@mui/icons-material/CalendarMonth";
import FolderIcon          from "@mui/icons-material/Folder";
import MedicationIcon      from "@mui/icons-material/Medication";
import ReceiptIcon         from "@mui/icons-material/Receipt";
import MedicalServicesIcon from "@mui/icons-material/MedicalServices";
import PersonIcon          from "@mui/icons-material/Person";
import MonitorHeartIcon    from "@mui/icons-material/MonitorHeart";
import LocalHospitalIcon   from "@mui/icons-material/LocalHospital";
import SidebarFooter       from "../../components/layout/SidebarFooter";

const items = [
  { label: "Home",            icon: <HomeIcon />,            path: "/patient" },
  { label: "Appointments",    icon: <CalendarMonthIcon />,   path: "/patient/appointments" },
  { label: "Medical Records", icon: <FolderIcon />,          path: "/patient/records" },
  { label: "Prescriptions",   icon: <MedicationIcon />,      path: "/patient/prescriptions" },
  { label: "Vitals",          icon: <MonitorHeartIcon />,    path: "/patient/vitals" },
  { label: "Bills",           icon: <ReceiptIcon />,         path: "/patient/bills" },
  { label: "Doctors",         icon: <MedicalServicesIcon />, path: "/patient/doctors" },
  { label: "Profile",         icon: <PersonIcon />,          path: "/patient/profile" },
];

export default function PatientSidebar() {
  const navigate = useNavigate();
  const location = useLocation();
  const isActive = (p) => location.pathname === p;

  return (
      <Box sx={{
        width: 220, minHeight: "100vh",
        background: "#1e1b4b",
        display: "flex", flexDirection: "column", py: 2,
      }}>
        <Box sx={{ px: 2.5, mb: 2, display: "flex", alignItems: "center", gap: 1.5 }}>
          <Box sx={{ width: 34, height: 34, borderRadius: 2, background: "#7c3aed",
            display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
            <LocalHospitalIcon sx={{ color: "#ffffff", fontSize: 17 }} />
          </Box>
          <Box>
            <Typography sx={{ color: "#ffffff", fontWeight: 800, fontSize: "0.9rem", lineHeight: 1 }}>CC Health</Typography>
            <Typography sx={{ color: "#a5a3c4", fontSize: "0.6rem", letterSpacing: "0.1em" }}>MY HEALTH</Typography>
          </Box>
        </Box>
        <Divider sx={{ borderColor: "#3730a3", mx: 2, mb: 1 }} />
        <List dense disablePadding sx={{ px: 1, flex: 1 }}>
          {items.map((item) => {
            const active = isActive(item.path);
            return (
                <ListItemButton key={item.path} onClick={() => navigate(item.path)}
                                sx={{
                                  borderRadius: 2, mb: 0.3, px: 1.5, py: 0.9,
                                  bgcolor: active ? "#4c1d95" : "transparent",
                                  "&:hover": { bgcolor: active ? "#4c1d95" : "#312e81" },
                                }}>
                  <ListItemIcon sx={{ minWidth: 28, color: active ? "#c4b5fd" : "#d8d6f0" }}>
                    {React.cloneElement(item.icon, { sx: { fontSize: 17 } })}
                  </ListItemIcon>
                  <ListItemText primary={item.label}
                                primaryTypographyProps={{ fontSize: "0.85rem", fontWeight: active ? 600 : 400,
                                  color: active ? "#ffffff" : "#e8e7f5" }} />
                </ListItemButton>
            );
          })}
        </List>
        <SidebarFooter accentColor="#7c3aed" />
      </Box>
  );
}
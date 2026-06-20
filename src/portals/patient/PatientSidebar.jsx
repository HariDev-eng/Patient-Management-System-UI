import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Box, List, ListItemButton, ListItemIcon, ListItemText, Typography } from "@mui/material";
import HomeIcon          from "@mui/icons-material/Home";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import FolderIcon        from "@mui/icons-material/Folder";
import MedicationIcon    from "@mui/icons-material/Medication";
import ReceiptIcon       from "@mui/icons-material/Receipt";
import MedicalServicesIcon from "@mui/icons-material/MedicalServices";
import PersonIcon        from "@mui/icons-material/Person";
import MonitorHeartIcon  from "@mui/icons-material/MonitorHeart";
import LocalHospitalIcon from "@mui/icons-material/LocalHospital";

const items = [
  { label: "Home",          icon: <HomeIcon />,          path: "/patient" },
  { label: "Appointments",  icon: <CalendarMonthIcon />, path: "/patient/appointments" },
  { label: "Medical Records",icon: <FolderIcon />,       path: "/patient/records" },
  { label: "Prescriptions", icon: <MedicationIcon />,    path: "/patient/prescriptions" },
  { label: "Vitals",        icon: <MonitorHeartIcon />,  path: "/patient/vitals" },
  { label: "Bills",         icon: <ReceiptIcon />,       path: "/patient/bills" },
  { label: "Doctors",       icon: <MedicalServicesIcon />, path: "/patient/doctors" },
  { label: "Profile",       icon: <PersonIcon />,        path: "/patient/profile" },
];

export default function PatientSidebar() {
  const navigate = useNavigate();
  const location = useLocation();
  const isActive = (p) => location.pathname === p;

  return (
    <Box sx={{
      width: 220, minHeight: "100vh",
      background: "linear-gradient(160deg, #1e1b4b 0%, #312e81 100%)",
      display: "flex", flexDirection: "column", py: 2.5,
      borderRight: "1px solid rgba(255,255,255,0.05)",
    }}>
      <Box sx={{ px: 2.5, mb: 3.5, display: "flex", alignItems: "center", gap: 1.5 }}>
        <Box sx={{ width: 36, height: 36, borderRadius: 2, background: "linear-gradient(135deg, #7c3aed, #ec4899)",
          display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 4px 12px rgba(124,58,237,0.4)" }}>
          <LocalHospitalIcon sx={{ color: "#fff", fontSize: 18 }} />
        </Box>
        <Box>
          <Typography sx={{ color: "#fff", fontWeight: 800, fontSize: "0.95rem", lineHeight: 1 }}>CC Health</Typography>
          <Typography sx={{ color: "rgba(255,255,255,0.35)", fontSize: "0.62rem", letterSpacing: "0.1em" }}>MY HEALTH</Typography>
        </Box>
      </Box>
      <List dense disablePadding sx={{ px: 1.5, flex: 1 }}>
        {items.map((item) => {
          const active = isActive(item.path);
          return (
            <ListItemButton key={item.path} onClick={() => navigate(item.path)}
              sx={{
                borderRadius: 2, mb: 0.3, px: 1.5, py: 0.9, position: "relative",
                bgcolor: active ? "rgba(124,58,237,0.2)" : "transparent",
                "&:hover": { bgcolor: active ? "rgba(124,58,237,0.25)" : "rgba(255,255,255,0.05)" },
                ...(active && { "&::before": { content:'""', position:"absolute", left:0, top:"18%", bottom:"18%", width:3, borderRadius:"0 2px 2px 0", bgcolor:"#a78bfa" } }),
              }}>
              <ListItemIcon sx={{ minWidth: 30, color: active ? "#a78bfa" : "rgba(255,255,255,0.3)" }}>
                {React.cloneElement(item.icon, { sx: { fontSize: 17 } })}
              </ListItemIcon>
              <ListItemText primary={item.label}
                primaryTypographyProps={{ fontSize: "0.855rem", fontWeight: active ? 600 : 400,
                  color: active ? "#ede9fe" : "rgba(255,255,255,0.5)" }} />
            </ListItemButton>
          );
        })}
      </List>
    </Box>
  );
}

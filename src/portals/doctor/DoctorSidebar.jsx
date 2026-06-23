import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Box, List, ListItemButton, ListItemIcon, ListItemText, Typography, Divider } from "@mui/material";
import DashboardIcon     from "@mui/icons-material/Dashboard";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import PersonIcon        from "@mui/icons-material/Person";
import BiotechIcon       from "@mui/icons-material/Biotech";
import MedicationIcon    from "@mui/icons-material/Medication";
import BarChartIcon      from "@mui/icons-material/BarChart";
import LocalHospitalIcon from "@mui/icons-material/LocalHospital";
import SidebarFooter     from "../../components/layout/SidebarFooter";

const items = [
  { label: "Dashboard",     icon: <DashboardIcon />,     path: "/doctor" },
  { label: "Appointments",  icon: <CalendarMonthIcon />, path: "/doctor/appointments" },
  { label: "My Patients",   icon: <PersonIcon />,        path: "/doctor/patients" },
  { label: "Diagnoses",     icon: <BiotechIcon />,       path: "/doctor/diagnoses" },
  { label: "Prescriptions", icon: <MedicationIcon />,    path: "/doctor/prescriptions" },
  { label: "Analytics",     icon: <BarChartIcon />,      path: "/doctor/analytics" },
];

export default function DoctorSidebar() {
  const navigate = useNavigate();
  const location = useLocation();
  const isActive = (p) => location.pathname === p;

  return (
    <Box sx={{
      width: 220, minHeight: "100vh",
      background: "linear-gradient(160deg, #0a0f1e 0%, #0f172a 100%)",
      display: "flex", flexDirection: "column", py: 2.5,
      borderRight: "1px solid rgba(255,255,255,0.05)",
    }}>
      <Box sx={{ px: 2.5, mb: 3, display: "flex", alignItems: "center", gap: 1.5 }}>
        <Box sx={{ width: 36, height: 36, borderRadius: 2, background: "linear-gradient(135deg, #1d4ed8, #06b6d4)",
          display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 4px 12px rgba(29,78,216,0.4)" }}>
          <LocalHospitalIcon sx={{ color: "#fff", fontSize: 18 }} />
        </Box>
        <Box>
          <Typography sx={{ color: "#fff", fontWeight: 800, fontSize: "0.95rem", lineHeight: 1 }}>CC Health</Typography>
          <Typography sx={{ color: "rgba(255,255,255,0.35)", fontSize: "0.62rem", letterSpacing: "0.1em" }}>DOCTOR PORTAL</Typography>
        </Box>
      </Box>
      <Divider sx={{ borderColor: "rgba(255,255,255,0.06)", mx: 2, mb: 1.5 }} />
      <List dense disablePadding sx={{ px: 1.5, flex: 1 }}>
        {items.map((item) => {
          const active = isActive(item.path);
          return (
            <ListItemButton key={item.path} onClick={() => navigate(item.path)}
              sx={{
                borderRadius: 2, mb: 0.5, px: 1.5, py: 1, position: "relative",
                bgcolor: active ? "rgba(29,78,216,0.15)" : "transparent",
                "&:hover": { bgcolor: active ? "rgba(29,78,216,0.18)" : "rgba(255,255,255,0.05)" },
                ...(active && { "&::before": { content:'""', position:"absolute", left:0, top:"20%", bottom:"20%", width:3, borderRadius:"0 2px 2px 0", bgcolor:"#60a5fa" } }),
              }}>
              <ListItemIcon sx={{ minWidth: 30, color: active ? "#60a5fa" : "rgba(255,255,255,0.3)" }}>
                {React.cloneElement(item.icon, { sx: { fontSize: 18 } })}
              </ListItemIcon>
              <ListItemText primary={item.label}
                primaryTypographyProps={{ fontSize: "0.875rem", fontWeight: active ? 600 : 400,
                  color: active ? "#dbeafe" : "rgba(255,255,255,0.5)" }} />
            </ListItemButton>
          );
        })}
      </List>
      <SidebarFooter accentColor="#1d4ed8" />
    </Box>
  );
}

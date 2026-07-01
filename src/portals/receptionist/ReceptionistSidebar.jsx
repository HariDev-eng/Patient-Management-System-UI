import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Box, List, ListItemButton, ListItemIcon, ListItemText, Typography, Divider } from "@mui/material";
import DashboardIcon       from "@mui/icons-material/Dashboard";
import PersonIcon          from "@mui/icons-material/Person";
import CalendarMonthIcon   from "@mui/icons-material/CalendarMonth";
import ReceiptIcon         from "@mui/icons-material/Receipt";
import MedicalServicesIcon from "@mui/icons-material/MedicalServices";
import AssessmentIcon      from "@mui/icons-material/Assessment";
import LocalHospitalIcon   from "@mui/icons-material/LocalHospital";
import SidebarFooter       from "../../components/layout/SidebarFooter";

const items = [
  { label: "Dashboard",    icon: <DashboardIcon />,       path: "/receptionist" },
  { label: "Patients",     icon: <PersonIcon />,          path: "/receptionist/patients" },
  { label: "Appointments", icon: <CalendarMonthIcon />,   path: "/receptionist/appointments" },
  { label: "Billing",      icon: <ReceiptIcon />,         path: "/receptionist/billing" },
  { label: "Doctors",      icon: <MedicalServicesIcon />, path: "/receptionist/doctors" },
  { label: "Reports",      icon: <AssessmentIcon />,      path: "/receptionist/reports" },
];

export default function ReceptionistSidebar() {
  const navigate = useNavigate();
  const location = useLocation();
  const isActive = (p) => location.pathname === p;

  return (
    <Box sx={{
      width: 220, minHeight: "100vh",
      background: "linear-gradient(160deg, #431407 0%, #7c2d12 100%)",
      display: "flex", flexDirection: "column", py: 2,
      borderRight: "1px solid rgba(255,255,255,0.06)",
    }}>
      <Box sx={{ px: 2.5, mb: 2.5, display: "flex", alignItems: "center", gap: 1.5 }}>
        <Box sx={{ width: 34, height: 34, borderRadius: 2,
          background: "linear-gradient(135deg,#ea580c,#f59e0b)",
          display: "flex", alignItems: "center", justifyContent: "center",
          boxShadow: "0 4px 12px rgba(234,88,12,0.4)", flexShrink: 0 }}>
          <LocalHospitalIcon sx={{ color: "#fff", fontSize: 17 }} />
        </Box>
        <Box>
          <Typography sx={{ color: "#fff", fontWeight: 800, fontSize: "0.9rem", lineHeight: 1 }}>CC Health</Typography>
          <Typography sx={{ color: "rgba(255,255,255,0.5)", fontSize: "0.6rem", letterSpacing: "0.1em" }}>RECEPTION</Typography>
        </Box>
      </Box>
      <Divider sx={{ borderColor: "rgba(255,255,255,0.08)", mx: 2, mb: 1 }} />
      <List dense disablePadding sx={{ px: 1, flex: 1 }}>
        {items.map((item) => {
          const active = isActive(item.path);
          return (
            <ListItemButton key={item.path} onClick={() => navigate(item.path)}
              sx={{
                borderRadius: 2, mb: 0.3, px: 1.5, py: 0.9, position: "relative",
                bgcolor: active ? "rgba(234,88,12,0.2)" : "transparent",
                "&:hover": { bgcolor: active ? "rgba(234,88,12,0.25)" : "rgba(255,255,255,0.08)" },
                ...(active && { "&::before": { content:'""', position:"absolute", left:0, top:"18%",
                  bottom:"18%", width:3, borderRadius:"0 2px 2px 0", bgcolor:"#fb923c" } }),
              }}>
              <ListItemIcon sx={{ minWidth: 28, color: active ? "#fb923c" : "rgba(255,255,255,0.6)" }}>
                {React.cloneElement(item.icon, { sx: { fontSize: 17 } })}
              </ListItemIcon>
              <ListItemText primary={item.label}
                primaryTypographyProps={{ fontSize: "0.85rem", fontWeight: active ? 600 : 400,
                  color: active ? "#ffedd5" : "rgba(255,255,255,0.75)" }} />
            </ListItemButton>
          );
        })}
      </List>
      <SidebarFooter accentColor="#ea580c" />
    </Box>
  );
}

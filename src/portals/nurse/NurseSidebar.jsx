import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Box, List, ListItemButton, ListItemIcon, ListItemText, Typography, Divider } from "@mui/material";
import DashboardIcon    from "@mui/icons-material/Dashboard";
import PersonIcon       from "@mui/icons-material/Person";
import MonitorHeartIcon from "@mui/icons-material/MonitorHeart";
import MedicationIcon   from "@mui/icons-material/Medication";
import AssignmentIcon   from "@mui/icons-material/Assignment";
import LocalHospitalIcon from "@mui/icons-material/LocalHospital";
import SidebarFooter    from "../../components/layout/SidebarFooter";

const items = [
  { label: "Dashboard",   icon: <DashboardIcon />,    path: "/nurse" },
  { label: "Patients",    icon: <PersonIcon />,       path: "/nurse/patients" },
  { label: "Vitals",      icon: <MonitorHeartIcon />, path: "/nurse/vitals" },
  { label: "Medications", icon: <MedicationIcon />,   path: "/nurse/medications" },
  { label: "Tasks",       icon: <AssignmentIcon />,   path: "/nurse/tasks" },
];

export default function NurseSidebar() {
  const navigate = useNavigate();
  const location = useLocation();
  const isActive = (p) => location.pathname === p;

  return (
    <Box sx={{
      width: 220, minHeight: "100vh",
      background: "linear-gradient(160deg, #052e16 0%, #064e3b 100%)",
      display: "flex", flexDirection: "column", py: 2,
      borderRight: "1px solid rgba(255,255,255,0.06)",
    }}>
      <Box sx={{ px: 2.5, mb: 2.5, display: "flex", alignItems: "center", gap: 1.5 }}>
        <Box sx={{ width: 34, height: 34, borderRadius: 2,
          background: "linear-gradient(135deg,#059669,#06b6d4)",
          display: "flex", alignItems: "center", justifyContent: "center",
          boxShadow: "0 4px 12px rgba(5,150,105,0.4)", flexShrink: 0 }}>
          <LocalHospitalIcon sx={{ color: "#fff", fontSize: 17 }} />
        </Box>
        <Box>
          <Typography sx={{ color: "#fff", fontWeight: 800, fontSize: "0.9rem", lineHeight: 1 }}>CC Health</Typography>
          <Typography sx={{ color: "rgba(255,255,255,0.5)", fontSize: "0.6rem", letterSpacing: "0.1em" }}>NURSE PORTAL</Typography>
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
                bgcolor: active ? "rgba(5,150,105,0.2)" : "transparent",
                "&:hover": { bgcolor: active ? "rgba(5,150,105,0.25)" : "rgba(255,255,255,0.08)" },
                ...(active && { "&::before": { content:'""', position:"absolute", left:0, top:"18%",
                  bottom:"18%", width:3, borderRadius:"0 2px 2px 0", bgcolor:"#34d399" } }),
              }}>
              <ListItemIcon sx={{ minWidth: 28, color: active ? "#34d399" : "rgba(255,255,255,0.6)" }}>
                {React.cloneElement(item.icon, { sx: { fontSize: 17 } })}
              </ListItemIcon>
              <ListItemText primary={item.label}
                primaryTypographyProps={{ fontSize: "0.85rem", fontWeight: active ? 600 : 400,
                  color: active ? "#d1fae5" : "rgba(255,255,255,0.75)" }} />
            </ListItemButton>
          );
        })}
      </List>
      <SidebarFooter accentColor="#059669" />
    </Box>
  );
}

import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Box, List, ListItemButton, ListItemIcon, ListItemText, Typography, Divider } from "@mui/material";
import DashboardIcon       from "@mui/icons-material/Dashboard";
import PersonIcon          from "@mui/icons-material/Person";
import MedicalServicesIcon from "@mui/icons-material/MedicalServices";
import MonitorHeartIcon    from "@mui/icons-material/MonitorHeart";
import CalendarMonthIcon   from "@mui/icons-material/CalendarMonth";
import BiotechIcon         from "@mui/icons-material/Biotech";
import MedicationIcon      from "@mui/icons-material/Medication";
import ReceiptIcon         from "@mui/icons-material/Receipt";
import InventoryIcon       from "@mui/icons-material/Inventory2";
import BarChartIcon        from "@mui/icons-material/BarChart";
import LocalHospitalIcon   from "@mui/icons-material/LocalHospital";
import SidebarFooter       from "../../components/layout/SidebarFooter";

const sections = [
  { label: "Overview", items: [
    { label: "Dashboard",     icon: <DashboardIcon />,       path: "/admin" },
    { label: "Analytics",     icon: <BarChartIcon />,        path: "/admin/analytics" },
  ]},
  { label: "People", items: [
    { label: "Patients",      icon: <PersonIcon />,          path: "/admin/patients" },
    { label: "Doctors",       icon: <MedicalServicesIcon />, path: "/admin/doctors" },
    { label: "Nurses",        icon: <MonitorHeartIcon />,    path: "/admin/nurses" },
  ]},
  { label: "Clinical", items: [
    { label: "Appointments",  icon: <CalendarMonthIcon />,   path: "/admin/appointments" },
    { label: "Diagnosis",     icon: <BiotechIcon />,         path: "/admin/diagnoses" },
    { label: "Prescriptions", icon: <MedicationIcon />,      path: "/admin/prescriptions" },
  ]},
  { label: "Operations", items: [
    { label: "Billing",       icon: <ReceiptIcon />,         path: "/admin/billing" },
    { label: "Inventory",     icon: <InventoryIcon />,       path: "/admin/inventory" },
  ]},
];

export default function AdminSidebar() {
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
        <Box sx={{ width: 36, height: 36, borderRadius: 2, background: "linear-gradient(135deg, #4f46e5, #06b6d4)",
          display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 4px 12px rgba(79,70,229,0.4)" }}>
          <LocalHospitalIcon sx={{ color: "#fff", fontSize: 18 }} />
        </Box>
        <Box>
          <Typography sx={{ color: "#fff", fontWeight: 800, fontSize: "0.95rem", lineHeight: 1 }}>CC Health</Typography>
          <Typography sx={{ color: "rgba(255,255,255,0.35)", fontSize: "0.62rem", letterSpacing: "0.1em" }}>ADMIN PORTAL</Typography>
        </Box>
      </Box>

      <Divider sx={{ borderColor: "rgba(255,255,255,0.06)", mx: 2, mb: 1 }} />

      <Box sx={{ flex: 1, overflow: "hidden" }}>
        {sections.map((sec) => (
          <Box key={sec.label} sx={{ mb: 0.5 }}>
            <Typography sx={{ px: 2.5, pt: 1.5, pb: 0.5, fontSize: "0.62rem", fontWeight: 700,
              color: "rgba(255,255,255,0.25)", textTransform: "uppercase", letterSpacing: "0.1em" }}>
              {sec.label}
            </Typography>
            <List dense disablePadding sx={{ px: 1.5 }}>
              {sec.items.map((item) => {
                const active = isActive(item.path);
                return (
                  <ListItemButton key={item.path} onClick={() => navigate(item.path)}
                    sx={{
                      borderRadius: 2, mb: 0.3, px: 1.5, py: 0.9, position: "relative",
                      bgcolor: active ? "rgba(79,70,229,0.15)" : "transparent",
                      "&:hover": { bgcolor: active ? "rgba(79,70,229,0.18)" : "rgba(255,255,255,0.05)" },
                      ...(active && { "&::before": { content:'""', position:"absolute", left:0, top:"18%", bottom:"18%", width:3, borderRadius:"0 2px 2px 0", bgcolor:"#818cf8" } }),
                    }}>
                    <ListItemIcon sx={{ minWidth: 30, color: active ? "#818cf8" : "rgba(255,255,255,0.3)" }}>
                      {React.cloneElement(item.icon, { sx: { fontSize: 17 } })}
                    </ListItemIcon>
                    <ListItemText primary={item.label}
                      primaryTypographyProps={{ fontSize: "0.855rem", fontWeight: active ? 600 : 400,
                        color: active ? "#e0e7ff" : "rgba(255,255,255,0.5)" }} />
                  </ListItemButton>
                );
              })}
            </List>
          </Box>
        ))}
      </Box>
      <SidebarFooter accentColor="#4f46e5" />
    </Box>
  );
}

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
      { label: "Dashboard", icon: <DashboardIcon />, path: "/admin" },
      { label: "Analytics", icon: <BarChartIcon />,  path: "/admin/analytics" },
    ]},
  { label: "People", items: [
      { label: "Patients", icon: <PersonIcon />,          path: "/admin/patients" },
      { label: "Doctors",  icon: <MedicalServicesIcon />, path: "/admin/doctors" },
      { label: "Nurses",   icon: <MonitorHeartIcon />,    path: "/admin/nurses" },
    ]},
  { label: "Clinical", items: [
      { label: "Appointments",  icon: <CalendarMonthIcon />, path: "/admin/appointments" },
      { label: "Diagnosis",     icon: <BiotechIcon />,       path: "/admin/diagnoses" },
      { label: "Prescriptions", icon: <MedicationIcon />,    path: "/admin/prescriptions" },
    ]},
  { label: "Operations", items: [
      { label: "Billing",   icon: <ReceiptIcon />,   path: "/admin/billing" },
      { label: "Inventory", icon: <InventoryIcon />, path: "/admin/inventory" },
    ]},
];

export default function AdminSidebar() {
  const navigate = useNavigate();
  const location = useLocation();
  const isActive = (p) => location.pathname === p;

  return (
      <Box sx={{
        width: 220, minHeight: "100vh",
        background: "#0f172a",
        display: "flex", flexDirection: "column", py: 2,
      }}>
        <Box sx={{ px: 2.5, mb: 2, display: "flex", alignItems: "center", gap: 1.5 }}>
          <Box sx={{ width: 34, height: 34, borderRadius: 2, background: "#4f46e5",
            display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
            <LocalHospitalIcon sx={{ color: "#ffffff", fontSize: 17 }} />
          </Box>
          <Box>
            <Typography sx={{ color: "#ffffff", fontWeight: 800, fontSize: "0.9rem", lineHeight: 1 }}>CC Health</Typography>
            <Typography sx={{ color: "#94a3b8", fontSize: "0.6rem", letterSpacing: "0.1em" }}>ADMIN PORTAL</Typography>
          </Box>
        </Box>
        <Divider sx={{ borderColor: "#334155", mx: 2, mb: 1 }} />

        <Box sx={{ flex: 1, overflowY: "auto" }}>
          {sections.map((sec) => (
              <Box key={sec.label} sx={{ mb: 0.5 }}>
                <Typography sx={{ px: 2.5, pt: 1.5, pb: 0.5, fontSize: "0.6rem", fontWeight: 700,
                  color: "#64748b", textTransform: "uppercase", letterSpacing: "0.1em" }}>
                  {sec.label}
                </Typography>
                <List dense disablePadding sx={{ px: 1 }}>
                  {sec.items.map((item) => {
                    const active = isActive(item.path);
                    return (
                        <ListItemButton key={item.path} onClick={() => navigate(item.path)}
                                        sx={{
                                          borderRadius: 2, mb: 0.3, px: 1.5, py: 0.8,
                                          bgcolor: active ? "#312e81" : "transparent",
                                          "&:hover": { bgcolor: active ? "#312e81" : "#1e293b" },
                                        }}>
                          <ListItemIcon sx={{ minWidth: 28, color: active ? "#a5b4fc" : "#cbd5e1" }}>
                            {React.cloneElement(item.icon, { sx: { fontSize: 17 } })}
                          </ListItemIcon>
                          <ListItemText primary={item.label}
                                        primaryTypographyProps={{ fontSize: "0.85rem", fontWeight: active ? 600 : 400,
                                          color: active ? "#ffffff" : "#e2e8f0" }} />
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
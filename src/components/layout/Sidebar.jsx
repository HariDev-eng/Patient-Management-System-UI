import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  Box, List, ListItemButton, ListItemIcon, ListItemText,
  Typography, Collapse, Switch, Divider,
} from "@mui/material";
import DashboardIcon       from "@mui/icons-material/Dashboard";
import LocalHospitalIcon   from "@mui/icons-material/LocalHospital";
import PersonIcon          from "@mui/icons-material/Person";
import MedicalServicesIcon from "@mui/icons-material/MedicalServices";
import LocalPharmacyIcon   from "@mui/icons-material/LocalPharmacy";
import CalendarMonthIcon   from "@mui/icons-material/CalendarMonth";
import ReceiptIcon         from "@mui/icons-material/Receipt";
import InventoryIcon       from "@mui/icons-material/Inventory2";
import ExpandLess          from "@mui/icons-material/ExpandLess";
import ExpandMore          from "@mui/icons-material/ExpandMore";
import AssessmentIcon      from "@mui/icons-material/Assessment";
import DarkModeIcon        from "@mui/icons-material/DarkMode";
import GroupIcon           from "@mui/icons-material/Group";
import MonitorHeartIcon    from "@mui/icons-material/MonitorHeart";
import BiotechIcon         from "@mui/icons-material/Biotech";
import MedicationIcon      from "@mui/icons-material/Medication";
import LanguageIcon        from "@mui/icons-material/Language";

const navItems = [
  { label: "Dashboard",     icon: <DashboardIcon />,     path: "/" },
  {
    label: "Department", icon: <LocalHospitalIcon />,
    children: [
      { label: "Doctor",     icon: <MedicalServicesIcon />, path: "/doctors" },
      { label: "Nurse",      icon: <MonitorHeartIcon />,    path: "/nurses" },
      { label: "Patient",    icon: <PersonIcon />,          path: "/patients" },
      { label: "Pharmacist", icon: <LocalPharmacyIcon />,   path: "/pharmacist" },
      { label: "FM",         icon: <GroupIcon />,           path: "/fm" },
    ],
  },
  { label: "Appointments",  icon: <CalendarMonthIcon />, path: "/appointments" },
  { label: "Diagnosis",     icon: <BiotechIcon />,       path: "/diagnoses" },
  { label: "Prescriptions", icon: <MedicationIcon />,    path: "/prescriptions" },
  { label: "Billing",       icon: <ReceiptIcon />,       path: "/billing" },
  { label: "Inventory",     icon: <InventoryIcon />,     path: "/inventory" },
  { label: "Report",        icon: <AssessmentIcon />,    path: "/report" },
  { label: "Language",      icon: <LanguageIcon />,      path: "/language" },
];

export default function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation();
  const [deptOpen, setDeptOpen] = React.useState(true);
  const [darkMode, setDarkMode] = React.useState(false);

  const isActive = (path) => location.pathname === path;

  return (
    <Box sx={{
      width: 240,
      minHeight: "100vh",
      background: "linear-gradient(160deg, #0a0f1e 0%, #0f172a 50%, #0a1628 100%)",
      display: "flex",
      flexDirection: "column",
      py: 2.5,
      borderRight: "1px solid rgba(255,255,255,0.06)",
    }}>
      {/* Logo */}
      <Box sx={{ px: 3, mb: 4 }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
          <Box sx={{
            width: 40, height: 40, borderRadius: 2.5,
            background: "linear-gradient(135deg, #06b6d4, #6366f1)",
            display: "flex", alignItems: "center", justifyContent: "center",
            boxShadow: "0 4px 14px rgba(6,182,212,0.4)",
          }}>
            <LocalHospitalIcon sx={{ color: "#fff", fontSize: 20 }} />
          </Box>
          <Box>
            <Typography sx={{ color: "#fff", fontWeight: 800, fontSize: "1rem", lineHeight: 1.1, letterSpacing: "-0.02em" }}>
              CC Health
            </Typography>
            <Typography sx={{ color: "rgba(255,255,255,0.4)", fontSize: "0.7rem", letterSpacing: "0.05em" }}>
              SYSTEM
            </Typography>
          </Box>
        </Box>
      </Box>

      {/* Nav */}
      <List dense sx={{ flex: 1, px: 1.5 }}>
        {navItems.map((item) =>
          item.children ? (
            <React.Fragment key={item.label}>
              <ListItemButton onClick={() => setDeptOpen((p) => !p)}
                sx={{
                  borderRadius: 2, mb: 0.5, px: 1.5,
                  "&:hover": { backgroundColor: "rgba(255,255,255,0.05)" },
                }}>
                <ListItemIcon sx={{ minWidth: 32, color: "rgba(255,255,255,0.4)" }}>
                  {React.cloneElement(item.icon, { sx: { fontSize: 18 } })}
                </ListItemIcon>
                <ListItemText primary={item.label}
                  primaryTypographyProps={{
                    fontSize: "0.75rem", fontWeight: 600,
                    color: "rgba(255,255,255,0.4)",
                    textTransform: "uppercase", letterSpacing: "0.08em",
                  }} />
                {deptOpen
                  ? <ExpandLess sx={{ color: "rgba(255,255,255,0.3)", fontSize: 16 }} />
                  : <ExpandMore sx={{ color: "rgba(255,255,255,0.3)", fontSize: 16 }} />}
              </ListItemButton>
              <Collapse in={deptOpen} timeout="auto" unmountOnExit>
                <List component="div" disablePadding sx={{ mb: 0.5 }}>
                  {item.children.map((child) => {
                    const active = isActive(child.path);
                    return (
                      <ListItemButton key={child.label}
                        onClick={() => navigate(child.path)}
                        sx={{
                          borderRadius: 2, mb: 0.5, pl: 2.5, pr: 1.5,
                          position: "relative",
                          backgroundColor: active ? "rgba(6,182,212,0.12)" : "transparent",
                          "&:hover": { backgroundColor: active ? "rgba(6,182,212,0.15)" : "rgba(255,255,255,0.05)" },
                          ...(active && {
                            "&::before": {
                              content: '""',
                              position: "absolute", left: 0, top: "20%", bottom: "20%",
                              width: 3, borderRadius: "0 2px 2px 0",
                              backgroundColor: "#06b6d4",
                            },
                          }),
                        }}>
                        <ListItemIcon sx={{ minWidth: 28, color: active ? "#06b6d4" : "rgba(255,255,255,0.35)" }}>
                          {React.cloneElement(child.icon, { sx: { fontSize: 17 } })}
                        </ListItemIcon>
                        <ListItemText primary={child.label}
                          primaryTypographyProps={{
                            fontSize: "0.875rem", fontWeight: active ? 600 : 400,
                            color: active ? "#e2e8f0" : "rgba(255,255,255,0.55)",
                          }} />
                      </ListItemButton>
                    );
                  })}
                </List>
              </Collapse>
            </React.Fragment>
          ) : (() => {
            const active = isActive(item.path);
            return (
              <ListItemButton key={item.label}
                onClick={() => navigate(item.path)}
                sx={{
                  borderRadius: 2, mb: 0.5, px: 1.5,
                  position: "relative",
                  backgroundColor: active ? "rgba(6,182,212,0.12)" : "transparent",
                  "&:hover": { backgroundColor: active ? "rgba(6,182,212,0.15)" : "rgba(255,255,255,0.05)" },
                  ...(active && {
                    "&::before": {
                      content: '""',
                      position: "absolute", left: 0, top: "20%", bottom: "20%",
                      width: 3, borderRadius: "0 2px 2px 0",
                      backgroundColor: "#06b6d4",
                    },
                  }),
                }}>
                <ListItemIcon sx={{ minWidth: 32, color: active ? "#06b6d4" : "rgba(255,255,255,0.35)" }}>
                  {React.cloneElement(item.icon, { sx: { fontSize: 18 } })}
                </ListItemIcon>
                <ListItemText primary={item.label}
                  primaryTypographyProps={{
                    fontSize: "0.875rem", fontWeight: active ? 600 : 400,
                    color: active ? "#e2e8f0" : "rgba(255,255,255,0.55)",
                  }} />
              </ListItemButton>
            );
          })()
        )}
      </List>

      {/* Appearance */}
      <Box sx={{ px: 2, pt: 1 }}>
        <Divider sx={{ borderColor: "rgba(255,255,255,0.08)", mb: 2 }} />
        <Box sx={{
          display: "flex", alignItems: "center", gap: 1,
          px: 1.5, py: 1, borderRadius: 2,
          background: "rgba(255,255,255,0.04)",
        }}>
          <DarkModeIcon sx={{ color: "rgba(255,255,255,0.4)", fontSize: 16 }} />
          <Typography sx={{ color: "rgba(255,255,255,0.5)", fontSize: "0.8rem", flex: 1 }}>
            Dark mode
          </Typography>
          <Switch size="small" checked={darkMode} onChange={(e) => setDarkMode(e.target.checked)}
            sx={{
              "& .MuiSwitch-thumb": { backgroundColor: darkMode ? "#06b6d4" : "rgba(255,255,255,0.3)" },
              "& .MuiSwitch-track": { backgroundColor: "rgba(255,255,255,0.15) !important" },
            }}
          />
        </Box>
      </Box>
    </Box>
  );
}

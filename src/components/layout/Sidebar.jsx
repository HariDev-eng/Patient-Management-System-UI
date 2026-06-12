import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  Box, List, ListItemButton, ListItemIcon, ListItemText,
  Typography, Collapse, Switch, Divider,
} from "@mui/material";
import DashboardIcon from "@mui/icons-material/Dashboard";
import LocalHospitalIcon from "@mui/icons-material/LocalHospital";
import PersonIcon from "@mui/icons-material/Person";
import MedicalServicesIcon from "@mui/icons-material/MedicalServices";
import NursingIcon from "@mui/icons-material/LocalPharmacy";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import ReceiptIcon from "@mui/icons-material/Receipt";
import InventoryIcon from "@mui/icons-material/Inventory2";
import ExpandLess from "@mui/icons-material/ExpandLess";
import ExpandMore from "@mui/icons-material/ExpandMore";
import LanguageIcon from "@mui/icons-material/Language";
import AssessmentIcon from "@mui/icons-material/Assessment";
import DarkModeIcon from "@mui/icons-material/DarkMode";
import GroupIcon from "@mui/icons-material/Group";

const navItems = [
  { label: "Dashboard",    icon: <DashboardIcon />,    path: "/" },
  {
    label: "Department",
    icon: <LocalHospitalIcon />,
    children: [
      { label: "Doctor",      icon: <MedicalServicesIcon />, path: "/doctors" },
      { label: "Nurse",       icon: <NursingIcon />,         path: "/nurses" },
      { label: "Patient",     icon: <PersonIcon />,          path: "/patients" },
      { label: "Pharmacist",  icon: <GroupIcon />,           path: "/pharmacist" },
      { label: "FM",          icon: <PersonIcon />,          path: "/fm" },
    ],
  },
  { label: "Appointments", icon: <CalendarMonthIcon />, path: "/appointments" },
  { label: "Billing",      icon: <ReceiptIcon />,       path: "/billing" },
  { label: "Inventory",    icon: <InventoryIcon />,     path: "/inventory" },
  { label: "Report",       icon: <AssessmentIcon />,    path: "/report" },
  { label: "Language",     icon: <LanguageIcon />,      path: "/language" },
];

export default function Sidebar() {
  const navigate  = useNavigate();
  const location  = useLocation();
  const [deptOpen, setDeptOpen] = React.useState(true);
  const [darkMode, setDarkMode] = React.useState(false);

  const isActive = (path) => location.pathname === path;

  const activeBtnSx = {
    borderRadius: 2,
    mb: 0.3,
    backgroundColor: "#fff",
    "&:hover": { backgroundColor: "#fff" },
  };

  const normalBtnSx = {
    borderRadius: 2,
    mb: 0.3,
    backgroundColor: "transparent",
    "&:hover": { backgroundColor: "rgba(255,255,255,0.15)" },
  };

  const activeIconColor  = "#0891b2";
  const normalIconColor  = "rgba(255,255,255,0.9)";
  const activeTextColor  = "#0891b2";
  const normalTextColor  = "#fff";

  return (
    <Box
      sx={{
        width: 220,
        minHeight: "100vh",
        background: "linear-gradient(180deg, #0891b2 0%, #0e7490 55%, #0f766e 100%)",
        display: "flex",
        flexDirection: "column",
        py: 2,
      }}
    >
      {/* Logo */}
      <Box sx={{ display: "flex", alignItems: "center", gap: 1.2, px: 2.5, mb: 3 }}>
        <Box
          sx={{
            width: 44, height: 44,
            borderRadius: "50%",
            background: "rgba(255,255,255,0.2)",
            border: "2px solid rgba(255,255,255,0.45)",
            display: "flex", alignItems: "center", justifyContent: "center",
            flexShrink: 0,
          }}
        >
          <LocalHospitalIcon sx={{ color: "#fff", fontSize: 22 }} />
        </Box>
        <Box>
          <Typography sx={{ color: "#fff", fontWeight: 800, fontSize: "1rem", lineHeight: 1.1 }}>
            CC
          </Typography>
          <Typography sx={{ color: "rgba(255,255,255,0.7)", fontSize: "0.7rem" }}>
            Health System
          </Typography>
        </Box>
      </Box>

      {/* Nav list */}
      <List dense sx={{ flex: 1, px: 1 }}>
        {navItems.map((item) =>
          item.children ? (
            <React.Fragment key={item.label}>
              <ListItemButton
                onClick={() => setDeptOpen((p) => !p)}
                sx={normalBtnSx}
              >
                <ListItemIcon sx={{ minWidth: 30, color: normalIconColor }}>
                  {React.cloneElement(item.icon, { fontSize: "small" })}
                </ListItemIcon>
                <ListItemText
                  primary={item.label}
                  primaryTypographyProps={{
                    fontSize: "0.88rem",
                    fontWeight: 600,
                    color: normalTextColor,
                  }}
                />
                {deptOpen
                  ? <ExpandLess sx={{ color: normalIconColor, fontSize: 18 }} />
                  : <ExpandMore sx={{ color: normalIconColor, fontSize: 18 }} />
                }
              </ListItemButton>
              <Collapse in={deptOpen} timeout="auto" unmountOnExit>
                <List component="div" disablePadding>
                  {item.children.map((child) => {
                    const active = isActive(child.path);
                    return (
                      <ListItemButton
                        key={child.label}
                        onClick={() => navigate(child.path)}
                        sx={{ ...(active ? activeBtnSx : normalBtnSx), pl: 3 }}
                      >
                        <ListItemIcon
                          sx={{ minWidth: 26, color: active ? activeIconColor : "rgba(255,255,255,0.8)" }}
                        >
                          {React.cloneElement(child.icon, { sx: { fontSize: 16 } })}
                        </ListItemIcon>
                        <ListItemText
                          primary={child.label}
                          primaryTypographyProps={{
                            fontSize: "0.83rem",
                            fontWeight: active ? 700 : 500,
                            color: active ? activeTextColor : normalTextColor,
                          }}
                        />
                      </ListItemButton>
                    );
                  })}
                </List>
              </Collapse>
            </React.Fragment>
          ) : (
            (() => {
              const active = isActive(item.path);
              return (
                <ListItemButton
                  key={item.label}
                  onClick={() => navigate(item.path)}
                  sx={active ? activeBtnSx : normalBtnSx}
                >
                  <ListItemIcon sx={{ minWidth: 30, color: active ? activeIconColor : normalIconColor }}>
                    {React.cloneElement(item.icon, { fontSize: "small" })}
                  </ListItemIcon>
                  <ListItemText
                    primary={item.label}
                    primaryTypographyProps={{
                      fontSize: "0.88rem",
                      fontWeight: active ? 700 : 600,
                      color: active ? activeTextColor : normalTextColor,
                    }}
                  />
                </ListItemButton>
              );
            })()
          )
        )}
      </List>

      {/* Appearance */}
      <Divider sx={{ borderColor: "rgba(255,255,255,0.2)", mx: 2, mb: 1.5 }} />
      <Box sx={{ px: 2.5, pb: 2 }}>
        <Typography
          variant="caption"
          sx={{
            color: "rgba(255,255,255,0.55)",
            fontWeight: 700,
            letterSpacing: 1.2,
            textTransform: "uppercase",
            fontSize: "0.65rem",
          }}
        >
          Appearance
        </Typography>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1, mt: 0.8 }}>
          <DarkModeIcon sx={{ color: "rgba(255,255,255,0.8)", fontSize: 17 }} />
          <Typography sx={{ color: "#fff", fontSize: "0.83rem", flex: 1 }}>
            Dark mode
          </Typography>
          <Switch
            size="small"
            checked={darkMode}
            onChange={(e) => setDarkMode(e.target.checked)}
            sx={{
              "& .MuiSwitch-thumb": {
                backgroundColor: darkMode ? "#22d3ee" : "#e2e8f0",
              },
              "& .MuiSwitch-track": {
                backgroundColor: darkMode ? "#0891b2 !important" : "rgba(255,255,255,0.3) !important",
              },
            }}
          />
        </Box>
      </Box>
    </Box>
  );
}

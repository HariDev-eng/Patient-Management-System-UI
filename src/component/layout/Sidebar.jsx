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
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import ReceiptIcon from "@mui/icons-material/Receipt";
import InventoryIcon from "@mui/icons-material/Inventory";
import ExpandLess from "@mui/icons-material/ExpandLess";
import ExpandMore from "@mui/icons-material/ExpandMore";
import LanguageIcon from "@mui/icons-material/Language";
import AssessmentIcon from "@mui/icons-material/Assessment";
import DarkModeIcon from "@mui/icons-material/DarkMode";

const SIDEBAR_W = 220;

const navItems = [
    { label: "Dashboard", icon: <DashboardIcon />, path: "/" },
    {
        label: "Department", icon: <LocalHospitalIcon />, children: [
            { label: "Doctor", icon: <MedicalServicesIcon />, path: "/doctors" },
            { label: "Nurse", icon: <PersonIcon />, path: "/nurses" },
            { label: "Patient", icon: <PersonIcon />, path: "/patients" },
            { label: "Pharmacist", icon: <MedicalServicesIcon />, path: "/pharmacist" },
            { label: "FM", icon: <PersonIcon />, path: "/fm" },
        ],
    },
    { label: "Appointments", icon: <CalendarMonthIcon />, path: "/appointments" },
    { label: "Billing", icon: <ReceiptIcon />, path: "/billing" },
    { label: "Inventory", icon: <InventoryIcon />, path: "/inventory" },
    { label: "Report", icon: <AssessmentIcon />, path: "/report" },
    { label: "Language", icon: <LanguageIcon />, path: "/language" },
];

export default function Sidebar() {
    const navigate = useNavigate();
    const location = useLocation();
    const [deptOpen, setDeptOpen] = React.useState(true);
    const [darkMode, setDarkMode] = React.useState(false);

    const isActive = (path) => location.pathname === path;

    return (
        <Box
            sx={{
                width: SIDEBAR_W,
                minHeight: "100vh",
                background: "linear-gradient(180deg, #0891b2 0%, #0e7490 60%, #0f766e 100%)",
                display: "flex",
                flexDirection: "column",
                py: 2,
                flexShrink: 0,
            }}
        >
            {/* Logo */}
            <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, px: 2.5, mb: 3 }}>
                <Box
                    sx={{
                        width: 48, height: 48, borderRadius: "50%",
                        background: "rgba(255,255,255,0.2)",
                        display: "flex", alignItems: "center", justifyContent: "center",
                        border: "2px solid rgba(255,255,255,0.5)",
                    }}
                >
                    <LocalHospitalIcon sx={{ color: "#fff", fontSize: 26 }} />
                </Box>
                <Typography variant="subtitle1" sx={{ color: "#fff", fontWeight: 700, lineHeight: 1.2 }}>
                    CC<br />
                    <Typography component="span" variant="caption" sx={{ color: "rgba(255,255,255,0.75)", fontWeight: 400 }}>
                        Health System
                    </Typography>
                </Typography>
            </Box>

            {/* Nav */}
            <List dense sx={{ flex: 1, px: 1 }}>
                {navItems.map((item) =>
                    item.children ? (
                        <React.Fragment key={item.label}>
                            <ListItemButton
                                onClick={() => setDeptOpen((p) => !p)}
                                sx={navBtnSx(false)}
                            >
                                <ListItemIcon sx={{ minWidth: 32, color: "rgba(255,255,255,0.85)" }}>
                                    {item.icon}
                                </ListItemIcon>
                                <ListItemText primary={item.label} primaryTypographyProps={{ fontSize: "0.9rem", fontWeight: 600, color: "#fff" }} />
                                {deptOpen ? <ExpandLess sx={{ color: "#fff" }} /> : <ExpandMore sx={{ color: "#fff" }} />}
                            </ListItemButton>
                            <Collapse in={deptOpen} timeout="auto" unmountOnExit>
                                <List component="div" disablePadding>
                                    {item.children.map((child) => (
                                        <ListItemButton
                                            key={child.label}
                                            onClick={() => navigate(child.path)}
                                            sx={{ ...navBtnSx(isActive(child.path)), pl: 3.5 }}
                                        >
                                            <ListItemIcon sx={{ minWidth: 28, color: isActive(child.path) ? "#0891b2" : "rgba(255,255,255,0.75)" }}>
                                                {React.cloneElement(child.icon, { fontSize: "small" })}
                                            </ListItemIcon>
                                            <ListItemText
                                                primary={child.label}
                                                primaryTypographyProps={{
                                                    fontSize: "0.85rem",
                                                    fontWeight: isActive(child.path) ? 700 : 500,
                                                    color: isActive(child.path) ? "#0891b2" : "#fff",
                                                }}
                                            />
                                        </ListItemButton>
                                    ))}
                                </List>
                            </Collapse>
                        </React.Fragment>
                    ) : (
                        <ListItemButton
                            key={item.label}
                            onClick={() => navigate(item.path)}
                            sx={navBtnSx(isActive(item.path))}
                        >
                            <ListItemIcon sx={{ minWidth: 32, color: isActive(item.path) ? "#0891b2" : "rgba(255,255,255,0.85)" }}>
                                {item.icon}
                            </ListItemIcon>
                            <ListItemText
                                primary={item.label}
                                primaryTypographyProps={{
                                    fontSize: "0.9rem",
                                    fontWeight: isActive(item.path) ? 700 : 600,
                                    color: isActive(item.path) ? "#0891b2" : "#fff",
                                }}
                            />
                        </ListItemButton>
                    )
                )}
            </List>

            {/* Appearance */}
            <Divider sx={{ borderColor: "rgba(255,255,255,0.2)", mx: 2, mb: 1 }} />
            <Box sx={{ px: 2.5, pb: 1 }}>
                <Typography variant="caption" sx={{ color: "rgba(255,255,255,0.6)", fontWeight: 600, letterSpacing: 1, textTransform: "uppercase" }}>
                    Appearance
                </Typography>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1, mt: 0.5 }}>
                    <DarkModeIcon sx={{ color: "rgba(255,255,255,0.85)", fontSize: 18 }} />
                    <Typography variant="body2" sx={{ color: "#fff", flex: 1 }}>Dark mode</Typography>
                    <Switch
                        size="small"
                        checked={darkMode}
                        onChange={(e) => setDarkMode(e.target.checked)}
                        sx={{
                            "& .MuiSwitch-thumb": { backgroundColor: darkMode ? "#0891b2" : "#fff" },
                            "& .MuiSwitch-track": { backgroundColor: darkMode ? "#22d3ee" : "rgba(255,255,255,0.3)" },
                        }}
                    />
                </Box>
            </Box>
        </Box>
    );
}

function navBtnSx(active) {
    return {
        borderRadius: 2,
        mb: 0.5,
        backgroundColor: active ? "#fff" : "transparent",
        "&:hover": { backgroundColor: active ? "#fff" : "rgba(255,255,255,0.15)" },
        transition: "background 0.15s",
    };
}
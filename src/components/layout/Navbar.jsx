import React from "react";
import {
  Box, IconButton, Badge, Avatar,
  Typography, Menu, MenuItem, Chip, Divider, ListItemIcon,
} from "@mui/material";
import NotificationsIcon     from "@mui/icons-material/Notifications";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import SettingsIcon          from "@mui/icons-material/Settings";
import LogoutIcon            from "@mui/icons-material/Logout";
import PersonIcon            from "@mui/icons-material/Person";
import { useNavigate }       from "react-router-dom";
import { clearAuth, getUserEmail, getUserRole } from "../../utils/auth";

const ROLE_COLORS = {
  ADMIN:        { bg: "#ede9fe", color: "#6d28d9" },
  DOCTOR:       { bg: "#dbeafe", color: "#1d4ed8" },
  NURSE:        { bg: "#dcfce7", color: "#15803d" },
  RECEPTIONIST: { bg: "#fef3c7", color: "#a16207" },
  PATIENT:      { bg: "#fce7f3", color: "#be185d" },
};

export default function Navbar({ greeting }) {
  const navigate    = useNavigate();
  const [anchor, setAnchor] = React.useState(null);
  const email       = getUserEmail();
  const role        = getUserRole().toUpperCase();
  const displayName = email.split("@")[0] ?? "User";
  const rc          = ROLE_COLORS[role] ?? { bg: "#f1f5f9", color: "#475569" };

  const handleLogout = () => {
    clearAuth();
    setAnchor(null);
    navigate("/login", { replace: true });
  };

  return (
    <Box sx={{
      height: 64, minHeight: 64,
      display: "flex", alignItems: "center",
      px: 3, gap: 2,
      background: "#fff",
      borderBottom: "1px solid #f1f5f9",
      flexShrink: 0, zIndex: 10,
    }}>
      {/* Left: greeting */}
      {greeting && (
        <Typography sx={{
          fontWeight: 700, fontSize: "1.05rem", color: "#0f172a",
          whiteSpace: "nowrap", letterSpacing: "-0.01em",
        }}>
          {greeting}
        </Typography>
      )}

      <Box sx={{ flex: 1 }} />

      {/* Notification bell — right side */}
      <IconButton size="small" sx={{
        width: 36, height: 36,
        background: "#f8fafc", border: "1px solid #e2e8f0", borderRadius: 2,
        "&:hover": { background: "#f1f5f9" },
      }}>
        <Badge badgeContent={3}
          sx={{ "& .MuiBadge-badge": { background: "#ef4444", color: "#fff", fontSize: "0.6rem", minWidth: 15, height: 15 } }}>
          <NotificationsIcon sx={{ fontSize: 17, color: "#64748b" }} />
        </Badge>
      </IconButton>

      <Box sx={{ width: 1, height: 28, background: "#e2e8f0", mx: 0.5 }} />

      {/* User avatar + name + role chip */}
      <Box
        onClick={(e) => setAnchor(e.currentTarget)}
        sx={{
          display: "flex", alignItems: "center", gap: 1.2,
          cursor: "pointer", px: 1.2, py: 0.6, borderRadius: 2.5,
          "&:hover": { background: "#f8fafc" }, transition: "background 0.15s",
        }}
      >
        <Avatar sx={{
          width: 32, height: 32,
          background: "linear-gradient(135deg, #4f46e5, #06b6d4)",
          fontSize: 12, fontWeight: 700,
        }}>
          {displayName[0]?.toUpperCase()}
        </Avatar>
        <Box sx={{ lineHeight: 1 }}>
          <Typography sx={{ fontWeight: 700, color: "#0f172a", fontSize: "0.85rem", lineHeight: 1.3 }}>
            {displayName}
          </Typography>
          <Chip label={role} size="small"
            sx={{
              height: 15, fontSize: "0.6rem", fontWeight: 700,
              bgcolor: rc.bg, color: rc.color,
              "& .MuiChip-label": { px: 0.8 },
            }}
          />
        </Box>
        <KeyboardArrowDownIcon sx={{ fontSize: 14, color: "#94a3b8" }} />
      </Box>

      {/* Dropdown menu with settings + logout */}
      <Menu
        anchorEl={anchor} open={Boolean(anchor)} onClose={() => setAnchor(null)}
        PaperProps={{
          sx: {
            borderRadius: 2.5, mt: 1, minWidth: 190,
            border: "1px solid #e2e8f0",
            boxShadow: "0 10px 30px rgba(0,0,0,0.1)",
          },
        }}
        transformOrigin={{ horizontal: "right", vertical: "top" }}
        anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
      >
        <Box sx={{ px: 2, py: 1.5 }}>
          <Typography sx={{ fontWeight: 700, fontSize: "0.85rem", color: "#0f172a" }}>{displayName}</Typography>
          <Typography variant="caption" color="text.secondary">{email}</Typography>
        </Box>
        <Divider sx={{ borderColor: "#f1f5f9" }} />
        <MenuItem onClick={() => setAnchor(null)} sx={{ fontSize: "0.875rem", py: 1.2, gap: 1.5 }}>
          <ListItemIcon sx={{ minWidth: 0 }}><PersonIcon fontSize="small" sx={{ color: "#64748b" }} /></ListItemIcon>
          Profile
        </MenuItem>
        <MenuItem onClick={() => setAnchor(null)} sx={{ fontSize: "0.875rem", py: 1.2, gap: 1.5 }}>
          <ListItemIcon sx={{ minWidth: 0 }}><SettingsIcon fontSize="small" sx={{ color: "#64748b" }} /></ListItemIcon>
          Settings
        </MenuItem>
        <Divider sx={{ borderColor: "#f1f5f9" }} />
        <MenuItem onClick={handleLogout} sx={{ fontSize: "0.875rem", py: 1.2, color: "#ef4444", gap: 1.5 }}>
          <ListItemIcon sx={{ minWidth: 0 }}><LogoutIcon fontSize="small" sx={{ color: "#ef4444" }} /></ListItemIcon>
          Logout
        </MenuItem>
      </Menu>
    </Box>
  );
}

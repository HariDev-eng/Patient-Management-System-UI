import React from "react";
import {
  Box, InputBase, IconButton, Badge, Avatar,
  Typography, Menu, MenuItem, Chip,
} from "@mui/material";
import SearchIcon            from "@mui/icons-material/Search";
import NotificationsIcon     from "@mui/icons-material/Notifications";
import SettingsIcon          from "@mui/icons-material/Settings";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import { useNavigate } from "react-router-dom";
import { clearAuth, getUserEmail, getUserRole } from "../../utils/auth";

const ROLE_COLORS = {
  ADMIN:        { bg: "#ede9fe", color: "#6d28d9" },
  DOCTOR:       { bg: "#dbeafe", color: "#1d4ed8" },
  NURSE:        { bg: "#dcfce7", color: "#15803d" },
  RECEPTIONIST: { bg: "#fef3c7", color: "#a16207" },
  PATIENT:      { bg: "#fce7f3", color: "#be185d" },
};

export default function Navbar({ greeting }) {
  const navigate  = useNavigate();
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
      height: 64, minHeight: 64, display: "flex", alignItems: "center",
      px: 3, gap: 2, background: "#fff",
      borderBottom: "1px solid #f1f5f9", flexShrink: 0, zIndex: 10,
    }}>
      {/* Greeting or Search */}
      {greeting ? (
        <Typography variant="h6" sx={{ fontWeight: 700, color: "#0f172a", letterSpacing: "-0.01em" }}>
          {greeting}
        </Typography>
      ) : (
        <Box sx={{
          display: "flex", alignItems: "center", gap: 1.5,
          background: "#f8fafc", border: "1px solid #e2e8f0",
          borderRadius: 2.5, px: 2, py: 0.8, flex: 1, maxWidth: 380,
          "&:focus-within": { borderColor: "#4f46e5", boxShadow: "0 0 0 3px rgba(79,70,229,0.08)" },
        }}>
          <SearchIcon sx={{ color: "#94a3b8", fontSize: 18 }} />
          <InputBase placeholder="Search…" sx={{ flex: 1, fontSize: "0.875rem", color: "#0f172a" }} />
          <Typography sx={{ fontSize: "0.65rem", color: "#cbd5e1", fontWeight: 500 }}>⌘K</Typography>
        </Box>
      )}

      <Box sx={{ flex: 1 }} />

      <IconButton size="small" sx={{ width: 36, height: 36, background: "#f8fafc", border: "1px solid #e2e8f0", borderRadius: 2 }}>
        <Badge badgeContent={3} sx={{ "& .MuiBadge-badge": { background: "#ef4444", color: "#fff", fontSize: "0.6rem", minWidth: 15, height: 15 } }}>
          <NotificationsIcon sx={{ fontSize: 17, color: "#64748b" }} />
        </Badge>
      </IconButton>

      <IconButton size="small" sx={{ width: 36, height: 36, background: "#f8fafc", border: "1px solid #e2e8f0", borderRadius: 2 }}>
        <SettingsIcon sx={{ fontSize: 17, color: "#64748b" }} />
      </IconButton>

      <Box sx={{ width: 1, height: 28, background: "#e2e8f0" }} />

      <Box onClick={(e) => setAnchor(e.currentTarget)}
        sx={{ display: "flex", alignItems: "center", gap: 1.2, cursor: "pointer",
          px: 1.2, py: 0.6, borderRadius: 2.5, "&:hover": { background: "#f8fafc" } }}>
        <Avatar sx={{ width: 32, height: 32, background: "linear-gradient(135deg, #4f46e5, #06b6d4)", fontSize: 12, fontWeight: 700 }}>
          {displayName[0]?.toUpperCase()}
        </Avatar>
        <Box>
          <Typography sx={{ fontWeight: 700, color: "#0f172a", fontSize: "0.85rem", lineHeight: 1.2 }}>
            {displayName}
          </Typography>
          <Chip label={role} size="small"
            sx={{ height: 15, fontSize: "0.6rem", fontWeight: 700, bgcolor: rc.bg, color: rc.color, "& .MuiChip-label": { px: 0.8 } }} />
        </Box>
        <KeyboardArrowDownIcon sx={{ fontSize: 15, color: "#94a3b8" }} />
      </Box>

      <Menu anchorEl={anchor} open={Boolean(anchor)} onClose={() => setAnchor(null)}
        PaperProps={{ sx: { borderRadius: 2.5, mt: 1, minWidth: 160, border: "1px solid #e2e8f0", boxShadow: "0 10px 30px rgba(0,0,0,0.1)" } }}>
        <MenuItem onClick={() => setAnchor(null)} sx={{ fontSize: "0.875rem", py: 1.2 }}>Profile</MenuItem>
        <MenuItem onClick={handleLogout} sx={{ fontSize: "0.875rem", py: 1.2, color: "#ef4444" }}>Logout</MenuItem>
      </Menu>
    </Box>
  );
}

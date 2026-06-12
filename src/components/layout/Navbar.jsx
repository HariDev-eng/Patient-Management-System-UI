import React from "react";
import {
  Box, InputBase, IconButton, Badge,
  Avatar, Typography, Menu, MenuItem,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import NotificationsIcon from "@mui/icons-material/Notifications";
import SettingsIcon from "@mui/icons-material/Settings";
import { useNavigate } from "react-router-dom";

export default function Navbar() {
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = React.useState(null);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <Box
      sx={{
        width: "100%",
        height: 64,
        minHeight: 64,
        display: "flex",
        alignItems: "center",
        px: 3,
        gap: 2,
        background: "#ffffff",
        borderBottom: "1px solid #e2e8f0",
        flexShrink: 0,
        zIndex: 10,
      }}
    >
      {/* Search */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 1,
          background: "#f8fafc",
          border: "1px solid #e2e8f0",
          borderRadius: 3,
          px: 2,
          py: 0.6,
          minWidth: 220,
          maxWidth: 360,
          flex: 1,
        }}
      >
        <InputBase
          placeholder="Search here"
          sx={{ flex: 1, fontSize: "0.88rem", color: "#475569" }}
        />
        <SearchIcon sx={{ color: "#94a3b8", fontSize: 18 }} />
      </Box>

      <Box sx={{ flex: 1 }} />

      {/* Icons */}
      <IconButton size="small">
        <Badge badgeContent={3} color="warning">
          <NotificationsIcon sx={{ color: "#64748b", fontSize: 22 }} />
        </Badge>
      </IconButton>

      <IconButton size="small">
        <SettingsIcon sx={{ color: "#64748b", fontSize: 22 }} />
      </IconButton>

      {/* User */}
      <Box
        onClick={(e) => setAnchorEl(e.currentTarget)}
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 1.2,
          cursor: "pointer",
          pl: 1,
        }}
      >
        <Avatar
          sx={{
            width: 36,
            height: 36,
            bgcolor: "#0891b2",
            fontSize: 15,
            fontWeight: 700,
          }}
        >
          J
        </Avatar>
        <Box sx={{ lineHeight: 1 }}>
          <Typography
            variant="body2"
            sx={{ fontWeight: 700, color: "#0f172a", fontSize: "0.88rem" }}
          >
            Jeo
          </Typography>
          <Typography variant="caption" sx={{ color: "#94a3b8", fontSize: "0.72rem" }}>
            acc.admin@gmail.com
          </Typography>
        </Box>
      </Box>

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={() => setAnchorEl(null)}
        PaperProps={{ sx: { borderRadius: 2, mt: 1 } }}
      >
        <MenuItem onClick={() => setAnchorEl(null)}>Profile</MenuItem>
        <MenuItem onClick={handleLogout} sx={{ color: "error.main" }}>
          Logout
        </MenuItem>
      </Menu>
    </Box>
  );
}

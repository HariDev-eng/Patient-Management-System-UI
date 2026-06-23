import React from "react";
import { Box, Avatar, Typography, IconButton, Tooltip } from "@mui/material";
import LogoutIcon from "@mui/icons-material/Logout";
import { useNavigate } from "react-router-dom";
import { clearAuth, getUserEmail, getUserRole } from "../../utils/auth";

export default function SidebarFooter({ accentColor = "#4f46e5" }) {
  const navigate    = useNavigate();
  const email       = getUserEmail();
  const role        = getUserRole();
  const displayName = email.split("@")[0] ?? "User";

  const handleLogout = () => {
    clearAuth();
    navigate("/login", { replace: true });
  };

  return (
    <Box sx={{
      mt: "auto",
      mx: 1.5, mb: 2, p: 1.5,
      borderRadius: 2.5,
      background: "rgba(255,255,255,0.06)",
      border: "1px solid rgba(255,255,255,0.08)",
      display: "flex", alignItems: "center", gap: 1.2,
    }}>
      <Avatar sx={{
        width: 34, height: 34,
        background: `linear-gradient(135deg, ${accentColor}, #06b6d4)`,
        fontSize: 13, fontWeight: 700, flexShrink: 0,
      }}>
        {displayName[0]?.toUpperCase()}
      </Avatar>
      <Box sx={{ flex: 1, minWidth: 0 }}>
        <Typography sx={{
          color: "#fff", fontWeight: 600, fontSize: "0.82rem",
          lineHeight: 1.2, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
        }}>
          {displayName}
        </Typography>
        <Typography sx={{
          color: "rgba(255,255,255,0.4)", fontSize: "0.68rem",
          overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
        }}>
          {role}
        </Typography>
      </Box>
      <Tooltip title="Logout" placement="right">
        <IconButton onClick={handleLogout} size="small"
          sx={{ color: "rgba(255,255,255,0.4)", "&:hover": { color: "#ef4444", background: "rgba(239,68,68,0.1)" }, borderRadius: 1.5 }}>
          <LogoutIcon sx={{ fontSize: 16 }} />
        </IconButton>
      </Tooltip>
    </Box>
  );
}

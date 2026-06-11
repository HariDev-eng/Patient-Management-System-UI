import React from "react";
import {
    AppBar, Toolbar, InputBase, IconButton, Badge,
    Avatar, Box, Typography, Menu, MenuItem,
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
        <AppBar
            position="static"
            elevation={0}
            sx={{ background: "#f0f9ff", borderBottom: "1px solid #e2e8f0" }}
        >
            <Toolbar sx={{ gap: 2 }}>
                {/* Search */}
                <Box
                    sx={{
                        flex: 1, maxWidth: 400,
                        display: "flex", alignItems: "center", gap: 1,
                        background: "#fff", borderRadius: 3,
                        border: "1px solid #e2e8f0",
                        px: 2, py: 0.5,
                    }}
                >
                    <InputBase placeholder="Search here" sx={{ flex: 1, fontSize: "0.9rem" }} />
                    <SearchIcon sx={{ color: "#94a3b8", fontSize: 20 }} />
                </Box>

                <Box sx={{ flex: 1 }} />

                {/* Icons */}
                <IconButton>
                    <Badge badgeContent={3} color="warning">
                        <NotificationsIcon sx={{ color: "#64748b" }} />
                    </Badge>
                </IconButton>
                <IconButton>
                    <SettingsIcon sx={{ color: "#64748b" }} />
                </IconButton>

                {/* User */}
                <Box
                    sx={{ display: "flex", alignItems: "center", gap: 1, cursor: "pointer" }}
                    onClick={(e) => setAnchorEl(e.currentTarget)}
                >
                    <Avatar src="" sx={{ width: 36, height: 36, bgcolor: "#0891b2" }}>J</Avatar>
                    <Box>
                        <Typography variant="body2" sx={{ fontWeight: 700, lineHeight: 1.2, color: "#0f172a" }}>
                            Jeo
                        </Typography>
                        <Typography variant="caption" sx={{ color: "#64748b" }}>
                            acc.admin@gmail.com
                        </Typography>
                    </Box>
                </Box>

                <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={() => setAnchorEl(null)}>
                    <MenuItem onClick={() => setAnchorEl(null)}>Profile</MenuItem>
                    <MenuItem onClick={handleLogout}>Logout</MenuItem>
                </Menu>
            </Toolbar>
        </AppBar>
    );
}
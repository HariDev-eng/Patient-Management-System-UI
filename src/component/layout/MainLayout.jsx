import React from "react";
import { Box } from "@mui/material";
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";

export default function MainLayout({ children }) {
    return (
        <Box sx={{ display: "flex", minHeight: "100vh", background: "#f0f9ff" }}>
            <Sidebar />
            <Box sx={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>
                <Navbar />
                <Box sx={{ flex: 1, p: 3, overflowY: "auto" }}>
                    {children}
                </Box>
            </Box>
        </Box>
    );
}
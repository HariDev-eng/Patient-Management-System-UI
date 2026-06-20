import React from "react";
import { Box } from "@mui/material";
import Navbar from "./Navbar";

export default function PortalLayout({ sidebar: Sidebar, children, greeting }) {
  return (
    <Box sx={{ display: "flex", width: "100vw", height: "100vh", overflow: "hidden", background: "#f1f5f9" }}>
      <Box sx={{ width: 220, minWidth: 220, height: "100vh", flexShrink: 0, overflowY: "auto", "&::-webkit-scrollbar": { display: "none" } }}>
        <Sidebar />
      </Box>
      <Box sx={{ flex: 1, display: "flex", flexDirection: "column", height: "100vh", overflow: "hidden", minWidth: 0 }}>
        <Navbar greeting={greeting} />
        <Box sx={{ flex: 1, overflowY: "auto", p: 3, background: "#f1f5f9" }}>
          {children}
        </Box>
      </Box>
    </Box>
  );
}

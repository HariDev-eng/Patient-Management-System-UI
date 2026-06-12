import React from "react";
import { Box } from "@mui/material";
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";

export default function MainLayout({ children }) {
  return (
    <Box
      sx={{
        display: "flex",
        width: "100vw",
        height: "100vh",
        overflow: "hidden",
        background: "#f0f9ff",
      }}
    >
      {/* Sidebar - fixed left */}
      <Box
        sx={{
          width: 220,
          minWidth: 220,
          height: "100vh",
          overflowY: "auto",
          overflowX: "hidden",
          flexShrink: 0,
          "&::-webkit-scrollbar": { display: "none" },
        }}
      >
        <Sidebar />
      </Box>

      {/* Right side: Navbar + Page content */}
      <Box
        sx={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          height: "100vh",
          overflow: "hidden",
          minWidth: 0,
        }}
      >
        <Navbar />
        <Box
          sx={{
            flex: 1,
            overflowY: "auto",
            overflowX: "hidden",
            p: 3,
            background: "#f0f9ff",
          }}
        >
          {children}
        </Box>
      </Box>
    </Box>
  );
}

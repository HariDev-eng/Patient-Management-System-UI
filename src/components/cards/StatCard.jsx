import React from "react";
import { Box, Typography } from "@mui/material";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";

export default function StatCard({ title, value, icon, color = "#4f46e5", bg, trend, onClick }) {
  return (
    <Box onClick={onClick}
      sx={{
        borderRadius: 3, background: "#fff", border: "1px solid #e2e8f0",
        p: 2.5, position: "relative", overflow: "hidden",
        boxShadow: "0 1px 3px rgba(0,0,0,0.04)",
        cursor: onClick ? "pointer" : "default",
        transition: "transform 0.2s, box-shadow 0.2s",
        "&:hover": onClick ? { transform: "translateY(-2px)", boxShadow: "0 8px 24px rgba(0,0,0,0.08)" } : {},
        "&::before": { content:'""', position:"absolute", top:0, left:0, right:0, height:3,
          background:`linear-gradient(90deg, ${color}, ${color}88)` },
      }}>
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <Box>
          <Typography sx={{ fontSize: "0.72rem", fontWeight: 600, color: "#94a3b8",
            textTransform: "uppercase", letterSpacing: "0.06em", mb: 0.8 }}>
            {title}
          </Typography>
          <Typography sx={{ fontSize: "2rem", fontWeight: 800, color: "#0f172a",
            letterSpacing: "-0.03em", lineHeight: 1 }}>
            {value}
          </Typography>
          {trend && (
            <Box sx={{ display: "flex", alignItems: "center", gap: 0.5, mt: 0.8 }}>
              <TrendingUpIcon sx={{ fontSize: 13, color: "#10b981" }} />
              <Typography sx={{ fontSize: "0.72rem", color: "#10b981", fontWeight: 600 }}>{trend}</Typography>
            </Box>
          )}
        </Box>
        <Box sx={{ width: 44, height: 44, borderRadius: 2.5, bgcolor: bg ?? `${color}18`,
          display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
          {React.cloneElement(icon, { sx: { color, fontSize: 20 } })}
        </Box>
      </Box>
    </Box>
  );
}

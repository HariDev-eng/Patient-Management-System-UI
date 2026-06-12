import React from "react";
import { Card, CardContent, Box, Typography } from "@mui/material";

export default function StatCard({ title, value, icon, color = "#0891b2", bg = "#e0f2fe" }) {
  return (
    <Card
      sx={{
        borderRadius: 3,
        border: "1px solid #e2e8f0",
        boxShadow: "0 1px 6px rgba(0,0,0,0.06)",
      }}
    >
      <CardContent
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 2,
          p: "20px !important",
        }}
      >
        <Box
          sx={{
            width: 54,
            height: 54,
            borderRadius: 2.5,
            background: bg,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
          }}
        >
          {React.cloneElement(icon, { sx: { color, fontSize: 26 } })}
        </Box>
        <Box>
          <Typography variant="h5" sx={{ fontWeight: 800, color: "#0f172a", lineHeight: 1 }}>
            {value}
          </Typography>
          <Typography variant="body2" sx={{ color: "#64748b", mt: 0.4 }}>
            {title}
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );
}

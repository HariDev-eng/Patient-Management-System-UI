import React from "react";
import { Card, CardContent, Box, Typography, Chip } from "@mui/material";

export default function InfoCard({ title, subtitle, status, children, action }) {
  return (
    <Card sx={{ borderRadius: 3, border: "1px solid #e2e8f0", boxShadow: "0 1px 6px rgba(0,0,0,0.06)" }}>
      <CardContent sx={{ p: "20px !important" }}>
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", mb: 1.5 }}>
          <Box>
            {title && (
              <Typography variant="subtitle1" sx={{ fontWeight: 700, color: "#0f172a" }}>
                {title}
              </Typography>
            )}
            {subtitle && (
              <Typography variant="caption" sx={{ color: "#64748b" }}>
                {subtitle}
              </Typography>
            )}
          </Box>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            {status && (
              <Chip label={status} size="small" sx={{ fontWeight: 600, fontSize: "0.72rem" }} />
            )}
            {action}
          </Box>
        </Box>
        {children}
      </CardContent>
    </Card>
  );
}

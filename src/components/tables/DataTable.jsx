import React from "react";
import {
  Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, IconButton, Menu, MenuItem,
  Box, Typography, CircularProgress, Chip,
} from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";

const STATUS_MAP = {
  // patient
  ACTIVE:    { bg: "#dcfce7", color: "#15803d" },
  INACTIVE:  { bg: "#f1f5f9", color: "#64748b" },
  DECEASED:  { bg: "#fee2e2", color: "#dc2626" },
  // appointment
  SCHEDULED: { bg: "#dbeafe", color: "#1d4ed8" },
  CONFIRMED: { bg: "#ede9fe", color: "#6d28d9" },
  COMPLETED: { bg: "#dcfce7", color: "#15803d" },
  CANCELLED: { bg: "#fee2e2", color: "#dc2626" },
  NO_SHOW:   { bg: "#fff7ed", color: "#c2410c" },
  // billing
  PENDING:   { bg: "#fef9c3", color: "#a16207" },
  PAID:      { bg: "#dcfce7", color: "#15803d" },
  FAILED:    { bg: "#fee2e2", color: "#dc2626" },
  // general
  Complete:  { bg: "#dcfce7", color: "#15803d" },
  Pending:   { bg: "#fef9c3", color: "#a16207" },
};

export default function DataTable({ columns, rows, loading, onEdit, onDelete, actions }) {
  const [menuAnchor, setMenuAnchor] = React.useState(null);
  const [menuRow,    setMenuRow]    = React.useState(null);

  const openMenu  = (e, row) => { setMenuAnchor(e.currentTarget); setMenuRow(row); };
  const closeMenu = () => { setMenuAnchor(null); setMenuRow(null); };

  const hasActions = onEdit || onDelete || actions?.length;

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", py: 8 }}>
        <CircularProgress size={32} sx={{ color: "#06b6d4" }} />
      </Box>
    );
  }

  if (!rows?.length) {
    return (
      <Box sx={{ textAlign: "center", py: 8 }}>
        <Box sx={{
          width: 56, height: 56, borderRadius: "50%",
          background: "#f1f5f9", display: "flex",
          alignItems: "center", justifyContent: "center",
          mx: "auto", mb: 2,
        }}>
          <Typography sx={{ fontSize: "1.5rem" }}>📋</Typography>
        </Box>
        <Typography variant="body2" sx={{ color: "#94a3b8", fontWeight: 500 }}>
          No records found
        </Typography>
        <Typography variant="caption" sx={{ color: "#cbd5e1" }}>
          Records will appear here once added
        </Typography>
      </Box>
    );
  }

  return (
    <TableContainer sx={{ borderRadius: 2, overflow: "hidden", border: "1px solid #f1f5f9" }}>
      <Table size="small">
        <TableHead>
          <TableRow>
            {columns.map((col) => (
              <TableCell key={col.key}>{col.label}</TableCell>
            ))}
            {hasActions && <TableCell align="right"></TableCell>}
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row, idx) => (
            <TableRow key={row.id ?? row._id ?? idx}>
              {columns.map((col) => (
                <TableCell key={col.key}>
                  {col.isStatus ? (
                    (() => {
                      const s = STATUS_MAP[row[col.key]];
                      return (
                        <Chip
                          label={row[col.key] ?? "—"}
                          size="small"
                          sx={{
                            bgcolor: s?.bg ?? "#f1f5f9",
                            color:   s?.color ?? "#64748b",
                            fontWeight: 600, fontSize: "0.7rem",
                            height: 22, borderRadius: 1.5,
                            "& .MuiChip-label": { px: 1 },
                          }}
                        />
                      );
                    })()
                  ) : col.render ? col.render(row) : (
                    <Typography sx={{ fontSize: "0.875rem", color: "#334155" }}>
                      {row[col.key] ?? "—"}
                    </Typography>
                  )}
                </TableCell>
              ))}
              {hasActions && (
                <TableCell align="right">
                  <IconButton size="small" onClick={(e) => openMenu(e, row)}
                    sx={{
                      width: 28, height: 28, borderRadius: 1.5,
                      "&:hover": { background: "#f1f5f9" },
                    }}>
                    <MoreVertIcon sx={{ fontSize: 16, color: "#94a3b8" }} />
                  </IconButton>
                </TableCell>
              )}
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <Menu anchorEl={menuAnchor} open={Boolean(menuAnchor)} onClose={closeMenu}
        PaperProps={{
          sx: {
            borderRadius: 2.5, mt: 0.5, minWidth: 160,
            border: "1px solid #e2e8f0",
            boxShadow: "0 10px 30px rgba(0,0,0,0.1)",
          },
        }}>
        {onEdit && (
          <MenuItem onClick={() => { onEdit(menuRow); closeMenu(); }}
            sx={{ fontSize: "0.875rem", py: 1.2, color: "#0f172a" }}>
            Edit
          </MenuItem>
        )}
        {actions?.map((a) => (
          <MenuItem key={a.label} onClick={() => { a.onClick(menuRow); closeMenu(); }}
            sx={{ fontSize: "0.875rem", py: 1.2, color: "#0f172a" }}>
            {a.label}
          </MenuItem>
        ))}
        {onDelete && (
          <MenuItem onClick={() => { onDelete(menuRow); closeMenu(); }}
            sx={{ fontSize: "0.875rem", py: 1.2, color: "#ef4444" }}>
            Delete
          </MenuItem>
        )}
      </Menu>
    </TableContainer>
  );
}

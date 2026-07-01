import React from "react";
import {
    Table, TableBody, TableCell, TableContainer,
    TableHead, TableRow, IconButton, Menu, MenuItem,
    Box, Typography, CircularProgress, Chip,
} from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";

const STATUS_MAP = {
    ACTIVE:    { bg: "#dcfce7", color: "#15803d" },
    INACTIVE:  { bg: "#f1f5f9", color: "#64748b" },
    DECEASED:  { bg: "#fee2e2", color: "#dc2626" },
    SCHEDULED: { bg: "#dbeafe", color: "#1d4ed8" },
    CONFIRMED: { bg: "#ede9fe", color: "#6d28d9" },
    COMPLETED: { bg: "#dcfce7", color: "#15803d" },
    CANCELLED: { bg: "#fee2e2", color: "#dc2626" },
    NO_SHOW:   { bg: "#fff7ed", color: "#c2410c" },
    PENDING:   { bg: "#fef9c3", color: "#a16207" },
    PAID:      { bg: "#dcfce7", color: "#15803d" },
    FAILED:    { bg: "#fee2e2", color: "#dc2626" },
};

export default function DataTable({ columns, rows, loading, onEdit, onDelete, actions }) {
    const [menuAnchor, setMenuAnchor] = React.useState(null);
    const [menuRow,    setMenuRow]    = React.useState(null);

    const openMenu  = (e, row) => { setMenuAnchor(e.currentTarget); setMenuRow(row); };
    const closeMenu = () => { setMenuAnchor(null); setMenuRow(null); };

    const hasActions = onEdit || onDelete || actions?.length;

    if (loading) {
        return (
            <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", py: 6 }}>
                <CircularProgress size={28} sx={{ color: "#4f46e5" }} />
            </Box>
        );
    }

    if (!rows?.length) {
        return (
            <Box sx={{ textAlign: "center", py: 5 }}>
                <Typography sx={{ fontSize: "0.85rem", color: "#cbd5e1", fontWeight: 500 }}>
                    No records found
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
                            <TableCell key={col.key} sx={{
                                fontWeight: 600, fontSize: "0.7rem", textTransform: "uppercase",
                                letterSpacing: "0.05em", color: "#94a3b8", backgroundColor: "#f8fafc",
                                borderBottom: "1px solid #e2e8f0", py: 1.2,
                            }}>
                                {col.label}
                            </TableCell>
                        ))}
                        {hasActions && <TableCell align="right" sx={{ backgroundColor: "#f8fafc" }} />}
                    </TableRow>
                </TableHead>
                <TableBody>
                    {rows.map((row, idx) => (
                        <TableRow key={row.id ?? row._id ?? idx}
                                  sx={{ "&:hover": { backgroundColor: "#f8fafc" }, "&:last-child td": { border: 0 } }}>
                            {columns.map((col) => (
                                <TableCell key={col.key} sx={{ borderBottom: "1px solid #f1f5f9", py: 1.3, fontSize: "0.82rem" }}>
                                    {col.isStatus ? (
                                        (() => {
                                            const s = STATUS_MAP[row[col.key]];
                                            return (
                                                <Chip label={row[col.key] ?? "—"} size="small"
                                                      sx={{
                                                          bgcolor: s?.bg ?? "#f1f5f9", color: s?.color ?? "#64748b",
                                                          fontWeight: 600, fontSize: "0.68rem", height: 20, borderRadius: 1.5,
                                                          "& .MuiChip-label": { px: 1 },
                                                      }} />
                                            );
                                        })()
                                    ) : col.render ? col.render(row) : (
                                        <Typography sx={{ fontSize: "0.82rem", color: "#334155" }}>
                                            {row[col.key] ?? "—"}
                                        </Typography>
                                    )}
                                </TableCell>
                            ))}
                            {hasActions && (
                                <TableCell align="right" sx={{ borderBottom: "1px solid #f1f5f9" }}>
                                    <IconButton size="small" onClick={(e) => openMenu(e, row)}
                                                sx={{ width: 26, height: 26, "&:hover": { background: "#f1f5f9" } }}>
                                        <MoreVertIcon sx={{ fontSize: 15, color: "#94a3b8" }} />
                                    </IconButton>
                                </TableCell>
                            )}
                        </TableRow>
                    ))}
                </TableBody>
            </Table>

            <Menu anchorEl={menuAnchor} open={Boolean(menuAnchor)} onClose={closeMenu}
                  PaperProps={{ sx: { borderRadius: 2.5, mt: 0.5, minWidth: 150, border: "1px solid #e2e8f0", boxShadow: "0 10px 30px rgba(0,0,0,0.1)" } }}>
                {onEdit && (
                    <MenuItem onClick={() => { onEdit(menuRow); closeMenu(); }} sx={{ fontSize: "0.85rem", py: 1.1 }}>
                        Edit
                    </MenuItem>
                )}
                {actions?.map((a) => (
                    <MenuItem key={a.label} onClick={() => { a.onClick(menuRow); closeMenu(); }} sx={{ fontSize: "0.85rem", py: 1.1 }}>
                        {a.label}
                    </MenuItem>
                ))}
                {onDelete && (
                    <MenuItem onClick={() => { onDelete(menuRow); closeMenu(); }} sx={{ fontSize: "0.85rem", py: 1.1, color: "#ef4444" }}>
                        Delete
                    </MenuItem>
                )}
            </Menu>
        </TableContainer>
    );
}
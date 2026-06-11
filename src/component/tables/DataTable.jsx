import React from "react";
import {
    Table, TableBody, TableCell, TableContainer,
    TableHead, TableRow, Paper, IconButton,
    Menu, MenuItem, Chip, CircularProgress, Box, Typography,
} from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";

const statusStyles = {
    Pending:   { bg: "#fef3c7", color: "#d97706" },
    PENDING:   { bg: "#fef3c7", color: "#d97706" },
    Complete:  { bg: "#d1fae5", color: "#059669" },
    COMPLETE:  { bg: "#d1fae5", color: "#059669" },
    COMPLETED: { bg: "#d1fae5", color: "#059669" },
    SCHEDULED: { bg: "#dbeafe", color: "#2563eb" },
    CANCELLED: { bg: "#fee2e2", color: "#dc2626" },
    PAID:      { bg: "#d1fae5", color: "#059669" },
    FAILED:    { bg: "#fee2e2", color: "#dc2626" },
};

export default function DataTable({ columns, rows, loading, onEdit, onDelete, actions }) {
    const [menuAnchor, setMenuAnchor] = React.useState(null);
    const [menuRow, setMenuRow] = React.useState(null);

    const openMenu = (e, row) => {
        setMenuAnchor(e.currentTarget);
        setMenuRow(row);
    };
    const closeMenu = () => { setMenuAnchor(null); setMenuRow(null); };

    if (loading) {
        return (
            <Box sx={{ display: "flex", justifyContent: "center", py: 6 }}>
                <CircularProgress sx={{ color: "#0891b2" }} />
            </Box>
        );
    }

    if (!rows?.length) {
        return (
            <Box sx={{ textAlign: "center", py: 6 }}>
                <Typography color="text.secondary">No records found.</Typography>
            </Box>
        );
    }

    return (
        <TableContainer component={Paper} elevation={0} sx={{ border: "none" }}>
            <Table size="small">
                <TableHead>
                    <TableRow>
                        {columns.map((col) => (
                            <TableCell key={col.key} sx={{ fontWeight: 700, whiteSpace: "nowrap" }}>
                                {col.label}
                            </TableCell>
                        ))}
                        <TableCell sx={{ fontWeight: 700 }}>Action</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {rows.map((row, idx) => (
                        <TableRow
                            key={row.id ?? idx}
                            hover
                            sx={{ "&:last-child td": { border: 0 } }}
                        >
                            {columns.map((col) => (
                                <TableCell key={col.key}>
                                    {col.isStatus ? (
                                        <Chip
                                            label={row[col.key]}
                                            size="small"
                                            sx={{
                                                backgroundColor: statusStyles[row[col.key]]?.bg ?? "#f1f5f9",
                                                color: statusStyles[row[col.key]]?.color ?? "#64748b",
                                                fontWeight: 600, fontSize: "0.72rem",
                                            }}
                                        />
                                    ) : col.render ? col.render(row) : row[col.key] ?? "—"}
                                </TableCell>
                            ))}
                            <TableCell>
                                <IconButton size="small" onClick={(e) => openMenu(e, row)}>
                                    <MoreVertIcon fontSize="small" />
                                </IconButton>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>

            <Menu anchorEl={menuAnchor} open={Boolean(menuAnchor)} onClose={closeMenu}>
                {onEdit && (
                    <MenuItem onClick={() => { onEdit(menuRow); closeMenu(); }}>Edit</MenuItem>
                )}
                {actions?.map((a) => (
                    <MenuItem key={a.label} onClick={() => { a.onClick(menuRow); closeMenu(); }}>
                        {a.label}
                    </MenuItem>
                ))}
                {onDelete && (
                    <MenuItem
                        onClick={() => { onDelete(menuRow); closeMenu(); }}
                        sx={{ color: "error.main" }}
                    >
                        Delete
                    </MenuItem>
                )}
            </Menu>
        </TableContainer>
    );
}
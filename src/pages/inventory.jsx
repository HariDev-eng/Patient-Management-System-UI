import React, { useEffect, useState } from "react";
import {
    Box, Card, CardContent, Typography, Button, TextField,
    InputAdornment, Dialog, DialogTitle, DialogContent,
    DialogActions, Snackbar, Alert, Chip,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import SearchIcon from "@mui/icons-material/Search";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";
import MainLayout from "../components/layout/MainLayout";
import DataTable from "../components/tables/DataTable";
import { inventoryApi } from "../api/inventoryApi";

const columns = [
    { key: "itemId",   label: "Item ID" },
    { key: "name",     label: "Item Name" },
    { key: "category", label: "Category" },
    { key: "quantity", label: "Quantity",
        render: (r) => (
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                {r.quantity}
                {r.quantity <= (r.minStock ?? 10) && (
                    <Chip label="Low" size="small"
                          sx={{ bgcolor: "#fee2e2", color: "#dc2626", fontWeight: 700, fontSize: "0.7rem" }} />
                )}
            </Box>
        ),
    },
    { key: "unit",     label: "Unit" },
    { key: "price",    label: "Price (₹)", render: (r) => r.price ? `₹${r.price}` : "—" },
    { key: "supplier", label: "Supplier" },
];

const empty = { name: "", category: "", quantity: "", unit: "", price: "", supplier: "", minStock: 10 };

export default function Inventory() {
    const [rows, setRows]          = useState([]);
    const [loading, setLoading]    = useState(true);
    const [search, setSearch]      = useState("");
    const [showLow, setShowLow]    = useState(false);
    const [lowCount, setLowCount]  = useState(0);
    const [open, setOpen]          = useState(false);
    const [form, setForm]          = useState(empty);
    const [editId, setEditId]      = useState(null);
    const [saving, setSaving]      = useState(false);
    const [snack, setSnack]        = useState({ open: false, msg: "", severity: "success" });

    const load = async (lowOnly = showLow) => {
        setLoading(true);
        try {
            const res = lowOnly
                ? await inventoryApi.getLowStock()
                : await inventoryApi.getAll();
            setRows(res.data);

            // low-stock badge
            const all = (await inventoryApi.getLowStock()).data;
            setLowCount(all.length);
        } catch { setRows([]); }
        finally { setLoading(false); }
    };

    useEffect(() => { load(); }, [showLow]);

    const handleSearch = async (e) => {
        const val = e.target.value;
        setSearch(val);
        if (val.trim().length > 1) {
            try { const res = await inventoryApi.search(val.trim()); setRows(res.data); }
            catch { /* ignore */ }
        } else if (!val.trim()) { load(); }
    };

    const toast = (msg, severity = "success") => setSnack({ open: true, msg, severity });
    const openAdd  = () => { setForm(empty); setEditId(null); setOpen(true); };
    const openEdit = (row) => { setForm({ ...row }); setEditId(row.id); setOpen(true); };

    const handleSave = async () => {
        setSaving(true);
        try {
            editId ? await inventoryApi.update(editId, form) : await inventoryApi.create(form);
            toast(`Item ${editId ? "updated" : "added"}.`);
            setOpen(false); load();
        } catch (err) {
            toast(err.response?.data?.message ?? "Failed to save.", "error");
        } finally { setSaving(false); }
    };

    const handleDelete = async (row) => {
        if (!window.confirm(`Delete "${row.name}"?`)) return;
        try { await inventoryApi.delete(row.id); toast("Item deleted."); load(); }
        catch { toast("Failed to delete.", "error"); }
    };

    const f = (key, label, type = "text") => (
        <TextField key={key} label={label} type={type} fullWidth size="small"
                   value={form[key] ?? ""} onChange={(e) => setForm({ ...form, [key]: e.target.value })}
                   sx={{ mb: 2 }} />
    );

    return (
        <MainLayout>
            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2.5 }}>
                <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                    <Typography variant="h5">Inventory</Typography>
                    {lowCount > 0 && (
                        <Chip
                            icon={<WarningAmberIcon fontSize="small" />}
                            label={`${lowCount} low stock`}
                            size="small"
                            sx={{ bgcolor: "#fef3c7", color: "#d97706", fontWeight: 700 }}
                            onClick={() => setShowLow((p) => !p)}
                        />
                    )}
                </Box>
                <Box sx={{ display: "flex", gap: 1.5 }}>
                    <Button
                        variant={showLow ? "contained" : "outlined"}
                        color="warning" size="small"
                        onClick={() => setShowLow((p) => !p)}
                    >
                        {showLow ? "Show All" : "Low Stock Only"}
                    </Button>
                    <Button variant="contained" startIcon={<AddIcon />} onClick={openAdd}>Add Item</Button>
                </Box>
            </Box>

            <Card>
                <CardContent>
                    <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
                        <Typography variant="h6">
                            {showLow ? "Low Stock Items" : "All Inventory Items"}
                        </Typography>
                        <TextField
                            size="small" placeholder="Search by item name…"
                            value={search} onChange={handleSearch}
                            InputProps={{ startAdornment: <InputAdornment position="start"><SearchIcon fontSize="small" sx={{ color: "#94a3b8" }} /></InputAdornment> }}
                            sx={{ width: 260 }}
                        />
                    </Box>
                    <DataTable columns={columns} rows={rows} loading={loading} onEdit={openEdit} onDelete={handleDelete} />
                </CardContent>
            </Card>

            <Dialog open={open} onClose={() => setOpen(false)} maxWidth="sm" fullWidth>
                <DialogTitle sx={{ fontWeight: 700 }}>{editId ? "Edit Item" : "Add Inventory Item"}</DialogTitle>
                <DialogContent sx={{ pt: "16px !important" }}>
                    {f("name",      "Item Name")}
                    {f("category",  "Category")}
                    {f("quantity",  "Quantity",    "number")}
                    {f("unit",      "Unit (e.g. tablets, ml)")}
                    {f("price",     "Price (₹)",   "number")}
                    {f("supplier",  "Supplier")}
                    {f("minStock",  "Min Stock (alert threshold)", "number")}
                </DialogContent>
                <DialogActions sx={{ px: 3, pb: 2 }}>
                    <Button onClick={() => setOpen(false)} color="inherit">Cancel</Button>
                    <Button variant="contained" onClick={handleSave} disabled={saving}>
                        {saving ? "Saving…" : editId ? "Update" : "Add"}
                    </Button>
                </DialogActions>
            </Dialog>

            <Snackbar open={snack.open} autoHideDuration={3000}
                      onClose={() => setSnack({ ...snack, open: false })}
                      anchorOrigin={{ vertical: "bottom", horizontal: "right" }}>
                <Alert severity={snack.severity} variant="filled" onClose={() => setSnack({ ...snack, open: false })}>
                    {snack.msg}
                </Alert>
            </Snackbar>
        </MainLayout>
    );
}
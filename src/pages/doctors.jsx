import React, { useEffect, useState } from "react";
import {
    Box, Card, CardContent, Typography, Button, TextField,
    InputAdornment, Dialog, DialogTitle, DialogContent,
    DialogActions, Snackbar, Alert, Chip,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import SearchIcon from "@mui/icons-material/Search";
import MainLayout from "../components/layout/MainLayout";
import DataTable from "../components/tables/DataTable";
import { doctorApi } from "../api/doctorApi";

const SPECIALIZATIONS = [
    "CARDIOLOGY","NEUROLOGY","ORTHOPEDICS","PEDIATRICS",
    "DERMATOLOGY","GENERAL","ONCOLOGY","RADIOLOGY",
];

const columns = [
    { key: "name",           label: "Doctor Name" },
    { key: "doctorId",       label: "Doctor ID" },
    { key: "specialization", label: "Specialization" },
    { key: "email",          label: "Email" },
    { key: "phone",          label: "Phone" },
    { key: "status",         label: "Status", isStatus: true },
];

const empty = { name: "", specialization: "GENERAL", email: "", phone: "", status: "Complete" };

export default function Doctors() {
    const [rows, setRows]       = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch]   = useState("");
    const [open, setOpen]       = useState(false);
    const [form, setForm]       = useState(empty);
    const [editId, setEditId]   = useState(null);
    const [saving, setSaving]   = useState(false);
    const [snack, setSnack]     = useState({ open: false, msg: "", severity: "success" });

    const load = async () => {
        setLoading(true);
        try { const res = await doctorApi.getAll(); setRows(res.data); }
        catch { setRows([]); }
        finally { setLoading(false); }
    };

    useEffect(() => { load(); }, []);

    const toast = (msg, severity = "success") => setSnack({ open: true, msg, severity });

    const openAdd  = () => { setForm(empty); setEditId(null); setOpen(true); };
    const openEdit = (row) => { setForm({ ...row }); setEditId(row.id); setOpen(true); };

    const handleSave = async () => {
        setSaving(true);
        try {
            editId ? await doctorApi.update(editId, form) : await doctorApi.create(form);
            toast(`Doctor ${editId ? "updated" : "added"} successfully.`);
            setOpen(false); load();
        } catch (err) {
            toast(err.response?.data?.message ?? "Failed to save.", "error");
        } finally { setSaving(false); }
    };

    const handleDelete = async (row) => {
        if (!window.confirm(`Delete Dr. ${row.name}?`)) return;
        try { await doctorApi.delete(row.id); toast("Doctor deleted."); load(); }
        catch { toast("Failed to delete.", "error"); }
    };

    const filtered = rows.filter((r) =>
        !search || r.name?.toLowerCase().includes(search.toLowerCase())
    );

    const f = (key, label, type = "text") => (
        <TextField key={key} label={label} type={type} fullWidth size="small"
                   value={form[key] ?? ""} onChange={(e) => setForm({ ...form, [key]: e.target.value })}
                   sx={{ mb: 2 }} />
    );

    return (
        <MainLayout>
            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2.5 }}>
                <Typography variant="h5">Doctors</Typography>
                <Button variant="contained" startIcon={<AddIcon />} onClick={openAdd}>Add Doctor</Button>
            </Box>

            <Card>
                <CardContent>
                    <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
                        <Typography variant="h6">Doctor details</Typography>
                        <TextField
                            size="small" placeholder="Search by name…"
                            value={search} onChange={(e) => setSearch(e.target.value)}
                            InputProps={{ startAdornment: <InputAdornment position="start"><SearchIcon fontSize="small" sx={{ color: "#94a3b8" }} /></InputAdornment> }}
                            sx={{ width: 240 }}
                        />
                    </Box>
                    <DataTable columns={columns} rows={filtered} loading={loading} onEdit={openEdit} onDelete={handleDelete} />
                </CardContent>
            </Card>

            <Dialog open={open} onClose={() => setOpen(false)} maxWidth="sm" fullWidth>
                <DialogTitle sx={{ fontWeight: 700 }}>{editId ? "Edit Doctor" : "Add Doctor"}</DialogTitle>
                <DialogContent sx={{ pt: "16px !important" }}>
                    {f("name",  "Full Name")}
                    {f("email", "Email", "email")}
                    {f("phone", "Phone")}
                    <TextField
                        select label="Specialization" fullWidth size="small"
                        value={form.specialization ?? "GENERAL"}
                        onChange={(e) => setForm({ ...form, specialization: e.target.value })}
                        SelectProps={{ native: true }} sx={{ mb: 2 }}
                    >
                        {SPECIALIZATIONS.map((s) => <option key={s} value={s}>{s}</option>)}
                    </TextField>
                    <TextField
                        select label="Status" fullWidth size="small"
                        value={form.status ?? "Complete"}
                        onChange={(e) => setForm({ ...form, status: e.target.value })}
                        SelectProps={{ native: true }}
                    >
                        <option value="Complete">Active</option>
                        <option value="Pending">On Leave</option>
                    </TextField>
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
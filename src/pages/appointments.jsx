import React, { useEffect, useState } from "react";
import {
    Box, Card, CardContent, Typography, Button, TextField,
    InputAdornment, Dialog, DialogTitle, DialogContent,
    DialogActions, Snackbar, Alert, Tabs, Tab,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import SearchIcon from "@mui/icons-material/Search";
import MainLayout from "../components/layout/MainLayout";
import DataTable from "../components/tables/DataTable";
import { appointmentApi } from "../api/appointmentApi";

const columns = [
    { key: "appointmentId", label: "Appt. ID" },
    { key: "patientName",   label: "Patient" },
    { key: "doctorName",    label: "Doctor" },
    { key: "date",          label: "Date" },
    { key: "time",          label: "Time" },
    { key: "reason",        label: "Reason" },
    { key: "status",        label: "Status", isStatus: true },
];

const TABS = ["ALL", "SCHEDULED", "COMPLETED", "CANCELLED"];
const empty = { patientName: "", doctorName: "", date: "", time: "", reason: "" };

export default function Appointments() {
    const [rows, setRows]       = useState([]);
    const [loading, setLoading] = useState(true);
    const [tab, setTab]         = useState(0);
    const [search, setSearch]   = useState("");
    const [open, setOpen]       = useState(false);
    const [form, setForm]       = useState(empty);
    const [editId, setEditId]   = useState(null);
    const [saving, setSaving]   = useState(false);
    const [snack, setSnack]     = useState({ open: false, msg: "", severity: "success" });

    const load = async () => {
        setLoading(true);
        try {
            const status = TABS[tab];
            const res = status === "ALL"
                ? await appointmentApi.getAll()
                : await appointmentApi.getByStatus(status);
            setRows(res.data);
        } catch { setRows([]); }
        finally { setLoading(false); }
    };

    useEffect(() => { load(); }, [tab]);

    const toast = (msg, severity = "success") => setSnack({ open: true, msg, severity });
    const openAdd  = () => { setForm(empty); setEditId(null); setOpen(true); };
    const openEdit = (row) => { setForm({ ...row }); setEditId(row.id); setOpen(true); };

    const handleSave = async () => {
        setSaving(true);
        try {
            editId
                ? await appointmentApi.updateStatus(editId, form.status ?? "SCHEDULED")
                : await appointmentApi.create(form);
            toast(`Appointment ${editId ? "updated" : "created"}.`);
            setOpen(false); load();
        } catch (err) {
            toast(err.response?.data?.message ?? "Failed to save.", "error");
        } finally { setSaving(false); }
    };

    const handleDelete = async (row) => {
        if (!window.confirm("Cancel this appointment?")) return;
        try { await appointmentApi.delete(row.id); toast("Appointment removed."); load(); }
        catch { toast("Failed to remove.", "error"); }
    };

    const changeStatus = async (row, status) => {
        try { await appointmentApi.updateStatus(row.id, status); toast(`Status → ${status}`); load(); }
        catch { toast("Status update failed.", "error"); }
    };

    const filtered = rows.filter((r) =>
        !search ||
        r.patientName?.toLowerCase().includes(search.toLowerCase()) ||
        r.doctorName?.toLowerCase().includes(search.toLowerCase())
    );

    const f = (key, label, type = "text") => (
        <TextField key={key} label={label} type={type} fullWidth size="small"
                   value={form[key] ?? ""} onChange={(e) => setForm({ ...form, [key]: e.target.value })}
                   sx={{ mb: 2 }} />
    );

    return (
        <MainLayout>
            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2.5 }}>
                <Typography variant="h5">Appointments</Typography>
                <Button variant="contained" startIcon={<AddIcon />} onClick={openAdd}>New Appointment</Button>
            </Box>

            <Card>
                <CardContent>
                    <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
                        <Tabs value={tab} onChange={(_, v) => setTab(v)}
                              sx={{ "& .MuiTab-root": { textTransform: "none", fontWeight: 600, minWidth: 90 } }}>
                            {TABS.map((t) => <Tab key={t} label={t} />)}
                        </Tabs>
                        <TextField
                            size="small" placeholder="Search patient / doctor…"
                            value={search} onChange={(e) => setSearch(e.target.value)}
                            InputProps={{ startAdornment: <InputAdornment position="start"><SearchIcon fontSize="small" sx={{ color: "#94a3b8" }} /></InputAdornment> }}
                            sx={{ width: 260 }}
                        />
                    </Box>
                    <DataTable
                        columns={columns} rows={filtered} loading={loading}
                        onEdit={openEdit} onDelete={handleDelete}
                        actions={[
                            { label: "Mark Scheduled",  onClick: (r) => changeStatus(r, "SCHEDULED") },
                            { label: "Mark Completed",  onClick: (r) => changeStatus(r, "COMPLETED") },
                            { label: "Mark Cancelled",  onClick: (r) => changeStatus(r, "CANCELLED") },
                        ]}
                    />
                </CardContent>
            </Card>

            <Dialog open={open} onClose={() => setOpen(false)} maxWidth="sm" fullWidth>
                <DialogTitle sx={{ fontWeight: 700 }}>{editId ? "Edit Appointment" : "New Appointment"}</DialogTitle>
                <DialogContent sx={{ pt: "16px !important" }}>
                    {f("patientName", "Patient Name")}
                    {f("doctorName",  "Doctor Name")}
                    {f("date",        "Date", "date")}
                    {f("time",        "Time", "time")}
                    {f("reason",      "Reason")}
                    {editId && (
                        <TextField
                            select label="Status" fullWidth size="small"
                            value={form.status ?? "SCHEDULED"}
                            onChange={(e) => setForm({ ...form, status: e.target.value })}
                            SelectProps={{ native: true }}
                        >
                            <option value="SCHEDULED">Scheduled</option>
                            <option value="COMPLETED">Completed</option>
                            <option value="CANCELLED">Cancelled</option>
                        </TextField>
                    )}
                </DialogContent>
                <DialogActions sx={{ px: 3, pb: 2 }}>
                    <Button onClick={() => setOpen(false)} color="inherit">Cancel</Button>
                    <Button variant="contained" onClick={handleSave} disabled={saving}>
                        {saving ? "Saving…" : editId ? "Update" : "Create"}
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
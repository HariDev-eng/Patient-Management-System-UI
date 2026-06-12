import React, { useEffect, useState } from "react";
import {
  Box, Card, CardContent, Typography, Button,
  TextField, InputAdornment, Dialog, DialogTitle,
  DialogContent, DialogActions, Alert, Snackbar,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import SearchIcon from "@mui/icons-material/Search";
import MainLayout from "../components/layout/MainLayout";
import DataTable from "../components/tables/DataTable";
import PatientForm from "../components/forms/PatientForm";
import { patientApi } from "../api/patientApi";

const EMPTY  = { name: "", age: "", gender: "Male", phone: "", address: "", doctorName: "", treatment: "", status: "Pending" };

const COLS = [
  { key: "name",       label: "Patient name" },
  { key: "patientId",  label: "Patient ID" },
  { key: "age",        label: "Age" },
  { key: "gender",     label: "Gender" },
  { key: "doctorName", label: "Doctor consulting" },
  { key: "treatment",  label: "Treatment under" },
  { key: "status",     label: "Status", isStatus: true },
];

export default function Patients() {
  const [rows, setRows]       = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch]   = useState("");
  const [dialog, setDialog]   = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm]       = useState(EMPTY);
  const [saving, setSaving]   = useState(false);
  const [snack, setSnack]     = useState({ open: false, msg: "", sev: "success" });

  const load = async () => {
    setLoading(true);
    try { const r = await patientApi.getAll(); setRows(r.data); }
    catch { setRows([]); }
    finally { setLoading(false); }
  };

  useEffect(() => { load(); }, []);

  const handleSearch = async (val) => {
    setSearch(val);
    if (!val.trim()) { load(); return; }
    try { const r = await patientApi.search(val); setRows(r.data); }
    catch { setRows([]); }
  };

  const openCreate  = () => { setEditing(null); setForm(EMPTY); setDialog(true); };
  const openEdit    = (row) => { setEditing(row); setForm({ ...row }); setDialog(true); };
  const closeDialog = () => { setDialog(false); setEditing(null); setForm(EMPTY); };

  const handleSave = async () => {
    setSaving(true);
    try {
      editing
        ? await patientApi.update(editing.id ?? editing._id, form)
        : await patientApi.create(form);
      toast(editing ? "Patient updated." : "Patient added.");
      closeDialog(); load();
    } catch (e) { toast(e.response?.data?.message ?? "Save failed.", "error"); }
    finally { setSaving(false); }
  };

  const handleDelete = async (row) => {
    if (!window.confirm(`Delete patient "${row.name}"?`)) return;
    try { await patientApi.delete(row.id ?? row._id); toast("Deleted."); load(); }
    catch { toast("Delete failed.", "error"); }
  };

  const toast = (msg, sev = "success") => setSnack({ open: true, msg, sev });

  return (
    <MainLayout>
      <Card sx={{ borderRadius: 3, border: "1px solid #e2e8f0", boxShadow: "0 1px 6px rgba(0,0,0,0.06)" }}>
        <CardContent sx={{ p: "24px !important" }}>
          <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2.5, flexWrap: "wrap", gap: 1 }}>
            <Typography variant="h6" sx={{ fontWeight: 700 }}>Patient details</Typography>
            <Box sx={{ display: "flex", gap: 1.5, alignItems: "center" }}>
              <TextField
                size="small" placeholder="Search patients…" value={search}
                onChange={(e) => handleSearch(e.target.value)}
                InputProps={{ startAdornment: <InputAdornment position="start"><SearchIcon fontSize="small" sx={{ color: "#94a3b8" }} /></InputAdornment> }}
                sx={{ width: 230, "& .MuiOutlinedInput-root": { borderRadius: 2.5 } }}
              />
              <Button
                variant="contained" startIcon={<AddIcon />} onClick={openCreate}
                sx={{ borderRadius: 2.5, px: 2.5, textTransform: "none", fontWeight: 600 }}
              >
                Add Patient
              </Button>
            </Box>
          </Box>
          <DataTable columns={COLS} rows={rows} loading={loading} onEdit={openEdit} onDelete={handleDelete} />
        </CardContent>
      </Card>

      <Dialog open={dialog} onClose={closeDialog} maxWidth="sm" fullWidth PaperProps={{ sx: { borderRadius: 3 } }}>
        <DialogTitle sx={{ fontWeight: 700, pb: 0 }}>{editing ? "Edit Patient" : "Add Patient"}</DialogTitle>
        <DialogContent>
          <PatientForm form={form} onChange={setForm} />
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2.5 }}>
          <Button onClick={closeDialog} sx={{ color: "#64748b", textTransform: "none" }}>Cancel</Button>
          <Button variant="contained" onClick={handleSave} disabled={saving} sx={{ textTransform: "none", fontWeight: 600 }}>
            {saving ? "Saving…" : editing ? "Update" : "Add Patient"}
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar open={snack.open} autoHideDuration={3000} onClose={() => setSnack({ ...snack, open: false })}>
        <Alert severity={snack.sev} onClose={() => setSnack({ ...snack, open: false })}>{snack.msg}</Alert>
      </Snackbar>
    </MainLayout>
  );
}

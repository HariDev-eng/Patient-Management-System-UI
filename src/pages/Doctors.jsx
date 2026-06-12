import React, { useEffect, useState } from "react";
import {
  Box, Card, CardContent, Typography, Button,
  Dialog, DialogTitle, DialogContent, DialogActions,
  Alert, Snackbar, Chip, Stack,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import MainLayout from "../components/layout/MainLayout";
import DataTable from "../components/tables/DataTable";
import DoctorForm from "../components/forms/DoctorForm";
import { doctorApi } from "../api/doctorApi";

const SPECS = ["CARDIOLOGY","NEUROLOGY","ORTHOPEDICS","PEDIATRICS","DERMATOLOGY","GENERAL"];
const EMPTY = { name: "", specialization: "GENERAL", phone: "", email: "", experience: "", status: "Active" };

const COLS = [
  { key: "name",           label: "Doctor Name" },
  { key: "doctorId",       label: "Doctor ID" },
  { key: "specialization", label: "Specialization" },
  { key: "phone",          label: "Phone" },
  { key: "email",          label: "Email" },
  { key: "experience",     label: "Experience" },
  { key: "status",         label: "Status", isStatus: true },
];

export default function Doctors() {
  const [rows, setRows]       = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeSpec, setSpec] = useState("ALL");
  const [dialog, setDialog]   = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm]       = useState(EMPTY);
  const [saving, setSaving]   = useState(false);
  const [snack, setSnack]     = useState({ open: false, msg: "", sev: "success" });

  const load = async (spec = "ALL") => {
    setLoading(true);
    try {
      const r = spec === "ALL" ? await doctorApi.getAll() : await doctorApi.getBySpecialization(spec);
      setRows(r.data);
    } catch { setRows([]); }
    finally { setLoading(false); }
  };

  useEffect(() => { load(); }, []);

  const handleSpec  = (s) => { setSpec(s); load(s); };
  const openCreate  = () => { setEditing(null); setForm(EMPTY); setDialog(true); };
  const openEdit    = (row) => { setEditing(row); setForm({ ...row }); setDialog(true); };
  const closeDialog = () => { setDialog(false); setEditing(null); };

  const handleSave = async () => {
    setSaving(true);
    try {
      editing
        ? await doctorApi.update(editing.id ?? editing._id, form)
        : await doctorApi.create(form);
      toast(editing ? "Doctor updated." : "Doctor added.");
      closeDialog(); load(activeSpec);
    } catch (e) { toast(e.response?.data?.message ?? "Save failed.", "error"); }
    finally { setSaving(false); }
  };

  const handleDelete = async (row) => {
    if (!window.confirm(`Delete Dr. ${row.name}?`)) return;
    try { await doctorApi.delete(row.id ?? row._id); toast("Deleted."); load(activeSpec); }
    catch { toast("Delete failed.", "error"); }
  };

  const toast = (msg, sev = "success") => setSnack({ open: true, msg, sev });

  return (
    <MainLayout>
      <Card sx={{ borderRadius: 3, border: "1px solid #e2e8f0", boxShadow: "0 1px 6px rgba(0,0,0,0.06)" }}>
        <CardContent sx={{ p: "24px !important" }}>
          <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2, flexWrap: "wrap", gap: 1 }}>
            <Typography variant="h6" sx={{ fontWeight: 700 }}>Doctors</Typography>
            <Button variant="contained" startIcon={<AddIcon />} onClick={openCreate}
              sx={{ borderRadius: 2.5, textTransform: "none", fontWeight: 600 }}>
              Add Doctor
            </Button>
          </Box>

          <Stack direction="row" spacing={1} sx={{ mb: 2.5, flexWrap: "wrap", gap: 1 }}>
            {["ALL", ...SPECS].map((s) => (
              <Chip key={s} label={s} size="small" clickable onClick={() => handleSpec(s)}
                sx={{
                  fontWeight: 600, fontSize: "0.72rem",
                  bgcolor: activeSpec === s ? "#0891b2" : "#e0f2fe",
                  color:   activeSpec === s ? "#fff"    : "#0891b2",
                  "&:hover": { bgcolor: activeSpec === s ? "#0e7490" : "#bae6fd" },
                }}
              />
            ))}
          </Stack>

          <DataTable columns={COLS} rows={rows} loading={loading} onEdit={openEdit} onDelete={handleDelete} />
        </CardContent>
      </Card>

      <Dialog open={dialog} onClose={closeDialog} maxWidth="sm" fullWidth PaperProps={{ sx: { borderRadius: 3 } }}>
        <DialogTitle sx={{ fontWeight: 700, pb: 0 }}>{editing ? "Edit Doctor" : "Add Doctor"}</DialogTitle>
        <DialogContent>
          <DoctorForm form={form} onChange={setForm} />
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2.5 }}>
          <Button onClick={closeDialog} sx={{ color: "#64748b", textTransform: "none" }}>Cancel</Button>
          <Button variant="contained" onClick={handleSave} disabled={saving} sx={{ textTransform: "none", fontWeight: 600 }}>
            {saving ? "Saving…" : editing ? "Update" : "Add Doctor"}
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar open={snack.open} autoHideDuration={3000} onClose={() => setSnack({ ...snack, open: false })}>
        <Alert severity={snack.sev} onClose={() => setSnack({ ...snack, open: false })}>{snack.msg}</Alert>
      </Snackbar>
    </MainLayout>
  );
}

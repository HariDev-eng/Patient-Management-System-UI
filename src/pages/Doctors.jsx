import React, { useEffect, useState, useCallback } from "react";
import {
  Box, Card, CardContent, Typography, Button, TextField,
  InputAdornment, Dialog, DialogTitle, DialogContent, DialogActions,
  Alert, Snackbar, Chip, Stack, IconButton, Tooltip,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import RefreshIcon from "@mui/icons-material/Refresh";
import SearchIcon from "@mui/icons-material/Search";
import MainLayout from "../components/layout/MainLayout";
import DataTable from "../components/tables/DataTable";
import DoctorForm from "../components/forms/DoctorForm";
import { doctorApi } from "../api/doctorApi";

const SPECIALIZATIONS = [
  "CARDIOLOGIST","DERMATOLOGIST","NEUROLOGIST",
  "ORTHOPEDIC","PEDIATRICIAN","GENERAL_PHYSICIAN","PSYCHIATRIST",
];

const EMPTY = {
  firstName: "", lastName: "", email: "", phone: "",
  specialization: "GENERAL_PHYSICIAN", licenseNumber: "",
  experienceYears: "", consultationFee: "",
};

const COLS = [
  { key: "fullName",        label: "Doctor Name",    render: (r) => `Dr. ${r.firstName ?? ""} ${r.lastName ?? ""}`.trim() },
  { key: "doctorId",        label: "Doctor ID",      render: (r) => getId(r) },
  { key: "specialization",  label: "Specialization", render: (r) => r.specialization?.replace(/_/g, " ") ?? "—" },
  { key: "phone",           label: "Phone" },
  { key: "email",           label: "Email" },
  { key: "experienceYears", label: "Exp (yrs)" },
  { key: "consultationFee", label: "Fee (₹)",        render: (r) => r.consultationFee ? `₹${r.consultationFee}` : "—" },
];

// Handles all possible ID field names the backend might return
function getId(row) {
  return row?.doctorId ?? row?.id ?? row?._id ?? "";
}

export default function Doctors() {
  const [allRows, setAllRows] = useState([]);   // full list for client-side search
  const [rows, setRows]       = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeSpec, setSpec] = useState("ALL");
  const [search, setSearch]   = useState("");
  const [dialog, setDialog]   = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm]       = useState(EMPTY);
  const [saving, setSaving]   = useState(false);
  const [errors, setErrors]   = useState({});
  const [snack, setSnack]     = useState({ open: false, msg: "", sev: "success" });

  const load = useCallback(async (spec = "ALL") => {
    setLoading(true);
    setSearch("");
    try {
      const res = spec === "ALL"
        ? await doctorApi.getAll()
        : await doctorApi.getBySpecialization(spec);
      const data = Array.isArray(res.data) ? res.data : [];
      setAllRows(data);
      setRows(data);
    } catch (e) {
      toast(e.response?.data?.message ?? "Failed to load doctors.", "error");
      setAllRows([]); setRows([]);
    } finally { setLoading(false); }
  }, []);

  useEffect(() => { load("ALL"); }, [load]);

  // Client-side search (filter name, email, specialization)
  const handleSearch = (val) => {
    setSearch(val);
    if (!val.trim()) { setRows(allRows); return; }
    const q = val.toLowerCase();
    setRows(allRows.filter((r) =>
      `${r.firstName} ${r.lastName}`.toLowerCase().includes(q) ||
      r.email?.toLowerCase().includes(q) ||
      r.specialization?.toLowerCase().includes(q) ||
      r.phone?.includes(q)
    ));
  };

  const handleSpec = (spec) => {
    setSpec(spec);
    load(spec);
  };

  const openCreate  = () => { setEditing(null); setForm(EMPTY); setErrors({}); setDialog(true); };
  const openEdit    = (row) => { setEditing(row); setForm({ ...EMPTY, ...row }); setErrors({}); setDialog(true); };
  const closeDialog = () => { setDialog(false); setEditing(null); setForm(EMPTY); setErrors({}); };

  const validate = () => {
    const e = {};
    if (!form.firstName?.trim())     e.firstName       = "First name is required";
    if (!form.lastName?.trim())      e.lastName        = "Last name is required";
    if (!form.email?.trim())         e.email           = "Email is required";
    if (!form.phone?.trim())         e.phone           = "Phone is required";
    if (!form.specialization)        e.specialization  = "Specialization is required";
    if (!form.licenseNumber?.trim()) e.licenseNumber   = "License number is required";
    if (!form.experienceYears)       e.experienceYears = "Experience is required";
    if (!form.consultationFee)       e.consultationFee = "Consultation fee is required";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSave = async () => {
    if (!validate()) return;
    setSaving(true);
    try {
      const payload = {
        firstName:       form.firstName,
        lastName:        form.lastName,
        email:           form.email,
        phone:           form.phone,
        specialization:  form.specialization,
        licenseNumber:   form.licenseNumber,
        experienceYears: Number(form.experienceYears),
        consultationFee: Number(form.consultationFee),
      };
      if (editing) {
        const id = getId(editing);
        if (!id) { toast("Cannot update: doctor ID missing.", "error"); return; }
        await doctorApi.update(id, payload);
        toast("Doctor updated successfully.");
      } else {
        await doctorApi.create(payload);
        toast("Doctor added successfully.");
      }
      closeDialog();
      load(activeSpec);
    } catch (e) {
      toast(e.response?.data?.message ?? "Save failed.", "error");
    } finally { setSaving(false); }
  };

  const handleDelete = async (row) => {
    const id = getId(row);
    if (!id) { toast("Cannot delete: doctor ID missing.", "error"); return; }
    if (!window.confirm(`Delete Dr. ${row.firstName} ${row.lastName}?`)) return;
    try {
      await doctorApi.delete(id);
      toast("Doctor deleted.");
      load(activeSpec);
    } catch (e) { toast(e.response?.data?.message ?? "Delete failed.", "error"); }
  };

  const toast = (msg, sev = "success") => setSnack({ open: true, msg, sev });

  return (
    <MainLayout>
      <Card sx={{ borderRadius: 3, border: "1px solid #e2e8f0", boxShadow: "0 1px 6px rgba(0,0,0,0.06)" }}>
        <CardContent sx={{ p: "24px !important" }}>

          {/* Header */}
          <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2, flexWrap: "wrap", gap: 1 }}>
            <Typography variant="h6" sx={{ fontWeight: 700 }}>Doctors</Typography>
            <Box sx={{ display: "flex", gap: 1.5, alignItems: "center", flexWrap: "wrap" }}>
              <TextField
                size="small"
                placeholder="Search name, email, specialization…"
                value={search}
                onChange={(e) => handleSearch(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon fontSize="small" sx={{ color: "#94a3b8" }} />
                    </InputAdornment>
                  ),
                }}
                sx={{ width: 280, "& .MuiOutlinedInput-root": { borderRadius: 2.5 } }}
              />
              <Tooltip title="Refresh">
                <IconButton onClick={() => load(activeSpec)} size="small" sx={{ border: "1px solid #e2e8f0", borderRadius: 2 }}>
                  <RefreshIcon fontSize="small" />
                </IconButton>
              </Tooltip>
              <Button variant="contained" startIcon={<AddIcon />} onClick={openCreate}
                sx={{ borderRadius: 2.5, textTransform: "none", fontWeight: 600 }}>
                Add Doctor
              </Button>
            </Box>
          </Box>

          {/* Specialization filter */}
          <Stack direction="row" spacing={1} sx={{ mb: 2.5, flexWrap: "wrap", gap: 1 }}>
            {["ALL", ...SPECIALIZATIONS].map((s) => (
              <Chip
                key={s}
                label={s.replace(/_/g, " ")}
                size="small"
                clickable
                onClick={() => handleSpec(s)}
                sx={{
                  fontWeight: 600, fontSize: "0.72rem",
                  bgcolor: activeSpec === s ? "#0891b2" : "#e0f2fe",
                  color:   activeSpec === s ? "#fff"    : "#0891b2",
                  "&:hover": { bgcolor: activeSpec === s ? "#0e7490" : "#bae6fd" },
                }}
              />
            ))}
          </Stack>

          <DataTable
            columns={COLS}
            rows={rows}
            loading={loading}
            onEdit={openEdit}
            onDelete={handleDelete}
          />
        </CardContent>
      </Card>

      <Dialog open={dialog} onClose={closeDialog} maxWidth="sm" fullWidth PaperProps={{ sx: { borderRadius: 3 } }}>
        <DialogTitle sx={{ fontWeight: 700, pb: 0 }}>
          {editing ? "Edit Doctor" : "Add New Doctor"}
        </DialogTitle>
        <DialogContent>
          <DoctorForm form={form} onChange={setForm} errors={errors} />
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2.5, gap: 1 }}>
          <Button onClick={closeDialog} disabled={saving} sx={{ color: "#64748b", textTransform: "none" }}>
            Cancel
          </Button>
          <Button variant="contained" onClick={handleSave} disabled={saving}
            sx={{ textTransform: "none", fontWeight: 600, minWidth: 120 }}>
            {saving ? "Saving…" : editing ? "Update Doctor" : "Add Doctor"}
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar open={snack.open} autoHideDuration={3500} onClose={() => setSnack({ ...snack, open: false })}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}>
        <Alert severity={snack.sev} onClose={() => setSnack({ ...snack, open: false })} sx={{ borderRadius: 2 }}>
          {snack.msg}
        </Alert>
      </Snackbar>
    </MainLayout>
  );
}

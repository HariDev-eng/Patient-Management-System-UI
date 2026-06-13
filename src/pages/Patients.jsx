import React, { useEffect, useState, useCallback } from "react";
import {
  Box, Card, CardContent, Typography, Button, TextField,
  InputAdornment, Dialog, DialogTitle, DialogContent,
  DialogActions, Alert, Snackbar, IconButton, Tooltip,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import SearchIcon from "@mui/icons-material/Search";
import RefreshIcon from "@mui/icons-material/Refresh";
import MainLayout from "../components/layout/MainLayout";
import DataTable from "../components/tables/DataTable";
import PatientForm from "../components/forms/PatientForm";
import { patientApi } from "../api/patientApi";

const EMPTY = {
  firstName: "", lastName: "", email: "", phone: "",
  dateOfBirth: "", gender: "MALE", bloodGroup: "O_POSITIVE",
  address: "", status: "ACTIVE",
  emergencyContactName: "", emergencyContactPhone: "",
  allergies: "", medicalConditions: "",
  insuranceProvider: "", insuranceNumber: "",
  primaryDoctorId: "",
};

// Resolve ID — backend returns "patientId" as UUID string
function getId(row) {
  return row?.patientId ?? row?.id ?? row?._id ?? "";
}

const COLS = [
  {
    key: "fullName", label: "Patient Name",
    render: (r) => `${r.firstName ?? ""} ${r.lastName ?? ""}`.trim() || "—",
  },
  { key: "patientId",   label: "Patient ID",   render: (r) => getId(r).substring(0, 8) + "…" },
  { key: "email",       label: "Email" },
  { key: "phone",       label: "Phone" },
  { key: "gender",      label: "Gender" },
  { key: "bloodGroup",  label: "Blood Group",  render: (r) => r.bloodGroup?.replace(/_/g, " ") ?? "—" },
  { key: "dateOfBirth", label: "DOB" },
  { key: "status",      label: "Status",       isStatus: true },
];

export default function Patients() {
  const [allRows, setAllRows] = useState([]);
  const [rows, setRows]       = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch]   = useState("");
  const [dialog, setDialog]   = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm]       = useState(EMPTY);
  const [saving, setSaving]   = useState(false);
  const [errors, setErrors]   = useState({});
  const [snack, setSnack]     = useState({ open: false, msg: "", sev: "success" });

  const load = useCallback(async () => {
    setLoading(true);
    setSearch("");
    try {
      const res = await patientApi.getAll();
      const data = Array.isArray(res.data) ? res.data : [];
      setAllRows(data);
      setRows(data);
    } catch (e) {
      toast(e.response?.data?.message ?? "Failed to load patients.", "error");
      setAllRows([]); setRows([]);
    } finally { setLoading(false); }
  }, []);

  useEffect(() => { load(); }, [load]);

  const handleSearch = async (val) => {
    setSearch(val);
    if (!val.trim()) { setRows(allRows); return; }
    // Try API search, fall back to client-side filter
    try {
      const res = await patientApi.search(val);
      setRows(Array.isArray(res.data) ? res.data : []);
    } catch {
      const q = val.toLowerCase();
      setRows(allRows.filter((r) =>
        `${r.firstName} ${r.lastName}`.toLowerCase().includes(q) ||
        r.email?.toLowerCase().includes(q) ||
        r.phone?.includes(q)
      ));
    }
  };

  const openCreate  = () => { setEditing(null); setForm(EMPTY); setErrors({}); setDialog(true); };
  const openEdit    = (row) => { setEditing(row); setForm({ ...EMPTY, ...row }); setErrors({}); setDialog(true); };
  const closeDialog = () => { setDialog(false); setEditing(null); setForm(EMPTY); setErrors({}); };

  const validate = () => {
    const e = {};
    if (!form.firstName?.trim()) e.firstName   = "First name is required";
    if (!form.lastName?.trim())  e.lastName    = "Last name is required";
    if (!form.email?.trim())     e.email       = "Email is required";
    if (!form.phone?.trim())     e.phone       = "Phone is required";
    if (!form.gender)            e.gender      = "Gender is required";
    if (!form.dateOfBirth)       e.dateOfBirth = "Date of birth is required";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSave = async () => {
    if (!validate()) return;
    setSaving(true);
    try {
      // Build payload matching PatientRequestDTO exactly
      const payload = {
        firstName:            form.firstName,
        lastName:             form.lastName,
        email:                form.email,
        phone:                form.phone,
        dateOfBirth:          form.dateOfBirth,         // "YYYY-MM-DD"
        gender:               form.gender,              // MALE | FEMALE | OTHER
        bloodGroup:           form.bloodGroup || null,
        address:              form.address || null,
        status:               form.status,              // ACTIVE | INACTIVE | DECEASED
        emergencyContactName:  form.emergencyContactName  || null,
        emergencyContactPhone: form.emergencyContactPhone || null,
        allergies:            form.allergies            || null,
        medicalConditions:    form.medicalConditions    || null,
        insuranceProvider:    form.insuranceProvider    || null,
        insuranceNumber:      form.insuranceNumber      || null,
        primaryDoctorId:      form.primaryDoctorId      || null,
      };

      if (editing) {
        const id = getId(editing);
        if (!id) { toast("Cannot update: patient ID missing.", "error"); setSaving(false); return; }
        await patientApi.update(id, payload);
        toast("Patient updated successfully.");
      } else {
        await patientApi.create(payload);
        toast("Patient created successfully.");
      }
      closeDialog();
      load();
    } catch (e) {
      toast(e.response?.data?.message ?? "Save failed.", "error");
    } finally { setSaving(false); }
  };

  const handleDelete = async (row) => {
    const id = getId(row);
    if (!id) { toast("Cannot delete: patient ID missing.", "error"); return; }
    if (!window.confirm(`Delete patient "${row.firstName} ${row.lastName}"?`)) return;
    try {
      await patientApi.delete(id);
      toast("Patient deleted.");
      load();
    } catch (e) { toast(e.response?.data?.message ?? "Delete failed.", "error"); }
  };

  const toast = (msg, sev = "success") => setSnack({ open: true, msg, sev });

  return (
    <MainLayout>
      <Card sx={{ borderRadius: 3, border: "1px solid #e2e8f0", boxShadow: "0 1px 6px rgba(0,0,0,0.06)" }}>
        <CardContent sx={{ p: "24px !important" }}>

          {/* Header */}
          <Box sx={{
            display: "flex", justifyContent: "space-between",
            alignItems: "center", mb: 2.5, flexWrap: "wrap", gap: 1,
          }}>
            <Typography variant="h6" sx={{ fontWeight: 700 }}>Patient Details</Typography>
            <Box sx={{ display: "flex", gap: 1.5, alignItems: "center", flexWrap: "wrap" }}>
              <TextField
                size="small"
                placeholder="Search name, email, phone…"
                value={search}
                onChange={(e) => handleSearch(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon fontSize="small" sx={{ color: "#94a3b8" }} />
                    </InputAdornment>
                  ),
                }}
                sx={{ width: 260, "& .MuiOutlinedInput-root": { borderRadius: 2.5 } }}
              />
              <Tooltip title="Refresh">
                <IconButton onClick={load} size="small" sx={{ border: "1px solid #e2e8f0", borderRadius: 2 }}>
                  <RefreshIcon fontSize="small" />
                </IconButton>
              </Tooltip>
              <Button
                variant="contained" startIcon={<AddIcon />} onClick={openCreate}
                sx={{ borderRadius: 2.5, px: 2.5, textTransform: "none", fontWeight: 600 }}
              >
                Add Patient
              </Button>
            </Box>
          </Box>

          <DataTable
            columns={COLS} rows={rows} loading={loading}
            onEdit={openEdit} onDelete={handleDelete}
          />
        </CardContent>
      </Card>

      {/* Add / Edit Dialog */}
      <Dialog
        open={dialog} onClose={closeDialog}
        maxWidth="md" fullWidth
        PaperProps={{ sx: { borderRadius: 3 } }}
      >
        <DialogTitle sx={{ fontWeight: 700, pb: 0 }}>
          {editing ? "Edit Patient" : "Add New Patient"}
        </DialogTitle>
        <DialogContent>
          <PatientForm form={form} onChange={setForm} errors={errors} />
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2.5, gap: 1 }}>
          <Button onClick={closeDialog} disabled={saving} sx={{ color: "#64748b", textTransform: "none" }}>
            Cancel
          </Button>
          <Button
            variant="contained" onClick={handleSave} disabled={saving}
            sx={{ textTransform: "none", fontWeight: 600, minWidth: 120 }}
          >
            {saving ? "Saving…" : editing ? "Update Patient" : "Add Patient"}
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={snack.open} autoHideDuration={3500}
        onClose={() => setSnack({ ...snack, open: false })}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        <Alert severity={snack.sev} onClose={() => setSnack({ ...snack, open: false })} sx={{ borderRadius: 2 }}>
          {snack.msg}
        </Alert>
      </Snackbar>
    </MainLayout>
  );
}

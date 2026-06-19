import React, { useEffect, useState, useCallback } from "react";
import {
  Box, Card, CardContent, Typography, Button, TextField,
  InputAdornment, Dialog, DialogTitle, DialogContent, DialogActions,
  Alert, Snackbar, IconButton, Tooltip, Chip,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import SearchIcon from "@mui/icons-material/Search";
import RefreshIcon from "@mui/icons-material/Refresh";
import MedicationIcon from "@mui/icons-material/Medication";
import MainLayout from "../components/layout/MainLayout";
import DataTable from "../components/tables/DataTable";
import PrescriptionForm from "../components/forms/PrescriptionForm";
import { prescriptionApi } from "../api/prescriptionApi";

const EMPTY = {
  patientId: "", doctorId: "", diagnosisId: "",
  appointmentId: "", items: [
    { medicineName: "", dosage: "", frequency: "", durationDays: "", instructions: "" }
  ],
};

function getId(row) {
  return row?.prescriptionId ?? row?.id ?? row?._id ?? "";
}

const COLS = [
  {
    key: "prescriptionId", label: "ID",
    render: (r) => getId(r).toString().substring(0, 8) + "…",
  },
  {
    key: "patientId", label: "Patient",
    render: (r) => r.patientId?.toString().substring(0, 8) + "…",
  },
  {
    key: "doctorId", label: "Doctor",
    render: (r) => r.doctorId?.toString().substring(0, 8) + "…",
  },
  {
    key: "items", label: "Medicines",
    render: (r) => {
      const count = r.items?.length ?? 0;
      return (
        <Chip
          icon={<MedicationIcon sx={{ fontSize: "14px !important" }} />}
          label={`${count} item${count !== 1 ? "s" : ""}`}
          size="small"
          sx={{ bgcolor: "#e0f2fe", color: "#0891b2", fontWeight: 600, fontSize: "0.72rem" }}
        />
      );
    },
  },
  {
    key: "medicines", label: "Medicine Names",
    render: (r) => r.items?.map((i) => i.medicineName).filter(Boolean).join(", ") || "—",
  },
  {
    key: "createdAt", label: "Created",
    render: (r) => r.createdAt
      ? new Date(r.createdAt).toLocaleDateString("en-IN")
      : "—",
  },
];

export default function Prescriptions() {
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
      const res = await prescriptionApi.getAll();
      const data = Array.isArray(res.data) ? res.data : [];
      setAllRows(data); setRows(data);
    } catch (e) {
      toast(e.response?.data?.message ?? "Failed to load prescriptions.", "error");
      setAllRows([]); setRows([]);
    } finally { setLoading(false); }
  }, []);

  useEffect(() => { load(); }, [load]);

  const handleSearch = (val) => {
    setSearch(val);
    if (!val.trim()) { setRows(allRows); return; }
    const q = val.toLowerCase();
    setRows(allRows.filter((r) =>
      r.items?.some((i) => i.medicineName?.toLowerCase().includes(q))
    ));
  };

  const openCreate  = () => { setEditing(null); setForm(EMPTY); setErrors({}); setDialog(true); };
  const openEdit    = (row) => {
    setEditing(row);
    setForm({
      ...EMPTY, ...row,
      items: row.items?.length ? row.items : EMPTY.items,
    });
    setErrors({});
    setDialog(true);
  };
  const closeDialog = () => { setDialog(false); setEditing(null); setForm(EMPTY); setErrors({}); };

  const validate = () => {
    const e = {};
    if (!form.patientId) e.patientId = "Patient is required";
    if (!form.doctorId)  e.doctorId  = "Doctor is required";
    if (!form.items?.some((i) => i.medicineName?.trim())) {
      e.items = "At least one medicine is required";
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSave = async () => {
    if (!validate()) return;
    setSaving(true);
    try {
      const payload = {
        patientId:     form.patientId,
        doctorId:      form.doctorId,
        diagnosisId:   form.diagnosisId   || null,
        appointmentId: form.appointmentId || null,
        items: form.items
          .filter((i) => i.medicineName?.trim())
          .map((i) => ({
            medicineName: i.medicineName,
            dosage:       i.dosage       || null,
            frequency:    i.frequency    || null,
            durationDays: i.durationDays ? Number(i.durationDays) : null,
            instructions: i.instructions || null,
          })),
      };
      if (editing) {
        const id = getId(editing);
        if (!id) { toast("Cannot update: ID missing.", "error"); setSaving(false); return; }
        await prescriptionApi.update(id, payload);
        toast("Prescription updated.");
      } else {
        await prescriptionApi.create(payload);
        toast("Prescription created.");
      }
      closeDialog(); load();
    } catch (e) {
      toast(e.response?.data?.message ?? "Save failed.", "error");
    } finally { setSaving(false); }
  };

  const handleDelete = async (row) => {
    const id = getId(row);
    if (!id) { toast("Cannot delete: ID missing.", "error"); return; }
    if (!window.confirm("Delete this prescription?")) return;
    try {
      await prescriptionApi.delete(id);
      toast("Prescription deleted."); load();
    } catch (e) { toast(e.response?.data?.message ?? "Delete failed.", "error"); }
  };

  const toast = (msg, sev = "success") => setSnack({ open: true, msg, sev });

  return (
    <MainLayout>
      <Card sx={{ borderRadius: 3, border: "1px solid #e2e8f0", boxShadow: "0 1px 6px rgba(0,0,0,0.06)" }}>
        <CardContent sx={{ p: "24px !important" }}>
          <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2.5, flexWrap: "wrap", gap: 1 }}>
            <Typography variant="h6" sx={{ fontWeight: 700 }}>Prescriptions</Typography>
            <Box sx={{ display: "flex", gap: 1.5, alignItems: "center", flexWrap: "wrap" }}>
              <TextField
                size="small" placeholder="Search medicine name…"
                value={search}
                onChange={(e) => handleSearch(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon fontSize="small" sx={{ color: "#94a3b8" }} />
                    </InputAdornment>
                  ),
                }}
                sx={{ width: 250, "& .MuiOutlinedInput-root": { borderRadius: 2.5 } }}
              />
              <Tooltip title="Refresh">
                <IconButton onClick={load} size="small" sx={{ border: "1px solid #e2e8f0", borderRadius: 2 }}>
                  <RefreshIcon fontSize="small" />
                </IconButton>
              </Tooltip>
              <Button variant="contained" startIcon={<AddIcon />} onClick={openCreate}
                sx={{ borderRadius: 2.5, textTransform: "none", fontWeight: 600 }}>
                New Prescription
              </Button>
            </Box>
          </Box>

          <DataTable
            columns={COLS} rows={rows} loading={loading}
            onEdit={openEdit} onDelete={handleDelete}
          />
        </CardContent>
      </Card>

      <Dialog open={dialog} onClose={closeDialog} maxWidth="md" fullWidth PaperProps={{ sx: { borderRadius: 3 } }}>
        <DialogTitle sx={{ fontWeight: 700, pb: 0 }}>
          {editing ? "Edit Prescription" : "New Prescription"}
        </DialogTitle>
        <DialogContent>
          <PrescriptionForm form={form} onChange={setForm} errors={errors} />
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2.5, gap: 1 }}>
          <Button onClick={closeDialog} disabled={saving} sx={{ color: "#64748b", textTransform: "none" }}>Cancel</Button>
          <Button variant="contained" onClick={handleSave} disabled={saving}
            sx={{ textTransform: "none", fontWeight: 600, minWidth: 140 }}>
            {saving ? "Saving…" : editing ? "Update" : "Create Prescription"}
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar open={snack.open} autoHideDuration={3500}
        onClose={() => setSnack({ ...snack, open: false })}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}>
        <Alert severity={snack.sev} onClose={() => setSnack({ ...snack, open: false })} sx={{ borderRadius: 2 }}>
          {snack.msg}
        </Alert>
      </Snackbar>
    </MainLayout>
  );
}

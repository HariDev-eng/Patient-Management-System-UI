import React, { useEffect, useState, useCallback } from "react";
import {
  Box, Card, CardContent, Typography, Button,
  Dialog, DialogTitle, DialogContent, DialogActions,
  Alert, Snackbar, Chip, Stack, IconButton, Tooltip,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import RefreshIcon from "@mui/icons-material/Refresh";
import MainLayout from "../components/layout/MainLayout";
import DataTable from "../components/tables/DataTable";
import AppointmentForm from "../components/forms/AppointmentForm";
import { appointmentApi } from "../api/appointmentApi";

const STATUSES = ["SCHEDULED", "CONFIRMED", "COMPLETED", "CANCELLED", "NO_SHOW"];

const EMPTY = {
  patientId: "", doctorId: "",
  appointmentDateTime: "", reason: "", notes: "", status: "SCHEDULED",
};

function getId(row) {
  return row?.appointmentId ?? row?.id ?? row?._id ?? "";
}

const COLS = [
  {
    key: "id", label: "Appt ID",
    render: (r) => {
      const id = getId(r);
      return id ? id.substring(0, 8) + "…" : "—";
    },
  },
  {
    key: "patient", label: "Patient",
    render: (r) =>
      r.patientFirstName
        ? `${r.patientFirstName} ${r.patientLastName ?? ""}`.trim()
        : r.patientName ?? (r.patientId?.substring(0, 8) + "…") ?? "—",
  },
  {
    key: "doctor", label: "Doctor",
    render: (r) =>
      r.doctorFirstName
        ? `Dr. ${r.doctorFirstName} ${r.doctorLastName ?? ""}`.trim()
        : r.doctorName ?? (r.doctorId?.substring(0, 8) + "…") ?? "—",
  },
  {
    key: "appointmentDateTime", label: "Date & Time",
    render: (r) => r.appointmentDateTime
      ? new Date(r.appointmentDateTime).toLocaleString("en-IN", {
          dateStyle: "medium", timeStyle: "short",
        })
      : "—",
  },
  { key: "reason", label: "Reason" },
  { key: "status", label: "Status", isStatus: true },
];

const STATUS_COLORS = {
  ALL:       { bg: "#f1f5f9", color: "#475569" },
  SCHEDULED: { bg: "#dbeafe", color: "#2563eb" },
  CONFIRMED: { bg: "#ede9fe", color: "#7c3aed" },
  COMPLETED: { bg: "#d1fae5", color: "#059669" },
  CANCELLED: { bg: "#fee2e2", color: "#dc2626" },
  NO_SHOW:   { bg: "#fff7ed", color: "#ea580c" },
};

export default function Appointments() {
  const [rows, setRows]           = useState([]);
  const [loading, setLoading]     = useState(true);
  const [activeStatus, setStatus] = useState("ALL");
  const [dialog, setDialog]       = useState(false);
  const [editing, setEditing]     = useState(null);
  const [form, setForm]           = useState(EMPTY);
  const [saving, setSaving]       = useState(false);
  const [errors, setErrors]       = useState({});
  const [snack, setSnack]         = useState({ open: false, msg: "", sev: "success" });

  const load = useCallback(async (status = "ALL") => {
    setLoading(true);
    try {
      const res = status === "ALL"
        ? await appointmentApi.getAll()
        : await appointmentApi.getByStatus(status);
      setRows(Array.isArray(res.data) ? res.data : []);
    } catch (e) {
      toast(e.response?.data?.message ?? "Failed to load appointments.", "error");
      setRows([]);
    } finally { setLoading(false); }
  }, []);

  useEffect(() => { load("ALL"); }, [load]);

  const handleStatus = (s) => { setStatus(s); load(s); };

  const openCreate = () => {
    setEditing(null); setForm(EMPTY); setErrors({}); setDialog(true);
  };

  const openEdit = (row) => {
    // Strip seconds for datetime-local input compatibility
    const dt = row.appointmentDateTime
      ? row.appointmentDateTime.substring(0, 16)
      : "";
    setEditing(row);
    setForm({ ...EMPTY, ...row, appointmentDateTime: dt });
    setErrors({});
    setDialog(true);
  };

  const closeDialog = () => {
    setDialog(false); setEditing(null); setForm(EMPTY); setErrors({});
  };

  const validate = () => {
    const e = {};
    if (!form.patientId)           e.patientId           = "Patient is required";
    if (!form.doctorId)            e.doctorId            = "Doctor is required";
    if (!form.appointmentDateTime) e.appointmentDateTime = "Date & time is required";
    if (!form.reason?.trim())      e.reason              = "Reason is required";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSave = async () => {
    if (!validate()) return;
    setSaving(true);
    try {
      if (editing) {
        const id = getId(editing);
        if (!id) { toast("Cannot update: appointment ID missing.", "error"); setSaving(false); return; }
        await appointmentApi.updateStatus(id, form.status);
        toast("Appointment updated.");
      } else {
        const payload = {
          patientId:           form.patientId,
          doctorId:            form.doctorId,
          appointmentDateTime: form.appointmentDateTime, // "2026-07-15T10:30"
          reason:              form.reason,
          notes:               form.notes || "",
        };
        await appointmentApi.create(payload);
        toast("Appointment created.");
      }
      closeDialog();
      load(activeStatus);
    } catch (e) {
      toast(e.response?.data?.message ?? "Save failed.", "error");
    } finally { setSaving(false); }
  };

  const handleDelete = async (row) => {
    const id = getId(row);
    if (!id) { toast("Cannot delete: appointment ID missing.", "error"); return; }
    if (!window.confirm("Delete this appointment?")) return;
    try {
      await appointmentApi.delete(id);
      toast("Appointment deleted.");
      load(activeStatus);
    } catch (e) { toast(e.response?.data?.message ?? "Delete failed.", "error"); }
  };

  const quickUpdate = async (row, status) => {
    const id = getId(row);
    if (!id) { toast("Cannot update: ID missing.", "error"); return; }
    try {
      await appointmentApi.updateStatus(id, status);
      toast(`Marked as ${status}.`);
      load(activeStatus);
    } catch (e) { toast(e.response?.data?.message ?? "Update failed.", "error"); }
  };

  const toast = (msg, sev = "success") => setSnack({ open: true, msg, sev });

  return (
    <MainLayout>
      <Card sx={{ borderRadius: 3, border: "1px solid #e2e8f0", boxShadow: "0 1px 6px rgba(0,0,0,0.06)" }}>
        <CardContent sx={{ p: "24px !important" }}>
          <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2, flexWrap: "wrap", gap: 1 }}>
            <Typography variant="h6" sx={{ fontWeight: 700 }}>Appointments</Typography>
            <Box sx={{ display: "flex", gap: 1.5, alignItems: "center" }}>
              <Tooltip title="Refresh">
                <IconButton onClick={() => load(activeStatus)} size="small" sx={{ border: "1px solid #e2e8f0", borderRadius: 2 }}>
                  <RefreshIcon fontSize="small" />
                </IconButton>
              </Tooltip>
              <Button variant="contained" startIcon={<AddIcon />} onClick={openCreate}
                sx={{ borderRadius: 2.5, textTransform: "none", fontWeight: 600 }}>
                New Appointment
              </Button>
            </Box>
          </Box>

          {/* Status filter */}
          <Stack direction="row" spacing={1} sx={{ mb: 2.5, flexWrap: "wrap", gap: 1 }}>
            {["ALL", ...STATUSES].map((s) => {
              const c = STATUS_COLORS[s];
              const active = activeStatus === s;
              return (
                <Chip key={s} label={s} size="small" clickable onClick={() => handleStatus(s)}
                  sx={{
                    fontWeight: 600, fontSize: "0.72rem",
                    bgcolor: active ? c.color : c.bg,
                    color:   active ? "#fff"   : c.color,
                    "&:hover": { opacity: 0.85 },
                  }}
                />
              );
            })}
          </Stack>

          <DataTable
            columns={COLS} rows={rows} loading={loading}
            onEdit={openEdit} onDelete={handleDelete}
            actions={[
              { label: "Confirm",        onClick: (r) => quickUpdate(r, "CONFIRMED") },
              { label: "Mark Completed", onClick: (r) => quickUpdate(r, "COMPLETED") },
              { label: "Mark No Show",   onClick: (r) => quickUpdate(r, "NO_SHOW") },
              { label: "Cancel",         onClick: (r) => quickUpdate(r, "CANCELLED") },
            ]}
          />
        </CardContent>
      </Card>

      <Dialog open={dialog} onClose={closeDialog} maxWidth="sm" fullWidth PaperProps={{ sx: { borderRadius: 3 } }}>
        <DialogTitle sx={{ fontWeight: 700, pb: 0 }}>
          {editing ? "Edit Appointment" : "New Appointment"}
        </DialogTitle>
        <DialogContent>
          <AppointmentForm form={form} onChange={setForm} errors={errors} />
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2.5, gap: 1 }}>
          <Button onClick={closeDialog} disabled={saving} sx={{ color: "#64748b", textTransform: "none" }}>
            Cancel
          </Button>
          <Button variant="contained" onClick={handleSave} disabled={saving}
            sx={{ textTransform: "none", fontWeight: 600, minWidth: 120 }}>
            {saving ? "Saving…" : editing ? "Update" : "Create"}
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

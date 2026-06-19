import React, { useEffect, useState, useCallback } from "react";
import {
  Box, Card, CardContent, Typography, Button, TextField,
  InputAdornment, Dialog, DialogTitle, DialogContent, DialogActions,
  Alert, Snackbar, IconButton, Tooltip, Chip, Tab, Tabs,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import SearchIcon from "@mui/icons-material/Search";
import RefreshIcon from "@mui/icons-material/Refresh";
import MonitorHeartIcon from "@mui/icons-material/MonitorHeart";
import MainLayout from "../components/layout/MainLayout";
import DataTable from "../components/tables/DataTable";
import NurseForm from "../components/forms/NurseForm";
import VitalForm from "../components/forms/VitalForm";
import { nurseApi, vitalApi } from "../api/nurseApi";

const EMPTY_NURSE = {
  firstName: "", lastName: "", email: "",
  phone: "", department: "", shift: "MORNING",
};

const EMPTY_VITAL = {
  patientId: "", nurseId: "",
  temperature: "", heartRate: "",
  systolicBP: "", diastolicBP: "",
  weight: "", height: "", oxygenSaturation: "",
};

function getNurseId(row) {
  return row?.nurseId ?? row?.id ?? row?._id ?? "";
}
function getVitalId(row) {
  return row?.vitalId ?? row?.id ?? row?._id ?? "";
}

const SHIFT_COLORS = {
  MORNING:   { bg: "#fef9c3", color: "#ca8a04" },
  AFTERNOON: { bg: "#dbeafe", color: "#2563eb" },
  NIGHT:     { bg: "#ede9fe", color: "#7c3aed" },
};

const NURSE_COLS = [
  { key: "fullName",   label: "Nurse Name",  render: (r) => `${r.firstName ?? ""} ${r.lastName ?? ""}`.trim() },
  { key: "nurseId",    label: "Nurse ID",    render: (r) => getNurseId(r).toString().substring(0, 8) + "…" },
  { key: "email",      label: "Email" },
  { key: "phone",      label: "Phone" },
  { key: "department", label: "Department" },
  {
    key: "shift", label: "Shift",
    render: (r) => {
      const c = SHIFT_COLORS[r.shift] ?? { bg: "#f1f5f9", color: "#475569" };
      return (
        <Chip label={r.shift ?? "—"} size="small"
          sx={{ fontWeight: 600, fontSize: "0.72rem", bgcolor: c.bg, color: c.color }} />
      );
    },
  },
  { key: "status", label: "Status", isStatus: true },
];

const VITAL_COLS = [
  { key: "vitalId",         label: "Vital ID",     render: (r) => getVitalId(r).toString().substring(0, 8) + "…" },
  { key: "patientId",       label: "Patient ID",   render: (r) => r.patientId?.toString().substring(0, 8) + "…" },
  { key: "temperature",     label: "Temp (°C)" },
  { key: "heartRate",       label: "Heart Rate" },
  { key: "systolicBP",      label: "Systolic BP" },
  { key: "diastolicBP",     label: "Diastolic BP" },
  { key: "oxygenSaturation",label: "SpO2 (%)" },
  { key: "weight",          label: "Weight (kg)" },
  { key: "height",          label: "Height (cm)" },
  {
    key: "recordedAt", label: "Recorded At",
    render: (r) => r.recordedAt
      ? new Date(r.recordedAt).toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short" })
      : "—",
  },
];

export default function Nurses() {
  const [tab, setTab]             = useState(0);   // 0 = Nurses, 1 = Vitals

  // Nurse state
  const [nurses, setNurses]       = useState([]);
  const [allNurses, setAllNurses] = useState([]);
  const [nurseLoading, setNurseLoading] = useState(true);
  const [nurseSearch, setNurseSearch]   = useState("");
  const [nurseDialog, setNurseDialog]   = useState(false);
  const [nurseForm, setNurseForm]       = useState(EMPTY_NURSE);
  const [nurseErrors, setNurseErrors]   = useState({});
  const [nurseSaving, setNurseSaving]   = useState(false);

  // Vital state
  const [vitals, setVitals]       = useState([]);
  const [vitalLoading, setVitalLoading] = useState(true);
  const [vitalDialog, setVitalDialog]   = useState(false);
  const [vitalForm, setVitalForm]       = useState(EMPTY_VITAL);
  const [vitalErrors, setVitalErrors]   = useState({});
  const [vitalSaving, setVitalSaving]   = useState(false);

  const [snack, setSnack] = useState({ open: false, msg: "", sev: "success" });
  const toast = (msg, sev = "success") => setSnack({ open: true, msg, sev });

  // ── Load nurses ──
  const loadNurses = useCallback(async () => {
    setNurseLoading(true);
    setNurseSearch("");
    try {
      const res = await nurseApi.getAll();
      const data = Array.isArray(res.data) ? res.data : [];
      setAllNurses(data);
      setNurses(data);
    } catch (e) {
      toast(e.response?.data?.message ?? "Failed to load nurses.", "error");
      setAllNurses([]); setNurses([]);
    } finally { setNurseLoading(false); }
  }, []);

  // ── Load vitals — all patients (no global endpoint, so we list from nurses' patients)
  const loadVitals = useCallback(async () => {
    setVitalLoading(true);
    try {
      // No GET /vitals all endpoint — fetch via each patient if needed
      // For now show empty with prompt to search by patient
      setVitals([]);
    } catch { setVitals([]); }
    finally { setVitalLoading(false); }
  }, []);

  useEffect(() => { loadNurses(); loadVitals(); }, [loadNurses, loadVitals]);

  // Nurse search
  const handleNurseSearch = (val) => {
    setNurseSearch(val);
    if (!val.trim()) { setNurses(allNurses); return; }
    const q = val.toLowerCase();
    setNurses(allNurses.filter((n) =>
      `${n.firstName} ${n.lastName}`.toLowerCase().includes(q) ||
      n.email?.toLowerCase().includes(q) ||
      n.department?.toLowerCase().includes(q) ||
      n.shift?.toLowerCase().includes(q)
    ));
  };

  // Load vitals for a specific patient
  const loadPatientVitals = async (patientId) => {
    if (!patientId.trim()) return;
    setVitalLoading(true);
    try {
      const res = await vitalApi.getByPatient(patientId);
      setVitals(Array.isArray(res.data) ? res.data : []);
    } catch (e) {
      toast(e.response?.data?.message ?? "No vitals found for this patient.", "error");
      setVitals([]);
    } finally { setVitalLoading(false); }
  };

  // ── Nurse CRUD ──
  const openNurseCreate  = () => { setNurseForm(EMPTY_NURSE); setNurseErrors({}); setNurseDialog(true); };
  const closeNurseDialog = () => { setNurseDialog(false); setNurseForm(EMPTY_NURSE); setNurseErrors({}); };

  const validateNurse = () => {
    const e = {};
    if (!nurseForm.firstName?.trim()) e.firstName  = "First name is required";
    if (!nurseForm.lastName?.trim())  e.lastName   = "Last name is required";
    if (!nurseForm.email?.trim())     e.email      = "Email is required";
    if (!nurseForm.phone?.trim())     e.phone      = "Phone is required";
    if (!nurseForm.department?.trim())e.department = "Department is required";
    if (!nurseForm.shift)             e.shift      = "Shift is required";
    setNurseErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleNurseSave = async () => {
    if (!validateNurse()) return;
    setNurseSaving(true);
    try {
      await nurseApi.create({
        firstName:  nurseForm.firstName,
        lastName:   nurseForm.lastName,
        email:      nurseForm.email,
        phone:      nurseForm.phone,
        department: nurseForm.department,
        shift:      nurseForm.shift,
      });
      toast("Nurse added successfully.");
      closeNurseDialog();
      loadNurses();
    } catch (e) {
      toast(e.response?.data?.message ?? "Save failed.", "error");
    } finally { setNurseSaving(false); }
  };

  // ── Vital CRUD ──
  const openVitalCreate  = () => { setVitalForm(EMPTY_VITAL); setVitalErrors({}); setVitalDialog(true); };
  const closeVitalDialog = () => { setVitalDialog(false); setVitalForm(EMPTY_VITAL); setVitalErrors({}); };

  const validateVital = () => {
    const e = {};
    if (!vitalForm.patientId?.trim()) e.patientId = "Patient ID is required";
    setVitalErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleVitalSave = async () => {
    if (!validateVital()) return;
    setVitalSaving(true);
    try {
      await vitalApi.create({
        patientId:        vitalForm.patientId,
        nurseId:          vitalForm.nurseId || null,
        temperature:      vitalForm.temperature       ? Number(vitalForm.temperature)       : null,
        heartRate:        vitalForm.heartRate         ? Number(vitalForm.heartRate)         : null,
        systolicBP:       vitalForm.systolicBP        ? Number(vitalForm.systolicBP)        : null,
        diastolicBP:      vitalForm.diastolicBP       ? Number(vitalForm.diastolicBP)       : null,
        weight:           vitalForm.weight            ? Number(vitalForm.weight)            : null,
        height:           vitalForm.height            ? Number(vitalForm.height)            : null,
        oxygenSaturation: vitalForm.oxygenSaturation  ? Number(vitalForm.oxygenSaturation)  : null,
      });
      toast("Vitals recorded successfully.");
      closeVitalDialog();
      // Reload vitals for this patient
      if (vitalForm.patientId) loadPatientVitals(vitalForm.patientId);
    } catch (e) {
      toast(e.response?.data?.message ?? "Save failed.", "error");
    } finally { setVitalSaving(false); }
  };

  const handleVitalDelete = async (row) => {
    const id = getVitalId(row);
    if (!id) { toast("Cannot delete: vital ID missing.", "error"); return; }
    if (!window.confirm("Delete this vital record?")) return;
    try {
      await vitalApi.delete(id);
      toast("Vital deleted.");
      setVitals((prev) => prev.filter((v) => getVitalId(v) !== id));
    } catch (e) { toast(e.response?.data?.message ?? "Delete failed.", "error"); }
  };

  return (
    <MainLayout>
      {/* Tab switcher */}
      <Box sx={{ mb: 2 }}>
        <Tabs
          value={tab}
          onChange={(_, v) => setTab(v)}
          sx={{
            "& .MuiTab-root": { textTransform: "none", fontWeight: 600 },
            "& .Mui-selected": { color: "#0891b2" },
            "& .MuiTabs-indicator": { backgroundColor: "#0891b2" },
          }}
        >
          <Tab label="Nurses" />
          <Tab label="Patient Vitals" icon={<MonitorHeartIcon fontSize="small" />} iconPosition="start" />
        </Tabs>
      </Box>

      {/* ── Nurses Tab ── */}
      {tab === 0 && (
        <Card sx={{ borderRadius: 3, border: "1px solid #e2e8f0", boxShadow: "0 1px 6px rgba(0,0,0,0.06)" }}>
          <CardContent sx={{ p: "24px !important" }}>
            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2.5, flexWrap: "wrap", gap: 1 }}>
              <Typography variant="h6" sx={{ fontWeight: 700 }}>Nurses</Typography>
              <Box sx={{ display: "flex", gap: 1.5, alignItems: "center", flexWrap: "wrap" }}>
                <TextField
                  size="small" placeholder="Search name, dept, shift…"
                  value={nurseSearch}
                  onChange={(e) => handleNurseSearch(e.target.value)}
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
                  <IconButton onClick={loadNurses} size="small" sx={{ border: "1px solid #e2e8f0", borderRadius: 2 }}>
                    <RefreshIcon fontSize="small" />
                  </IconButton>
                </Tooltip>
                <Button variant="contained" startIcon={<AddIcon />} onClick={openNurseCreate}
                  sx={{ borderRadius: 2.5, textTransform: "none", fontWeight: 600 }}>
                  Add Nurse
                </Button>
              </Box>
            </Box>
            <DataTable columns={NURSE_COLS} rows={nurses} loading={nurseLoading} />
          </CardContent>
        </Card>
      )}

      {/* ── Vitals Tab ── */}
      {tab === 1 && (
        <Card sx={{ borderRadius: 3, border: "1px solid #e2e8f0", boxShadow: "0 1px 6px rgba(0,0,0,0.06)" }}>
          <CardContent sx={{ p: "24px !important" }}>
            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2.5, flexWrap: "wrap", gap: 1 }}>
              <Typography variant="h6" sx={{ fontWeight: 700 }}>Patient Vitals</Typography>
              <Box sx={{ display: "flex", gap: 1.5, alignItems: "center", flexWrap: "wrap" }}>
                <TextField
                  size="small" placeholder="Enter Patient ID to load vitals…"
                  sx={{ width: 280, "& .MuiOutlinedInput-root": { borderRadius: 2.5 } }}
                  onKeyDown={(e) => { if (e.key === "Enter") loadPatientVitals(e.target.value); }}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <SearchIcon fontSize="small" sx={{ color: "#94a3b8" }} />
                      </InputAdornment>
                    ),
                  }}
                />
                <Button variant="contained" startIcon={<AddIcon />} onClick={openVitalCreate}
                  sx={{ borderRadius: 2.5, textTransform: "none", fontWeight: 600 }}>
                  Record Vital
                </Button>
              </Box>
            </Box>

            {vitals.length === 0 && !vitalLoading ? (
              <Box sx={{ textAlign: "center", py: 6, color: "#94a3b8" }}>
                <MonitorHeartIcon sx={{ fontSize: 48, mb: 1, opacity: 0.4 }} />
                <Typography variant="body2">Enter a Patient ID above and press Enter to load their vitals</Typography>
              </Box>
            ) : (
              <DataTable
                columns={VITAL_COLS} rows={vitals} loading={vitalLoading}
                onDelete={handleVitalDelete}
              />
            )}
          </CardContent>
        </Card>
      )}

      {/* ── Add Nurse Dialog ── */}
      <Dialog open={nurseDialog} onClose={closeNurseDialog} maxWidth="sm" fullWidth PaperProps={{ sx: { borderRadius: 3 } }}>
        <DialogTitle sx={{ fontWeight: 700, pb: 0 }}>Add New Nurse</DialogTitle>
        <DialogContent>
          <NurseForm form={nurseForm} onChange={setNurseForm} errors={nurseErrors} />
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2.5, gap: 1 }}>
          <Button onClick={closeNurseDialog} disabled={nurseSaving} sx={{ color: "#64748b", textTransform: "none" }}>
            Cancel
          </Button>
          <Button variant="contained" onClick={handleNurseSave} disabled={nurseSaving}
            sx={{ textTransform: "none", fontWeight: 600, minWidth: 120 }}>
            {nurseSaving ? "Saving…" : "Add Nurse"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* ── Record Vital Dialog ── */}
      <Dialog open={vitalDialog} onClose={closeVitalDialog} maxWidth="sm" fullWidth PaperProps={{ sx: { borderRadius: 3 } }}>
        <DialogTitle sx={{ fontWeight: 700, pb: 0 }}>Record Patient Vitals</DialogTitle>
        <DialogContent>
          <VitalForm form={vitalForm} onChange={setVitalForm} errors={vitalErrors} nurses={allNurses} />
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2.5, gap: 1 }}>
          <Button onClick={closeVitalDialog} disabled={vitalSaving} sx={{ color: "#64748b", textTransform: "none" }}>
            Cancel
          </Button>
          <Button variant="contained" onClick={handleVitalSave} disabled={vitalSaving}
            sx={{ textTransform: "none", fontWeight: 600, minWidth: 140 }}>
            {vitalSaving ? "Saving…" : "Record Vitals"}
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

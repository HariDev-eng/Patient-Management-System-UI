import React, { useEffect, useState } from "react";
import {Grid, TextField, Typography, Divider, Button, Box, IconButton, Paper, Autocomplete, CircularProgress,} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from '@mui/icons-material/Delete';
import { patientApi } from "../../api/patientApi";
import { doctorApi } from "../../api/doctorApi";

function getPatientId(r) { return r?.patientId ?? r?.id ?? r?._id ?? ""; }
function getDoctorId(r)  { return r?.doctorId  ?? r?.id ?? r?._id ?? ""; }

const EMPTY_ITEM = {
  medicineName: "", dosage: "", frequency: "",
  durationDays: "", instructions: "",
};

export default function PrescriptionForm({ form, onChange, errors = {} }) {
  const [patients,  setPatients]  = useState([]);
  const [doctors,   setDoctors]   = useState([]);
  const [loadingP,  setLoadingP]  = useState(true);
  const [loadingD,  setLoadingD]  = useState(true);

  useEffect(() => {
    patientApi.getAll()
      .then((r) => setPatients(Array.isArray(r.data) ? r.data : []))
      .catch(() => setPatients([]))
      .finally(() => setLoadingP(false));
    doctorApi.getAll()
      .then((r) => setDoctors(Array.isArray(r.data) ? r.data : []))
      .catch(() => setDoctors([]))
      .finally(() => setLoadingD(false));
  }, []);

  const selectedPatient = patients.find((p) => getPatientId(p) === form.patientId) ?? null;
  const selectedDoctor  = doctors.find((d)  => getDoctorId(d)  === form.doctorId)  ?? null;

  // items helpers
  const items = form.items ?? [{ ...EMPTY_ITEM }];

  const updateItem = (idx, key, val) => {
    const updated = items.map((item, i) => i === idx ? { ...item, [key]: val } : item);
    onChange({ ...form, items: updated });
  };

  const addItem = () => onChange({ ...form, items: [...items, { ...EMPTY_ITEM }] });

  const removeItem = (idx) => {
    if (items.length === 1) return;
    onChange({ ...form, items: items.filter((_, i) => i !== idx) });
  };

  return (
    <Grid container spacing={2} sx={{ mt: 0.5 }}>

      {/* Assignment */}
      <Grid item xs={12}>
        <Typography variant="caption" sx={{ fontWeight: 700, color: "#0891b2", textTransform: "uppercase", letterSpacing: 1 }}>
          Assignment
        </Typography>
        <Divider sx={{ mt: 0.5, mb: 1 }} />
      </Grid>

      <Grid item xs={12}>
        {loadingP ? (
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <CircularProgress size={16} /><Typography variant="body2" color="text.secondary">Loading patients…</Typography>
          </Box>
        ) : (
          <Autocomplete
            options={patients}
            value={selectedPatient}
            getOptionLabel={(p) => `${p.firstName ?? ""} ${p.lastName ?? ""} — ${p.phone ?? ""}`}
            isOptionEqualToValue={(a, b) => getPatientId(a) === getPatientId(b)}
            onChange={(_, val) => onChange({ ...form, patientId: val ? getPatientId(val) : "" })}
            renderOption={(props, p) => (
              <Box component="li" {...props} key={getPatientId(p)}>
                <Typography variant="body2" fontWeight={600}>{p.firstName} {p.lastName}</Typography>
                <Typography variant="caption" color="text.secondary" sx={{ ml: 1 }}>{p.phone}</Typography>
              </Box>
            )}
            renderInput={(params) => (
              <TextField {...params} label="Patient *" size="small"
                error={!!errors.patientId} helperText={errors.patientId ?? ""} />
            )}
          />
        )}
      </Grid>

      <Grid item xs={12}>
        {loadingD ? (
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <CircularProgress size={16} /><Typography variant="body2" color="text.secondary">Loading doctors…</Typography>
          </Box>
        ) : (
          <Autocomplete
            options={doctors}
            value={selectedDoctor}
            getOptionLabel={(d) => `Dr. ${d.firstName ?? ""} ${d.lastName ?? ""} — ${d.specialization?.replace(/_/g, " ") ?? ""}`}
            isOptionEqualToValue={(a, b) => getDoctorId(a) === getDoctorId(b)}
            onChange={(_, val) => onChange({ ...form, doctorId: val ? getDoctorId(val) : "" })}
            renderOption={(props, d) => (
              <Box component="li" {...props} key={getDoctorId(d)}>
                <Typography variant="body2" fontWeight={600}>Dr. {d.firstName} {d.lastName}</Typography>
                <Typography variant="caption" color="text.secondary" sx={{ ml: 1 }}>{d.specialization?.replace(/_/g, " ")}</Typography>
              </Box>
            )}
            renderInput={(params) => (
              <TextField {...params} label="Doctor *" size="small"
                error={!!errors.doctorId} helperText={errors.doctorId ?? ""} />
            )}
          />
        )}
      </Grid>

      <Grid item xs={12} sm={6}>
        <TextField
          label="Diagnosis ID (optional)" size="small" fullWidth
          value={form.diagnosisId ?? ""}
          onChange={(e) => onChange({ ...form, diagnosisId: e.target.value })}
        />
      </Grid>
      <Grid item xs={12} sm={6}>
        <TextField
          label="Appointment ID (optional)" size="small" fullWidth
          value={form.appointmentId ?? ""}
          onChange={(e) => onChange({ ...form, appointmentId: e.target.value })}
        />
      </Grid>

      {/* Medicine Items */}
      <Grid item xs={12}>
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <Typography variant="caption" sx={{ fontWeight: 700, color: "#0891b2", textTransform: "uppercase", letterSpacing: 1 }}>
            Medicines
          </Typography>
          <Button size="small" startIcon={<AddIcon />} onClick={addItem}
            sx={{ textTransform: "none", color: "#0891b2", fontWeight: 600 }}>
            Add Medicine
          </Button>
        </Box>
        <Divider sx={{ mt: 0.5, mb: 1.5 }} />
      </Grid>

      {items.map((item, idx) => (
        <Grid item xs={12} key={idx}>
          <Paper variant="outlined" sx={{ p: 2, borderRadius: 2, position: "relative" }}>
            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 1.5 }}>
              <Typography variant="caption" sx={{ fontWeight: 700, color: "#475569" }}>
                Medicine {idx + 1}
              </Typography>
              {items.length > 1 && (
                <IconButton size="small" onClick={() => removeItem(idx)} sx={{ color: "#dc2626" }}>
                  <DeleteIcon fontSize="small" />
                </IconButton>
              )}
            </Box>
            <Grid container spacing={1.5}>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Medicine Name *" size="small" fullWidth
                  value={item.medicineName}
                  onChange={(e) => updateItem(idx, "medicineName", e.target.value)}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Dosage (e.g. 500mg)" size="small" fullWidth
                  value={item.dosage}
                  onChange={(e) => updateItem(idx, "dosage", e.target.value)}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Frequency (e.g. Twice daily)" size="small" fullWidth
                  value={item.frequency}
                  onChange={(e) => updateItem(idx, "frequency", e.target.value)}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Duration (days)" size="small" fullWidth type="number"
                  value={item.durationDays}
                  onChange={(e) => updateItem(idx, "durationDays", e.target.value)}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label="Instructions" size="small" fullWidth
                  value={item.instructions}
                  onChange={(e) => updateItem(idx, "instructions", e.target.value)}
                />
              </Grid>
            </Grid>
          </Paper>
        </Grid>
      ))}
    </Grid>
  );
}

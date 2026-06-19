import React, { useEffect, useState } from "react";
import {
  Grid, TextField, MenuItem, Typography, Divider,
  Autocomplete, Box, CircularProgress,
} from "@mui/material";
import { patientApi } from "../../api/patientApi";
import { doctorApi } from "../../api/doctorApi";

function getPatientId(r) { return r?.patientId ?? r?.id ?? r?._id ?? ""; }
function getDoctorId(r)  { return r?.doctorId  ?? r?.id ?? r?._id ?? ""; }

export default function DiagnosisForm({ form, onChange, errors = {} }) {
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

  const f = (key, label, extra = {}) => ({
    label,
    value: form[key] ?? "",
    onChange: (e) => onChange({ ...form, [key]: e.target.value }),
    error: !!errors[key],
    helperText: errors[key] ?? "",
    fullWidth: true,
    size: "small",
    ...extra,
  });

  const selectedPatient = patients.find((p) => getPatientId(p) === form.patientId) ?? null;
  const selectedDoctor  = doctors.find((d)  => getDoctorId(d)  === form.doctorId)  ?? null;

  return (
    <Grid container spacing={2} sx={{ mt: 0.5 }}>

      {/* Patient & Doctor */}
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
                <Box>
                  <Typography variant="body2" fontWeight={600}>{p.firstName} {p.lastName}</Typography>
                  <Typography variant="caption" color="text.secondary">{p.email} · {p.phone}</Typography>
                </Box>
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
                <Box>
                  <Typography variant="body2" fontWeight={600}>Dr. {d.firstName} {d.lastName}</Typography>
                  <Typography variant="caption" color="text.secondary">{d.specialization?.replace(/_/g, " ")}</Typography>
                </Box>
              </Box>
            )}
            renderInput={(params) => (
              <TextField {...params} label="Doctor *" size="small"
                error={!!errors.doctorId} helperText={errors.doctorId ?? ""} />
            )}
          />
        )}
      </Grid>

      <Grid item xs={12}>
        <TextField {...f("appointmentId", "Appointment ID (optional)")} />
      </Grid>

      {/* Clinical Details */}
      <Grid item xs={12}>
        <Typography variant="caption" sx={{ fontWeight: 700, color: "#0891b2", textTransform: "uppercase", letterSpacing: 1 }}>
          Clinical Details
        </Typography>
        <Divider sx={{ mt: 0.5, mb: 1 }} />
      </Grid>

      <Grid item xs={12}>
        <TextField {...f("symptoms", "Symptoms *")} multiline rows={2} />
      </Grid>
      <Grid item xs={12}>
        <TextField {...f("diagnosis", "Diagnosis *")} multiline rows={2} />
      </Grid>
      <Grid item xs={12}>
        <TextField {...f("treatmentPlan", "Treatment Plan")} multiline rows={2} />
      </Grid>
      <Grid item xs={12}>
        <TextField {...f("notes", "Notes")} multiline rows={2} />
      </Grid>
      <Grid item xs={12} sm={6}>
        <TextField {...f("followUpDate", "Follow-up Date", {
          type: "date", InputLabelProps: { shrink: true },
        })} />
      </Grid>
    </Grid>
  );
}

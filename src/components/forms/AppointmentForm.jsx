import React, { useEffect, useState } from "react";
import {
  Grid, TextField, MenuItem, CircularProgress,
  Autocomplete, Box, Typography,
} from "@mui/material";
import { patientApi } from "../../api/patientApi";
import { doctorApi } from "../../api/doctorApi";

const STATUSES = ["SCHEDULED", "CONFIRMED", "COMPLETED", "CANCELLED", "NO_SHOW"];

function getPatientId(row) { return row?.patientId ?? row?.id ?? row?._id ?? ""; }
function getDoctorId(row)  { return row?.doctorId  ?? row?.id ?? row?._id ?? ""; }

export default function AppointmentForm({ form, onChange, errors = {} }) {
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
  const isEditing = !!(form.appointmentId || form.id || form._id);

  return (
    <Grid container spacing={2} sx={{ mt: 0.5 }}>

      {/* Patient dropdown */}
      <Grid item xs={12}>
        {loadingP ? (
          <Box sx={{ display: "flex", alignItems: "center", gap: 1, py: 1 }}>
            <CircularProgress size={16} sx={{ color: "#0891b2" }} />
            <Typography variant="body2" color="text.secondary">Loading patients…</Typography>
          </Box>
        ) : (
          <Autocomplete
            options={patients}
            value={selectedPatient}
            getOptionLabel={(p) =>
              `${p.firstName ?? ""} ${p.lastName ?? ""} — ${p.phone ?? ""}`.trim()
            }
            isOptionEqualToValue={(a, b) => getPatientId(a) === getPatientId(b)}
            onChange={(_, val) =>
              onChange({ ...form, patientId: val ? getPatientId(val) : "" })
            }
            renderOption={(props, p) => (
              <Box component="li" {...props} key={getPatientId(p)}>
                <Box>
                  <Typography variant="body2" fontWeight={600}>
                    {p.firstName} {p.lastName}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {p.email} · {p.phone} · {p.bloodGroup?.replace(/_/g, " ")}
                  </Typography>
                </Box>
              </Box>
            )}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Patient *"
                size="small"
                error={!!errors.patientId}
                helperText={errors.patientId ?? ""}
              />
            )}
          />
        )}
      </Grid>

      {/* Doctor dropdown */}
      <Grid item xs={12}>
        {loadingD ? (
          <Box sx={{ display: "flex", alignItems: "center", gap: 1, py: 1 }}>
            <CircularProgress size={16} sx={{ color: "#0891b2" }} />
            <Typography variant="body2" color="text.secondary">Loading doctors…</Typography>
          </Box>
        ) : (
          <Autocomplete
            options={doctors}
            value={selectedDoctor}
            getOptionLabel={(d) =>
              `Dr. ${d.firstName ?? ""} ${d.lastName ?? ""} — ${d.specialization?.replace(/_/g, " ") ?? ""}`
            }
            isOptionEqualToValue={(a, b) => getDoctorId(a) === getDoctorId(b)}
            onChange={(_, val) =>
              onChange({ ...form, doctorId: val ? getDoctorId(val) : "" })
            }
            renderOption={(props, d) => (
              <Box component="li" {...props} key={getDoctorId(d)}>
                <Box>
                  <Typography variant="body2" fontWeight={600}>
                    Dr. {d.firstName} {d.lastName}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {d.specialization?.replace(/_/g, " ")} · ₹{d.consultationFee}
                  </Typography>
                </Box>
              </Box>
            )}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Doctor *"
                size="small"
                error={!!errors.doctorId}
                helperText={errors.doctorId ?? ""}
              />
            )}
          />
        )}
      </Grid>

      {/* Date & Time */}
      <Grid item xs={12}>
        <TextField
          {...f("appointmentDateTime", "Appointment Date & Time *", {
            type: "datetime-local",
            InputLabelProps: { shrink: true },
          })}
        />
      </Grid>

      {/* Reason */}
      <Grid item xs={12}>
        <TextField {...f("reason", "Reason *")} />
      </Grid>

      {/* Notes */}
      <Grid item xs={12}>
        <TextField {...f("notes", "Notes")} multiline rows={2} />
      </Grid>

      {/* Status — only when editing */}
      {isEditing && (
        <Grid item xs={12}>
          <TextField {...f("status", "Status")} select>
            {STATUSES.map((s) => <MenuItem key={s} value={s}>{s}</MenuItem>)}
          </TextField>
        </Grid>
      )}
    </Grid>
  );
}

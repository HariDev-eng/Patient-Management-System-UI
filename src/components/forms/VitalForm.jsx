import React from "react";
import { Grid, TextField, MenuItem, Typography, Divider } from "@mui/material";

export default function VitalForm({ form, onChange, errors = {}, nurses = [] }) {
  const f = (key, label, extra = {}) => ({
    label,
    value: form[key] ?? "",
    onChange: (e) => onChange({ ...form, [key]: e.target.value }),
    error: !!errors[key],
    helperText: errors[key] ?? "",
    fullWidth: true,
    size: "small",
    type: "number",
    ...extra,
  });

  return (
    <Grid container spacing={2} sx={{ mt: 0.5 }}>

      <Grid item xs={12}>
        <Typography variant="caption" sx={{ fontWeight: 700, color: "#0891b2", textTransform: "uppercase", letterSpacing: 1 }}>
          Assignment
        </Typography>
        <Divider sx={{ mt: 0.5, mb: 1 }} />
      </Grid>

      <Grid item xs={12} sm={6}>
        <TextField
          label="Patient ID *" size="small" fullWidth
          value={form.patientId ?? ""}
          onChange={(e) => onChange({ ...form, patientId: e.target.value })}
          error={!!errors.patientId}
          helperText={errors.patientId ?? ""}
        />
      </Grid>
      <Grid item xs={12} sm={6}>
        {nurses.length > 0 ? (
          <TextField
            label="Nurse" size="small" fullWidth select
            value={form.nurseId ?? ""}
            onChange={(e) => onChange({ ...form, nurseId: e.target.value })}
          >
            <MenuItem value="">— None —</MenuItem>
            {nurses.map((n) => (
              <MenuItem key={n.nurseId} value={n.nurseId}>
                {n.firstName} {n.lastName} — {n.shift}
              </MenuItem>
            ))}
          </TextField>
        ) : (
          <TextField
            label="Nurse ID" size="small" fullWidth
            value={form.nurseId ?? ""}
            onChange={(e) => onChange({ ...form, nurseId: e.target.value })}
          />
        )}
      </Grid>

      <Grid item xs={12}>
        <Typography variant="caption" sx={{ fontWeight: 700, color: "#0891b2", textTransform: "uppercase", letterSpacing: 1 }}>
          Vitals
        </Typography>
        <Divider sx={{ mt: 0.5, mb: 1 }} />
      </Grid>

      <Grid item xs={12} sm={6}>
        <TextField {...f("temperature",      "Temperature (°C)", { inputProps: { step: 0.1 } })} />
      </Grid>
      <Grid item xs={12} sm={6}>
        <TextField {...f("heartRate",        "Heart Rate (bpm)")} />
      </Grid>
      <Grid item xs={12} sm={6}>
        <TextField {...f("systolicBP",       "Systolic BP (mmHg)")} />
      </Grid>
      <Grid item xs={12} sm={6}>
        <TextField {...f("diastolicBP",      "Diastolic BP (mmHg)")} />
      </Grid>
      <Grid item xs={12} sm={6}>
        <TextField {...f("oxygenSaturation", "Oxygen Saturation (%)")} />
      </Grid>
      <Grid item xs={12} sm={6}>
        <TextField {...f("weight",           "Weight (kg)", { inputProps: { step: 0.1 } })} />
      </Grid>
      <Grid item xs={12} sm={6}>
        <TextField {...f("height",           "Height (cm)", { inputProps: { step: 0.1 } })} />
      </Grid>
    </Grid>
  );
}

import React from "react";
import { Grid, TextField, MenuItem, InputAdornment } from "@mui/material";

const SPECIALIZATIONS = [
  "CARDIOLOGIST",
  "DERMATOLOGIST",
  "NEUROLOGIST",
  "ORTHOPEDIC",
  "PEDIATRICIAN",
  "GENERAL_PHYSICIAN",
  "PSYCHIATRIST",
];

export default function DoctorForm({ form, onChange, errors = {} }) {
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

  return (
    <Grid container spacing={2} sx={{ mt: 0.5 }}>
      <Grid item xs={12} sm={6}>
        <TextField {...f("firstName", "First Name *")} />
      </Grid>
      <Grid item xs={12} sm={6}>
        <TextField {...f("lastName", "Last Name *")} />
      </Grid>
      <Grid item xs={12} sm={6}>
        <TextField {...f("email", "Email *", { type: "email" })} />
      </Grid>
      <Grid item xs={12} sm={6}>
        <TextField {...f("phone", "Phone *")} />
      </Grid>
      <Grid item xs={12} sm={6}>
        <TextField {...f("specialization", "Specialization *")} select>
          {SPECIALIZATIONS.map((s) => (
            <MenuItem key={s} value={s}>{s.replace("_", " ")}</MenuItem>
          ))}
        </TextField>
      </Grid>
      <Grid item xs={12} sm={6}>
        <TextField {...f("licenseNumber", "License Number *")} />
      </Grid>
      <Grid item xs={12} sm={6}>
        <TextField {...f("experienceYears", "Experience (years) *", { type: "number" })} />
      </Grid>
      <Grid item xs={12} sm={6}>
        <TextField
          {...f("consultationFee", "Consultation Fee *", { type: "number" })}
          InputProps={{
            startAdornment: <InputAdornment position="start">₹</InputAdornment>,
          }}
        />
      </Grid>
    </Grid>
  );
}

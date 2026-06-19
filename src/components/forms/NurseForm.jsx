import React from "react";
import { Grid, TextField, MenuItem } from "@mui/material";

const SHIFTS = ["MORNING", "AFTERNOON", "NIGHT"];

export default function NurseForm({ form, onChange, errors = {} }) {
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
        <TextField {...f("department", "Department *")} />
      </Grid>
      <Grid item xs={12} sm={6}>
        <TextField {...f("shift", "Shift *")} select>
          {SHIFTS.map((s) => <MenuItem key={s} value={s}>{s}</MenuItem>)}
        </TextField>
      </Grid>
    </Grid>
  );
}

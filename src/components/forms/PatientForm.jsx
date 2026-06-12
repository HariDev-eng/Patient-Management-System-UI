import React from "react";
import { Grid, TextField } from "@mui/material";

const GENDERS  = ["Male", "Female", "Other"];
const STATUSES = ["Pending", "Complete", "CANCELLED"];

export default function PatientForm({ form, onChange }) {
  const f = (key) => ({
    value: form[key] ?? "",
    onChange: (e) => onChange({ ...form, [key]: e.target.value }),
    fullWidth: true,
    size: "small",
  });

  return (
    <Grid container spacing={2} sx={{ mt: 0.5 }}>
      <Grid item xs={12} sm={6}>
        <TextField label="Full Name"          {...f("name")} />
      </Grid>
      <Grid item xs={12} sm={6}>
        <TextField label="Age" type="number"  {...f("age")} />
      </Grid>
      <Grid item xs={12} sm={6}>
        <TextField label="Gender" select SelectProps={{ native: true }} {...f("gender")}>
          {GENDERS.map((g) => <option key={g} value={g}>{g}</option>)}
        </TextField>
      </Grid>
      <Grid item xs={12} sm={6}>
        <TextField label="Phone"              {...f("phone")} />
      </Grid>
      <Grid item xs={12} sm={6}>
        <TextField label="Doctor Consulting"  {...f("doctorName")} />
      </Grid>
      <Grid item xs={12} sm={6}>
        <TextField label="Treatment Under"    {...f("treatment")} />
      </Grid>
      <Grid item xs={12} sm={6}>
        <TextField label="Status" select SelectProps={{ native: true }} {...f("status")}>
          {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
        </TextField>
      </Grid>
      <Grid item xs={12}>
        <TextField label="Address" multiline rows={2} {...f("address")} />
      </Grid>
    </Grid>
  );
}

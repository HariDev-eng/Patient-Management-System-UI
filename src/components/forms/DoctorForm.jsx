import React from "react";
import { Grid, TextField } from "@mui/material";

const SPECS     = ["CARDIOLOGY","NEUROLOGY","ORTHOPEDICS","PEDIATRICS","DERMATOLOGY","GENERAL"];
const STATUSES  = ["Active","Inactive"];

export default function DoctorForm({ form, onChange }) {
  const f = (key) => ({
    value: form[key] ?? "",
    onChange: (e) => onChange({ ...form, [key]: e.target.value }),
    fullWidth: true,
    size: "small",
  });

  return (
    <Grid container spacing={2} sx={{ mt: 0.5 }}>
      <Grid item xs={12} sm={6}>
        <TextField label="Full Name"                   {...f("name")} />
      </Grid>
      <Grid item xs={12} sm={6}>
        <TextField label="Specialization" select SelectProps={{ native: true }} {...f("specialization")}>
          {SPECS.map((s) => <option key={s} value={s}>{s}</option>)}
        </TextField>
      </Grid>
      <Grid item xs={12} sm={6}>
        <TextField label="Phone"                       {...f("phone")} />
      </Grid>
      <Grid item xs={12} sm={6}>
        <TextField label="Email" type="email"          {...f("email")} />
      </Grid>
      <Grid item xs={12} sm={6}>
        <TextField label="Experience (years)" type="number" {...f("experience")} />
      </Grid>
      <Grid item xs={12} sm={6}>
        <TextField label="Status" select SelectProps={{ native: true }} {...f("status")}>
          {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
        </TextField>
      </Grid>
    </Grid>
  );
}

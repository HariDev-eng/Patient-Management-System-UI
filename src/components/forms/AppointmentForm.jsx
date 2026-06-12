import React from "react";
import { Grid, TextField } from "@mui/material";

const STATUSES = ["SCHEDULED","COMPLETED","CANCELLED"];

export default function AppointmentForm({ form, onChange }) {
  const f = (key, extra = {}) => ({
    value: form[key] ?? "",
    onChange: (e) => onChange({ ...form, [key]: e.target.value }),
    fullWidth: true,
    size: "small",
    ...extra,
  });

  return (
    <Grid container spacing={2} sx={{ mt: 0.5 }}>
      <Grid item xs={12} sm={6}>
        <TextField label="Patient ID"  {...f("patientId")} />
      </Grid>
      <Grid item xs={12} sm={6}>
        <TextField label="Doctor ID"   {...f("doctorId")} />
      </Grid>
      <Grid item xs={12} sm={6}>
        <TextField label="Date" type="date" InputLabelProps={{ shrink: true }} {...f("date")} />
      </Grid>
      <Grid item xs={12} sm={6}>
        <TextField label="Time" type="time" InputLabelProps={{ shrink: true }} {...f("time")} />
      </Grid>
      <Grid item xs={12} sm={6}>
        <TextField label="Status" select SelectProps={{ native: true }} {...f("status")}>
          {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
        </TextField>
      </Grid>
      <Grid item xs={12}>
        <TextField label="Reason" multiline rows={2} {...f("reason")} />
      </Grid>
    </Grid>
  );
}

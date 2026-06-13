import React from "react";
import { Grid, TextField, MenuItem, Typography, Divider } from "@mui/material";

const GENDERS = ["MALE", "FEMALE", "OTHER"];
const BLOOD_GROUPS = [
  "A_POSITIVE","A_NEGATIVE","B_POSITIVE","B_NEGATIVE",
  "AB_POSITIVE","AB_NEGATIVE","O_POSITIVE","O_NEGATIVE",
];
const STATUSES = ["ACTIVE", "INACTIVE", "DECEASED"];

export default function PatientForm({ form, onChange, errors = {} }) {
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

      {/* ── Basic Info ── */}
      <Grid item xs={12}>
        <Typography variant="caption" sx={{ fontWeight: 700, color: "#0891b2", textTransform: "uppercase", letterSpacing: 1 }}>
          Basic Information
        </Typography>
        <Divider sx={{ mt: 0.5, mb: 1 }} />
      </Grid>

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
        <TextField {...f("dateOfBirth", "Date of Birth *", {
          type: "date", InputLabelProps: { shrink: true },
        })} />
      </Grid>
      <Grid item xs={12} sm={6}>
        <TextField {...f("gender", "Gender *")} select>
          {GENDERS.map((g) => <MenuItem key={g} value={g}>{g}</MenuItem>)}
        </TextField>
      </Grid>
      <Grid item xs={12} sm={6}>
        <TextField {...f("bloodGroup", "Blood Group")} select>
          <MenuItem value="">— None —</MenuItem>
          {BLOOD_GROUPS.map((b) => (
            <MenuItem key={b} value={b}>{b.replace(/_/g, " ")}</MenuItem>
          ))}
        </TextField>
      </Grid>
      <Grid item xs={12} sm={6}>
        <TextField {...f("status", "Status")} select>
          {STATUSES.map((s) => <MenuItem key={s} value={s}>{s}</MenuItem>)}
        </TextField>
      </Grid>
      <Grid item xs={12}>
        <TextField {...f("address", "Address")} multiline rows={2} />
      </Grid>

      {/* ── Emergency Contact ── */}
      <Grid item xs={12}>
        <Typography variant="caption" sx={{ fontWeight: 700, color: "#0891b2", textTransform: "uppercase", letterSpacing: 1 }}>
          Emergency Contact
        </Typography>
        <Divider sx={{ mt: 0.5, mb: 1 }} />
      </Grid>
      <Grid item xs={12} sm={6}>
        <TextField {...f("emergencyContactName", "Contact Name")} />
      </Grid>
      <Grid item xs={12} sm={6}>
        <TextField {...f("emergencyContactPhone", "Contact Phone")} />
      </Grid>

      {/* ── Medical Info ── */}
      <Grid item xs={12}>
        <Typography variant="caption" sx={{ fontWeight: 700, color: "#0891b2", textTransform: "uppercase", letterSpacing: 1 }}>
          Medical Information
        </Typography>
        <Divider sx={{ mt: 0.5, mb: 1 }} />
      </Grid>
      <Grid item xs={12} sm={6}>
        <TextField {...f("allergies", "Allergies")} />
      </Grid>
      <Grid item xs={12} sm={6}>
        <TextField {...f("medicalConditions", "Medical Conditions")} />
      </Grid>

      {/* ── Insurance ── */}
      <Grid item xs={12}>
        <Typography variant="caption" sx={{ fontWeight: 700, color: "#0891b2", textTransform: "uppercase", letterSpacing: 1 }}>
          Insurance
        </Typography>
        <Divider sx={{ mt: 0.5, mb: 1 }} />
      </Grid>
      <Grid item xs={12} sm={6}>
        <TextField {...f("insuranceProvider", "Insurance Provider")} />
      </Grid>
      <Grid item xs={12} sm={6}>
        <TextField {...f("insuranceNumber", "Insurance Number")} />
      </Grid>

    </Grid>
  );
}

import React from "react";
import { Grid, TextField } from "@mui/material";

export default function InventoryForm({ form, onChange }) {
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
        <TextField label="Item Name"         {...f("name")} />
      </Grid>
      <Grid item xs={12} sm={6}>
        <TextField label="Category"          {...f("category")} />
      </Grid>
      <Grid item xs={12} sm={6}>
        <TextField label="Quantity" type="number" {...f("quantity")} />
      </Grid>
      <Grid item xs={12} sm={6}>
        <TextField label="Unit (e.g. tablets, ml)" {...f("unit")} />
      </Grid>
      <Grid item xs={12} sm={6}>
        <TextField label="Min Stock Level" type="number" {...f("minStock")} />
      </Grid>
      <Grid item xs={12} sm={6}>
        <TextField label="Price (₹)" type="number" {...f("price")} />
      </Grid>
      <Grid item xs={12}>
        <TextField label="Supplier"          {...f("supplier")} />
      </Grid>
    </Grid>
  );
}

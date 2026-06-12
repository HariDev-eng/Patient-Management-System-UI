import React, { useEffect, useState } from "react";
import {
  Box, Card, CardContent, Typography, Button, TextField,
  InputAdornment, Dialog, DialogTitle, DialogContent,
  DialogActions, Alert, Snackbar, Chip,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import SearchIcon from "@mui/icons-material/Search";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";
import MainLayout from "../components/layout/MainLayout";
import DataTable from "../components/tables/DataTable";
import InventoryForm from "../components/forms/InventoryForm";
import { inventoryApi } from "../api/inventoryApi";

const EMPTY = { name: "", category: "", quantity: "", unit: "", minStock: "", price: "", supplier: "" };

const COLS = [
  { key: "itemId",   label: "Item ID" },
  { key: "name",     label: "Item Name" },
  { key: "category", label: "Category" },
  { key: "quantity", label: "Qty" },
  { key: "unit",     label: "Unit" },
  { key: "minStock", label: "Min Stock" },
  { key: "price",    label: "Price", render: (r) => r.price ? `₹${r.price}` : "—" },
  { key: "supplier", label: "Supplier" },
];

export default function Inventory() {
  const [rows, setRows]         = useState([]);
  const [loading, setLoading]   = useState(true);
  const [search, setSearch]     = useState("");
  const [lowStock, setLowStock] = useState(false);
  const [dialog, setDialog]     = useState(false);
  const [editing, setEditing]   = useState(null);
  const [form, setForm]         = useState(EMPTY);
  const [saving, setSaving]     = useState(false);
  const [snack, setSnack]       = useState({ open: false, msg: "", sev: "success" });

  const load = async () => {
    setLoading(true);
    try { const r = await inventoryApi.getAll(); setRows(r.data); setLowStock(false); }
    catch { setRows([]); }
    finally { setLoading(false); }
  };

  const loadLow = async () => {
    setLoading(true);
    try { const r = await inventoryApi.getLowStock(); setRows(r.data); setLowStock(true); }
    catch { setRows([]); }
    finally { setLoading(false); }
  };

  useEffect(() => { load(); }, []);

  const handleSearch = async (val) => {
    setSearch(val);
    if (!val.trim()) { load(); return; }
    try { const r = await inventoryApi.search(val); setRows(r.data); }
    catch { setRows([]); }
  };

  const openCreate  = () => { setEditing(null); setForm(EMPTY); setDialog(true); };
  const openEdit    = (row) => { setEditing(row); setForm({ ...row }); setDialog(true); };
  const closeDialog = () => { setDialog(false); setEditing(null); };

  const handleSave = async () => {
    setSaving(true);
    try {
      editing ? await inventoryApi.update(editing.id ?? editing._id, form) : await inventoryApi.create(form);
      toast(editing ? "Item updated." : "Item added.");
      closeDialog(); load();
    } catch (e) { toast(e.response?.data?.message ?? "Save failed.", "error"); }
    finally { setSaving(false); }
  };

  const handleDelete = async (row) => {
    if (!window.confirm(`Delete "${row.name}"?`)) return;
    try { await inventoryApi.delete(row.id ?? row._id); toast("Deleted."); load(); }
    catch { toast("Delete failed.", "error"); }
  };

  const toast = (msg, sev = "success") => setSnack({ open: true, msg, sev });

  return (
    <MainLayout>
      <Card sx={{ borderRadius: 3, border: "1px solid #e2e8f0", boxShadow: "0 1px 6px rgba(0,0,0,0.06)" }}>
        <CardContent sx={{ p: "24px !important" }}>
          <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2.5, flexWrap: "wrap", gap: 1 }}>
            <Typography variant="h6" sx={{ fontWeight: 700 }}>Inventory</Typography>
            <Box sx={{ display: "flex", gap: 1.5, alignItems: "center", flexWrap: "wrap" }}>
              <TextField
                size="small" placeholder="Search items…" value={search}
                onChange={(e) => handleSearch(e.target.value)}
                InputProps={{ startAdornment: <InputAdornment position="start"><SearchIcon fontSize="small" sx={{ color: "#94a3b8" }} /></InputAdornment> }}
                sx={{ width: 200, "& .MuiOutlinedInput-root": { borderRadius: 2.5 } }}
              />
              <Chip
                icon={<WarningAmberIcon fontSize="small" />}
                label="Low Stock" clickable
                onClick={lowStock ? load : loadLow}
                sx={{
                  fontWeight: 600,
                  bgcolor: lowStock ? "#fef3c7" : "#f8fafc",
                  color:   lowStock ? "#d97706" : "#64748b",
                  border:  `1px solid ${lowStock ? "#fbbf24" : "#e2e8f0"}`,
                }}
              />
              <Button variant="contained" startIcon={<AddIcon />} onClick={openCreate}
                sx={{ borderRadius: 2.5, textTransform: "none", fontWeight: 600 }}>
                Add Item
              </Button>
            </Box>
          </Box>
          <DataTable columns={COLS} rows={rows} loading={loading} onEdit={openEdit} onDelete={handleDelete} />
        </CardContent>
      </Card>

      <Dialog open={dialog} onClose={closeDialog} maxWidth="sm" fullWidth PaperProps={{ sx: { borderRadius: 3 } }}>
        <DialogTitle sx={{ fontWeight: 700, pb: 0 }}>{editing ? "Edit Item" : "Add Inventory Item"}</DialogTitle>
        <DialogContent>
          <InventoryForm form={form} onChange={setForm} />
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2.5 }}>
          <Button onClick={closeDialog} sx={{ color: "#64748b", textTransform: "none" }}>Cancel</Button>
          <Button variant="contained" onClick={handleSave} disabled={saving} sx={{ textTransform: "none", fontWeight: 600 }}>
            {saving ? "Saving…" : editing ? "Update" : "Add Item"}
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar open={snack.open} autoHideDuration={3000} onClose={() => setSnack({ ...snack, open: false })}>
        <Alert severity={snack.sev} onClose={() => setSnack({ ...snack, open: false })}>{snack.msg}</Alert>
      </Snackbar>
    </MainLayout>
  );
}

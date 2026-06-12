import React, { useEffect, useState } from "react";
import {
  Box, Card, CardContent, Typography, Button,
  Dialog, DialogTitle, DialogContent, DialogActions,
  Alert, Snackbar, Chip, Stack,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import MainLayout from "../components/layout/MainLayout";
import DataTable from "../components/tables/DataTable";
import BillingForm from "../components/forms/BillingForm";
import { billingApi } from "../api/billingApi";

const STATUSES = ["PENDING","PAID","FAILED"];
const EMPTY    = { patientId: "", amount: "", description: "", status: "PENDING", dueDate: "" };

const COLS = [
  { key: "billId",      label: "Bill ID" },
  { key: "patientId",   label: "Patient ID" },
  { key: "amount",      label: "Amount", render: (r) => r.amount ? `₹${r.amount}` : "—" },
  { key: "description", label: "Description" },
  { key: "dueDate",     label: "Due Date" },
  { key: "status",      label: "Status", isStatus: true },
];

const STATUS_COLORS = {
  PENDING: { bg: "#fef3c7", color: "#d97706" },
  PAID:    { bg: "#d1fae5", color: "#059669" },
  FAILED:  { bg: "#fee2e2", color: "#dc2626" },
};

export default function Billing() {
  const [rows, setRows]         = useState([]);
  const [loading, setLoading]   = useState(true);
  const [activeStatus, setStatus] = useState("ALL");
  const [dialog, setDialog]     = useState(false);
  const [editing, setEditing]   = useState(null);
  const [form, setForm]         = useState(EMPTY);
  const [saving, setSaving]     = useState(false);
  const [snack, setSnack]       = useState({ open: false, msg: "", sev: "success" });

  const load = async (status = "ALL") => {
    setLoading(true);
    try {
      const r = status === "ALL" ? await billingApi.getAll() : await billingApi.getByStatus(status);
      setRows(r.data);
    } catch { setRows([]); }
    finally { setLoading(false); }
  };

  useEffect(() => { load(); }, []);

  const handleStatus = (s) => { setStatus(s); load(s); };
  const openCreate   = () => { setEditing(null); setForm(EMPTY); setDialog(true); };
  const openEdit     = (row) => { setEditing(row); setForm({ ...row }); setDialog(true); };
  const closeDialog  = () => { setDialog(false); setEditing(null); };

  const handleSave = async () => {
    setSaving(true);
    try {
      editing ? await billingApi.update(editing.id ?? editing._id, form) : await billingApi.create(form);
      toast(editing ? "Bill updated." : "Bill created.");
      closeDialog(); load(activeStatus);
    } catch (e) { toast(e.response?.data?.message ?? "Save failed.", "error"); }
    finally { setSaving(false); }
  };

  const handleDelete = async (row) => {
    if (!window.confirm("Delete this bill?")) return;
    try { await billingApi.delete(row.id ?? row._id); toast("Deleted."); load(activeStatus); }
    catch { toast("Delete failed.", "error"); }
  };

  const toast = (msg, sev = "success") => setSnack({ open: true, msg, sev });

  return (
    <MainLayout>
      <Card sx={{ borderRadius: 3, border: "1px solid #e2e8f0", boxShadow: "0 1px 6px rgba(0,0,0,0.06)" }}>
        <CardContent sx={{ p: "24px !important" }}>
          <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2, flexWrap: "wrap", gap: 1 }}>
            <Typography variant="h6" sx={{ fontWeight: 700 }}>Billing</Typography>
            <Button variant="contained" startIcon={<AddIcon />} onClick={openCreate}
              sx={{ borderRadius: 2.5, textTransform: "none", fontWeight: 600 }}>
              Create Bill
            </Button>
          </Box>

          <Stack direction="row" spacing={1} sx={{ mb: 2.5, flexWrap: "wrap", gap: 1 }}>
            {["ALL", ...STATUSES].map((s) => {
              const c = STATUS_COLORS[s] ?? { bg: "#f1f5f9", color: "#475569" };
              const active = activeStatus === s;
              return (
                <Chip key={s} label={s} size="small" clickable onClick={() => handleStatus(s)}
                  sx={{ fontWeight: 600, fontSize: "0.72rem", bgcolor: active ? c.color : c.bg, color: active ? "#fff" : c.color }}
                />
              );
            })}
          </Stack>

          <DataTable columns={COLS} rows={rows} loading={loading} onEdit={openEdit} onDelete={handleDelete} />
        </CardContent>
      </Card>

      <Dialog open={dialog} onClose={closeDialog} maxWidth="sm" fullWidth PaperProps={{ sx: { borderRadius: 3 } }}>
        <DialogTitle sx={{ fontWeight: 700, pb: 0 }}>{editing ? "Edit Bill" : "Create Bill"}</DialogTitle>
        <DialogContent>
          <BillingForm form={form} onChange={setForm} />
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2.5 }}>
          <Button onClick={closeDialog} sx={{ color: "#64748b", textTransform: "none" }}>Cancel</Button>
          <Button variant="contained" onClick={handleSave} disabled={saving} sx={{ textTransform: "none", fontWeight: 600 }}>
            {saving ? "Saving…" : editing ? "Update" : "Create"}
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar open={snack.open} autoHideDuration={3000} onClose={() => setSnack({ ...snack, open: false })}>
        <Alert severity={snack.sev} onClose={() => setSnack({ ...snack, open: false })}>{snack.msg}</Alert>
      </Snackbar>
    </MainLayout>
  );
}

import React, { useEffect, useState } from "react";
import {
  Box, Card, CardContent, Typography, Grid,
  Avatar, LinearProgress, CircularProgress,
} from "@mui/material";
import {
  Radar, RadarChart, PolarGrid, PolarAngleAxis,
  PolarRadiusAxis, ResponsiveContainer,
} from "recharts";
import PersonIcon from "@mui/icons-material/Person";
import MedicalServicesIcon from "@mui/icons-material/MedicalServices";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import ReceiptIcon from "@mui/icons-material/Receipt";
import MainLayout from "../components/layout/MainLayout";
import DataTable from "../components/tables/DataTable";
import { patientApi } from "../api/patientApi";
import { doctorApi } from "../api/doctorApi";
import { appointmentApi } from "../api/appointmentApi";
import { billingApi } from "../api/billingApi";

const RADAR_DATA = [
  { subject: "Root canal",   A: 64 },
  { subject: "Fever",        A: 90 },
  { subject: "High BP",      A: 77 },
  { subject: "Brain Cancer", A: 96 },
  { subject: "CSBG",         A: 80 },
];

const DIAGNOSIS_STATS = [
  { label: "Fever",        value: 90 },
  { label: "High BP",      value: 77 },
  { label: "ESBR",         value: 75 },
  { label: "Root canal",   value: 64 },
  { label: "Brain Cancer", value: 96 },
];

const TABLE_COLS = [
  { key: "name",       label: "Patient name" },
  { key: "patientId",  label: "Patient ID" },
  { key: "age",        label: "Age" },
  { key: "gender",     label: "Gender" },
  { key: "doctorName", label: "Doctor consulting" },
  { key: "treatment",  label: "Treatment under" },
  { key: "status",     label: "Status", isStatus: true },
];

const STAT_CARDS = [
  { key: "patients",     label: "Total Patients",  icon: <PersonIcon />,          color: "#0891b2", bg: "#e0f2fe" },
  { key: "doctors",      label: "Doctors",          icon: <MedicalServicesIcon />, color: "#0f766e", bg: "#d1fae5" },
  { key: "appointments", label: "Appointments",     icon: <CalendarMonthIcon />,   color: "#7c3aed", bg: "#ede9fe" },
  { key: "billing",      label: "Billing Records",  icon: <ReceiptIcon />,         color: "#d97706", bg: "#fef3c7" },
];

export default function Dashboard() {
  const [patients, setPatients]   = useState([]);
  const [prescriptions, setPrescriptions] = useState([]);
  const [stats, setStats]         = useState({ patients: 0, doctors: 0, appointments: 0, billing: 0 });
  const [loading, setLoading]     = useState(true);

  useEffect(() => {
    setLoading(true);
    Promise.allSettled([
      patientApi.getAll(),
      doctorApi.getAll(),
      appointmentApi.getAll(),
      billingApi.getAll(),
    ]).then(([p, d, a, b]) => {
      // patients table — latest 6
      const pts = p.status === "fulfilled" ? (p.value.data ?? []) : [];
      setPatients(pts.slice(0, 6));

      // prescriptions — derive from patients (first 3 with treatment info)
      const rxPatients = pts.filter((pt) => pt.treatment || pt.prescription).slice(0, 3);
      setPrescriptions(rxPatients);

      setStats({
        patients:     pts.length,
        doctors:      d.status === "fulfilled" ? (d.value.data ?? []).length : 0,
        appointments: a.status === "fulfilled" ? (a.value.data ?? []).length : 0,
        billing:      b.status === "fulfilled" ? (b.value.data ?? []).length : 0,
      });
    }).finally(() => setLoading(false));
  }, []);

  return (
    <MainLayout>
      {/* ── Stat Cards ── */}
      <Grid container spacing={2.5} sx={{ mb: 3 }}>
        {STAT_CARDS.map(({ key, label, icon, color, bg }) => (
          <Grid item xs={12} sm={6} lg={3} key={key}>
            <Card sx={{ borderRadius: 3, border: "1px solid #e2e8f0", boxShadow: "0 1px 6px rgba(0,0,0,0.06)" }}>
              <CardContent sx={{ display: "flex", alignItems: "center", gap: 2, p: "20px !important" }}>
                <Box
                  sx={{
                    width: 54, height: 54, borderRadius: 2.5,
                    background: bg, display: "flex",
                    alignItems: "center", justifyContent: "center", flexShrink: 0,
                  }}
                >
                  {React.cloneElement(icon, { sx: { color, fontSize: 26 } })}
                </Box>
                <Box>
                  <Typography variant="h5" sx={{ fontWeight: 800, color: "#0f172a", lineHeight: 1 }}>
                    {loading ? <CircularProgress size={18} sx={{ color }} /> : stats[key]}
                  </Typography>
                  <Typography variant="body2" sx={{ color: "#64748b", mt: 0.4 }}>{label}</Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* ── Patient Table ── */}
      <Card sx={{ mb: 3, borderRadius: 3, border: "1px solid #e2e8f0", boxShadow: "0 1px 6px rgba(0,0,0,0.06)" }}>
        <CardContent sx={{ p: "24px !important" }}>
          <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
            <Typography variant="h6" sx={{ fontWeight: 700 }}>Patient details</Typography>
          </Box>
          <DataTable columns={TABLE_COLS} rows={patients} loading={loading} />
        </CardContent>
      </Card>

      {/* ── Bottom Row ── */}
      <Grid container spacing={2.5}>
        {/* Prescriptions */}
        <Grid item xs={12} md={7}>
          <Card sx={{ borderRadius: 3, border: "1px solid #e2e8f0", boxShadow: "0 1px 6px rgba(0,0,0,0.06)", height: "100%" }}>
            <CardContent sx={{ p: "20px !important" }}>
              <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>Prescriptions for patients</Typography>
              {loading ? (
                <Box sx={{ display: "flex", justifyContent: "center", py: 3 }}>
                  <CircularProgress size={28} sx={{ color: "#0891b2" }} />
                </Box>
              ) : prescriptions.length === 0 ? (
                <Typography variant="body2" color="text.secondary" sx={{ py: 2 }}>
                  No prescription data available.
                </Typography>
              ) : (
                <Box sx={{ display: "flex", gap: 1.5, flexWrap: "nowrap", overflowX: "auto" }}>
                  {prescriptions.map((p, i) => (
                    <Box
                      key={p._id ?? p.id ?? i}
                      sx={{
                        minWidth: 170, flex: "1 1 170px",
                        border: "1px solid #e2e8f0", borderRadius: 2.5,
                        p: 1.8, background: "#fff",
                      }}
                    >
                      <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1.5 }}>
                        <Avatar sx={{ width: 38, height: 38, bgcolor: "#0891b2", fontSize: 14, fontWeight: 700 }}>
                          {(p.name ?? "P")[0].toUpperCase()}
                        </Avatar>
                        <Typography sx={{ fontSize: "0.75rem", fontWeight: 700, color: "#0f172a", lineHeight: 1.3 }}>
                          {p.name} prescription
                        </Typography>
                      </Box>
                      <Typography sx={{ fontSize: "0.72rem", fontWeight: 700, color: "#475569", mb: 0.3 }}>
                        Prescription detail
                      </Typography>
                      <Typography sx={{ fontSize: "0.7rem", color: "#64748b", lineHeight: 1.7 }}>
                        Treatment: {p.treatment ?? "—"}<br />
                        Doctor: {p.doctorName ?? "—"}<br />
                        Status: {p.status ?? "—"}
                      </Typography>
                    </Box>
                  ))}
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* Diagnosis Radar */}
        <Grid item xs={12} md={5}>
          <Card sx={{ borderRadius: 3, border: "1px solid #e2e8f0", boxShadow: "0 1px 6px rgba(0,0,0,0.06)", height: "100%" }}>
            <CardContent sx={{ p: "20px !important" }}>
              <Typography variant="h6" sx={{ fontWeight: 700, mb: 1.5 }}>Patient Diagnosis</Typography>
              <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
                <Box sx={{ width: 190, flexShrink: 0 }}>
                  <ResponsiveContainer width="100%" height={185}>
                    <RadarChart cx="50%" cy="50%" outerRadius="70%" data={RADAR_DATA}>
                      <PolarGrid stroke="#e2e8f0" />
                      <PolarAngleAxis dataKey="subject" tick={{ fontSize: 9, fill: "#64748b" }} />
                      <PolarRadiusAxis tick={false} axisLine={false} />
                      <Radar dataKey="A" stroke="#0891b2" fill="#0891b2" fillOpacity={0.22} strokeWidth={2} />
                    </RadarChart>
                  </ResponsiveContainer>
                </Box>
                <Box sx={{ flex: 1, minWidth: 0 }}>
                  {DIAGNOSIS_STATS.map((d) => (
                    <Box key={d.label} sx={{ mb: 1.4 }}>
                      <Box sx={{ display: "flex", justifyContent: "space-between", mb: 0.4 }}>
                        <Typography sx={{ fontSize: "0.75rem", color: "#475569" }}>{d.label}</Typography>
                        <Typography sx={{ fontSize: "0.75rem", fontWeight: 700, color: "#0f172a" }}>
                          — {d.value}%
                        </Typography>
                      </Box>
                      <LinearProgress
                        variant="determinate" value={d.value}
                        sx={{
                          height: 5, borderRadius: 3, bgcolor: "#e0f2fe",
                          "& .MuiLinearProgress-bar": { bgcolor: "#0891b2", borderRadius: 3 },
                        }}
                      />
                    </Box>
                  ))}
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </MainLayout>
  );
}

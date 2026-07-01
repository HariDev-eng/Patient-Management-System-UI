import React, { useEffect, useState } from "react";
import {
  Box, Card, CardContent, Typography, Grid,
  Avatar, Chip, CircularProgress,
} from "@mui/material";
import PersonIcon          from "@mui/icons-material/Person";
import MedicalServicesIcon from "@mui/icons-material/MedicalServices";
import CalendarMonthIcon   from "@mui/icons-material/CalendarMonth";
import MonitorHeartIcon    from "@mui/icons-material/MonitorHeart";
import TrendingUpIcon      from "@mui/icons-material/TrendingUp";
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, PieChart, Pie, Cell,
  RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis,
} from "recharts";
import MainLayout    from "../components/layout/MainLayout";
import DataTable     from "../components/tables/DataTable";
import { patientApi }     from "../api/patientApi";
import { doctorApi }      from "../api/doctorApi";
import { appointmentApi } from "../api/appointmentApi";
import { billingApi }     from "../api/billingApi";

const TREND_DATA = [
  { month: "Jan", appointments: 32, patients: 24 },
  { month: "Feb", appointments: 45, patients: 38 },
  { month: "Mar", appointments: 38, patients: 30 },
  { month: "Apr", appointments: 52, patients: 44 },
  { month: "May", appointments: 61, patients: 55 },
  { month: "Jun", appointments: 48, patients: 42 },
];

const RADAR_DATA = [
  { subject: "Fever",      A: 90 },
  { subject: "High BP",    A: 77 },
  { subject: "ESBR",       A: 75 },
  { subject: "Root Canal", A: 64 },
  { subject: "Cancer",     A: 96 },
];

const PIE_COLORS = ["#4f46e5", "#ec4899", "#f59e0b"];

const PATIENT_COLS = [
  { key: "fullName",   label: "Name",   render: (r) => `${r.firstName ?? ""} ${r.lastName ?? ""}`.trim() || "—" },
  { key: "patientId",  label: "ID",     render: (r) => (r.patientId ?? r.id ?? "").toString().substring(0, 8) + "…" },
  { key: "gender",     label: "Gender" },
  { key: "bloodGroup", label: "Blood",  render: (r) => r.bloodGroup?.replace(/_/g, " ") ?? "—" },
  { key: "status",     label: "Status", isStatus: true },
];

const APPT_COLS = [
  { key: "id",     label: "ID",     render: (r) => (r.appointmentId ?? r.id ?? "").toString().substring(0, 8) + "…" },
  { key: "date",   label: "Date",   render: (r) => r.appointmentDateTime ? new Date(r.appointmentDateTime).toLocaleDateString("en-IN", { day: "2-digit", month: "short" }) : "—" },
  { key: "reason", label: "Reason", render: (r) => r.reason ?? "—" },
  { key: "status", label: "Status", isStatus: true },
];

function StatCard({ icon, label, value, color, bg, trend, loading }) {
  return (
      <Card sx={{
        borderRadius: 3, overflow: "hidden", position: "relative",
        border: "1px solid #e2e8f0", boxShadow: "0 1px 3px rgba(0,0,0,0.04)",
        transition: "transform 0.2s, box-shadow 0.2s",
        "&:hover": { transform: "translateY(-2px)", boxShadow: "0 8px 24px rgba(0,0,0,0.08)" },
        "&::before": { content:'""', position:"absolute", top:0, left:0, right:0, height:3,
          background:`linear-gradient(90deg,${color},${color}88)` },
      }}>
        <CardContent sx={{ p: "18px !important" }}>
          <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
            <Box>
              <Typography sx={{ fontSize: "0.68rem", fontWeight: 600, color: "#94a3b8",
                textTransform: "uppercase", letterSpacing: "0.06em", mb: 0.8 }}>
                {label}
              </Typography>
              <Typography sx={{ fontSize: "2rem", fontWeight: 800, color: "#0f172a",
                letterSpacing: "-0.03em", lineHeight: 1 }}>
                {loading ? <CircularProgress size={20} sx={{ color }} /> : value}
              </Typography>
              {trend && !loading && (
                  <Box sx={{ display: "flex", alignItems: "center", gap: 0.5, mt: 0.8 }}>
                    <TrendingUpIcon sx={{ fontSize: 12, color: "#10b981" }} />
                    <Typography sx={{ fontSize: "0.7rem", color: "#10b981", fontWeight: 600 }}>{trend}</Typography>
                  </Box>
              )}
            </Box>
            <Box sx={{ width: 44, height: 44, borderRadius: 2.5, bgcolor: bg,
              display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
              {React.cloneElement(icon, { sx: { color, fontSize: 20 } })}
            </Box>
          </Box>
        </CardContent>
      </Card>
  );
}

export default function Dashboard() {
  const [patients,     setPatients]     = useState([]);
  const [doctors,      setDoctors]      = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [stats,        setStats]        = useState({ patients: 0, doctors: 0, appointments: 0, billing: 0 });
  const [loading,      setLoading]      = useState(true);

  useEffect(() => {
    Promise.allSettled([
      patientApi.getAll(),
      doctorApi.getAll(),
      appointmentApi.getAll(),
      billingApi.getAll(),
    ]).then(([p, d, a, b]) => {
      const pts  = p.status === "fulfilled" ? (p.value.data ?? []) : [];
      const drs  = d.status === "fulfilled" ? (d.value.data ?? []) : [];
      const apts = a.status === "fulfilled" ? (a.value.data ?? []) : [];
      setPatients(pts.slice(0, 5));
      setDoctors(drs.slice(0, 4));
      setAppointments(apts.slice(0, 5));
      setStats({
        patients:     pts.length,
        doctors:      drs.length,
        appointments: apts.length,
        billing:      b.status === "fulfilled" ? (b.value.data ?? []).length : 0,
      });
    }).finally(() => setLoading(false));
  }, []);

  const genderData = [
    { name: "Male",   value: patients.filter((p) => p.gender === "MALE").length },
    { name: "Female", value: patients.filter((p) => p.gender === "FEMALE").length },
    { name: "Other",  value: patients.filter((p) => p.gender === "OTHER").length },
  ].filter((d) => d.value > 0);

  return (
      <MainLayout>
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2, width: "100%" }}>

          {/* Row 1: Stats */}
          <Grid container spacing={2}>
            <Grid item xs={6} sm={3}>
              <StatCard icon={<PersonIcon />} label="Total Patients"
                        value={stats.patients} color="#4f46e5" bg="#ede9fe" trend="+2 this week" loading={loading} />
            </Grid>
            <Grid item xs={6} sm={3}>
              <StatCard icon={<MedicalServicesIcon />} label="Doctors"
                        value={stats.doctors} color="#0891b2" bg="#e0f2fe" trend="+1 this month" loading={loading} />
            </Grid>
            <Grid item xs={6} sm={3}>
              <StatCard icon={<CalendarMonthIcon />} label="Appointments"
                        value={stats.appointments} color="#059669" bg="#dcfce7" trend="+12%" loading={loading} />
            </Grid>
            <Grid item xs={6} sm={3}>
              <StatCard icon={<MonitorHeartIcon />} label="Billing Records"
                        value={stats.billing} color="#dc2626" bg="#fee2e2" loading={loading} />
            </Grid>
          </Grid>

          {/* Row 2: Trend chart + Pie + Radar */}
          <Grid container spacing={2} sx={{ alignItems: "stretch" }}>
            <Grid item xs={12} md={7}>
              <Card sx={{ borderRadius: 3, border: "1px solid #e2e8f0", height: "100%" }}>
                <CardContent sx={{ p: "18px !important" }}>
                  <Typography sx={{ fontWeight: 700, fontSize: "0.9rem", color: "#0f172a" }}>
                    Appointments & Patients Trend
                  </Typography>
                  <Typography variant="caption" color="text.secondary">Last 6 months</Typography>
                  <Box sx={{ height: 220, mt: 1.5 }}>
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={TREND_DATA} margin={{ top: 5, right: 5, left: -25, bottom: 0 }}>
                        <defs>
                          <linearGradient id="aG" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%"  stopColor="#4f46e5" stopOpacity={0.2} />
                            <stop offset="95%" stopColor="#4f46e5" stopOpacity={0} />
                          </linearGradient>
                          <linearGradient id="pG" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%"  stopColor="#06b6d4" stopOpacity={0.2} />
                            <stop offset="95%" stopColor="#06b6d4" stopOpacity={0} />
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                        <XAxis dataKey="month" tick={{ fontSize: 11, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
                        <YAxis tick={{ fontSize: 11, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
                        <Tooltip contentStyle={{ borderRadius: 10, border: "1px solid #e2e8f0", fontSize: 11 }} />
                        <Area type="monotone" dataKey="appointments" name="Appointments"
                              stroke="#4f46e5" strokeWidth={2.5} fill="url(#aG)" dot={{ fill: "#4f46e5", r: 3 }} />
                        <Area type="monotone" dataKey="patients" name="Patients"
                              stroke="#06b6d4" strokeWidth={2.5} fill="url(#pG)" dot={{ fill: "#06b6d4", r: 3 }} />
                      </AreaChart>
                    </ResponsiveContainer>
                  </Box>
                  <Box sx={{ display: "flex", gap: 2, mt: 1, justifyContent: "center" }}>
                    {[{ c: "#4f46e5", l: "Appointments" }, { c: "#06b6d4", l: "Patients" }].map((x) => (
                        <Box key={x.l} sx={{ display: "flex", alignItems: "center", gap: 0.6 }}>
                          <Box sx={{ width: 8, height: 8, borderRadius: "50%", bgcolor: x.c }} />
                          <Typography sx={{ fontSize: "0.68rem", color: "#64748b" }}>{x.l}</Typography>
                        </Box>
                    ))}
                  </Box>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} md={5}>
              <Box sx={{ display: "flex", flexDirection: "column", gap: 2, height: "100%" }}>
                <Card sx={{ borderRadius: 3, border: "1px solid #e2e8f0", flex: 1 }}>
                  <CardContent sx={{ p: "16px !important" }}>
                    <Typography sx={{ fontWeight: 700, fontSize: "0.875rem", color: "#0f172a", mb: 1 }}>
                      Patient Gender
                    </Typography>
                    {genderData.length === 0 ? (
                        <Box sx={{ textAlign: "center", py: 3 }}>
                          <Typography variant="caption" color="text.secondary">No data yet</Typography>
                        </Box>
                    ) : (
                        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                          <Box sx={{ width: 110, height: 110, flexShrink: 0 }}>
                            <ResponsiveContainer width="100%" height="100%">
                              <PieChart>
                                <Pie data={genderData} cx="50%" cy="50%" innerRadius={30} outerRadius={48}
                                     dataKey="value" paddingAngle={3}>
                                  {genderData.map((_, i) => <Cell key={i} fill={PIE_COLORS[i]} />)}
                                </Pie>
                              </PieChart>
                            </ResponsiveContainer>
                          </Box>
                          <Box sx={{ flex: 1 }}>
                            {genderData.map((d, i) => (
                                <Box key={d.name} sx={{ display: "flex", alignItems: "center", gap: 0.8, mb: 1 }}>
                                  <Box sx={{ width: 8, height: 8, borderRadius: "50%", bgcolor: PIE_COLORS[i], flexShrink: 0 }} />
                                  <Typography sx={{ fontSize: "0.75rem", color: "#475569", flex: 1 }}>{d.name}</Typography>
                                  <Typography sx={{ fontSize: "0.75rem", fontWeight: 700 }}>{d.value}</Typography>
                                </Box>
                            ))}
                          </Box>
                        </Box>
                    )}
                  </CardContent>
                </Card>

                <Card sx={{ borderRadius: 3, border: "1px solid #e2e8f0", flex: 1 }}>
                  <CardContent sx={{ p: "16px !important" }}>
                    <Typography sx={{ fontWeight: 700, fontSize: "0.875rem", color: "#0f172a", mb: 0.5 }}>
                      Diagnosis Distribution
                    </Typography>
                    <Box sx={{ height: 140 }}>
                      <ResponsiveContainer width="100%" height="100%">
                        <RadarChart data={RADAR_DATA} margin={{ top: 0, right: 15, left: 15, bottom: 0 }}>
                          <PolarGrid stroke="#f1f5f9" />
                          <PolarAngleAxis dataKey="subject" tick={{ fontSize: 9, fill: "#94a3b8" }} />
                          <PolarRadiusAxis tick={false} axisLine={false} domain={[0, 100]} />
                          <Radar dataKey="A" stroke="#4f46e5" fill="#4f46e5" fillOpacity={0.2} strokeWidth={2} />
                        </RadarChart>
                      </ResponsiveContainer>
                    </Box>
                  </CardContent>
                </Card>
              </Box>
            </Grid>
          </Grid>

          {/* Row 3: Patients table + Doctors + Appointments */}
          <Grid container spacing={2} sx={{ alignItems: "stretch" }}>
            <Grid item xs={12} md={7}>
              <Card sx={{ borderRadius: 3, border: "1px solid #e2e8f0", height: "100%" }}>
                <CardContent sx={{ p: "18px !important" }}>
                  <Typography sx={{ fontWeight: 700, fontSize: "0.9rem", color: "#0f172a", mb: 1.5 }}>
                    Recent Patients
                  </Typography>
                  <DataTable columns={PATIENT_COLS} rows={patients} loading={loading} />
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} md={5}>
              <Box sx={{ display: "flex", flexDirection: "column", gap: 2, height: "100%" }}>
                <Card sx={{ borderRadius: 3, border: "1px solid #e2e8f0", flex: 1 }}>
                  <CardContent sx={{ p: "18px !important" }}>
                    <Typography sx={{ fontWeight: 700, fontSize: "0.9rem", color: "#0f172a", mb: 1.5 }}>
                      Doctors
                    </Typography>
                    {loading ? (
                        <Box sx={{ display: "flex", justifyContent: "center", py: 3 }}>
                          <CircularProgress size={24} sx={{ color: "#4f46e5" }} />
                        </Box>
                    ) : doctors.length === 0 ? (
                        <Typography variant="caption" color="text.secondary">No doctors yet</Typography>
                    ) : doctors.map((d, i) => (
                        <Box key={d.doctorId ?? i} sx={{ display: "flex", alignItems: "center", gap: 1.5,
                          py: 1.2, borderBottom: i < doctors.length - 1 ? "1px solid #f1f5f9" : "none" }}>
                          <Avatar sx={{ width: 32, height: 32, bgcolor: "#dbeafe", color: "#1d4ed8", fontSize: 12, fontWeight: 700 }}>
                            {(d.firstName?.[0] ?? "D").toUpperCase()}
                          </Avatar>
                          <Box sx={{ flex: 1, minWidth: 0 }}>
                            <Typography sx={{ fontWeight: 600, fontSize: "0.82rem", color: "#0f172a",
                              overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                              Dr. {d.firstName} {d.lastName}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              {d.specialization?.replace(/_/g, " ")}
                            </Typography>
                          </Box>
                          <Chip label="Active" size="small"
                                sx={{ height: 18, fontSize: "0.58rem", fontWeight: 600, borderRadius: 1.5,
                                  bgcolor: "#dcfce7", color: "#15803d" }} />
                        </Box>
                    ))}
                  </CardContent>
                </Card>

                <Card sx={{ borderRadius: 3, border: "1px solid #e2e8f0", flex: 1 }}>
                  <CardContent sx={{ p: "18px !important" }}>
                    <Typography sx={{ fontWeight: 700, fontSize: "0.9rem", color: "#0f172a", mb: 1.5 }}>
                      Recent Appointments
                    </Typography>
                    <DataTable columns={APPT_COLS} rows={appointments} loading={loading} />
                  </CardContent>
                </Card>
              </Box>
            </Grid>
          </Grid>

        </Box>
      </MainLayout>
  );
}

import React, { useEffect, useState } from "react";
import {
  Box, Typography, Grid, Card, CardContent, Chip,
  Divider, Button, CircularProgress, LinearProgress,
} from "@mui/material";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import MedicationIcon    from "@mui/icons-material/Medication";
import BiotechIcon       from "@mui/icons-material/Biotech";
import MonitorHeartIcon  from "@mui/icons-material/MonitorHeart";
import ArrowForwardIcon  from "@mui/icons-material/ArrowForward";
import FavoriteIcon      from "@mui/icons-material/Favorite";
import ThermostatIcon    from "@mui/icons-material/Thermostat";
import AirIcon           from "@mui/icons-material/Air";
import ScaleIcon         from "@mui/icons-material/Scale";
import {
  RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis,
  ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid,
} from "recharts";
import PortalLayout   from "../../components/layout/PortalLayout";
import PatientSidebar from "./PatientSidebar";
import { appointmentApi }  from "../../api/appointmentApi";
import { prescriptionApi } from "../../api/prescriptionApi";
import { diagnosisApi }    from "../../api/diagnosisApi";
import { vitalApi }        from "../../api/nurseApi";
import { getUserEmail, getUserId } from "../../utils/auth";
import { useNavigate } from "react-router-dom";

const STATUS_CHIP = {
  CONFIRMED: { bg: "#dcfce7", color: "#15803d" },
  SCHEDULED: { bg: "#dbeafe", color: "#1d4ed8" },
  CANCELLED: { bg: "#fee2e2", color: "#dc2626" },
  COMPLETED: { bg: "#f1f5f9", color: "#64748b" },
};

const DUMMY_TREND = [
  { day: "Mon", heartRate: 72, bp: 120 },
  { day: "Tue", heartRate: 75, bp: 118 },
  { day: "Wed", heartRate: 70, bp: 122 },
  { day: "Thu", heartRate: 78, bp: 119 },
  { day: "Fri", heartRate: 74, bp: 121 },
  { day: "Sat", heartRate: 71, bp: 117 },
  { day: "Sun", heartRate: 73, bp: 120 },
];

function StatCard({ icon, label, value, color, bg, sub, onClick }) {
  return (
      <Card onClick={onClick} sx={{
        borderRadius: 3, cursor: onClick ? "pointer" : "default",
        border: "1px solid #e2e8f0", overflow: "hidden", position: "relative",
        boxShadow: "0 1px 3px rgba(0,0,0,0.04)", height: "100%",
        transition: "transform 0.2s, box-shadow 0.2s",
        "&:hover": onClick ? { transform: "translateY(-2px)", boxShadow: "0 8px 20px rgba(0,0,0,0.08)" } : {},
        "&::before": { content:'""', position:"absolute", top:0, left:0, right:0, height:3,
          background:`linear-gradient(90deg,${color},${color}88)` },
      }}>
        <CardContent sx={{ p: "16px !important" }}>
          <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
            <Box>
              <Typography sx={{ fontSize: "0.65rem", fontWeight: 600, color: "#94a3b8",
                textTransform: "uppercase", letterSpacing: "0.06em", mb: 0.5 }}>
                {label}
              </Typography>
              <Typography sx={{ fontSize: "1.8rem", fontWeight: 800, color: "#0f172a",
                letterSpacing: "-0.02em", lineHeight: 1.1 }}>
                {value}
              </Typography>
              {sub && <Typography sx={{ fontSize: "0.68rem", color: "#94a3b8", mt: 0.3 }}>{sub}</Typography>}
            </Box>
            <Box sx={{ width: 40, height: 40, borderRadius: 2.5, bgcolor: bg,
              display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
              {React.cloneElement(icon, { sx: { color, fontSize: 19 } })}
            </Box>
          </Box>
        </CardContent>
      </Card>
  );
}

function CardHeader({ title, sub, action, onAction, actionColor = "#7c3aed" }) {
  return (
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", mb: 1.5 }}>
        <Box>
          <Typography sx={{ fontWeight: 700, fontSize: "0.875rem", color: "#0f172a" }}>{title}</Typography>
          {sub && <Typography variant="caption" color="text.secondary">{sub}</Typography>}
        </Box>
        {action && (
            <Button size="small" endIcon={<ArrowForwardIcon sx={{ fontSize: 12 }} />} onClick={onAction}
                    sx={{ textTransform: "none", fontSize: "0.72rem", fontWeight: 600,
                      color: actionColor, minWidth: 0, p: 0 }}>
              {action}
            </Button>
        )}
      </Box>
  );
}

function Empty({ icon, text }) {
  return (
      <Box sx={{ textAlign: "center", py: 3 }}>
        {React.cloneElement(icon, { sx: { fontSize: 34, color: "#e2e8f0", mb: 0.8 } })}
        <Typography sx={{ fontSize: "0.78rem", color: "#cbd5e1", fontWeight: 500 }}>{text}</Typography>
      </Box>
  );
}

export default function PatientDashboard() {
  const navigate  = useNavigate();
  const email     = getUserEmail();
  const firstName = email.split("@")[0] ?? "there";
  const hour      = new Date().getHours();
  const greeting  = `${hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening"}, ${firstName} 👋`;

  const [appointments,  setAppointments]  = useState([]);
  const [prescriptions, setPrescriptions] = useState([]);
  const [diagnoses,     setDiagnoses]     = useState([]);
  const [vitals,        setVitals]        = useState(null);
  const [vitalsList,    setVitalsList]    = useState([]);
  const [loading,       setLoading]       = useState(true);

  useEffect(() => {
    const pid = getUserId();
    Promise.allSettled([
      appointmentApi.getAll(),
      prescriptionApi.getAll(),
      diagnosisApi.getAll(),
      pid ? vitalApi.getByPatient(pid) : Promise.resolve({ data: [] }),
    ]).then(([a, p, d, v]) => {
      setAppointments(a.status === "fulfilled" ? (a.value.data ?? []) : []);
      setPrescriptions(p.status === "fulfilled" ? (p.value.data ?? []) : []);
      setDiagnoses(d.status === "fulfilled" ? (d.value.data ?? []) : []);
      const vl = v.status === "fulfilled" ? (v.value.data ?? []) : [];
      setVitalsList(vl);
      setVitals(vl.length ? vl[vl.length - 1] : null);
    }).finally(() => setLoading(false));
  }, []);

  const upcomingApts = appointments.filter((a) =>
      a.status === "SCHEDULED" || a.status === "CONFIRMED");
  const latestDx  = diagnoses.length ? diagnoses[diagnoses.length - 1] : null;
  const allMeds   = prescriptions.flatMap((rx) => rx.items ?? []);

  const trendData = vitalsList.length >= 2
      ? vitalsList.slice(-7).map((v, i) => ({
        day: `V${i + 1}`, heartRate: v.heartRate ?? 0, bp: v.systolicBP ?? 0,
      }))
      : DUMMY_TREND;

  const radarData = [
    { subject: "Appts",  A: Math.min(appointments.length * 12, 100) },
    { subject: "Rx",     A: Math.min(prescriptions.length * 15, 100) },
    { subject: "Dx",     A: Math.min(diagnoses.length * 20, 100) },
    { subject: "Vitals", A: vitalsList.length > 0 ? 80 : 5 },
    { subject: "Follow", A: Math.min(diagnoses.filter((d) => d.followUpDate).length * 25, 100) },
  ];

  return (
      <PortalLayout sidebar={PatientSidebar} greeting={greeting}>
        {loading ? (
            <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "60vh" }}>
              <CircularProgress sx={{ color: "#7c3aed" }} />
            </Box>
        ) : (
            <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>

              {/* Row 1: 4 Stat Cards */}
              <Grid container spacing={2}>
                {[
                  { icon: <CalendarMonthIcon />, label: "Upcoming Appointments", value: upcomingApts.length,
                    sub: `${appointments.length} total`, color: "#4f46e5", bg: "#ede9fe", path: "/patient/appointments" },
                  { icon: <MedicationIcon />, label: "Active Prescriptions", value: prescriptions.length,
                    sub: `${allMeds.length} medicines`, color: "#0891b2", bg: "#e0f2fe", path: "/patient/prescriptions" },
                  { icon: <BiotechIcon />, label: "Diagnoses", value: diagnoses.length,
                    sub: latestDx?.diagnosis?.substring(0, 16) ?? "No records", color: "#059669", bg: "#dcfce7", path: "/patient/records" },
                  { icon: <MonitorHeartIcon />, label: "Vitals Recorded", value: vitalsList.length,
                    sub: vitals ? `HR: ${vitals.heartRate ?? "—"} bpm` : "Not recorded", color: "#dc2626", bg: "#fee2e2", path: "/patient/vitals" },
                ].map((s) => (
                    <Grid size={3} key={s.label}>
                      <StatCard {...s} onClick={() => navigate(s.path)} />
                    </Grid>
                ))}
              </Grid>

              {/* Row 2: Appointments (4) + Vitals Chart (5) + Radar (3) */}
              <Grid container spacing={2} sx={{ alignItems: "stretch" }}>

                <Grid size={4}>
                  <Card sx={{ borderRadius: 3, height: "100%" }}>
                    <CardContent sx={{ p: "18px !important" }}>
                      <CardHeader title="Upcoming Appointments" sub={`${upcomingApts.length} scheduled`}
                                  action="View all" onAction={() => navigate("/patient/appointments")} />
                      {upcomingApts.length === 0
                          ? <Empty icon={<CalendarMonthIcon />} text="No upcoming appointments" />
                          : upcomingApts.slice(0, 4).map((apt, i) => {
                            const s  = STATUS_CHIP[apt.status] ?? { bg: "#f1f5f9", color: "#64748b" };
                            const dt = apt.appointmentDateTime ? new Date(apt.appointmentDateTime) : null;
                            return (
                                <Box key={apt.appointmentId ?? i}>
                                  <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, py: 1.2 }}>
                                    <Box sx={{ width: 42, height: 42, borderRadius: 2, bgcolor: "#f3f0ff",
                                      display: "flex", flexDirection: "column", alignItems: "center",
                                      justifyContent: "center", flexShrink: 0 }}>
                                      <Typography sx={{ fontSize: "0.9rem", fontWeight: 800, color: "#6d28d9", lineHeight: 1 }}>
                                        {dt ? dt.getDate() : "—"}
                                      </Typography>
                                      <Typography sx={{ fontSize: "0.55rem", color: "#8b5cf6", textTransform: "uppercase", fontWeight: 600 }}>
                                        {dt ? dt.toLocaleDateString("en-IN", { month: "short" }) : ""}
                                      </Typography>
                                    </Box>
                                    <Box sx={{ flex: 1, minWidth: 0 }}>
                                      <Typography sx={{ fontWeight: 600, fontSize: "0.82rem", color: "#0f172a",
                                        overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                                        {apt.reason ?? "Appointment"}
                                      </Typography>
                                      <Typography variant="caption" color="text.secondary">
                                        {dt ? dt.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" }) : ""}
                                      </Typography>
                                    </Box>
                                    <Chip label={apt.status} size="small"
                                          sx={{ height: 18, fontSize: "0.58rem", fontWeight: 600, borderRadius: 1.5,
                                            bgcolor: s.bg, color: s.color }} />
                                  </Box>
                                  {i < upcomingApts.slice(0, 4).length - 1 && <Divider sx={{ borderColor: "#f8fafc" }} />}
                                </Box>
                            );
                          })
                      }
                    </CardContent>
                  </Card>
                </Grid>

                <Grid size={5}>
                  <Card sx={{ borderRadius: 3, height: "100%" }}>
                    <CardContent sx={{ p: "18px !important" }}>
                      <CardHeader title="Vitals Trend" sub="Heart rate & blood pressure"
                                  action="View vitals" onAction={() => navigate("/patient/vitals")} actionColor="#dc2626" />
                      <Box sx={{ height: 210 }}>
                        <ResponsiveContainer width="100%" height="100%">
                          <AreaChart data={trendData} margin={{ top: 5, right: 5, left: -25, bottom: 0 }}>
                            <defs>
                              <linearGradient id="hrG" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%"  stopColor="#7c3aed" stopOpacity={0.2} />
                                <stop offset="95%" stopColor="#7c3aed" stopOpacity={0} />
                              </linearGradient>
                              <linearGradient id="bpG" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%"  stopColor="#06b6d4" stopOpacity={0.2} />
                                <stop offset="95%" stopColor="#06b6d4" stopOpacity={0} />
                              </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                            <XAxis dataKey="day" tick={{ fontSize: 10, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
                            <YAxis tick={{ fontSize: 10, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
                            <Tooltip contentStyle={{ borderRadius: 10, border: "1px solid #e2e8f0", fontSize: 11 }} />
                            <Area type="monotone" dataKey="heartRate" name="Heart Rate" stroke="#7c3aed"
                                  strokeWidth={2} fill="url(#hrG)" dot={{ fill: "#7c3aed", r: 2.5 }} />
                            <Area type="monotone" dataKey="bp" name="Systolic BP" stroke="#06b6d4"
                                  strokeWidth={2} fill="url(#bpG)" dot={{ fill: "#06b6d4", r: 2.5 }} />
                          </AreaChart>
                        </ResponsiveContainer>
                      </Box>
                      <Box sx={{ display: "flex", gap: 2.5, mt: 1, justifyContent: "center" }}>
                        {[{ c: "#7c3aed", l: "Heart Rate (bpm)" }, { c: "#06b6d4", l: "Systolic BP (mmHg)" }].map((x) => (
                            <Box key={x.l} sx={{ display: "flex", alignItems: "center", gap: 0.6 }}>
                              <Box sx={{ width: 8, height: 8, borderRadius: "50%", bgcolor: x.c }} />
                              <Typography sx={{ fontSize: "0.68rem", color: "#64748b" }}>{x.l}</Typography>
                            </Box>
                        ))}
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>

                <Grid size={3}>
                  <Card sx={{ borderRadius: 3, height: "100%" }}>
                    <CardContent sx={{ p: "18px !important", height: "100%", display: "flex", flexDirection: "column" }}>
                      <CardHeader title="Health Overview" />
                      <Box sx={{ flex: 1, minHeight: 180 }}>
                        <ResponsiveContainer width="100%" height="100%">
                          <RadarChart data={radarData} margin={{ top: 0, right: 20, left: 20, bottom: 0 }}>
                            <PolarGrid stroke="#f1f5f9" />
                            <PolarAngleAxis dataKey="subject" tick={{ fontSize: 11, fill: "#94a3b8", fontWeight: 500 }} />
                            <PolarRadiusAxis tick={false} axisLine={false} domain={[0, 100]} />
                            <Radar dataKey="A" stroke="#7c3aed" fill="#7c3aed" fillOpacity={0.2} strokeWidth={2} />
                          </RadarChart>
                        </ResponsiveContainer>
                      </Box>
                      <Box sx={{ display: "flex", flexDirection: "column", gap: 1, mt: 1.5 }}>
                        {[
                          { l: "Appointments", v: appointments.length, c: "#4f46e5" },
                          { l: "Prescriptions", v: prescriptions.length, c: "#0891b2" },
                          { l: "Diagnoses",    v: diagnoses.length,     c: "#059669" },
                        ].map((s) => (
                            <Box key={s.l}>
                              <Box sx={{ display: "flex", justifyContent: "space-between", mb: 0.3 }}>
                                <Typography sx={{ fontSize: "0.68rem", color: "#64748b" }}>{s.l}</Typography>
                                <Typography sx={{ fontSize: "0.68rem", fontWeight: 700, color: "#0f172a" }}>{s.v}</Typography>
                              </Box>
                              <LinearProgress variant="determinate" value={Math.min(s.v * 15, 100)}
                                              sx={{ height: 4, borderRadius: 2, bgcolor: "#f1f5f9",
                                                "& .MuiLinearProgress-bar": { bgcolor: s.c, borderRadius: 2 } }} />
                            </Box>
                        ))}
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
              </Grid>

              {/* Row 3: Medications (3) + Vitals (4) + Diagnosis+Progress (5) */}
              <Grid container spacing={2} sx={{ alignItems: "stretch" }}>

                <Grid size={3}>
                  <Card sx={{ borderRadius: 3, height: "100%" }}>
                    <CardContent sx={{ p: "18px !important" }}>
                      <CardHeader title="Current Medications" sub={`${allMeds.length} medicines`}
                                  action="View all" onAction={() => navigate("/patient/prescriptions")} actionColor="#0891b2" />
                      {allMeds.length === 0
                          ? <Empty icon={<MedicationIcon />} text="No active medications" />
                          : (
                              <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
                                {allMeds.slice(0, 5).map((med, i) => (
                                    <Box key={i} sx={{ display: "flex", alignItems: "center", gap: 1.2,
                                      p: 1.2, borderRadius: 2, bgcolor: "#f8fafc", border: "1px solid #f1f5f9" }}>
                                      <Box sx={{ width: 28, height: 28, borderRadius: 1.5, bgcolor: "#e0f2fe",
                                        display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                                        <MedicationIcon sx={{ fontSize: 13, color: "#0891b2" }} />
                                      </Box>
                                      <Box sx={{ flex: 1, minWidth: 0 }}>
                                        <Typography sx={{ fontWeight: 600, fontSize: "0.78rem", color: "#0f172a",
                                          overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                                          {med.medicineName}
                                        </Typography>
                                        <Typography variant="caption" sx={{ color: "#94a3b8", fontSize: "0.65rem" }}>
                                          {med.dosage}{med.frequency ? ` · ${med.frequency}` : ""}
                                        </Typography>
                                      </Box>
                                    </Box>
                                ))}
                              </Box>
                          )
                      }
                    </CardContent>
                  </Card>
                </Grid>

                <Grid size={4}>
                  <Card sx={{ borderRadius: 3, height: "100%" }}>
                    <CardContent sx={{ p: "18px !important" }}>
                      <CardHeader title="Latest Vitals"
                                  action="View" onAction={() => navigate("/patient/vitals")} actionColor="#dc2626" />
                      {!vitals
                          ? <Empty icon={<MonitorHeartIcon />} text="No vitals recorded yet" />
                          : (
                              <Grid container spacing={1.2}>
                                {[
                                  { icon: <FavoriteIcon />,    label: "Heart Rate",    value: vitals.heartRate,        unit: "bpm",  color: "#ef4444", bg: "#fee2e2" },
                                  { icon: <MonitorHeartIcon />,label: "Blood Pressure",value: vitals.systolicBP ? `${vitals.systolicBP}/${vitals.diastolicBP}` : null, unit: "mmHg", color: "#7c3aed", bg: "#ede9fe" },
                                  { icon: <ThermostatIcon />,  label: "Temperature",   value: vitals.temperature,      unit: "°C",   color: "#f59e0b", bg: "#fef9c3" },
                                  { icon: <AirIcon />,         label: "SpO₂",          value: vitals.oxygenSaturation, unit: "%",    color: "#0891b2", bg: "#e0f2fe" },
                                  { icon: <ScaleIcon />,       label: "Weight",        value: vitals.weight,           unit: "kg",   color: "#059669", bg: "#dcfce7" },
                                  { icon: <MonitorHeartIcon />,label: "Height",        value: vitals.height,           unit: "cm",   color: "#6366f1", bg: "#ede9fe" },
                                ].map((v) => (
                                    <Grid size={6} key={v.label}>
                                      <Box sx={{ p: 1.3, borderRadius: 2, bgcolor: "#f8fafc", border: "1px solid #f1f5f9" }}>
                                        <Box sx={{ display: "flex", alignItems: "center", gap: 0.6, mb: 0.4 }}>
                                          <Box sx={{ width: 18, height: 18, borderRadius: 1, bgcolor: v.bg,
                                            display: "flex", alignItems: "center", justifyContent: "center" }}>
                                            {React.cloneElement(v.icon, { sx: { fontSize: 10, color: v.color } })}
                                          </Box>
                                          <Typography sx={{ fontSize: "0.6rem", color: "#94a3b8", fontWeight: 600 }}>
                                            {v.label}
                                          </Typography>
                                        </Box>
                                        <Typography sx={{ fontSize: "1rem", fontWeight: 800, color: "#0f172a", lineHeight: 1 }}>
                                          {v.value ?? "—"}
                                        </Typography>
                                        <Typography sx={{ fontSize: "0.58rem", color: "#94a3b8" }}>{v.unit}</Typography>
                                      </Box>
                                    </Grid>
                                ))}
                              </Grid>
                          )
                      }
                    </CardContent>
                  </Card>
                </Grid>

                <Grid size={5}>
                  <Box sx={{ display: "flex", flexDirection: "column", gap: 2, height: "100%" }}>
                    <Card sx={{ borderRadius: 3, background: "linear-gradient(135deg,#1e1b4b 0%,#312e81 100%)", flex: 1 }}>
                      <CardContent sx={{ p: "18px !important" }}>
                        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 1.5 }}>
                          <Typography sx={{ fontWeight: 700, fontSize: "0.875rem", color: "#fff" }}>Latest Diagnosis</Typography>
                          <Button size="small" endIcon={<ArrowForwardIcon sx={{ fontSize: 12 }} />}
                                  onClick={() => navigate("/patient/records")}
                                  sx={{ textTransform: "none", fontSize: "0.72rem", color: "#a78bfa", fontWeight: 600, p: 0, minWidth: 0 }}>
                            View
                          </Button>
                        </Box>
                        {latestDx ? (
                            <>
                              <Typography sx={{ fontWeight: 700, fontSize: "0.95rem", color: "#e0e7ff", mb: 0.5 }}>
                                {latestDx.diagnosis}
                              </Typography>
                              <Typography sx={{ fontSize: "0.72rem", color: "rgba(255,255,255,0.45)", mb: 1.5, lineHeight: 1.5 }}>
                                {latestDx.symptoms?.substring(0, 80)}{latestDx.symptoms?.length > 80 ? "…" : ""}
                              </Typography>
                              {latestDx.treatmentPlan && (
                                  <Box sx={{ p: 1.2, borderRadius: 2, bgcolor: "rgba(255,255,255,0.07)", mb: 1 }}>
                                    <Typography sx={{ fontSize: "0.62rem", color: "rgba(255,255,255,0.35)", fontWeight: 600, mb: 0.3 }}>
                                      TREATMENT PLAN
                                    </Typography>
                                    <Typography sx={{ fontSize: "0.75rem", color: "rgba(255,255,255,0.65)" }}>
                                      {latestDx.treatmentPlan?.substring(0, 60)}{latestDx.treatmentPlan?.length > 60 ? "…" : ""}
                                    </Typography>
                                  </Box>
                              )}
                              {latestDx.followUpDate && (
                                  <Chip label={`Follow-up: ${latestDx.followUpDate}`} size="small"
                                        sx={{ height: 22, fontSize: "0.65rem", fontWeight: 600,
                                          bgcolor: "rgba(167,139,250,0.2)", color: "#c4b5fd" }} />
                              )}
                            </>
                        ) : (
                            <Typography sx={{ fontSize: "0.8rem", color: "rgba(255,255,255,0.3)", textAlign: "center", py: 2 }}>
                              No diagnosis records
                            </Typography>
                        )}
                      </CardContent>
                    </Card>

                    <Card sx={{ borderRadius: 3 }}>
                      <CardContent sx={{ p: "18px !important" }}>
                        <Typography sx={{ fontWeight: 700, fontSize: "0.875rem", color: "#0f172a", mb: 1.5 }}>
                          Health Progress
                        </Typography>
                        <Grid container spacing={1.2}>
                          {[
                            { l: "Completed Appts", v: appointments.filter((a) => a.status === "COMPLETED").length, t: Math.max(appointments.length, 1), c: "#4f46e5" },
                            { l: "Prescriptions",   v: prescriptions.length, t: Math.max(prescriptions.length, 3), c: "#0891b2" },
                            { l: "Diagnoses",       v: diagnoses.length,     t: Math.max(diagnoses.length, 3),     c: "#059669" },
                            { l: "Vitals",          v: vitalsList.length,    t: Math.max(vitalsList.length, 3),    c: "#dc2626" },
                          ].map((s) => (
                              <Grid size={6} key={s.l}>
                                <Box sx={{ p: 1.3, borderRadius: 2, bgcolor: "#f8fafc", border: "1px solid #f1f5f9" }}>
                                  <Typography sx={{ fontSize: "0.65rem", color: "#94a3b8", fontWeight: 600, mb: 0.5 }}>
                                    {s.l}
                                  </Typography>
                                  <Typography sx={{ fontSize: "1.2rem", fontWeight: 800, color: s.c, lineHeight: 1, mb: 0.6 }}>
                                    {s.v}
                                  </Typography>
                                  <LinearProgress variant="determinate"
                                                  value={Math.min((s.v / s.t) * 100, 100)}
                                                  sx={{ height: 4, borderRadius: 2, bgcolor: "#e2e8f0",
                                                    "& .MuiLinearProgress-bar": { bgcolor: s.c, borderRadius: 2 } }} />
                                </Box>
                              </Grid>
                          ))}
                        </Grid>
                      </CardContent>
                    </Card>
                  </Box>
                </Grid>
              </Grid>

            </Box>
        )}
      </PortalLayout>
  );
}
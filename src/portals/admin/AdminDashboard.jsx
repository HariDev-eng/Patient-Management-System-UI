import React, { useEffect, useState } from "react";
import {
  Box, Typography, Grid, Card, CardContent, CircularProgress,
  Avatar, Chip,
} from "@mui/material";
import PersonIcon          from "@mui/icons-material/Person";
import MedicalServicesIcon from "@mui/icons-material/MedicalServices";
import CalendarMonthIcon   from "@mui/icons-material/CalendarMonth";
import MonitorHeartIcon    from "@mui/icons-material/MonitorHeart";
import TrendingUpIcon      from "@mui/icons-material/TrendingUp";
import {
  AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid,
  ResponsiveContainer, PieChart, Pie, Cell, BarChart, Bar,
} from "recharts";
import PortalLayout     from "../../components/layout/PortalLayout";
import AdminSidebar     from "./AdminSidebar";
import { patientApi }     from "../../api/patientApi";
import { doctorApi }      from "../../api/doctorApi";
import { appointmentApi } from "../../api/appointmentApi";
import { nurseApi }       from "../../api/nurseApi";

const STATUS_MAP = {
  SCHEDULED: { bg: "#dbeafe", color: "#1d4ed8" },
  CONFIRMED: { bg: "#ede9fe", color: "#6d28d9" },
  COMPLETED: { bg: "#dcfce7", color: "#15803d" },
  CANCELLED: { bg: "#fee2e2", color: "#dc2626" },
  ACTIVE:    { bg: "#dcfce7", color: "#15803d" },
  INACTIVE:  { bg: "#f1f5f9", color: "#64748b" },
};

const APPT_TREND = [
  { month: "Jan", appointments: 32, patients: 24 },
  { month: "Feb", appointments: 45, patients: 38 },
  { month: "Mar", appointments: 38, patients: 30 },
  { month: "Apr", appointments: 52, patients: 44 },
  { month: "May", appointments: 61, patients: 55 },
  { month: "Jun", appointments: 48, patients: 42 },
];

const GENDER_COLORS = ["#4f46e5", "#ec4899", "#f59e0b"];
const STATUS_COLORS = ["#4f46e5", "#10b981", "#ef4444", "#f59e0b"];

function StatCard({ icon, label, value, color, bg, trend }) {
  return (
      <Card sx={{
        borderRadius: 3, overflow: "hidden", position: "relative",
        boxShadow: "0 1px 3px rgba(0,0,0,0.04)",
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
                {value}
              </Typography>
              {trend && (
                  <Box sx={{ display: "flex", alignItems: "center", gap: 0.5, mt: 0.8 }}>
                    <TrendingUpIcon sx={{ fontSize: 12, color: "#10b981" }} />
                    <Typography sx={{ fontSize: "0.7rem", color: "#10b981", fontWeight: 600 }}>{trend}</Typography>
                  </Box>
              )}
            </Box>
            <Box sx={{ width: 44, height: 44, borderRadius: 2.5, bgcolor: bg,
              display: "flex", alignItems: "center", justifyContent: "center" }}>
              {React.cloneElement(icon, { sx: { color, fontSize: 20 } })}
            </Box>
          </Box>
        </CardContent>
      </Card>
  );
}

export default function AdminDashboard() {
  const [stats,        setStats]        = useState({ patients: 0, doctors: 0, appointments: 0, nurses: 0 });
  const [patients,     setPatients]     = useState([]);
  const [doctors,      setDoctors]      = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [loading,      setLoading]      = useState(true);

  useEffect(() => {
    Promise.allSettled([
      patientApi.getAll(),
      doctorApi.getAll(),
      appointmentApi.getAll(),
      nurseApi.getAll(),
    ]).then(([p, d, a, n]) => {
      const pts  = p.status === "fulfilled" ? (p.value.data ?? []) : [];
      const drs  = d.status === "fulfilled" ? (d.value.data ?? []) : [];
      const apts = a.status === "fulfilled" ? (a.value.data ?? []) : [];
      const nrs  = n.status === "fulfilled" ? (n.value.data ?? []) : [];
      setStats({ patients: pts.length, doctors: drs.length, appointments: apts.length, nurses: nrs.length });
      setPatients(pts);
      setDoctors(drs);
      setAppointments(apts);
    }).finally(() => setLoading(false));
  }, []);

  const genderData = [
    { name: "Male",   value: patients.filter((p) => p.gender === "MALE").length },
    { name: "Female", value: patients.filter((p) => p.gender === "FEMALE").length },
    { name: "Other",  value: patients.filter((p) => p.gender === "OTHER").length },
  ].filter((d) => d.value > 0);

  const apptStatusData = [
    { name: "Scheduled", value: appointments.filter((a) => a.status === "SCHEDULED").length },
    { name: "Completed", value: appointments.filter((a) => a.status === "COMPLETED").length },
    { name: "Cancelled", value: appointments.filter((a) => a.status === "CANCELLED").length },
    { name: "Confirmed", value: appointments.filter((a) => a.status === "CONFIRMED").length },
  ].filter((d) => d.value > 0);

  const specData = Object.entries(
      doctors.reduce((acc, d) => {
        const s = d.specialization?.replace(/_/g, " ") ?? "Unknown";
        acc[s] = (acc[s] || 0) + 1;
        return acc;
      }, {})
  ).map(([name, value]) => ({ name, value })).slice(0, 6);

  const recentPatients = [...patients].reverse().slice(0, 5);
  const recentApts     = [...appointments].reverse().slice(0, 6);

  return (
      <PortalLayout sidebar={AdminSidebar}>
        {loading ? (
            <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "60vh" }}>
              <CircularProgress sx={{ color: "#4f46e5" }} />
            </Box>
        ) : (
            <Box sx={{ display: "flex", flexDirection: "column", gap: 2, width: "100%" }}>

              <Box>
                <Typography variant="h5" sx={{ fontWeight: 800, color: "#0f172a", letterSpacing: "-0.02em" }}>
                  Admin Dashboard
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {new Date().toLocaleDateString("en-IN", { weekday: "long", day: "numeric", month: "long", year: "numeric" })}
                </Typography>
              </Box>

              <Grid container spacing={2}>
                <Grid size={3}>
                  <StatCard icon={<PersonIcon />} label="Total Patients" value={stats.patients}
                            color="#4f46e5" bg="#ede9fe" trend="+2 this week" />
                </Grid>
                <Grid size={3}>
                  <StatCard icon={<MedicalServicesIcon />} label="Doctors" value={stats.doctors}
                            color="#0891b2" bg="#e0f2fe" trend="+1 this month" />
                </Grid>
                <Grid size={3}>
                  <StatCard icon={<CalendarMonthIcon />} label="Appointments" value={stats.appointments}
                            color="#059669" bg="#dcfce7" trend="+12%" />
                </Grid>
                <Grid size={3}>
                  <StatCard icon={<MonitorHeartIcon />} label="Nurses" value={stats.nurses}
                            color="#dc2626" bg="#fee2e2" />
                </Grid>
              </Grid>

              <Grid container spacing={2} sx={{ alignItems: "stretch" }}>
                <Grid size={8}>
                  <Card sx={{ borderRadius: 3, height: "100%" }}>
                    <CardContent sx={{ p: "18px !important" }}>
                      <Box sx={{ mb: 1.5 }}>
                        <Typography sx={{ fontWeight: 700, fontSize: "0.875rem", color: "#0f172a" }}>
                          Appointments & Patients Trend
                        </Typography>
                        <Typography variant="caption" color="text.secondary">Last 6 months overview</Typography>
                      </Box>
                      <Box sx={{ height: 230 }}>
                        <ResponsiveContainer width="100%" height="100%">
                          <AreaChart data={APPT_TREND} margin={{ top: 5, right: 5, left: -25, bottom: 0 }}>
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
                      <Box sx={{ display: "flex", gap: 2.5, mt: 1, justifyContent: "center" }}>
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

                <Grid size={4}>
                  <Box sx={{ display: "flex", flexDirection: "column", gap: 2, height: "100%" }}>
                    <Card sx={{ borderRadius: 3, flex: 1 }}>
                      <CardContent sx={{ p: "16px !important" }}>
                        <Typography sx={{ fontWeight: 700, fontSize: "0.875rem", color: "#0f172a", mb: 1 }}>
                          Patient Gender Distribution
                        </Typography>
                        {genderData.length === 0 ? (
                            <Box sx={{ textAlign: "center", py: 3 }}>
                              <Typography variant="caption" color="text.secondary">No patient data yet</Typography>
                            </Box>
                        ) : (
                            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                              <Box sx={{ width: 110, height: 110, flexShrink: 0 }}>
                                <ResponsiveContainer width="100%" height="100%">
                                  <PieChart>
                                    <Pie data={genderData} cx="50%" cy="50%" innerRadius={32} outerRadius={50}
                                         dataKey="value" paddingAngle={3}>
                                      {genderData.map((_, i) => <Cell key={i} fill={GENDER_COLORS[i]} />)}
                                    </Pie>
                                  </PieChart>
                                </ResponsiveContainer>
                              </Box>
                              <Box sx={{ flex: 1 }}>
                                {genderData.map((d, i) => (
                                    <Box key={d.name} sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
                                      <Box sx={{ width: 8, height: 8, borderRadius: "50%", bgcolor: GENDER_COLORS[i], flexShrink: 0 }} />
                                      <Typography sx={{ fontSize: "0.75rem", color: "#475569", flex: 1 }}>{d.name}</Typography>
                                      <Typography sx={{ fontSize: "0.75rem", fontWeight: 700, color: "#0f172a" }}>{d.value}</Typography>
                                    </Box>
                                ))}
                              </Box>
                            </Box>
                        )}
                      </CardContent>
                    </Card>

                    <Card sx={{ borderRadius: 3, flex: 1 }}>
                      <CardContent sx={{ p: "16px !important" }}>
                        <Typography sx={{ fontWeight: 700, fontSize: "0.875rem", color: "#0f172a", mb: 1 }}>
                          Appointment Status
                        </Typography>
                        {apptStatusData.length === 0 ? (
                            <Box sx={{ textAlign: "center", py: 3 }}>
                              <Typography variant="caption" color="text.secondary">No appointments yet</Typography>
                            </Box>
                        ) : (
                            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                              <Box sx={{ width: 110, height: 110, flexShrink: 0 }}>
                                <ResponsiveContainer width="100%" height="100%">
                                  <PieChart>
                                    <Pie data={apptStatusData} cx="50%" cy="50%" innerRadius={32} outerRadius={50}
                                         dataKey="value" paddingAngle={3}>
                                      {apptStatusData.map((_, i) => <Cell key={i} fill={STATUS_COLORS[i]} />)}
                                    </Pie>
                                  </PieChart>
                                </ResponsiveContainer>
                              </Box>
                              <Box sx={{ flex: 1 }}>
                                {apptStatusData.map((d, i) => (
                                    <Box key={d.name} sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
                                      <Box sx={{ width: 8, height: 8, borderRadius: "50%", bgcolor: STATUS_COLORS[i], flexShrink: 0 }} />
                                      <Typography sx={{ fontSize: "0.75rem", color: "#475569", flex: 1 }}>{d.name}</Typography>
                                      <Typography sx={{ fontSize: "0.75rem", fontWeight: 700, color: "#0f172a" }}>{d.value}</Typography>
                                    </Box>
                                ))}
                              </Box>
                            </Box>
                        )}
                      </CardContent>
                    </Card>
                  </Box>
                </Grid>
              </Grid>

              <Grid container spacing={2} sx={{ alignItems: "stretch" }}>
                <Grid size={4}>
                  <Card sx={{ borderRadius: 3, height: "100%" }}>
                    <CardContent sx={{ p: "18px !important" }}>
                      <Typography sx={{ fontWeight: 700, fontSize: "0.875rem", color: "#0f172a", mb: 1.5 }}>
                        Recent Patients
                      </Typography>
                      {recentPatients.length === 0 ? (
                          <Box sx={{ textAlign: "center", py: 4 }}>
                            <Typography variant="caption" color="text.secondary">No patients yet</Typography>
                          </Box>
                      ) : recentPatients.map((p, i) => (
                          <Box key={p.patientId ?? i} sx={{ display: "flex", alignItems: "center", gap: 1.5,
                            py: 1.2, borderBottom: i < recentPatients.length - 1 ? "1px solid #f1f5f9" : "none" }}>
                            <Avatar sx={{ width: 34, height: 34, bgcolor: "#ede9fe", color: "#6d28d9", fontSize: 13, fontWeight: 700 }}>
                              {(p.firstName?.[0] ?? "P").toUpperCase()}
                            </Avatar>
                            <Box sx={{ flex: 1, minWidth: 0 }}>
                              <Typography sx={{ fontWeight: 600, fontSize: "0.85rem", color: "#0f172a",
                                overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                                {p.firstName} {p.lastName}
                              </Typography>
                              <Typography variant="caption" color="text.secondary">
                                {p.gender} · {p.bloodGroup?.replace(/_/g, " ")}
                              </Typography>
                            </Box>
                            <Chip label={p.status ?? "ACTIVE"} size="small"
                                  sx={{ height: 20, fontSize: "0.6rem", fontWeight: 600, borderRadius: 1.5,
                                    bgcolor: STATUS_MAP[p.status ?? "ACTIVE"]?.bg ?? "#f1f5f9",
                                    color:   STATUS_MAP[p.status ?? "ACTIVE"]?.color ?? "#64748b" }} />
                          </Box>
                      ))}
                    </CardContent>
                  </Card>
                </Grid>

                <Grid size={4}>
                  <Card sx={{ borderRadius: 3, height: "100%" }}>
                    <CardContent sx={{ p: "18px !important" }}>
                      <Typography sx={{ fontWeight: 700, fontSize: "0.875rem", color: "#0f172a", mb: 1.5 }}>
                        Doctors
                      </Typography>
                      {doctors.length === 0 ? (
                          <Box sx={{ textAlign: "center", py: 4 }}>
                            <Typography variant="caption" color="text.secondary">No doctors yet</Typography>
                          </Box>
                      ) : doctors.slice(0, 5).map((d, i) => (
                          <Box key={d.doctorId ?? i} sx={{ display: "flex", alignItems: "center", gap: 1.5,
                            py: 1.2, borderBottom: i < Math.min(doctors.length, 5) - 1 ? "1px solid #f1f5f9" : "none" }}>
                            <Avatar sx={{ width: 34, height: 34, bgcolor: "#dbeafe", color: "#1d4ed8", fontSize: 13, fontWeight: 700 }}>
                              {(d.firstName?.[0] ?? "D").toUpperCase()}
                            </Avatar>
                            <Box sx={{ flex: 1, minWidth: 0 }}>
                              <Typography sx={{ fontWeight: 600, fontSize: "0.85rem", color: "#0f172a",
                                overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                                Dr. {d.firstName} {d.lastName}
                              </Typography>
                              <Typography variant="caption" color="text.secondary">
                                {d.specialization?.replace(/_/g, " ")}
                              </Typography>
                            </Box>
                            <Chip label="Available" size="small"
                                  sx={{ height: 20, fontSize: "0.6rem", fontWeight: 600, borderRadius: 1.5,
                                    bgcolor: "#dcfce7", color: "#15803d" }} />
                          </Box>
                      ))}
                    </CardContent>
                  </Card>
                </Grid>

                <Grid size={4}>
                  <Card sx={{ borderRadius: 3, height: "100%" }}>
                    <CardContent sx={{ p: "18px !important" }}>
                      <Typography sx={{ fontWeight: 700, fontSize: "0.875rem", color: "#0f172a", mb: 1.5 }}>
                        Doctors by Specialization
                      </Typography>
                      {specData.length === 0 ? (
                          <Box sx={{ textAlign: "center", py: 4 }}>
                            <Typography variant="caption" color="text.secondary">No data yet</Typography>
                          </Box>
                      ) : (
                          <Box sx={{ height: 230 }}>
                            <ResponsiveContainer width="100%" height="100%">
                              <BarChart data={specData} layout="vertical" margin={{ top: 0, right: 10, left: 10, bottom: 0 }}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" horizontal={false} />
                                <XAxis type="number" tick={{ fontSize: 10, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
                                <YAxis type="category" dataKey="name" width={100}
                                       tick={{ fontSize: 10, fill: "#64748b" }} axisLine={false} tickLine={false} />
                                <Tooltip contentStyle={{ borderRadius: 10, border: "1px solid #e2e8f0", fontSize: 11 }} />
                                <Bar dataKey="value" name="Doctors" fill="#4f46e5" radius={[0, 4, 4, 0]} />
                              </BarChart>
                            </ResponsiveContainer>
                          </Box>
                      )}
                    </CardContent>
                  </Card>
                </Grid>
              </Grid>

              <Card sx={{ borderRadius: 3 }}>
                <CardContent sx={{ p: "18px !important" }}>
                  <Typography sx={{ fontWeight: 700, fontSize: "0.875rem", color: "#0f172a", mb: 1.5 }}>
                    Recent Appointments
                  </Typography>
                  {recentApts.length === 0 ? (
                      <Box sx={{ textAlign: "center", py: 4 }}>
                        <CalendarMonthIcon sx={{ fontSize: 36, color: "#e2e8f0", mb: 1 }} />
                        <Typography variant="caption" color="text.secondary">No appointments yet</Typography>
                      </Box>
                  ) : (
                      <Grid container spacing={1.5}>
                        {recentApts.map((apt, i) => {
                          const s  = STATUS_MAP[apt.status] ?? { bg: "#f1f5f9", color: "#64748b" };
                          const dt = apt.appointmentDateTime ? new Date(apt.appointmentDateTime) : null;
                          return (
                              <Grid size={4} key={apt.appointmentId ?? i}>
                                <Box sx={{ p: 1.5, borderRadius: 2.5, border: "1px solid #e2e8f0",
                                  bgcolor: "#f8fafc", display: "flex", alignItems: "center", gap: 1.5 }}>
                                  <Box sx={{ width: 40, height: 40, borderRadius: 2, bgcolor: "#ede9fe",
                                    display: "flex", flexDirection: "column", alignItems: "center",
                                    justifyContent: "center", flexShrink: 0 }}>
                                    <Typography sx={{ fontSize: "0.9rem", fontWeight: 800, color: "#6d28d9", lineHeight: 1 }}>
                                      {dt ? dt.getDate() : "—"}
                                    </Typography>
                                    <Typography sx={{ fontSize: "0.52rem", color: "#8b5cf6", textTransform: "uppercase", fontWeight: 600 }}>
                                      {dt ? dt.toLocaleDateString("en-IN", { month: "short" }) : ""}
                                    </Typography>
                                  </Box>
                                  <Box sx={{ flex: 1, minWidth: 0 }}>
                                    <Typography sx={{ fontWeight: 600, fontSize: "0.8rem", color: "#0f172a",
                                      overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                                      {apt.reason ?? "Consultation"}
                                    </Typography>
                                    <Typography variant="caption" color="text.secondary">
                                      {dt ? dt.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" }) : ""}
                                    </Typography>
                                  </Box>
                                  <Chip label={apt.status} size="small"
                                        sx={{ height: 20, fontSize: "0.6rem", fontWeight: 600, borderRadius: 1.5,
                                          bgcolor: s.bg, color: s.color }} />
                                </Box>
                              </Grid>
                          );
                        })}
                      </Grid>
                  )}
                </CardContent>
              </Card>

            </Box>
        )}
      </PortalLayout>
  );
}
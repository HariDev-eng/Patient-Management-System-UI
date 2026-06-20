import React, { useEffect, useState } from "react";
import {
  Box, Typography, Grid, Card, CardContent, CircularProgress,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Chip, Avatar,
} from "@mui/material";
import PersonIcon          from "@mui/icons-material/Person";
import MedicalServicesIcon from "@mui/icons-material/MedicalServices";
import CalendarMonthIcon   from "@mui/icons-material/CalendarMonth";
import MonitorHeartIcon    from "@mui/icons-material/MonitorHeart";
import TrendingUpIcon      from "@mui/icons-material/TrendingUp";
import PortalLayout        from "../../components/layout/PortalLayout";
import AdminSidebar        from "./AdminSidebar";
import { patientApi }     from "../../api/patientApi";
import { doctorApi }      from "../../api/doctorApi";
import { appointmentApi } from "../../api/appointmentApi";
import { nurseApi }       from "../../api/nurseApi";

const STATUS_STYLES = {
  SCHEDULED: { bg: "#dbeafe", color: "#1d4ed8" },
  CONFIRMED: { bg: "#ede9fe", color: "#6d28d9" },
  COMPLETED: { bg: "#dcfce7", color: "#15803d" },
  CANCELLED: { bg: "#fee2e2", color: "#dc2626" },
  ACTIVE:    { bg: "#dcfce7", color: "#15803d" },
};

function StatCard({ icon, label, value, color, bg, trend }) {
  return (
    <Card sx={{
      borderRadius: 3, overflow: "hidden", position: "relative",
      transition: "transform 0.2s, box-shadow 0.2s",
      "&:hover": { transform: "translateY(-2px)", boxShadow: "0 8px 24px rgba(0,0,0,0.08)" },
      "&::before": { content:'""', position:"absolute", top:0, left:0, right:0, height:3, background:`linear-gradient(90deg, ${color}, ${color}88)` },
    }}>
      <CardContent sx={{ p: "20px !important" }}>
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
          <Box>
            <Typography sx={{ fontSize: "0.72rem", fontWeight: 600, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.06em", mb: 0.8 }}>
              {label}
            </Typography>
            <Typography sx={{ fontSize: "2rem", fontWeight: 800, color: "#0f172a", letterSpacing: "-0.03em", lineHeight: 1 }}>
              {value}
            </Typography>
            {trend && (
              <Box sx={{ display: "flex", alignItems: "center", gap: 0.5, mt: 0.8 }}>
                <TrendingUpIcon sx={{ fontSize: 13, color: "#10b981" }} />
                <Typography sx={{ fontSize: "0.72rem", color: "#10b981", fontWeight: 600 }}>{trend}</Typography>
              </Box>
            )}
          </Box>
          <Box sx={{ width: 46, height: 46, borderRadius: 2.5, bgcolor: bg, display: "flex", alignItems: "center", justifyContent: "center" }}>
            {React.cloneElement(icon, { sx: { color, fontSize: 22 } })}
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
}

export default function AdminDashboard() {
  const [stats,   setStats]   = useState({ patients: 0, doctors: 0, appointments: 0, nurses: 0 });
  const [recentPatients,      setRecentPatients]     = useState([]);
  const [recentAppointments,  setRecentAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

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
      setRecentPatients(pts.slice(-5).reverse());
      setRecentAppointments(apts.slice(-6).reverse());
    }).finally(() => setLoading(false));
  }, []);

  return (
    <PortalLayout sidebar={AdminSidebar}>
      <Box sx={{ mb: 3 }}>
        <Typography variant="h5" sx={{ fontWeight: 800, color: "#0f172a" }}>Admin Dashboard</Typography>
        <Typography variant="body2" color="text.secondary">System overview and key metrics</Typography>
      </Box>

      {loading ? (
        <Box sx={{ display: "flex", justifyContent: "center", pt: 8 }}>
          <CircularProgress sx={{ color: "#4f46e5" }} />
        </Box>
      ) : (
        <>
          <Grid container spacing={2} sx={{ mb: 3 }}>
            <Grid item xs={12} sm={6} lg={3}>
              <StatCard icon={<PersonIcon />} label="Total Patients" value={stats.patients} color="#4f46e5" bg="#ede9fe" trend="+2 this week" />
            </Grid>
            <Grid item xs={12} sm={6} lg={3}>
              <StatCard icon={<MedicalServicesIcon />} label="Doctors" value={stats.doctors} color="#0891b2" bg="#e0f2fe" />
            </Grid>
            <Grid item xs={12} sm={6} lg={3}>
              <StatCard icon={<CalendarMonthIcon />} label="Appointments" value={stats.appointments} color="#059669" bg="#dcfce7" />
            </Grid>
            <Grid item xs={12} sm={6} lg={3}>
              <StatCard icon={<MonitorHeartIcon />} label="Nurses" value={stats.nurses} color="#dc2626" bg="#fee2e2" />
            </Grid>
          </Grid>

          <Grid container spacing={2.5}>
            {/* Recent Patients */}
            <Grid item xs={12} md={5}>
              <Card sx={{ borderRadius: 3 }}>
                <CardContent sx={{ p: "20px !important" }}>
                  <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>Recent Patients</Typography>
                  {recentPatients.length === 0 ? (
                    <Typography variant="body2" color="text.secondary" sx={{ textAlign: "center", py: 3 }}>No patients yet</Typography>
                  ) : recentPatients.map((p, i) => (
                    <Box key={p.patientId ?? i} sx={{ display: "flex", alignItems: "center", gap: 1.5, py: 1.2,
                      borderBottom: i < recentPatients.length - 1 ? "1px solid #f1f5f9" : "none" }}>
                      <Avatar sx={{ width: 34, height: 34, bgcolor: "#ede9fe", color: "#6d28d9", fontSize: 13, fontWeight: 700 }}>
                        {(p.firstName?.[0] ?? "P").toUpperCase()}
                      </Avatar>
                      <Box sx={{ flex: 1 }}>
                        <Typography sx={{ fontWeight: 600, fontSize: "0.875rem", color: "#0f172a" }}>
                          {p.firstName} {p.lastName}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">{p.email}</Typography>
                      </Box>
                      <Chip label={p.status ?? "ACTIVE"} size="small"
                        sx={{ height: 20, fontSize: "0.62rem", fontWeight: 600, borderRadius: 1.5,
                          bgcolor: STATUS_STYLES[p.status ?? "ACTIVE"]?.bg ?? "#f1f5f9",
                          color: STATUS_STYLES[p.status ?? "ACTIVE"]?.color ?? "#64748b" }} />
                    </Box>
                  ))}
                </CardContent>
              </Card>
            </Grid>

            {/* Recent Appointments */}
            <Grid item xs={12} md={7}>
              <Card sx={{ borderRadius: 3 }}>
                <CardContent sx={{ p: "20px !important" }}>
                  <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>Recent Appointments</Typography>
                  <TableContainer>
                    <Table size="small">
                      <TableHead>
                        <TableRow>
                          {["Patient", "Date & Time", "Reason", "Status"].map((h) => (
                            <TableCell key={h} sx={{ fontWeight: 600, fontSize: "0.7rem", textTransform: "uppercase",
                              color: "#94a3b8", letterSpacing: "0.06em", py: 1.2, bgcolor: "#f8fafc" }}>{h}</TableCell>
                          ))}
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {recentAppointments.length === 0 ? (
                          <TableRow>
                            <TableCell colSpan={4} sx={{ textAlign: "center", py: 4, color: "#94a3b8" }}>No appointments yet</TableCell>
                          </TableRow>
                        ) : recentAppointments.map((apt, i) => {
                          const s = STATUS_STYLES[apt.status] ?? { bg: "#f1f5f9", color: "#64748b" };
                          return (
                            <TableRow key={apt.appointmentId ?? i} sx={{ "&:hover": { bgcolor: "#f8fafc" }, "&:last-child td": { border: 0 } }}>
                              <TableCell sx={{ fontSize: "0.8rem", fontWeight: 500, py: 1.4 }}>
                                {apt.patientId?.toString().substring(0, 8)}…
                              </TableCell>
                              <TableCell sx={{ fontSize: "0.8rem", color: "#64748b", py: 1.4 }}>
                                {apt.appointmentDateTime ? new Date(apt.appointmentDateTime).toLocaleDateString("en-IN", { day: "2-digit", month: "short" }) : "—"}
                              </TableCell>
                              <TableCell sx={{ fontSize: "0.8rem", color: "#64748b", py: 1.4 }}>
                                {apt.reason?.substring(0, 20) ?? "—"}
                              </TableCell>
                              <TableCell sx={{ py: 1.4 }}>
                                <Chip label={apt.status} size="small"
                                  sx={{ height: 20, fontSize: "0.62rem", fontWeight: 600, borderRadius: 1.5, bgcolor: s.bg, color: s.color }} />
                              </TableCell>
                            </TableRow>
                          );
                        })}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </>
      )}
    </PortalLayout>
  );
}

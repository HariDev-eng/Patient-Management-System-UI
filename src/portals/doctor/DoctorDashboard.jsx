import React, { useEffect, useState } from "react";
import {
  Box, Typography, Grid, Card, CardContent, CircularProgress,
  Avatar, Chip, Divider, Button,
} from "@mui/material";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import PersonIcon        from "@mui/icons-material/Person";
import BiotechIcon       from "@mui/icons-material/Biotech";
import MedicationIcon    from "@mui/icons-material/Medication";
import ArrowForwardIcon  from "@mui/icons-material/ArrowForward";
import PortalLayout      from "../../components/layout/PortalLayout";
import DoctorSidebar     from "./DoctorSidebar";
import { appointmentApi }  from "../../api/appointmentApi";
import { patientApi }      from "../../api/patientApi";
import { diagnosisApi }    from "../../api/diagnosisApi";
import { prescriptionApi } from "../../api/prescriptionApi";
import { getUserEmail }    from "../../utils/auth";
import { useNavigate }     from "react-router-dom";

const STATUS_STYLES = {
  SCHEDULED: { bg: "#dbeafe", color: "#1d4ed8" },
  CONFIRMED: { bg: "#ede9fe", color: "#6d28d9" },
  COMPLETED: { bg: "#dcfce7", color: "#15803d" },
  CANCELLED: { bg: "#fee2e2", color: "#dc2626" },
};

export default function DoctorDashboard() {
  const navigate  = useNavigate();
  const email     = getUserEmail();
  const firstName = email.split("@")[0] ?? "Doctor";
  const hour      = new Date().getHours();
  const greeting  = `${hour < 12 ? "Good morning" : hour < 18 ? "Good afternoon" : "Good evening"}, Dr. ${firstName}`;

  const [appointments,  setAppointments]  = useState([]);
  const [patients,      setPatients]      = useState([]);
  const [diagnoses,     setDiagnoses]     = useState([]);
  const [prescriptions, setPrescriptions] = useState([]);
  const [loading,       setLoading]       = useState(true);

  useEffect(() => {
    Promise.allSettled([
      appointmentApi.getAll(),
      patientApi.getAll(),
      diagnosisApi.getAll(),
      prescriptionApi.getAll(),
    ]).then(([a, p, d, rx]) => {
      setAppointments(a.status === "fulfilled" ? (a.value.data ?? []) : []);
      setPatients(p.status === "fulfilled" ? (p.value.data ?? []) : []);
      setDiagnoses(d.status === "fulfilled" ? (d.value.data ?? []) : []);
      setPrescriptions(rx.status === "fulfilled" ? (rx.value.data ?? []) : []);
    }).finally(() => setLoading(false));
  }, []);

  const todayApts = appointments.filter((a) => {
    if (!a.appointmentDateTime) return false;
    const d = new Date(a.appointmentDateTime);
    const today = new Date();
    return d.toDateString() === today.toDateString();
  });

  const pendingFollowUps = diagnoses.filter((d) => d.followUpDate && new Date(d.followUpDate) >= new Date());

  return (
    <PortalLayout sidebar={DoctorSidebar} greeting={greeting}>
      {loading ? (
        <Box sx={{ display: "flex", justifyContent: "center", pt: 8 }}>
          <CircularProgress sx={{ color: "#1d4ed8" }} />
        </Box>
      ) : (
        <>
          {/* Quick stats */}
          <Grid container spacing={2} sx={{ mb: 3 }}>
            {[
              { label: "Today's Appointments", value: todayApts.length, color: "#4f46e5", bg: "#ede9fe", icon: <CalendarMonthIcon /> },
              { label: "Total Patients",        value: patients.length,  color: "#0891b2", bg: "#e0f2fe", icon: <PersonIcon /> },
              { label: "Diagnoses Made",        value: diagnoses.length, color: "#059669", bg: "#dcfce7", icon: <BiotechIcon /> },
              { label: "Prescriptions Issued",  value: prescriptions.length, color: "#7c3aed", bg: "#ede9fe", icon: <MedicationIcon /> },
            ].map((s) => (
              <Grid item xs={12} sm={6} lg={3} key={s.label}>
                <Card sx={{
                  borderRadius: 3, overflow: "hidden", position: "relative",
                  transition: "transform 0.2s", "&:hover": { transform: "translateY(-2px)", boxShadow: "0 8px 24px rgba(0,0,0,0.08)" },
                  "&::before": { content:'""', position:"absolute", top:0, left:0, right:0, height:3, background:`linear-gradient(90deg, ${s.color}, ${s.color}88)` },
                }}>
                  <CardContent sx={{ p: "20px !important" }}>
                    <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                      <Box>
                        <Typography sx={{ fontSize: "0.72rem", fontWeight: 600, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.06em", mb: 0.8 }}>
                          {s.label}
                        </Typography>
                        <Typography sx={{ fontSize: "2rem", fontWeight: 800, color: "#0f172a", letterSpacing: "-0.03em", lineHeight: 1 }}>
                          {s.value}
                        </Typography>
                      </Box>
                      <Box sx={{ width: 44, height: 44, borderRadius: 2.5, bgcolor: s.bg, display: "flex", alignItems: "center", justifyContent: "center" }}>
                        {React.cloneElement(s.icon, { sx: { color: s.color, fontSize: 20 } })}
                      </Box>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>

          <Grid container spacing={2.5}>
            {/* Today's Schedule */}
            <Grid item xs={12} md={6}>
              <Card sx={{ borderRadius: 3 }}>
                <CardContent sx={{ p: "20px !important" }}>
                  <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
                    <Box>
                      <Typography variant="h6" sx={{ fontWeight: 700 }}>Today's Schedule</Typography>
                      <Typography variant="caption" color="text.secondary">{todayApts.length} appointments today</Typography>
                    </Box>
                    <Button size="small" endIcon={<ArrowForwardIcon />}
                      onClick={() => navigate("/doctor/appointments")}
                      sx={{ textTransform: "none", color: "#4f46e5", fontWeight: 600, fontSize: "0.8rem" }}>
                      View all
                    </Button>
                  </Box>
                  {todayApts.length === 0 ? (
                    <Box sx={{ textAlign: "center", py: 4 }}>
                      <CalendarMonthIcon sx={{ fontSize: 40, color: "#e2e8f0", mb: 1 }} />
                      <Typography variant="body2" color="text.secondary">No appointments today</Typography>
                    </Box>
                  ) : todayApts.slice(0, 5).map((apt, i) => {
                    const s = STATUS_STYLES[apt.status] ?? { bg: "#f1f5f9", color: "#64748b" };
                    return (
                      <Box key={apt.appointmentId ?? i}>
                        <Box sx={{ display: "flex", alignItems: "center", gap: 2, py: 1.4 }}>
                          <Typography sx={{ fontSize: "0.75rem", fontWeight: 700, color: "#94a3b8", width: 40, flexShrink: 0 }}>
                            {apt.appointmentDateTime ? new Date(apt.appointmentDateTime).toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit", hour12: false }) : "—"}
                          </Typography>
                          <Avatar sx={{ width: 32, height: 32, bgcolor: "#ede9fe", color: "#6d28d9", fontSize: 11, fontWeight: 700 }}>P</Avatar>
                          <Box sx={{ flex: 1 }}>
                            <Typography sx={{ fontWeight: 600, fontSize: "0.8rem", color: "#0f172a" }}>
                              {apt.patientId?.toString().substring(0, 8)}…
                            </Typography>
                            <Typography variant="caption" color="text.secondary">{apt.reason ?? "Consultation"}</Typography>
                          </Box>
                          <Chip label={apt.status} size="small"
                            sx={{ height: 20, fontSize: "0.6rem", fontWeight: 600, borderRadius: 1.5, bgcolor: s.bg, color: s.color }} />
                        </Box>
                        {i < Math.min(todayApts.length, 5) - 1 && <Divider sx={{ borderColor: "#f1f5f9" }} />}
                      </Box>
                    );
                  })}
                </CardContent>
              </Card>
            </Grid>

            {/* Pending follow-ups + Recent patients */}
            <Grid item xs={12} md={6}>
              <Box sx={{ display: "flex", flexDirection: "column", gap: 2.5 }}>
                <Card sx={{ borderRadius: 3 }}>
                  <CardContent sx={{ p: "20px !important" }}>
                    <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>Pending Follow-ups</Typography>
                    {pendingFollowUps.length === 0 ? (
                      <Typography variant="body2" color="text.secondary" sx={{ textAlign: "center", py: 2 }}>No pending follow-ups</Typography>
                    ) : pendingFollowUps.slice(0, 3).map((d, i) => (
                      <Box key={d.diagnosisId ?? i} sx={{ display: "flex", alignItems: "center", gap: 1.5, py: 1.2,
                        borderBottom: i < Math.min(pendingFollowUps.length, 3) - 1 ? "1px solid #f1f5f9" : "none" }}>
                        <Box sx={{ width: 8, height: 8, borderRadius: "50%", bgcolor: "#f59e0b", flexShrink: 0 }} />
                        <Box sx={{ flex: 1 }}>
                          <Typography sx={{ fontWeight: 600, fontSize: "0.8rem" }}>{d.diagnosis}</Typography>
                          <Typography variant="caption" color="text.secondary">Follow-up: {d.followUpDate}</Typography>
                        </Box>
                      </Box>
                    ))}
                  </CardContent>
                </Card>
                <Card sx={{ borderRadius: 3 }}>
                  <CardContent sx={{ p: "20px !important" }}>
                    <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>Recent Patients</Typography>
                    {patients.slice(-4).reverse().map((p, i) => (
                      <Box key={p.patientId ?? i} sx={{ display: "flex", alignItems: "center", gap: 1.5, py: 1,
                        borderBottom: i < 3 ? "1px solid #f1f5f9" : "none" }}>
                        <Avatar sx={{ width: 30, height: 30, bgcolor: "#dbeafe", color: "#1d4ed8", fontSize: 11, fontWeight: 700 }}>
                          {(p.firstName?.[0] ?? "P").toUpperCase()}
                        </Avatar>
                        <Box>
                          <Typography sx={{ fontWeight: 600, fontSize: "0.8rem" }}>{p.firstName} {p.lastName}</Typography>
                          <Typography variant="caption" color="text.secondary">{p.gender} · {p.bloodGroup?.replace(/_/g, " ")}</Typography>
                        </Box>
                      </Box>
                    ))}
                  </CardContent>
                </Card>
              </Box>
            </Grid>
          </Grid>
        </>
      )}
    </PortalLayout>
  );
}

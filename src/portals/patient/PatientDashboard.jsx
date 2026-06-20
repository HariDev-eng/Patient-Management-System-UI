import React, { useEffect, useState } from "react";
import {
  Box, Typography, Grid, Card, CardContent, Chip,
  Avatar, LinearProgress, Divider, Button, CircularProgress,
} from "@mui/material";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import MedicationIcon    from "@mui/icons-material/Medication";
import BiotechIcon       from "@mui/icons-material/Biotech";
import ReceiptIcon       from "@mui/icons-material/Receipt";
import MonitorHeartIcon  from "@mui/icons-material/MonitorHeart";
import ArrowForwardIcon  from "@mui/icons-material/ArrowForward";
import FavoriteIcon      from "@mui/icons-material/Favorite";
import PortalLayout      from "../../components/layout/PortalLayout";
import PatientSidebar    from "./PatientSidebar";
import { appointmentApi }  from "../../api/appointmentApi";
import { prescriptionApi } from "../../api/prescriptionApi";
import { diagnosisApi }    from "../../api/diagnosisApi";
import { vitalApi }        from "../../api/nurseApi";
import { getUserEmail, getUserId } from "../../utils/auth";
import { useNavigate } from "react-router-dom";

function StatCard({ icon, label, value, color, bg, onClick }) {
  return (
    <Card onClick={onClick}
      sx={{
        cursor: onClick ? "pointer" : "default",
        borderRadius: 3, border: "1px solid #e2e8f0",
        boxShadow: "0 1px 3px rgba(0,0,0,0.04)",
        transition: "transform 0.2s, box-shadow 0.2s",
        "&:hover": onClick ? { transform: "translateY(-2px)", boxShadow: "0 8px 20px rgba(0,0,0,0.08)" } : {},
        overflow: "hidden", position: "relative",
        "&::before": { content:'""', position:"absolute", top:0, left:0, right:0, height:3, background:`linear-gradient(90deg, ${color}, ${color}88)` },
      }}>
      <CardContent sx={{ p: "20px !important" }}>
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
          <Box>
            <Typography sx={{ fontSize: "0.72rem", fontWeight: 600, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.06em", mb: 0.8 }}>
              {label}
            </Typography>
            <Typography sx={{ fontSize: "1.8rem", fontWeight: 800, color: "#0f172a", letterSpacing: "-0.03em", lineHeight: 1 }}>
              {value}
            </Typography>
          </Box>
          <Box sx={{ width: 42, height: 42, borderRadius: 2.5, bgcolor: bg, display: "flex", alignItems: "center", justifyContent: "center" }}>
            {React.cloneElement(icon, { sx: { color, fontSize: 20 } })}
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
}

export default function PatientDashboard() {
  const navigate  = useNavigate();
  const email     = getUserEmail();
  const firstName = email.split("@")[0] ?? "there";
  const hour      = new Date().getHours();
  const greeting  = hour < 12 ? "Good morning" : hour < 18 ? "Good afternoon" : "Good evening";

  const [appointments,  setAppointments]  = useState([]);
  const [prescriptions, setPrescriptions] = useState([]);
  const [diagnoses,     setDiagnoses]     = useState([]);
  const [vitals,        setVitals]        = useState(null);
  const [loading,       setLoading]       = useState(true);

  useEffect(() => {
    const patientId = getUserId();
    Promise.allSettled([
      appointmentApi.getAll(),
      prescriptionApi.getAll(),
      diagnosisApi.getAll(),
      patientId ? vitalApi.getByPatient(patientId) : Promise.resolve({ data: [] }),
    ]).then(([a, p, d, v]) => {
      setAppointments(a.status === "fulfilled" ? (a.value.data ?? []).slice(0, 3) : []);
      setPrescriptions(p.status === "fulfilled" ? (p.value.data ?? []) : []);
      setDiagnoses(d.status === "fulfilled" ? (d.value.data ?? []) : []);
      const vitalList = v.status === "fulfilled" ? (v.value.data ?? []) : [];
      setVitals(vitalList[vitalList.length - 1] ?? null);
    }).finally(() => setLoading(false));
  }, []);

  const latestDiagnosis = diagnoses[diagnoses.length - 1];
  const activePrescriptions = prescriptions.filter((p) => p.status !== "COMPLETED");

  return (
    <PortalLayout sidebar={PatientSidebar}
      greeting={`${greeting}, ${firstName} 👋`}>

      {loading ? (
        <Box sx={{ display: "flex", justifyContent: "center", pt: 8 }}>
          <CircularProgress sx={{ color: "#7c3aed" }} />
        </Box>
      ) : (
        <>
          {/* Stat Cards */}
          <Grid container spacing={2} sx={{ mb: 3 }}>
            <Grid item xs={12} sm={6} lg={3}>
              <StatCard icon={<CalendarMonthIcon />} label="Upcoming Appointments"
                value={appointments.length} color="#4f46e5" bg="#ede9fe"
                onClick={() => navigate("/patient/appointments")} />
            </Grid>
            <Grid item xs={12} sm={6} lg={3}>
              <StatCard icon={<MedicationIcon />} label="Active Prescriptions"
                value={activePrescriptions.length} color="#0891b2" bg="#e0f2fe"
                onClick={() => navigate("/patient/prescriptions")} />
            </Grid>
            <Grid item xs={12} sm={6} lg={3}>
              <StatCard icon={<BiotechIcon />} label="Diagnoses"
                value={diagnoses.length} color="#059669" bg="#dcfce7"
                onClick={() => navigate("/patient/records")} />
            </Grid>
            <Grid item xs={12} sm={6} lg={3}>
              <StatCard icon={<MonitorHeartIcon />} label="Latest Vitals"
                value={vitals ? "Recorded" : "None"} color="#dc2626" bg="#fee2e2"
                onClick={() => navigate("/patient/vitals")} />
            </Grid>
          </Grid>

          <Grid container spacing={2.5}>
            {/* Upcoming Appointments */}
            <Grid item xs={12} md={7}>
              <Card sx={{ borderRadius: 3 }}>
                <CardContent sx={{ p: "20px !important" }}>
                  <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
                    <Typography variant="h6" sx={{ fontWeight: 700 }}>Upcoming Appointments</Typography>
                    <Button size="small" endIcon={<ArrowForwardIcon />}
                      onClick={() => navigate("/patient/appointments")}
                      sx={{ textTransform: "none", color: "#4f46e5", fontWeight: 600, fontSize: "0.8rem" }}>
                      View all
                    </Button>
                  </Box>
                  {appointments.length === 0 ? (
                    <Box sx={{ textAlign: "center", py: 4 }}>
                      <CalendarMonthIcon sx={{ fontSize: 40, color: "#e2e8f0", mb: 1 }} />
                      <Typography variant="body2" color="text.secondary">No upcoming appointments</Typography>
                    </Box>
                  ) : appointments.map((apt, i) => (
                    <Box key={apt.appointmentId ?? i}>
                      <Box sx={{ display: "flex", alignItems: "center", gap: 2, py: 1.5 }}>
                        <Box sx={{ width: 44, height: 44, borderRadius: 2, bgcolor: "#ede9fe",
                          display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
                          <Typography sx={{ fontSize: "0.65rem", fontWeight: 700, color: "#6d28d9", lineHeight: 1 }}>
                            {apt.appointmentDateTime ? new Date(apt.appointmentDateTime).toLocaleDateString("en-IN", { day: "2-digit" }) : "—"}
                          </Typography>
                          <Typography sx={{ fontSize: "0.55rem", color: "#8b5cf6", textTransform: "uppercase" }}>
                            {apt.appointmentDateTime ? new Date(apt.appointmentDateTime).toLocaleDateString("en-IN", { month: "short" }) : ""}
                          </Typography>
                        </Box>
                        <Box sx={{ flex: 1 }}>
                          <Typography sx={{ fontWeight: 600, fontSize: "0.875rem", color: "#0f172a" }}>
                            {apt.doctorFirstName ? `Dr. ${apt.doctorFirstName} ${apt.doctorLastName ?? ""}` : apt.reason ?? "Appointment"}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {apt.appointmentDateTime ? new Date(apt.appointmentDateTime).toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" }) : ""}
                            {apt.reason ? ` · ${apt.reason}` : ""}
                          </Typography>
                        </Box>
                        <Chip label={apt.status} size="small"
                          sx={{
                            fontWeight: 600, fontSize: "0.65rem", height: 22, borderRadius: 1.5,
                            bgcolor: apt.status === "CONFIRMED" ? "#dcfce7" : apt.status === "SCHEDULED" ? "#dbeafe" : "#f1f5f9",
                            color:   apt.status === "CONFIRMED" ? "#15803d" : apt.status === "SCHEDULED" ? "#1d4ed8" : "#64748b",
                          }} />
                      </Box>
                      {i < appointments.length - 1 && <Divider sx={{ borderColor: "#f1f5f9" }} />}
                    </Box>
                  ))}
                </CardContent>
              </Card>
            </Grid>

            {/* Right column */}
            <Grid item xs={12} md={5}>
              <Box sx={{ display: "flex", flexDirection: "column", gap: 2.5 }}>

                {/* Latest Vitals */}
                <Card sx={{ borderRadius: 3 }}>
                  <CardContent sx={{ p: "20px !important" }}>
                    <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 1.5 }}>
                      <Typography variant="h6" sx={{ fontWeight: 700, fontSize: "1rem" }}>Latest Vitals</Typography>
                      <MonitorHeartIcon sx={{ color: "#ef4444", fontSize: 20 }} />
                    </Box>
                    {vitals ? (
                      <Grid container spacing={1.5}>
                        {[
                          { label: "Heart Rate", value: vitals.heartRate ? `${vitals.heartRate} bpm` : "—", color: "#ef4444", icon: "❤️" },
                          { label: "BP",         value: vitals.systolicBP ? `${vitals.systolicBP}/${vitals.diastolicBP}` : "—", color: "#4f46e5", icon: "🩺" },
                          { label: "SpO2",       value: vitals.oxygenSaturation ? `${vitals.oxygenSaturation}%` : "—", color: "#0891b2", icon: "💨" },
                          { label: "Temp",       value: vitals.temperature ? `${vitals.temperature}°C` : "—", color: "#f59e0b", icon: "🌡️" },
                          { label: "Weight",     value: vitals.weight ? `${vitals.weight} kg` : "—", color: "#059669", icon: "⚖️" },
                          { label: "Height",     value: vitals.height ? `${vitals.height} cm` : "—", color: "#7c3aed", icon: "📏" },
                        ].map((v) => (
                          <Grid item xs={6} key={v.label}>
                            <Box sx={{ p: 1.5, borderRadius: 2, bgcolor: "#f8fafc", border: "1px solid #f1f5f9" }}>
                              <Typography sx={{ fontSize: "0.65rem", color: "#94a3b8", fontWeight: 600, mb: 0.3 }}>{v.label}</Typography>
                              <Typography sx={{ fontSize: "1rem", fontWeight: 700, color: v.color }}>{v.value}</Typography>
                            </Box>
                          </Grid>
                        ))}
                      </Grid>
                    ) : (
                      <Typography variant="body2" color="text.secondary" sx={{ textAlign: "center", py: 2 }}>
                        No vitals recorded yet
                      </Typography>
                    )}
                  </CardContent>
                </Card>

                {/* Latest Diagnosis */}
                <Card sx={{ borderRadius: 3 }}>
                  <CardContent sx={{ p: "20px !important" }}>
                    <Typography variant="h6" sx={{ fontWeight: 700, fontSize: "1rem", mb: 1.5 }}>Latest Diagnosis</Typography>
                    {latestDiagnosis ? (
                      <Box>
                        <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
                          <Box sx={{ width: 8, height: 8, borderRadius: "50%", bgcolor: "#10b981" }} />
                          <Typography sx={{ fontWeight: 600, fontSize: "0.875rem" }}>{latestDiagnosis.diagnosis}</Typography>
                        </Box>
                        <Typography variant="caption" color="text.secondary" sx={{ display: "block", mb: 1 }}>
                          Symptoms: {latestDiagnosis.symptoms?.substring(0, 80)}…
                        </Typography>
                        {latestDiagnosis.followUpDate && (
                          <Chip label={`Follow-up: ${latestDiagnosis.followUpDate}`} size="small"
                            sx={{ bgcolor: "#fef9c3", color: "#a16207", fontWeight: 600, fontSize: "0.65rem", height: 22 }} />
                        )}
                      </Box>
                    ) : (
                      <Typography variant="body2" color="text.secondary" sx={{ textAlign: "center", py: 2 }}>
                        No diagnosis records
                      </Typography>
                    )}
                  </CardContent>
                </Card>

              </Box>
            </Grid>

            {/* Active Prescriptions */}
            <Grid item xs={12}>
              <Card sx={{ borderRadius: 3 }}>
                <CardContent sx={{ p: "20px !important" }}>
                  <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
                    <Typography variant="h6" sx={{ fontWeight: 700 }}>Current Medications</Typography>
                    <Button size="small" endIcon={<ArrowForwardIcon />}
                      onClick={() => navigate("/patient/prescriptions")}
                      sx={{ textTransform: "none", color: "#4f46e5", fontWeight: 600, fontSize: "0.8rem" }}>
                      View all
                    </Button>
                  </Box>
                  {activePrescriptions.length === 0 ? (
                    <Typography variant="body2" color="text.secondary" sx={{ textAlign: "center", py: 3 }}>
                      No active medications
                    </Typography>
                  ) : (
                    <Grid container spacing={1.5}>
                      {activePrescriptions.slice(0, 4).map((rx, i) =>
                        (rx.items ?? []).map((item, j) => (
                          <Grid item xs={12} sm={6} md={3} key={`${i}-${j}`}>
                            <Box sx={{ p: 1.5, borderRadius: 2, border: "1px solid #e2e8f0", bgcolor: "#f8fafc" }}>
                              <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 0.5 }}>
                                <Box sx={{ width: 28, height: 28, borderRadius: 1.5, bgcolor: "#ede9fe",
                                  display: "flex", alignItems: "center", justifyContent: "center" }}>
                                  <MedicationIcon sx={{ fontSize: 14, color: "#7c3aed" }} />
                                </Box>
                                <Typography sx={{ fontWeight: 600, fontSize: "0.8rem", color: "#0f172a" }}>
                                  {item.medicineName}
                                </Typography>
                              </Box>
                              <Typography variant="caption" color="text.secondary">
                                {item.dosage} · {item.frequency}
                              </Typography>
                              {item.durationDays && (
                                <Typography variant="caption" sx={{ display: "block", color: "#94a3b8" }}>
                                  {item.durationDays} days
                                </Typography>
                              )}
                            </Box>
                          </Grid>
                        ))
                      )}
                    </Grid>
                  )}
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </>
      )}
    </PortalLayout>
  );
}

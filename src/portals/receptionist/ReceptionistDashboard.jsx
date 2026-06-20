import React, { useEffect, useState } from "react";
import { Box, Typography, Grid, Card, CardContent, CircularProgress, Avatar, Chip, Divider, TextField, InputAdornment, Button } from "@mui/material";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import PersonIcon        from "@mui/icons-material/Person";
import ReceiptIcon       from "@mui/icons-material/Receipt";
import MedicalServicesIcon from "@mui/icons-material/MedicalServices";
import SearchIcon        from "@mui/icons-material/Search";
import AddIcon           from "@mui/icons-material/Add";
import PortalLayout      from "../../components/layout/PortalLayout";
import ReceptionistSidebar from "./ReceptionistSidebar";
import { appointmentApi } from "../../api/appointmentApi";
import { patientApi }     from "../../api/patientApi";
import { doctorApi }      from "../../api/doctorApi";
import { billingApi }     from "../../api/billingApi";
import { useNavigate }    from "react-router-dom";

const STATUS_STYLES = {
  SCHEDULED: { bg: "#dbeafe", color: "#1d4ed8" },
  CONFIRMED: { bg: "#ede9fe", color: "#6d28d9" },
  COMPLETED: { bg: "#dcfce7", color: "#15803d" },
  CANCELLED: { bg: "#fee2e2", color: "#dc2626" },
  PENDING:   { bg: "#fef9c3", color: "#a16207" },
};

export default function ReceptionistDashboard() {
  const navigate = useNavigate();
  const [appointments, setAppointments] = useState([]);
  const [patients,     setPatients]     = useState([]);
  const [doctors,      setDoctors]      = useState([]);
  const [loading,      setLoading]      = useState(true);
  const [search,       setSearch]       = useState("");

  useEffect(() => {
    Promise.allSettled([appointmentApi.getAll(), patientApi.getAll(), doctorApi.getAll()])
      .then(([a, p, d]) => {
        setAppointments(a.status === "fulfilled" ? (a.value.data ?? []) : []);
        setPatients(p.status === "fulfilled" ? (p.value.data ?? []) : []);
        setDoctors(d.status === "fulfilled" ? (d.value.data ?? []) : []);
      }).finally(() => setLoading(false));
  }, []);

  const todayApts = appointments.filter((a) => {
    if (!a.appointmentDateTime) return false;
    return new Date(a.appointmentDateTime).toDateString() === new Date().toDateString();
  });

  const filteredPatients = search.trim()
    ? patients.filter((p) => `${p.firstName} ${p.lastName}`.toLowerCase().includes(search.toLowerCase()) || p.phone?.includes(search))
    : patients.slice(-5).reverse();

  return (
    <PortalLayout sidebar={ReceptionistSidebar}>
      <Box sx={{ mb: 3, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <Box>
          <Typography variant="h5" sx={{ fontWeight: 800, color: "#0f172a" }}>Reception Desk</Typography>
          <Typography variant="body2" color="text.secondary">
            {new Date().toLocaleDateString("en-IN", { weekday: "long", day: "numeric", month: "long", year: "numeric" })}
          </Typography>
        </Box>
        <Button variant="contained" startIcon={<AddIcon />} onClick={() => navigate("/receptionist/appointments")}
          sx={{ borderRadius: 2.5, textTransform: "none", fontWeight: 600, background: "linear-gradient(135deg, #ea580c, #f59e0b)", boxShadow: "0 4px 14px rgba(234,88,12,0.35)", "&:hover": { background: "linear-gradient(135deg, #c2410c, #ea580c)" } }}>
          New Appointment
        </Button>
      </Box>

      {loading ? (
        <Box sx={{ display: "flex", justifyContent: "center", pt: 8 }}><CircularProgress sx={{ color: "#ea580c" }} /></Box>
      ) : (
        <>
          <Grid container spacing={2} sx={{ mb: 3 }}>
            {[
              { label: "Today's Appointments", value: todayApts.length, color: "#4f46e5", bg: "#ede9fe", icon: <CalendarMonthIcon /> },
              { label: "Total Patients",       value: patients.length,  color: "#0891b2", bg: "#e0f2fe", icon: <PersonIcon /> },
              { label: "Doctors Available",    value: doctors.length,   color: "#059669", bg: "#dcfce7", icon: <MedicalServicesIcon /> },
              { label: "Pending Bills",        value: "—",              color: "#ea580c", bg: "#fff7ed", icon: <ReceiptIcon /> },
            ].map((s) => (
              <Grid item xs={12} sm={6} lg={3} key={s.label}>
                <Card sx={{ borderRadius: 3, overflow: "hidden", position: "relative",
                  "&::before": { content:'""', position:"absolute", top:0, left:0, right:0, height:3, background:`linear-gradient(90deg, ${s.color}, ${s.color}88)` } }}>
                  <CardContent sx={{ p: "20px !important" }}>
                    <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                      <Box>
                        <Typography sx={{ fontSize: "0.72rem", fontWeight: 600, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.06em", mb: 0.8 }}>{s.label}</Typography>
                        <Typography sx={{ fontSize: "2rem", fontWeight: 800, color: "#0f172a", letterSpacing: "-0.03em", lineHeight: 1 }}>{s.value}</Typography>
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
            {/* Today's Appointments */}
            <Grid item xs={12} md={7}>
              <Card sx={{ borderRadius: 3 }}>
                <CardContent sx={{ p: "20px !important" }}>
                  <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>Today's Appointments</Typography>
                  {todayApts.length === 0 ? (
                    <Box sx={{ textAlign: "center", py: 4 }}>
                      <CalendarMonthIcon sx={{ fontSize: 40, color: "#e2e8f0", mb: 1 }} />
                      <Typography variant="body2" color="text.secondary">No appointments today</Typography>
                    </Box>
                  ) : todayApts.map((apt, i) => {
                    const s = STATUS_STYLES[apt.status] ?? { bg: "#f1f5f9", color: "#64748b" };
                    return (
                      <Box key={apt.appointmentId ?? i}>
                        <Box sx={{ display: "flex", alignItems: "center", gap: 2, py: 1.4 }}>
                          <Typography sx={{ fontSize: "0.78rem", fontWeight: 700, color: "#94a3b8", width: 44, flexShrink: 0 }}>
                            {apt.appointmentDateTime ? new Date(apt.appointmentDateTime).toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit", hour12: false }) : "—"}
                          </Typography>
                          <Avatar sx={{ width: 32, height: 32, bgcolor: "#ede9fe", color: "#6d28d9", fontSize: 11, fontWeight: 700 }}>P</Avatar>
                          <Box sx={{ flex: 1 }}>
                            <Typography sx={{ fontWeight: 600, fontSize: "0.85rem", color: "#0f172a" }}>
                              {apt.patientId?.toString().substring(0, 8)}…
                            </Typography>
                            <Typography variant="caption" color="text.secondary">{apt.reason ?? "Consultation"}</Typography>
                          </Box>
                          <Chip label={apt.status} size="small"
                            sx={{ height: 20, fontSize: "0.62rem", fontWeight: 600, borderRadius: 1.5, bgcolor: s.bg, color: s.color }} />
                        </Box>
                        {i < todayApts.length - 1 && <Divider sx={{ borderColor: "#f1f5f9" }} />}
                      </Box>
                    );
                  })}
                </CardContent>
              </Card>
            </Grid>

            {/* Quick Patient Search */}
            <Grid item xs={12} md={5}>
              <Card sx={{ borderRadius: 3 }}>
                <CardContent sx={{ p: "20px !important" }}>
                  <Typography variant="h6" sx={{ fontWeight: 700, mb: 1.5 }}>Quick Patient Search</Typography>
                  <TextField size="small" fullWidth placeholder="Search by name or phone…" value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    InputProps={{ startAdornment: <InputAdornment position="start"><SearchIcon sx={{ fontSize: 17, color: "#94a3b8" }} /></InputAdornment> }}
                    sx={{ mb: 2 }} />
                  {filteredPatients.map((p, i) => (
                    <Box key={p.patientId ?? i} sx={{ display: "flex", alignItems: "center", gap: 1.5, py: 1.2,
                      borderBottom: i < filteredPatients.length - 1 ? "1px solid #f1f5f9" : "none" }}>
                      <Avatar sx={{ width: 30, height: 30, bgcolor: "#fff7ed", color: "#ea580c", fontSize: 11, fontWeight: 700 }}>
                        {(p.firstName?.[0] ?? "P").toUpperCase()}
                      </Avatar>
                      <Box sx={{ flex: 1 }}>
                        <Typography sx={{ fontWeight: 600, fontSize: "0.8rem" }}>{p.firstName} {p.lastName}</Typography>
                        <Typography variant="caption" color="text.secondary">{p.phone} · {p.gender}</Typography>
                      </Box>
                      <Chip label={p.status} size="small"
                        sx={{ height: 18, fontSize: "0.6rem", fontWeight: 600, bgcolor: "#dcfce7", color: "#15803d", borderRadius: 1.5 }} />
                    </Box>
                  ))}
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </>
      )}
    </PortalLayout>
  );
}

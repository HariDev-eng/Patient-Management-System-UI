import React, { useEffect, useState } from "react";
import { Box, Typography, Grid, Card, CardContent, CircularProgress, Avatar, Chip, Divider } from "@mui/material";
import PersonIcon       from "@mui/icons-material/Person";
import MonitorHeartIcon from "@mui/icons-material/MonitorHeart";
import AssignmentIcon   from "@mui/icons-material/Assignment";
import PortalLayout     from "../../components/layout/PortalLayout";
import NurseSidebar     from "./NurseSidebar";
import { patientApi }   from "../../api/patientApi";
import { nurseApi }     from "../../api/nurseApi";
import { getUserEmail } from "../../utils/auth";

export default function NurseDashboard() {
  const email     = getUserEmail();
  const firstName = email.split("@")[0] ?? "Nurse";
  const [patients, setPatients] = useState([]);
  const [nurses,   setNurses]   = useState([]);
  const [loading,  setLoading]  = useState(true);

  useEffect(() => {
    Promise.allSettled([patientApi.getAll(), nurseApi.getAll()])
      .then(([p, n]) => {
        setPatients(p.status === "fulfilled" ? (p.value.data ?? []) : []);
        setNurses(n.status === "fulfilled" ? (n.value.data ?? []) : []);
      }).finally(() => setLoading(false));
  }, []);

  const stats = [
    { label: "Total Patients", value: patients.length, color: "#059669", bg: "#dcfce7", icon: <PersonIcon /> },
    { label: "Nurses On Duty", value: nurses.filter((n) => n.shift === "MORNING" || n.shift === "AFTERNOON").length, color: "#0891b2", bg: "#e0f2fe", icon: <MonitorHeartIcon /> },
    { label: "Pending Vitals", value: patients.length, color: "#f59e0b", bg: "#fef9c3", icon: <AssignmentIcon /> },
  ];

  return (
    <PortalLayout sidebar={NurseSidebar} greeting={`Good shift, ${firstName} 👋`}>
      {loading ? (
        <Box sx={{ display: "flex", justifyContent: "center", pt: 8 }}><CircularProgress sx={{ color: "#059669" }} /></Box>
      ) : (
        <>
          <Grid container spacing={2} sx={{ mb: 3 }}>
            {stats.map((s) => (
              <Grid item xs={12} sm={4} key={s.label}>
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
            <Grid item xs={12} md={6}>
              <Card sx={{ borderRadius: 3 }}>
                <CardContent sx={{ p: "20px !important" }}>
                  <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>Patients Needing Vitals</Typography>
                  {patients.slice(0, 6).map((p, i) => (
                    <Box key={p.patientId ?? i} sx={{ display: "flex", alignItems: "center", gap: 1.5, py: 1.2,
                      borderBottom: i < Math.min(patients.length, 6) - 1 ? "1px solid #f1f5f9" : "none" }}>
                      <Avatar sx={{ width: 32, height: 32, bgcolor: "#dcfce7", color: "#059669", fontSize: 12, fontWeight: 700 }}>
                        {(p.firstName?.[0] ?? "P").toUpperCase()}
                      </Avatar>
                      <Box sx={{ flex: 1 }}>
                        <Typography sx={{ fontWeight: 600, fontSize: "0.875rem" }}>{p.firstName} {p.lastName}</Typography>
                        <Typography variant="caption" color="text.secondary">{p.gender} · {p.bloodGroup?.replace(/_/g, " ")}</Typography>
                      </Box>
                      <Chip label="Pending" size="small" sx={{ height: 20, fontSize: "0.6rem", fontWeight: 600, bgcolor: "#fef9c3", color: "#a16207", borderRadius: 1.5 }} />
                    </Box>
                  ))}
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} md={6}>
              <Card sx={{ borderRadius: 3 }}>
                <CardContent sx={{ p: "20px !important" }}>
                  <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>Nurses On Shift</Typography>
                  {nurses.slice(0, 6).map((n, i) => (
                    <Box key={n.nurseId ?? i} sx={{ display: "flex", alignItems: "center", gap: 1.5, py: 1.2,
                      borderBottom: i < Math.min(nurses.length, 6) - 1 ? "1px solid #f1f5f9" : "none" }}>
                      <Avatar sx={{ width: 32, height: 32, bgcolor: "#e0f2fe", color: "#0891b2", fontSize: 12, fontWeight: 700 }}>
                        {(n.firstName?.[0] ?? "N").toUpperCase()}
                      </Avatar>
                      <Box sx={{ flex: 1 }}>
                        <Typography sx={{ fontWeight: 600, fontSize: "0.875rem" }}>{n.firstName} {n.lastName}</Typography>
                        <Typography variant="caption" color="text.secondary">{n.department}</Typography>
                      </Box>
                      <Chip label={n.shift} size="small"
                        sx={{ height: 20, fontSize: "0.6rem", fontWeight: 600, borderRadius: 1.5,
                          bgcolor: n.shift === "MORNING" ? "#fef9c3" : n.shift === "AFTERNOON" ? "#dbeafe" : "#ede9fe",
                          color:   n.shift === "MORNING" ? "#a16207" : n.shift === "AFTERNOON" ? "#1d4ed8" : "#6d28d9" }} />
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

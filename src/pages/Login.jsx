import React, { useState } from "react";
import {
  Box, Card, CardContent, TextField, Button,
  Typography, Alert, CircularProgress, InputAdornment, IconButton,
} from "@mui/material";
import LocalHospitalIcon from "@mui/icons-material/LocalHospital";
import Visibility        from "@mui/icons-material/Visibility";
import VisibilityOff     from "@mui/icons-material/VisibilityOff";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { getPortal } from "../utils/auth";

// Decode JWT payload without a library
function decodeJwt(token) {
  try {
    const payload = token.split(".")[1];
    return JSON.parse(atob(payload));
  } catch { return {}; }
}

export default function Login() {
  const navigate  = useNavigate();
  const [form, setForm]       = useState({ email: "", password: "" });
  const [error, setError]     = useState("");
  const [loading, setLoading] = useState(false);
  const [showPwd, setShowPwd] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await axios.post(
        "/auth/login",
        { email: form.email, password: form.password },
        { headers: { "Content-Type": "application/json" } }
      );

      const data  = res.data;
      const token = data.token ?? data.accessToken ?? data.jwt;
      if (!token) throw new Error("No token received");

      // Decode JWT to get userId and role if not in response body
      const decoded = decodeJwt(token);

      localStorage.setItem("token",     token);
      localStorage.setItem("userEmail", data.email ?? decoded.sub ?? form.email);
      // Role from response, or from JWT claim
      localStorage.setItem("userRole",  data.role  ?? decoded.role ?? decoded.authorities?.[0] ?? "ADMIN");
      // userId from response, JWT "userId" claim, or JWT "sub"
      localStorage.setItem("userId",    data.userId ?? decoded.userId ?? decoded.sub ?? "");

      const portal = getPortal();
      const map = {
        admin:        "/admin",
        doctor:       "/doctor",
        nurse:        "/nurse",
        patient:      "/patient",
        receptionist: "/receptionist",
      };
      navigate(map[portal] ?? "/admin", { replace: true });

    } catch (err) {
      setError(err.response?.data?.message ?? err.message ?? "Login failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{
      minHeight: "100vh",
      background: "linear-gradient(135deg, #0f172a 0%, #1e1b4b 50%, #0f172a 100%)",
      display: "flex", alignItems: "center", justifyContent: "center",
      position: "relative", overflow: "hidden",
      "&::before": { content: '""', position: "absolute", width: 600, height: 600, borderRadius: "50%",
        background: "radial-gradient(circle, rgba(79,70,229,0.15) 0%, transparent 70%)", top: "-200px", right: "-100px" },
      "&::after":  { content: '""', position: "absolute", width: 400, height: 400, borderRadius: "50%",
        background: "radial-gradient(circle, rgba(6,182,212,0.1) 0%, transparent 70%)",  bottom: "-100px", left: "-100px" },
    }}>
      <Card sx={{
        width: 420, borderRadius: 4,
        boxShadow: "0 25px 60px rgba(0,0,0,0.4)",
        border: "1px solid rgba(255,255,255,0.08)",
        position: "relative", zIndex: 1,
      }}>
        <CardContent sx={{ p: 4 }}>
          <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", mb: 3.5 }}>
            <Box sx={{
              width: 56, height: 56, borderRadius: 3, mb: 2,
              background: "linear-gradient(135deg, #4f46e5, #06b6d4)",
              display: "flex", alignItems: "center", justifyContent: "center",
              boxShadow: "0 8px 24px rgba(79,70,229,0.35)",
            }}>
              <LocalHospitalIcon sx={{ color: "#fff", fontSize: 28 }} />
            </Box>
            <Typography variant="h5" sx={{ fontWeight: 800, color: "#0f172a", letterSpacing: "-0.02em" }}>
              CC Health System
            </Typography>
            <Typography variant="body2" sx={{ color: "#64748b", mt: 0.5 }}>
              Sign in to continue
            </Typography>
          </Box>

          {error && (
            <Alert severity="error" sx={{ mb: 2.5, borderRadius: 2, fontSize: "0.85rem" }}>{error}</Alert>
          )}

          <Box component="form" onSubmit={handleSubmit} sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            <TextField label="Email address" type="email" fullWidth required
              value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
            <TextField label="Password" fullWidth required
              type={showPwd ? "text" : "password"}
              value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })}
              InputProps={{ endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={() => setShowPwd((p) => !p)} edge="end" size="small">
                    {showPwd ? <VisibilityOff fontSize="small" /> : <Visibility fontSize="small" />}
                  </IconButton>
                </InputAdornment>
              )}} />
            <Button type="submit" variant="contained" fullWidth size="large" disabled={loading}
              sx={{ mt: 0.5, py: 1.5, fontSize: "0.95rem", fontWeight: 700, borderRadius: 2.5 }}>
              {loading ? <CircularProgress size={22} color="inherit" /> : "Sign In"}
            </Button>
          </Box>

          <Typography variant="body2" sx={{ textAlign: "center", mt: 2.5, color: "#64748b" }}>
            Don't have an account?{" "}
            <Link to="/signup" style={{ color: "#4f46e5", fontWeight: 700, textDecoration: "none" }}>
              Sign up
            </Link>
          </Typography>
        </CardContent>
      </Card>
    </Box>
  );
}

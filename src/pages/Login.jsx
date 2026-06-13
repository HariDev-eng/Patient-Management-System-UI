import React, { useState } from "react";
import {
  Box, Card, CardContent, TextField, Button,
  Typography, CircularProgress, InputAdornment, IconButton,
} from "@mui/material";
import LocalHospitalIcon from "@mui/icons-material/LocalHospital";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import { useNavigate, Link } from "react-router-dom";

// Auth is skipped for now — endpoint will change in future
// Just navigate to dashboard directly
export default function Login() {
  const navigate = useNavigate();
  const [form, setForm]     = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [showPwd, setShowPwd] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    // Skip auth — set a dummy token and go to dashboard
    localStorage.setItem("token", "skip-auth");
    setTimeout(() => { setLoading(false); navigate("/"); }, 400);
  };

  return (
    <Box sx={{
      minHeight: "100vh",
      background: "linear-gradient(135deg, #0891b2 0%, #0e7490 60%, #0f766e 100%)",
      display: "flex", alignItems: "center", justifyContent: "center",
    }}>
      <Card sx={{ width: 400, borderRadius: 4, boxShadow: "0 20px 60px rgba(0,0,0,0.2)" }}>
        <CardContent sx={{ p: 4 }}>
          <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", mb: 3 }}>
            <Box sx={{
              width: 64, height: 64, borderRadius: "50%",
              background: "linear-gradient(135deg, #0891b2, #0e7490)",
              display: "flex", alignItems: "center", justifyContent: "center", mb: 1.5,
            }}>
              <LocalHospitalIcon sx={{ color: "#fff", fontSize: 32 }} />
            </Box>
            <Typography variant="h5" sx={{ fontWeight: 700, color: "#0f172a" }}>CC Health System</Typography>
            <Typography variant="body2" color="text.secondary">Sign in to your account</Typography>
          </Box>

          <Box component="form" onSubmit={handleSubmit} sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            <TextField
              label="Email" type="email" fullWidth required
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
            />
            <TextField
              label="Password" fullWidth required
              type={showPwd ? "text" : "password"}
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={() => setShowPwd((p) => !p)} edge="end">
                      {showPwd ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
            <Button type="submit" variant="contained" fullWidth size="large" disabled={loading}
              sx={{ mt: 1, py: 1.4, borderRadius: 2, fontSize: "1rem", textTransform: "none", fontWeight: 600 }}>
              {loading ? <CircularProgress size={22} color="inherit" /> : "Sign In"}
            </Button>
          </Box>

          <Typography variant="body2" sx={{ textAlign: "center", mt: 2, color: "#64748b" }}>
            Don't have an account?{" "}
            <Link to="/signup" style={{ color: "#0891b2", fontWeight: 600, textDecoration: "none" }}>Sign Up</Link>
          </Typography>
        </CardContent>
      </Card>
    </Box>
  );
}

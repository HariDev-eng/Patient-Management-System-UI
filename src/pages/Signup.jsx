import React, { useState } from "react";
import {
    Box, Card, CardContent, TextField, Button,
    Typography, Alert, CircularProgress,
} from "@mui/material";
import LocalHospitalIcon from "@mui/icons-material/LocalHospital";
import { useNavigate, Link } from "react-router-dom";
import { authApi } from "../api/authApi";

export default function Signup() {
    const navigate = useNavigate();
    const [form, setForm] = useState({ name: "", email: "", password: "", confirmPassword: "" });
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        if (form.password !== form.confirmPassword) {
            setError("Passwords do not match.");
            return;
        }
        setLoading(true);
        try {
            await authApi.register({ name: form.name, email: form.email, password: form.password });
            navigate("/login");
        } catch (err) {
            setError(err.response?.data?.message ?? "Registration failed.");
        } finally {
            setLoading(false);
        }
    };

    const field = (key, label, type = "text") => (
        <TextField
            label={label} type={type} fullWidth required
            value={form[key]}
            onChange={(e) => setForm({ ...form, [key]: e.target.value })}
        />
    );

    return (
        <Box
            sx={{
                minHeight: "100vh",
                background: "linear-gradient(135deg, #0891b2 0%, #0e7490 60%, #0f766e 100%)",
                display: "flex", alignItems: "center", justifyContent: "center",
            }}
        >
            <Card sx={{ width: 420, borderRadius: 4, boxShadow: "0 20px 60px rgba(0,0,0,0.2)" }}>
                <CardContent sx={{ p: 4 }}>
                    <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", mb: 3 }}>
                        <Box
                            sx={{
                                width: 60, height: 60, borderRadius: "50%",
                                background: "linear-gradient(135deg, #0891b2, #0e7490)",
                                display: "flex", alignItems: "center", justifyContent: "center", mb: 1.5,
                            }}
                        >
                            <LocalHospitalIcon sx={{ color: "#fff", fontSize: 30 }} />
                        </Box>
                        <Typography variant="h5" sx={{ fontWeight: 700, color: "#0f172a" }}>Create Account</Typography>
                        <Typography variant="body2" color="text.secondary">Join CC Health System</Typography>
                    </Box>

                    {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

                    <Box component="form" onSubmit={handleSubmit} sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                        {field("name", "Full Name")}
                        {field("email", "Email", "email")}
                        {field("password", "Password", "password")}
                        {field("confirmPassword", "Confirm Password", "password")}
                        <Button
                            type="submit" variant="contained" fullWidth size="large"
                            disabled={loading}
                            sx={{ mt: 1, py: 1.4, borderRadius: 2, fontSize: "1rem" }}
                        >
                            {loading ? <CircularProgress size={22} color="inherit" /> : "Create Account"}
                        </Button>
                    </Box>

                    <Typography variant="body2" sx={{ textAlign: "center", mt: 2, color: "#64748b" }}>
                        Already have an account?{" "}
                        <Link to="/login" style={{ color: "#0891b2", fontWeight: 600, textDecoration: "none" }}>
                            Sign In
                        </Link>
                    </Typography>
                </CardContent>
            </Card>
        </Box>
    );
}
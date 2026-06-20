import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    primary:   { main: "#4f46e5", dark: "#3730a3", light: "#818cf8", contrastText: "#fff" },
    secondary: { main: "#06b6d4", contrastText: "#fff" },
    success:   { main: "#10b981" },
    warning:   { main: "#f59e0b" },
    error:     { main: "#ef4444" },
    background:{ default: "#f1f5f9", paper: "#ffffff" },
    text:      { primary: "#0f172a", secondary: "#64748b" },
  },
  typography: {
    fontFamily: "'Inter', 'system-ui', sans-serif",
    h3: { fontWeight: 800, letterSpacing: "-0.03em" },
    h4: { fontWeight: 800, letterSpacing: "-0.02em" },
    h5: { fontWeight: 700, letterSpacing: "-0.02em" },
    h6: { fontWeight: 700, letterSpacing: "-0.01em" },
  },
  shape: { borderRadius: 14 },
  components: {
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          border: "1px solid #e2e8f0",
          boxShadow: "0 1px 3px rgba(0,0,0,0.04)",
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: { borderRadius: 10, textTransform: "none", fontWeight: 600 },
        contained: {
          background: "linear-gradient(135deg, #4f46e5 0%, #6366f1 100%)",
          boxShadow: "0 4px 14px rgba(79,70,229,0.35)",
          "&:hover": { background: "linear-gradient(135deg, #3730a3 0%, #4f46e5 100%)" },
        },
      },
    },
    MuiTableHead: {
      styleOverrides: {
        root: {
          "& .MuiTableCell-head": {
            fontWeight: 600, fontSize: "0.72rem", textTransform: "uppercase",
            letterSpacing: "0.06em", color: "#94a3b8",
            backgroundColor: "#f8fafc", borderBottom: "1px solid #e2e8f0",
            padding: "12px 16px",
          },
        },
      },
    },
    MuiTableCell: {
      styleOverrides: {
        root: { borderBottom: "1px solid #f1f5f9", padding: "14px 16px", fontSize: "0.875rem" },
      },
    },
    MuiTableRow: {
      styleOverrides: {
        root: { "&:hover": { backgroundColor: "#f8fafc" }, "&:last-child td": { border: 0 } },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          "& .MuiOutlinedInput-root": {
            borderRadius: 10, backgroundColor: "#f8fafc",
            "&:hover fieldset": { borderColor: "#4f46e5" },
            "&.Mui-focused fieldset": { borderColor: "#4f46e5", borderWidth: 2 },
          },
        },
      },
    },
    MuiChip: {
      styleOverrides: { root: { fontWeight: 600, fontSize: "0.7rem", borderRadius: 6 } },
    },
  },
});

export default theme;

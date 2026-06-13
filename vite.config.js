import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    cors: true,
    proxy: {
      "^/patients":          { target: "http://localhost:4000", changeOrigin: true, secure: false },
      "^/auth":              { target: "http://localhost:4005", changeOrigin: true, secure: false },
      "^/doctors":           { target: "http://localhost:4006", changeOrigin: true, secure: false },
      "^/api/appointment":   { target: "http://localhost:4007", changeOrigin: true, secure: false },
      "^/api/billing":       { target: "http://localhost:4004", changeOrigin: true, secure: false },
      "^/api/inventory":     { target: "http://localhost:4004", changeOrigin: true, secure: false },
    },
  },
});
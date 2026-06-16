import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    host: "0.0.0.0",   // required to accept connections inside Docker
    port: 5173,
    proxy: {
      "/api": {
        target: "http://api-gateway:4004",  // container name in Docker network
        changeOrigin: true,
        secure: false,
      },
      "/auth": {
        target: "http://api-gateway:4004",
        changeOrigin: true,
        secure: false,
      },
    },
  },
});

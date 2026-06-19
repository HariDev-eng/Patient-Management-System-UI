import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  build: { outDir: "dist" },
  server: {
    host: "0.0.0.0",
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

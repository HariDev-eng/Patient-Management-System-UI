import axios from "axios";

// IMPORTANT: baseURL must be empty string "" so all requests go to
// localhost:5173 (Vite dev server) which then proxies them to the
// correct backend port via vite.config.js proxy rules.
// Never use absolute URLs like http://localhost:4006 — that bypasses the proxy.

const client = axios.create({
  baseURL: "",
  headers: { "Content-Type": "application/json" },
});

client.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token && token !== "skip-auth") {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

client.interceptors.response.use(
  (res) => res,
  (err) => Promise.reject(err)
);

// All services use same client — routing handled by vite proxy
export const authClient        = client;
export const patientClient     = client;
export const doctorClient      = client;
export const appointmentClient = client;
export default client;

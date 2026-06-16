import axios from "axios";

// Single client — all requests go through API Gateway (port 4004)
// In dev: Vite proxy forwards /api and /auth to localhost:4004
// In Docker: Nginx forwards /api and /auth to api-gateway:4004
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
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem("token");
      window.location.href = "/login";
    }
    return Promise.reject(err);
  }
);

export const authClient        = client;
export const patientClient     = client;
export const doctorClient      = client;
export const appointmentClient = client;
export const billingClient     = client;
export const analyticsClient   = client;
export default client;

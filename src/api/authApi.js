import { authClient } from "./axiosClient";

// Vite proxy: /auth -> http://localhost:4005
export const authApi = {
  login:    (data) => authClient.post("/auth/login", data),
  register: (data) => authClient.post("/auth/register", data),
};

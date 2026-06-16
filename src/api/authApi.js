import { authClient } from "./axiosClient";

// Gateway: /auth/** -> auth-service:4005 (StripPrefix=0, keeps /auth)
export const authApi = {
  login:    (data) => authClient.post("/auth/login", data),
  register: (data) => authClient.post("/auth/register", data),
  me:       ()     => authClient.get("/auth/me"),
  logout:   ()     => authClient.post("/auth/logout"),
};

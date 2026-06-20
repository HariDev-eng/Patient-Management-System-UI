export const getToken     = () => localStorage.getItem("token");
export const getUserEmail = () => localStorage.getItem("userEmail") ?? "";
export const getUserRole  = () => localStorage.getItem("userRole")  ?? "";
export const getUserId    = () => localStorage.getItem("userId")    ?? "";

export const isAuthenticated = () => {
  const token = getToken();
  return !!token && token !== "skip-auth";
};

export const getPortal = () => {
  const role = getUserRole().toUpperCase();
  if (role === "PATIENT")      return "patient";
  if (role === "DOCTOR")       return "doctor";
  if (role === "NURSE")        return "nurse";
  if (role === "RECEPTIONIST") return "receptionist";
  return "admin";
};

export const clearAuth = () => {
  ["token","userEmail","userRole","userId"].forEach((k) => localStorage.removeItem(k));
};

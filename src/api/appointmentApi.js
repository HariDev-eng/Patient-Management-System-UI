import { appointmentClient } from "./axiosClient";

// Vite proxy: /api/appointment -> http://localhost:4007
export const appointmentApi = {
  create:       (data)       => appointmentClient.post("/api/appointment", data),
  getAll:       ()           => appointmentClient.get("/api/appointment"),
  getById:      (id)         => appointmentClient.get(`/api/appointment/${id}`),
  updateStatus: (id, status) => appointmentClient.put(`/api/appointment/${id}?status=${status}`),
  delete:       (id)         => appointmentClient.delete(`/api/appointment/${id}`),
  getByPatient: (pid)        => appointmentClient.get(`/api/appointment/patient/${pid}`),
  getByDoctor:  (did)        => appointmentClient.get(`/api/appointment/doctor/${did}`),
  getByStatus:  (status)     => appointmentClient.get(`/api/appointment/status/${status}`),
};

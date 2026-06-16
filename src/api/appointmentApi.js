import { appointmentClient } from "./axiosClient";

// Gateway: /api/appointments/** -> appointment-service:4007
// StripPrefix=1 strips /api, so service receives /appointments/**
export const appointmentApi = {
  create:       (data)       => appointmentClient.post("/api/appointments", data),
  getAll:       ()           => appointmentClient.get("/api/appointments"),
  getById:      (id)         => appointmentClient.get(`/api/appointments/${id}`),
  updateStatus: (id, status) => appointmentClient.put(`/api/appointments/${id}?status=${status}`),
  delete:       (id)         => appointmentClient.delete(`/api/appointments/${id}`),
  getByPatient: (pid)        => appointmentClient.get(`/api/appointments/patient/${pid}`),
  getByDoctor:  (did)        => appointmentClient.get(`/api/appointments/doctor/${did}`),
  getByStatus:  (status)     => appointmentClient.get(`/api/appointments/status/${status}`),
};

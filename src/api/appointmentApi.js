import axiosClient from "./axiosClient";

export const appointmentApi = {
  create: (data) => axiosClient.post("/api/appointment", data),
  getAll: () => axiosClient.get("/api/appointment"),
  getById: (id) => axiosClient.get(`/api/appointment/${id}`),
  updateStatus: (id, status) => axiosClient.put(`/api/appointment/${id}?status=${status}`),
  delete: (id) => axiosClient.delete(`/api/appointment/${id}`),
  getByPatient: (patientId) => axiosClient.get(`/api/appointment/patient/${patientId}`),
  getByDoctor: (doctorId) => axiosClient.get(`/api/appointment/doctor/${doctorId}`),
  getByStatus: (status) => axiosClient.get(`/api/appointment/status/${status}`),
};

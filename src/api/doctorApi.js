import axiosClient from "./axiosClient";

export const doctorApi = {
  create: (data) => axiosClient.post("/api/doctors", data),
  getAll: () => axiosClient.get("/api/doctors"),
  getById: (id) => axiosClient.get(`/api/doctors/${id}`),
  update: (id, data) => axiosClient.put(`/api/doctors/${id}`, data),
  delete: (id) => axiosClient.delete(`/api/doctors/${id}`),
  getBySpecialization: (spec) => axiosClient.get(`/api/doctors/specialization/${spec}`),
  getAvailability: (id) => axiosClient.get(`/api/doctors/${id}/availability`),
};

import axiosClient from "./axiosClient";

export const patientApi = {
  create: (data) => axiosClient.post("/api/patients", data),
  getAll: () => axiosClient.get("/api/patients"),
  getById: (id) => axiosClient.get(`/api/patients/${id}`),
  update: (id, data) => axiosClient.put(`/api/patients/${id}`, data),
  delete: (id) => axiosClient.delete(`/api/patients/${id}`),
  search: (name) => axiosClient.get(`/api/patients/search?name=${name}`),
};

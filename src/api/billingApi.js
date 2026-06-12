import axiosClient from "./axiosClient";

export const billingApi = {
  create: (data) => axiosClient.post("/api/billing", data),
  getAll: () => axiosClient.get("/api/billing"),
  getById: (id) => axiosClient.get(`/api/billing/${id}`),
  update: (id, data) => axiosClient.put(`/api/billing/${id}`, data),
  delete: (id) => axiosClient.delete(`/api/billing/${id}`),
  getByPatient: (patientId) => axiosClient.get(`/api/billing/patient/${patientId}`),
  getByStatus: (status) => axiosClient.get(`/api/billing/status/${status}`),
};

export const inventoryApi = {
  create: (data) => axiosClient.post("/api/inventory", data),
  getAll: () => axiosClient.get("/api/inventory"),
  getById: (id) => axiosClient.get(`/api/inventory/${id}`),
  update: (id, data) => axiosClient.put(`/api/inventory/${id}`, data),
  delete: (id) => axiosClient.delete(`/api/inventory/${id}`),
  getLowStock: () => axiosClient.get("/api/inventory/low-stock"),
  search: (name) => axiosClient.get(`/api/inventory/search?name=${name}`),
};

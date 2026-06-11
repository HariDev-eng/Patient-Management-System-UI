import axiosClient from "./axiosClient";

export const inventoryApi = {
    create: (data) => axiosClient.post("/api/inventory", data),
    getAll: () => axiosClient.get("/api/inventory"),
    getById: (id) => axiosClient.get(`/api/inventory/${id}`),
    update: (id, data) => axiosClient.put(`/api/inventory/${id}`, data),
    delete: (id) => axiosClient.delete(`/api/inventory/${id}`),
    getLowStock: () => axiosClient.get("/api/inventory/low-stock"),
    search: (name) => axiosClient.get(`/api/inventory/search?name=${name}`),
};
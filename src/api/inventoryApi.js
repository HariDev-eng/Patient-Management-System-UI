import {patientClient} from "./axiosClient.js";


export const inventoryApi = {
  create: (data) => patientClient.post(`/api/inventory`, data),
  getAll: (id) => patientClient.get(`/api/inventory`),
  getById: (id) => patientClient.get(`/api/inventory/${id}`),
  update: (id, data) => patientClient.put(`/api/inventory/${id}`, data),
  delete: (id) => patientClient.delete(`/api/inventory/${id}`),
  getLowStock: (id) => patientClient.get(`/api/inventory/low-stock`),
  search:  (id) => patientClient.search(`/api/inventory/search?name=${name}`),
}
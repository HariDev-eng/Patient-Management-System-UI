import { billingClient } from "./axiosClient";

// Gateway: /api/bills/** -> billing-service:4001
export const billingApi = {
  create:      (data)     => billingClient.post("/api/bills", data),
  getAll:      ()         => billingClient.get("/api/bills"),
  getById:     (id)       => billingClient.get(`/api/bills/${id}`),
  update:      (id, data) => billingClient.put(`/api/bills/${id}`, data),
  delete:      (id)       => billingClient.delete(`/api/bills/${id}`),
  getByPatient:(pid)      => billingClient.get(`/api/bills/patient/${pid}`),
  getByStatus: (status)   => billingClient.get(`/api/bills/status/${status}`),
};

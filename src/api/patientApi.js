import { patientClient } from "./axiosClient";

// Gateway: /api/patients/** -> patient-service:4000
// StripPrefix=1 strips /api, so patient-service receives /patients/**
export const patientApi = {
  create:  (data) => patientClient.post("/api/patients", data),
  getAll:  ()     => patientClient.get("/api/patients"),
  getById: (id)   => patientClient.get(`/api/patients/${id}`),
  update:  (id, data) => patientClient.put(`/api/patients/${id}`, data),
  delete:  (id)   => patientClient.delete(`/api/patients/${id}`),
  search:  (name) => patientClient.get(`/api/patients/search?name=${name}`),
};

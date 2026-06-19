import { patientClient } from "./axiosClient";

// Gateway: /api/nurses/** -> nurse-service:4008 (StripPrefix=1)
export const nurseApi = {
  create:  (data) => patientClient.post("/api/nurses", data),
  getAll:  ()     => patientClient.get("/api/nurses"),
  getById: (id)   => patientClient.get(`/api/nurses/${id}`),
};

// Vitals — also in nurse-service
export const vitalApi = {
  create:          (data) => patientClient.post("/api/vitals", data),
  getById:         (id)   => patientClient.get(`/api/vitals/${id}`),
  getByPatient:    (pid)  => patientClient.get(`/api/vitals/patient/${pid}`),
  delete:          (id)   => patientClient.delete(`/api/vitals/${id}`),
};

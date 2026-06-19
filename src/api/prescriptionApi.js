import { patientClient } from "./axiosClient";

// Gateway: /api/prescriptions/** -> prescription-service:4010 (StripPrefix=1)
export const prescriptionApi = {
  create:         (data) => patientClient.post("/api/prescriptions", data),
  getAll:         ()     => patientClient.get("/api/prescriptions"),
  getById:        (id)   => patientClient.get(`/api/prescriptions/${id}`),
  getByPatient:   (pid)  => patientClient.get(`/api/prescriptions/patient/${pid}`),
  update:         (id, data) => patientClient.put(`/api/prescriptions/${id}`, data),
  delete:         (id)   => patientClient.delete(`/api/prescriptions/${id}`),
};

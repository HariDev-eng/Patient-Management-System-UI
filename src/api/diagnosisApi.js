import { patientClient } from "./axiosClient";

// Gateway: /api/diagnoses/** -> diagnosis-service:4009 (StripPrefix=1)
export const diagnosisApi = {
  create:         (data) => patientClient.post("/api/diagnoses", data),
  getAll:         ()     => patientClient.get("/api/diagnoses"),
  getById:        (id)   => patientClient.get(`/api/diagnoses/${id}`),
  getByPatient:   (pid)  => patientClient.get(`/api/diagnoses/patient/${pid}`),
  getByDoctor:    (did)  => patientClient.get(`/api/diagnoses/doctor/${did}`),
  update:         (id, data) => patientClient.put(`/api/diagnoses/${id}`, data),
  delete:         (id)   => patientClient.delete(`/api/diagnoses/${id}`),
};

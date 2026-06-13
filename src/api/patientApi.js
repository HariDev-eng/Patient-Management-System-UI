import { patientClient } from "./axiosClient";

// Vite proxy: /patients -> http://localhost:4000
export const patientApi = {
  create:  (data) => patientClient.post("/patients", data),
  getAll:  ()     => patientClient.get("/patients"),
  getById: (id)   => patientClient.get(`/patients/${id}`),
  update:  (id, data) => patientClient.put(`/patients/${id}`, data),
  delete:  (id)   => patientClient.delete(`/patients/${id}`),
  search:  (name) => patientClient.get(`/patients/search?name=${name}`),
};

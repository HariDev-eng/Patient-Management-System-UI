import { doctorClient } from "./axiosClient";

// Gateway: /api/doctors/** -> doctor-service:4006
// StripPrefix=1 strips /api, so doctor-service receives /doctors/**
export const doctorApi = {
  create:              (data)     => doctorClient.post("/api/doctors", data),
  getAll:              ()         => doctorClient.get("/api/doctors"),
  getById:             (id)       => doctorClient.get(`/api/doctors/${id}`),
  update:              (id, data) => doctorClient.put(`/api/doctors/${id}`, data),
  delete:              (id)       => doctorClient.delete(`/api/doctors/${id}`),
  // doctor-service receives: /doctors/search?specialization=CARDIOLOGIST
  getBySpecialization: (spec)     => doctorClient.get(`/api/doctors/search?specialization=${spec}`),
  getAvailability:     (id)       => doctorClient.get(`/api/doctors/${id}/availability`),
};

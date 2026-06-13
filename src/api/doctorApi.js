import { doctorClient } from "./axiosClient";

export const doctorApi = {
  create:              (data)   => doctorClient.post("/doctors", data),
  getAll:              ()       => doctorClient.get("/doctors"),
  getById:             (id)     => doctorClient.get(`/doctors/${id}`),
  update:              (id, data) => doctorClient.patch(`/doctors/${id}`, data),
  delete:              (id)     => doctorClient.delete(`/doctors/${id}`),
  getBySpecialization: (spec)   => doctorClient.get(`/doctors/search?specialization=${spec}`),
  getAvailability:     (id)     => doctorClient.get(`/doctors/${id}/availability`),
};

import axiosClient from "./axiosClient";

export const getPatients = () =>
    axiosClient.get("/api/patients");

export const getPatientById = (id) =>
    axiosClient.get(`/api/patients/${id}`);

export const createPatient = (data) =>
    axiosClient.post("/api/patients", data);

export const updatePatient = (id, data) =>
    axiosClient.put(`/api/patients/${id}`, data);

export const deletePatient = (id) =>
    axiosClient.delete(`/api/patients/${id}`);
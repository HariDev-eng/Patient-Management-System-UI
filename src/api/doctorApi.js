import axiosClient from "./axiosClient";

export const getDoctors = () =>
    axiosClient.get("/api/doctors");

export const getDoctorById = (id) =>
    axiosClient.get(`/api/doctors/${id}`);

export const createDoctor = (data) =>
    axiosClient.post("/api/doctors", data);

export const updateDoctor = (id, data) =>
    axiosClient.put(`/api/doctors/${id}`, data);

export const deleteDoctor = (id) =>
    axiosClient.delete(`/api/doctors/${id}`);
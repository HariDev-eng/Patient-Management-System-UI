import axiosClient from "./axiosClient";

export const getAppointments = () =>
    axiosClient.get("/api/appointment");

export const getAppointmentById = (id) =>
    axiosClient.get(`/api/appointment/${id}`);

export const createAppointment = (data) =>
    axiosClient.post("/api/appointment", data);

export const updateAppointment = (
    id,
    status,
    data
) =>
    axiosClient.put(
        `/api/appointment/${id}?status=${status}`,
        data
    );

export const deleteAppointment = (id) =>
    axiosClient.delete(`/api/appointment/${id}`);
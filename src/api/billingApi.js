import axiosClient from "./axiosClient";

export const getBills = () =>
    axiosClient.get("/api/billing");

export const getBillById = (id) =>
    axiosClient.get(`/api/billing/${id}`);

export const createBill = (data) =>
    axiosClient.post("/api/billing", data);

export const updateBill = (id, data) =>
    axiosClient.put(`/api/billing/${id}`, data);

export const deleteBill = (id) =>
    axiosClient.delete(`/api/billing/${id}`);
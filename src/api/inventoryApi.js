import axiosClient from "./axiosClient";

export const getInventoryItems = () =>
    axiosClient.get("/api/inventory");

export const getInventoryItemById = (id) =>
    axiosClient.get(`/api/inventory/${id}`);

export const createInventoryItem = (data) =>
    axiosClient.post("/api/inventory", data);

export const updateInventoryItem = (
    id,
    data
) =>
    axiosClient.put(`/api/inventory/${id}`, data);

export const deleteInventoryItem = (id) =>
    axiosClient.delete(`/api/inventory/${id}`);
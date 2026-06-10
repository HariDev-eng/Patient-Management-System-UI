import axiosClient from "./axiosClient";

export const login = (data) =>
    axiosClient.post("/auth/login", data);

export const signup = (data) =>
    axiosClient.post("/auth/register", data);

export const getCurrentUser = () =>
    axiosClient.get("/auth/me");
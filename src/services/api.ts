import axios from "axios";
import { env } from "../config/env";
import { tokenStorage } from "./token";

export const api = axios.create({
  baseURL: env.apiUrl,
});

api.interceptors.request.use((config) => {
  const token = tokenStorage.get();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 && tokenStorage.hasToken()) {
      tokenStorage.clear();
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

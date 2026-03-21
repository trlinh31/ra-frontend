import { env } from "@/configs/env";
import axios, { type AxiosInstance, type InternalAxiosRequestConfig } from "axios";

export const http: AxiosInstance = axios.create({
  baseURL: env.baseUrl,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

http.interceptors.request.use(
  async (config: InternalAxiosRequestConfig) => {
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

http.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    return Promise.reject(error);
  }
);

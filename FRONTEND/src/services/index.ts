import axios from "axios";
import { getCookie, deleteCookie } from "cookies-next/client";

import { queryClient } from "@/src/lib/react-query/queryClient";

const ACCESS_TOKEN = "access_token";
const NESTJS_API_BASE = "/nestjs/api/v1";

const axiosClient = axios.create({
  baseURL: NESTJS_API_BASE,
  timeout: 30000,
  headers: { "Content-Type": "application/json" },
});

const logout = () => {
  deleteCookie(ACCESS_TOKEN);
  queryClient.clear();
  window.location.reload();
};

axiosClient.interceptors.request.use((config) => {
  const token = getCookie(ACCESS_TOKEN);
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

axiosClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      logout();
    }
    return Promise.reject(error);
  },
);

export default axiosClient;

import { deleteCookie } from "cookies-next/client";

import { queryClient } from "@/src/lib/react-query/queryClient";
import axiosClient from "@/src/services";

const ACCESS_TOKEN = "access_token";

export const registerUser = (data: any): Promise<any> => {
  return axiosClient.post("/auth/register", data);
};

export const loginUser = (data: any): Promise<any> => {
  return axiosClient.post("/auth/login", data);
};

export const logoutUser = async (): Promise<any> => {
  // Try calling backend logout if available, but don't fail if it errors
  try {
    await axiosClient.post("/auth/logout");
  } catch (err) {
    // ignore backend logout errors
  }

  // Remove access token cookie used by axiosClient interceptors
  try {
    deleteCookie(ACCESS_TOKEN, { path: "/" });
  } catch (e) {
    // ignore
  }

  // Clear react-query cache
  try {
    queryClient.clear();
  } catch (e) {
    // ignore
  }

  // Also remove legacy localStorage keys if present
  try {
    if (typeof window !== "undefined") {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
    }
  } catch (e) {
    // ignore
  }

  return { success: true };
};

export const forgotPassword = (email: string): Promise<any> => {
  return axiosClient.post("/auth/forgot-password", { email });
};

export const resetPassword = (
  token: string,
  newPassword: string,
): Promise<any> => {
  return axiosClient.post("/auth/reset-password", { token, newPassword });
};

export const getQR = (text: string): Promise<any> => {
  // Mock QR or call backend QR generator if it maps to event.
  // GHN or Event generation has its own QR path.
  return Promise.resolve({ success: true, data: { qrCode: text } });
};

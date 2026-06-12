import { deleteCookie } from "cookies-next/client";
import QRCode from "qrcode";

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
  // Clear access token and potential refresh token cookies
  try {
    deleteCookie(ACCESS_TOKEN, { path: "/" });
    deleteCookie("refresh_token", { path: "/" });
  } catch (e) {
    // ignore
  }

  // Clear react-query cache
  try {
    queryClient.clear();
  } catch (e) {
    // ignore
  }

  // Clear user-related local storage items
  try {
    if (typeof window !== "undefined") {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      localStorage.removeItem("user_avatar_url");
      localStorage.removeItem("partner_profile_meta");
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

export const getQR = async (text: string): Promise<any> => {
  try {
    const url = await QRCode.toDataURL(text, { margin: 1, width: 300 });
    return { success: true, data: url };
  } catch (error: any) {
    console.error("Failed to generate QR code:", error);
    return { success: false, message: error?.message || "Failed to generate QR code" };
  }
};

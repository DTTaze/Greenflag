import axiosClient from "@/src/services";
import { ApiResponse } from "@/src/types/api";
import {
  LoginPayload,
  RegisterPayload,
  VerifyOtpPayload,
  ResendEmailPayload,
  ForgotPasswordPayload,
  ResetPasswordPayload,
  ChangePasswordPayload,
} from "@/src/types/auth/auth.payload";
import { AuthResponse } from "@/src/types/auth/auth.response";
import { UserType } from "@/src/types/user/user.type";

/** Auth service layer interfacing with NestJS backend */
export const login = async (
  payload: LoginPayload,
): Promise<ApiResponse<AuthResponse>> => {
  return axiosClient.post("/auth/login", payload);
};

export const register = async (
  payload: RegisterPayload,
): Promise<ApiResponse<any>> => {
  return axiosClient.post("/auth/register", payload);
};

export const verifyOtp = async (
  payload: VerifyOtpPayload,
): Promise<ApiResponse<any>> => {
  return axiosClient.post("/auth/verify-otp", payload);
};

export const resendEmail = async (
  payload: ResendEmailPayload,
): Promise<ApiResponse<any>> => {
  return axiosClient.post("/auth/resend-email", payload);
};

export const forgotPassword = async (
  payload: ForgotPasswordPayload,
): Promise<ApiResponse<any>> => {
  return axiosClient.post("/auth/forgot-password", payload);
};

export const resetPassword = async (
  payload: ResetPasswordPayload,
): Promise<ApiResponse<any>> => {
  return axiosClient.post("/auth/reset-password", payload);
};

export const changePassword = async (
  payload: ChangePasswordPayload,
): Promise<ApiResponse<any>> => {
  return axiosClient.post("/auth/change-password", payload);
};

export const whoAmI = async (): Promise<ApiResponse<UserType>> => {
  return axiosClient.get("/auth/whoami");
};

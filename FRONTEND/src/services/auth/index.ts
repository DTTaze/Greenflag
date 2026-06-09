import axiosClient from "@/src/services";
import { ApiResponse } from "@/src/types/api";
import { LoginPayload, RegisterPayload, VerifyOtpPayload, ResendEmailPayload, ForgotPasswordPayload, ResetPasswordPayload, ChangePasswordPayload } from "@/src/types/auth/auth.payload";
import { SuccessResponse } from "@/src/types/auth/auth.response";

/** Auth service layer interfacing with NestJS backend */
export const login = async (payload: LoginPayload): Promise<ApiResponse<SuccessResponse<any>>> => {
  return axiosClient.post("/auth/login", payload);
};

export const register = async (payload: RegisterPayload): Promise<ApiResponse<SuccessResponse<any>>> => {
  return axiosClient.post("/auth/register", payload);
};

export const verifyOtp = async (payload: VerifyOtpPayload): Promise<ApiResponse<SuccessResponse<any>>> => {
  return axiosClient.post("/auth/verify-otp", payload);
};

export const resendEmail = async (payload: ResendEmailPayload): Promise<ApiResponse<SuccessResponse<any>>> => {
  return axiosClient.post("/auth/resend-email", payload);
};

export const forgotPassword = async (payload: ForgotPasswordPayload): Promise<ApiResponse<SuccessResponse<any>>> => {
  return axiosClient.post("/auth/forgot-password", payload);
};

export const resetPassword = async (payload: ResetPasswordPayload): Promise<ApiResponse<SuccessResponse<any>>> => {
  return axiosClient.post("/auth/reset-password", payload);
};

export const changePassword = async (payload: ChangePasswordPayload): Promise<ApiResponse<SuccessResponse<any>>> => {
  return axiosClient.patch("/auth/change-password", payload);
};

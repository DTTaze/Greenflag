import { login, register, verifyOtp, resendEmail, forgotPassword, resetPassword, changePassword } from '@/src/services/auth';

export const loginFn = async (payload: any) => {
  return login(payload);
};

export const registerFn = async (payload: any) => {
  return register(payload);
};

export const verifyOtpFn = async (payload: any) => {
  return verifyOtp(payload);
};

export const resendEmailFn = async (payload: any) => {
  return resendEmail(payload);
};

export const forgotPasswordFn = async (payload: any) => {
  return forgotPassword(payload);
};

export const resetPasswordFn = async (payload: any) => {
  return resetPassword(payload);
};

export const changePasswordFn = async (payload: any) => {
  return changePassword(payload);
};

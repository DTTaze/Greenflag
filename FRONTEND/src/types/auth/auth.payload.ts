export interface LoginPayload {
  usernameOrEmail: string;
  password: string;
}

export interface RegisterPayload {
  email: string;
  username: string;
  password: string;
}

export interface VerifyOtpPayload {
  usernameOrEmail: string;
  code: string;
  action: "register" | "reset_password";
}

export interface ResendEmailPayload {
  email: string;
}

export interface ForgotPasswordPayload {
  email: string;
}

export interface ResetPasswordPayload {
  email: string;
  newPassword: string;
  confirmNewPassword: string;
  otpCode: string;
}

export interface ChangePasswordPayload {
  oldPassword?: string;
  newPassword: string;
}

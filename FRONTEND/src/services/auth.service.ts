import axiosClient from "@/src/services";

export const registerUser = (data: any): Promise<any> => {
  return axiosClient.post("/auth/register", data);
};

export const loginUser = (data: any): Promise<any> => {
  return axiosClient.post("/auth/login", data);
};

export const logoutUser = (): Promise<any> => {
  // logout handles cache/cookie clearing on frontend
  return Promise.resolve({ success: true });
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

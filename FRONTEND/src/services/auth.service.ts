import axios from "@/src/utils/axios.customize";

export const registerUser = (data: any): Promise<any> => {
  return axios.post("api/auth/register", data);
};

export const loginUser = (data: any): Promise<any> => {
  return axios.post("api/auth/login", data);
};

export const logoutUser = (): Promise<any> => {
  return axios.post("api/auth/logout");
};

export const forgotPassword = (email: string): Promise<any> => {
  return axios.post("/api/auth/forgot_password", { email });
};

export const resetPassword = (
  token: string,
  newPassword: string,
): Promise<any> => {
  return axios.post("/api/auth/reset_password", { token, newPassword });
};

export const getQR = (text: string): Promise<any> => {
  return axios.get("api/qr", {
    params: { text },
  });
};

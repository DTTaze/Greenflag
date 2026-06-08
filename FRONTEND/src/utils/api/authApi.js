import axios from "../axios.customize";

export const createUserApi = (data) => {
  return axios.post("api/auth/register", data);
};

export const loginUserApi = (data) => {
  return axios.post("api/auth/login", data);
};

export const logoutUserApi = () => {
  return axios.post("api/auth/logout");
};

export const forgotPasswordApi = (email) => {
  return axios.post("/api/auth/forgot_password", { email });
};

export const resetPasswordApi = (token, newPassword) => {
  return axios.post("/api/auth/reset_password", { token, newPassword });
};

export const getQRApi = (text) => {
  return axios.get("api/qr", {
    params: { text },
  });
};

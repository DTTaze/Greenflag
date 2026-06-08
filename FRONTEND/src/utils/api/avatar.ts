import axios from "../axios.customize";

export const uploadUserAvatar = (userId: string | number, file: File) => {
  const formData = new FormData();
  formData.append("avatar", file);

  return axios.post(`api/avatars/upload/${userId}`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

export const getUserAvatarById = (userId: string | number) => {
  return axios.get(`api/avatars/${userId}`);
};

export const updateUserAvatar = (userId: string | number, file: File) => {
  const formData = new FormData();
  formData.append("avatar", file);

  return axios.put(`api/avatars/${userId}`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

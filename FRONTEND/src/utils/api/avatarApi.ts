import axios from "../axios.customize";

export const uploadUserAvatarApi = (user_id: string | number, file: File) => {
  const formData = new FormData();
  formData.append("avatar", file);

  return axios.post(`api/avatars/upload/${user_id}`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

export const getUserAvatarByIdApi = (user_id: string | number) => {
  return axios.get(`api/avatars/${user_id}`);
};

export const getAllUserAvatarsApi = () => {
  return axios.get("api/avatars/");
};

export const updateUserAvatarApi = (user_id: string | number, file: File) => {
  const formData = new FormData();
  formData.append("avatar", file);

  return axios.put(`api/avatars/${user_id}`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

export const deleteUserAvatarApi = (user_id: string | number) => {
  return axios.delete(`api/avatars/${user_id}`);
};

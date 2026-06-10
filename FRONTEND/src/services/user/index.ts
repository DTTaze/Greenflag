import axiosClient from "@/src/services";
import { UpdateCoinPayload } from "@/src/types/user/user.payload";
import { UserType } from "@/src/types/user/user.type";

export const UserService = {
  // --- Profile Actions ---
  getProfile: (): Promise<any> => axiosClient.get("/users/me"),

  updateProfile: (data: Partial<UserType>): Promise<any> => axiosClient.put("/users/me", data),

  updateAvatar: (file: File): Promise<any> => {
    const formData = new FormData();
    formData.append("avatar", file);
    return axiosClient.put("/users/me/avatar", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  },

  // --- Task & Item integration ---
  getUserTasksCompleted: (): Promise<any> => axiosClient.get("/users/task/completed"),

  getUserAllTasks: (userId: string): Promise<any> => axiosClient.get(`/users/tasks/all/${userId}`),

  getUserItems: (userId: string): Promise<any> => axiosClient.get(`/users/items/${userId}`),

  // --- Admin User Actions ---
  adminGetAllUsers: (): Promise<any> => axiosClient.get("/admin/users"),

  adminGetUserById: (id: string): Promise<any> => axiosClient.get(`/admin/users/${id}`),

  adminUpdateUser: (id: string, data: any): Promise<any> =>
    axiosClient.put(`/admin/users/${id}`, data),

  adminDeleteUser: (id: string): Promise<any> => axiosClient.delete(`/admin/users/${id}`),

  // --- Ranks ---
  getRank: (id: string): Promise<any> => axiosClient.get(`/ranks/${id}`),

  adminRearrangeRanks: (): Promise<any> => axiosClient.post("/admin/ranks/rearrange"),

  // --- Coins ---
  getCoin: (id: string): Promise<any> => axiosClient.get(`/coins/${id}`),

  adminUpdateCoin: (id: string, payload: UpdateCoinPayload): Promise<any> =>
    axiosClient.put(`/admin/coins/${id}`, payload),

  adminIncreaseCoin: (id: string, payload: UpdateCoinPayload): Promise<any> =>
    axiosClient.put(`/admin/coins/${id}/increase`, payload),

  adminDecreaseCoin: (id: string, payload: UpdateCoinPayload): Promise<any> =>
    axiosClient.put(`/admin/coins/${id}/decrease`, payload),
};

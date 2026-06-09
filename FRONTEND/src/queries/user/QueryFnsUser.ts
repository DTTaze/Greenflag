import axiosClient from "@/src/services";
import { ApiResponse } from "@/src/types/api";
import { UserType } from "@/src/types/user/user.type";

export const fetchUserProfile = async (
  userId: string,
): Promise<ApiResponse<UserType>> => {
  return axiosClient.get(`/user/${userId}`);
};

export const updateUserProfile = async (
  userId: string,
  data: Partial<UserType>,
): Promise<ApiResponse<UserType>> => {
  return axiosClient.patch(`/user/${userId}`, data);
};

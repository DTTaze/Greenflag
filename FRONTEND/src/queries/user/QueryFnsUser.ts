import {
  adminGetAllUsersHandler,
  adminGetUserByIdHandler,
  getCoinHandler,
  getProfileHandler,
  getRankHandler,
  getUserAllTasksHandler,
  getUserItemsHandler,
  getUserTasksCompletedHandler,
} from "@/src/services/user/userHandlers";
import { CoinType, RankType, UserType } from "@/src/types/user/user.type";

export const fetchUserProfileQueryFn = async (): Promise<UserType> => {
  const response = await getProfileHandler();
  if (!response.success) {
    throw new Error(response.message || "Failed to fetch user profile");
  }
  return response.data;
};

export const getUserTasksCompletedQueryFn = async (): Promise<any[]> => {
  const response = await getUserTasksCompletedHandler();
  if (!response.success) {
    throw new Error(response.message || "Failed to fetch completed tasks");
  }
  return response.data;
};

export const getUserAllTasksQueryFn = async (
  userId: string,
): Promise<any[]> => {
  const response = await getUserAllTasksHandler(userId);
  if (!response.success) {
    throw new Error(response.message || "Failed to fetch user tasks");
  }
  return response.data;
};

export const getUserItemsQueryFn = async (userId: string): Promise<any[]> => {
  const response = await getUserItemsHandler(userId);
  if (!response.success) {
    throw new Error(response.message || "Failed to fetch user items");
  }
  return response.data;
};

export const adminGetAllUsersQueryFn = async (): Promise<UserType[]> => {
  const response = await adminGetAllUsersHandler();
  if (!response.success) {
    throw new Error(response.message || "Failed to fetch users");
  }
  return response.data;
};

export const adminGetUserByIdQueryFn = async (
  id: string,
): Promise<UserType> => {
  const response = await adminGetUserByIdHandler(id);
  if (!response.success) {
    throw new Error(response.message || "Failed to fetch user by ID");
  }
  return response.data;
};

export const getRankQueryFn = async (id: string): Promise<RankType> => {
  const response = await getRankHandler(id);
  if (!response.success) {
    throw new Error(response.message || "Failed to fetch rank");
  }
  return response.data;
};

export const getCoinQueryFn = async (id: string): Promise<CoinType> => {
  const response = await getCoinHandler(id);
  if (!response.success) {
    throw new Error(response.message || "Failed to fetch coin balance");
  }
  return response.data;
};

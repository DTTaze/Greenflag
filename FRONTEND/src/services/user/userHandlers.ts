import { ApiResponse } from "@/src/types/api";
import { UpdateCoinPayload } from "@/src/types/user/user.payload";
import { CoinType, RankType, UserType } from "@/src/types/user/user.type";

import { UserService } from ".";

// --- Profile Handlers ---

export const getProfileHandler = async (): Promise<ApiResponse<UserType>> => {
  return UserService.getProfile();
};

export const updateProfileHandler = async (
  data: Partial<UserType>,
): Promise<ApiResponse<UserType>> => {
  return UserService.updateProfile(data);
};

export const updateAvatarHandler = async (
  file: File,
): Promise<ApiResponse<UserType>> => {
  return UserService.updateAvatar(file);
};

export const getUserByIdHandler = async (
  id: string,
): Promise<ApiResponse<UserType>> => {
  return UserService.getUserById(id);
};

// --- Task & Item Integration ---

export const getUserTasksCompletedHandler = async (): Promise<
  ApiResponse<any[]>
> => {
  return UserService.getUserTasksCompleted();
};

export const getUserAllTasksHandler = async (
  userId: string,
): Promise<ApiResponse<any[]>> => {
  return UserService.getUserAllTasks(userId);
};

export const getUserItemsHandler = async (
  userId: string,
): Promise<ApiResponse<any[]>> => {
  return UserService.getUserItems(userId);
};

// --- Admin User Handlers ---

export const adminGetAllUsersHandler = async (
  showDeleted?: boolean,
): Promise<ApiResponse<UserType[]>> => {
  return UserService.adminGetAllUsers(showDeleted);
};

export const adminGetUserByIdHandler = async (
  id: string,
): Promise<ApiResponse<UserType>> => {
  return UserService.adminGetUserById(id);
};

export const adminUpdateUserHandler = async (
  id: string,
  data: any,
): Promise<ApiResponse<UserType>> => {
  return UserService.adminUpdateUser(id, data);
};

export const adminDeleteUserHandler = async (
  id: string,
): Promise<ApiResponse<void>> => {
  return UserService.adminDeleteUser(id);
};

export const adminCreateUserHandler = async (
  data: any,
): Promise<ApiResponse<UserType>> => {
  return UserService.adminCreateUser(data);
};

export const adminRestoreUserHandler = async (
  id: string,
): Promise<ApiResponse<UserType>> => {
  return UserService.adminRestoreUser(id);
};

export const adminHardDeleteUserHandler = async (
  id: string,
): Promise<ApiResponse<void>> => {
  return UserService.adminHardDeleteUser(id);
};

// --- Rank Handlers ---

export const getRankHandler = async (
  id: string,
): Promise<ApiResponse<RankType>> => {
  return UserService.getRank(id);
};

export const adminRearrangeRanksHandler = async (): Promise<
  ApiResponse<void>
> => {
  return UserService.adminRearrangeRanks();
};

// --- Coin Handlers ---

export const getCoinHandler = async (
  id: string,
): Promise<ApiResponse<CoinType>> => {
  return UserService.getCoin(id);
};

export const adminUpdateCoinHandler = async (
  id: string,
  payload: UpdateCoinPayload,
): Promise<ApiResponse<CoinType>> => {
  return UserService.adminUpdateCoin(id, payload);
};

export const adminIncreaseCoinHandler = async (
  id: string,
  payload: UpdateCoinPayload,
): Promise<ApiResponse<CoinType>> => {
  return UserService.adminIncreaseCoin(id, payload);
};

export const adminDecreaseCoinHandler = async (
  id: string,
  payload: UpdateCoinPayload,
): Promise<ApiResponse<CoinType>> => {
  return UserService.adminDecreaseCoin(id, payload);
};

export enum UserRole {
  ADMIN = "admin",
  PARTNER = "partner",
  USER = "user",
}

export enum UserStatus {
  ACTIVE = "active",
  SUSPENDED = "suspended",
  INACTIVE = "inactive",
  DELETED = "deleted",
}

export interface UserProfileType {
  fullName?: string;
  phoneNumber?: string;
  streak: number;
  lastCompletedTask?: string;
}

export interface UserCoinType {
  amount: number;
}

export interface UserType {
  id: string;
  email: string;
  username: string;
  role: UserRole;
  status: UserStatus;
  avatarUrl?: string;
  profile?: UserProfileType;
  coin?: UserCoinType;
}

export interface RankType {
  id: string;
  userId?: string;
  amount: number;
  order: number;
  createdAt: string;
  updatedAt: string;
  user?: UserType;
}

export interface CoinType {
  id: string;
  userId: string;
  amount: number;
  createdAt: string;
  updatedAt: string;
  user?: UserType;
}

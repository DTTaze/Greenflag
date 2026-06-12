import { UserType } from "../user/user.type";

export interface AdminUserDTO extends UserType {
  isLocked: boolean;
  lockReason?: string;
  lastActivityDate?: string;
}

export interface AdminUpdateUserPayload {
  email?: string;
  username?: string;
  fullName?: string;
  phoneNumber?: string;
  role?: string;
  status?: string;
  coinAdjustment?: number;
  coinAdjustmentReason?: string;
}

export interface LockAccountPayload {
  isLocked: boolean;
  reason?: string;
}

export interface UserRankDTO {
  userId: string;
  rankLevel: number;
  rankName: string;
  requiredPoints: number;
  currentPoints: number;
  achievedAt?: string;
}

export interface RearrangeRanksDTO {
  ranks: Array<{
    userId: string;
    rankLevel: number;
  }>;
}

export interface UserCoinDTO {
  userId: string;
  amount: number;
  lastUpdated: string;
}

export interface UpdateCoinDTO {
  amount: number;
  reason?: string;
}

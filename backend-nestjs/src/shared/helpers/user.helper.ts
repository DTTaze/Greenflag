import { User } from '@modules/user/entities/user.entity';

import { UserAuthProfile } from '@shared/interfaces';

export function extractUserPublicInfo(user: User): UserAuthProfile {
  return {
    id: user.id,
    role: user.role,
    username: user.username,
    email: user.email,
    fullName: user.profile?.fullName,
    phoneNumber: user.profile?.phoneNumber,
    streak: user.profile?.streak,
    lastCompletedTask: user.profile?.lastCompletedTask,
    avatarUrl: user.avatarUrl,
    coins: user.coin ? { amount: user.coin.amount } : undefined,
    birthDate: user.metadata?.birthDate,
    gender: user.metadata?.gender,
  };
}

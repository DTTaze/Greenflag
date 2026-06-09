import { Repository } from 'typeorm';

import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { ROLE } from '@shared/enums';
import {
  OperationResult,
  generateSuccessResult,
} from '@shared/helpers/operation-result.helper';
import { BaseCRUDService } from '@shared/services/base-crud.service';

import { Coin } from '../entities/coin.entity';
import { Rank } from '../entities/rank.entity';
import { UserProfile } from '../entities/user-profile.entity';
import { UserSocialAccount } from '../entities/user-social-account.entity';
import { User } from '../entities/user.entity';

@Injectable()
export class UserSocialAccountService extends BaseCRUDService<UserSocialAccount> {
  constructor(
    @InjectRepository(UserSocialAccount)
    private readonly userSocialAccountRepository: Repository<UserSocialAccount>,
  ) {
    super(userSocialAccountRepository);
  }

  async findOrCreateUser(profile: any): Promise<OperationResult<User>> {
    const email = profile.emails[0].value;
    const googleId = profile.id;
    const displayName = profile.displayName;

    const existingUser = await this.model.manager.findOne(User, {
      where: { email },
      relations: ['profile', 'coin', 'rank', 'socialAccounts'],
    });

    if (existingUser) {
      // Check if social account is already linked
      const hasSocial = existingUser.socialAccounts?.some(
        (s) => s.provider === 'google' && s.providerUserId === googleId,
      );

      if (!hasSocial) {
        const social = this.model.create({
          userId: existingUser.id,
          provider: 'google',
          providerUserId: googleId,
        });
        await this.model.save(social);
      }
      return generateSuccessResult(existingUser);
    }

    const savedUser = await this.model.manager.transaction(
      async (transactionalEntityManager) => {
        // 1. Calculate max order for Rank
        const maxRank = await transactionalEntityManager.findOne(Rank, {
          where: {},
          order: { order: 'DESC' },
        });
        const newOrder = maxRank ? maxRank.order + 1 : 1;

        // 2. Create User (Default role = ROLE.USER)
        const user = transactionalEntityManager.create(User, {
          email,
          username: displayName,
          role: ROLE.USER,
        });
        const savedUser = await transactionalEntityManager.save(User, user);

        // 3. Create UserProfile
        const userProfile = transactionalEntityManager.create(UserProfile, {
          userId: savedUser.id,
          fullName: displayName,
          streak: 0,
        });
        await transactionalEntityManager.save(UserProfile, userProfile);

        // 4. Create Social Account Link
        const social = transactionalEntityManager.create(UserSocialAccount, {
          userId: savedUser.id,
          provider: 'google',
          providerUserId: googleId,
        });
        await transactionalEntityManager.save(UserSocialAccount, social);

        // 5. Create Rank
        const rank = transactionalEntityManager.create(Rank, {
          amount: 0,
          order: newOrder,
          userId: savedUser.id,
        });
        await transactionalEntityManager.save(Rank, rank);

        // 6. Create Coin
        const coin = transactionalEntityManager.create(Coin, {
          amount: 0,
          userId: savedUser.id,
        });
        await transactionalEntityManager.save(Coin, coin);

        // Return the saved user
        const resultUser = await transactionalEntityManager.findOne(User, {
          where: { id: savedUser.id },
          relations: ['profile', 'coin', 'rank'],
        });

        if (resultUser) {
          delete resultUser.password;
        }
        return resultUser!;
      },
    );

    return generateSuccessResult(savedUser);
  }
}

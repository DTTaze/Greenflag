import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { TaskModule } from '@modules/task/task.module';

import { Coin } from './entities/coin.entity';
import { Rank } from './entities/rank.entity';
import { UserProfile } from './entities/user-profile.entity';
import { UserSocialAccount } from './entities/user-social-account.entity';
import { User } from './entities/user.entity';
import { UserProfileService } from './services/user-profile.service';
import { UserSocialAccountService } from './services/user-social-account.service';
import { UserService } from './services/user.service';
import { UserController } from './user.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      User,
      Rank,
      Coin,
      UserProfile,
      UserSocialAccount,
    ]),
    TaskModule,
  ],
  controllers: [UserController],
  providers: [UserService, UserProfileService, UserSocialAccountService],
  exports: [UserService, UserProfileService, UserSocialAccountService],
})
export class UserModule {}

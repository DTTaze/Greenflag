import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { CloudinaryModule } from '@modules/cloudinary/cloudinary.module';
import { CommerceModule } from '@modules/commerce/commerce.module';
import { TaskModule } from '@modules/task/task.module';

import { CoinController } from './controllers/coin.controller';
import { RankController } from './controllers/rank.controller';
import { UserController } from './controllers/user.controller';
import { Coin } from './entities/coin.entity';
import { Rank } from './entities/rank.entity';
import { UserProfile } from './entities/user-profile.entity';
import { UserSocialAccount } from './entities/user-social-account.entity';
import { User } from './entities/user.entity';
import { CoinService } from './services/coin.service';
import { RankService } from './services/rank.service';
import { UserProfileService } from './services/user-profile.service';
import { UserSocialAccountService } from './services/user-social-account.service';
import { UserService } from './services/user.service';

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
    CloudinaryModule,
    CommerceModule,
  ],
  controllers: [UserController, CoinController, RankController],
  providers: [
    UserService,
    UserProfileService,
    UserSocialAccountService,
    CoinService,
    RankService,
  ],
  exports: [
    UserService,
    UserProfileService,
    UserSocialAccountService,
    CoinService,
    RankService,
  ],
})
export class UserModule {}

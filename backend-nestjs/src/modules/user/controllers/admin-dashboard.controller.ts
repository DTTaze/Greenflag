import { HttpResponse } from 'mvc-common-toolkit';
import { IsNull, Not } from 'typeorm';

import { Controller, Get, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

import { Event } from '@modules/event/entities/event.entity';
import { Post } from '@modules/forum/entities/post.entity';

import { Roles } from '@shared/decorators/roles.decorator';
import { EVENT_STATUS, FORUM_POST_STATUS, ROLE } from '@shared/enums';
import { AuthGuard } from '@shared/guards/auth.guard';
import { RolesGuard } from '@shared/guards/roles.guard';

import { Coin } from '../entities/coin.entity';
import { UserService } from '../services/user.service';

@ApiTags('Admin Dashboard')
@ApiBearerAuth()
@Controller('admin/dashboard')
@UseGuards(AuthGuard, RolesGuard)
@Roles(ROLE.ADMIN)
export class AdminDashboardController {
  constructor(private readonly userService: UserService) {}

  @Get('macro-stats')
  async getMacroStats(): Promise<HttpResponse> {
    const manager = this.userService.model.manager;

    const [totalUsers, activeEvents, pendingPosts, coinsSumResult] =
      await Promise.all([
        this.userService.model.count({
          where: { deletedAt: IsNull() },
        }),
        manager.getRepository(Event).count({
          where: { status: Not(EVENT_STATUS.FINISHED) },
        }),
        manager.getRepository(Post).count({
          where: { status: FORUM_POST_STATUS.PENDING },
        }),
        manager
          .getRepository(Coin)
          .createQueryBuilder('coin')
          .select('SUM(coin.amount)', 'sum')
          .getRawOne(),
      ]);

    const totalCoins = coinsSumResult?.sum
      ? parseInt(coinsSumResult.sum, 10)
      : 0;

    return {
      success: true,
      data: {
        totalUsers,
        activeEvents,
        pendingPosts,
        totalCoins,
      },
    };
  }
}

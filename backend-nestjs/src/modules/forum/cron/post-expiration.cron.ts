import { Repository } from 'typeorm';

import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { InjectRepository } from '@nestjs/typeorm';

import { SystemConfigService } from '@modules/system-config/system-config.service';

import { FORUM_POST_STATUS, SYSTEM_CONFIG_KEY } from '@shared/enums';

import { Post } from '../entities/post.entity';

@Injectable()
export class PostExpirationCron {
  private readonly logger = new Logger(PostExpirationCron.name);

  constructor(
    @InjectRepository(Post)
    private readonly postRepository: Repository<Post>,
    private readonly systemConfigService: SystemConfigService,
  ) {}

  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT, { timeZone: 'Asia/Ho_Chi_Minh' })
  async handleExpiredPosts() {
    this.logger.log('Running daily post expiration cron job...');

    // 1. Get expire days from system configuration (default to 7 days)
    const expireDaysStr = await this.systemConfigService.get(
      SYSTEM_CONFIG_KEY.POST_EXPIRE_DAYS,
    );
    let expireDays = 7;
    if (expireDaysStr) {
      const parsed = parseInt(expireDaysStr, 10);
      if (!isNaN(parsed)) {
        expireDays = parsed;
      }
    }

    // 2. Calculate threshold date
    const thresholdDate = new Date();
    thresholdDate.setDate(thresholdDate.getDate() - expireDays);

    this.logger.log(
      `Expiring pending posts created before ${thresholdDate.toISOString()} (Threshold: ${expireDays} days)`,
    );

    // 3. Update status: PENDING -> EXPIRED for posts older than the threshold
    try {
      const result = await this.postRepository
        .createQueryBuilder()
        .update(Post)
        .set({
          status: FORUM_POST_STATUS.EXPIRED,
          flaggedReason: 'Quá hạn duyệt',
        })
        .where('status = :pendingStatus', {
          pendingStatus: FORUM_POST_STATUS.PENDING,
        })
        .andWhere('created_at < :thresholdDate', { thresholdDate })
        .execute();

      this.logger.log(
        `Successfully expired ${result.affected || 0} pending posts.`,
      );
    } catch (error) {
      this.logger.error(
        `Error during post expiration cron job: ${error.message}`,
      );
    }
  }
}

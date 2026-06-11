import { LessThan, Repository } from 'typeorm';

import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { InjectRepository } from '@nestjs/typeorm';

import { SystemConfigService } from '@modules/system-config/system-config.service';

import { FORUM_POST_STATUS, SYSTEM_CONFIG_KEY } from '@shared/enums';

import { Comment } from '../entities/comment.entity';
import { Post } from '../entities/post.entity';
import { PostEventHandlerService } from '../services/post-event-handler.service';

@Injectable()
export class ModerationCron {
  private readonly logger = new Logger(ModerationCron.name);

  constructor(
    @InjectRepository(Post)
    private readonly postRepository: Repository<Post>,
    @InjectRepository(Comment)
    private readonly commentRepository: Repository<Comment>,
    private readonly systemConfigService: SystemConfigService,
    private readonly postEventHandler: PostEventHandlerService,
  ) {}

  // Chạy định kỳ mỗi 5 phút một lần
  @Cron(CronExpression.EVERY_5_MINUTES)
  async handlePendingModeration() {
    this.logger.log('Starting background AI Moderation fallback sweep...');

    // 1. Kiểm tra xem tính năng quét nền có được bật không
    const isCronEnabled =
      (await this.systemConfigService.get(
        SYSTEM_CONFIG_KEY.AI_CRON_MODERATION_ENABLED,
      )) === 'true';

    if (!isCronEnabled) {
      this.logger.log('AI Cron Moderation is disabled. Skipping sweep.');
      return;
    }

    // 2. Lấy số phút trễ quét nền
    const delayMinutesStr = await this.systemConfigService.get(
      SYSTEM_CONFIG_KEY.AI_CRON_DELAY_MINUTES,
    );
    let delayMinutes = 15;
    if (delayMinutesStr) {
      const parsed = parseInt(delayMinutesStr, 10);
      if (!isNaN(parsed)) {
        delayMinutes = parsed;
      }
    }

    const cutoffTime = new Date(Date.now() - delayMinutes * 60 * 1000);
    this.logger.log(
      `Sweeping PENDING posts and comments created before ${cutoffTime.toISOString()} (Delay: ${delayMinutes} mins)...`,
    );

    // 3. Quét các bài viết (Posts) đang kẹt ở PENDING
    try {
      const pendingPosts = await this.postRepository.find({
        where: {
          status: FORUM_POST_STATUS.PENDING,
          createdAt: LessThan(cutoffTime),
        },
      });

      this.logger.log(
        `Found ${pendingPosts.length} pending posts to moderate.`,
      );

      for (const post of pendingPosts) {
        try {
          this.logger.log(
            `[Cron] Đang gửi bài viết ${post.id} cho AI duyệt lại...`,
          );
          await this.postEventHandler.handlePostCreated({ postId: post.id });
        } catch (error) {
          this.logger.error(
            `[Cron] Lỗi khi duyệt bài viết ${post.id}: ${error.message}`,
            error.stack,
          );
          // Tiếp tục vòng lặp cho các post khác, không làm ngắt tiến trình
        }
      }
    } catch (error) {
      this.logger.error(
        `Error during pending posts cron sweep: ${error.message}`,
        error.stack,
      );
    }

    // 4. Quét các bình luận (Comments) đang kẹt ở PENDING
    try {
      const pendingComments = await this.commentRepository.find({
        where: {
          status: FORUM_POST_STATUS.PENDING,
          createdAt: LessThan(cutoffTime),
        },
      });

      this.logger.log(
        `Found ${pendingComments.length} pending comments to moderate.`,
      );

      for (const comment of pendingComments) {
        try {
          this.logger.log(
            `[Cron] Đang gửi bình luận ${comment.id} cho AI duyệt lại...`,
          );
          await this.postEventHandler.handleCommentCreated({
            commentId: comment.id,
          });
        } catch (error) {
          this.logger.error(
            `[Cron] Lỗi khi duyệt bình luận ${comment.id}: ${error.message}`,
            error.stack,
          );
          // Tiếp tục vòng lặp cho các bình luận khác, không làm ngắt tiến trình
        }
      }
    } catch (error) {
      this.logger.error(
        `Error during pending comments cron sweep: ${error.message}`,
        error.stack,
      );
    }

    this.logger.log('Background AI Moderation fallback sweep completed.');
  }
}

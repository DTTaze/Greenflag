import { Job } from 'bullmq';
import { In, Not, Repository } from 'typeorm';

import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { User } from '@modules/user/entities/user.entity';

import { JOB_NAME, QUEUE_NAME } from '@shared/constants';

import { Notification, NotificationType } from '../entities/notification.entity';
import { NotificationGateway } from '../gateways/notification.gateway';

@Processor(QUEUE_NAME.NOTIFICATION)
export class NotificationProcessor extends WorkerHost {
  private readonly logger = new Logger(NotificationProcessor.name);

  constructor(
    @InjectRepository(Notification)
    private readonly notificationRepository: Repository<Notification>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly notificationGateway: NotificationGateway,
  ) {
    super();
  }

  public async process(job: Job<any, any, string>): Promise<any> {
    if (job.name !== JOB_NAME.BROADCAST_NOTIFICATION) {
      this.logger.warn(`Unknown job name: ${job.name}`);
      return;
    }

    const { type, content, link, senderId, recipientIds, excludeUserIds } = job.data;

    try {
      this.logger.log(`Processing background notification broadcast of type ${type}`);

      // Resolve senderInfo once outside the loop
      let senderInfo = null;
      if (senderId) {
        try {
          const sender = await this.userRepository.findOne({
            where: { id: senderId },
            relations: ['profile'],
          });
          if (sender) {
            senderInfo = {
              id: sender.id,
              username: sender.username,
              avatarUrl: sender.avatarUrl,
              fullName: sender.profile?.fullName,
            };
          }
        } catch (err) {
          this.logger.warn(`Failed to resolve sender info for ID ${senderId}: ${err.message}`);
        }
      }

      if (recipientIds && Array.isArray(recipientIds)) {
        // Option A: Targeted delivery to a specific list of user IDs
        await this.sendToRecipients(recipientIds, type, content, link, senderId, senderInfo);
      } else {
        // Option B: Broadcast to all users (excluding specified IDs)
        await this.broadcastToAll(type, content, link, senderId, excludeUserIds || [], senderInfo);
      }

      this.logger.log(`Successfully completed notification broadcast job of type ${type}`);
    } catch (error) {
      this.logger.error(`Failed to process notification job: ${error.message}`, error.stack);
      throw error;
    }
  }

  private async sendToRecipients(
    recipientIds: string[],
    type: NotificationType,
    content: string,
    link: string | null,
    senderId: string | null,
    senderInfo: any,
  ) {
    const chunkSize = 500;
    for (let i = 0; i < recipientIds.length; i += chunkSize) {
      const chunk = recipientIds.slice(i, i + chunkSize);
      
      try {
        // Build notifications for this chunk
        const notifications = chunk.map((recipientId) =>
          this.notificationRepository.create({
            recipientId,
            senderId,
            type,
            content,
            link,
            isRead: false,
          }),
        );

        // Bulk insert to database
        const insertResult = await this.notificationRepository.insert(notifications);

        // Emit WebSockets strictly to online users
        for (let index = 0; index < chunk.length; index++) {
          const recipientId = chunk[index];
          const hasActiveSocket = this.notificationGateway.server?.sockets?.adapter?.rooms?.has(recipientId);

          if (hasActiveSocket) {
            const savedId = insertResult.generatedMaps[index]?.id;
            const createdAt = insertResult.generatedMaps[index]?.createdAt;

            this.notificationGateway.sendToUser(recipientId, 'new_notification', {
              id: savedId,
              recipientId,
              type,
              content,
              link,
              isRead: false,
              createdAt,
              sender: senderInfo,
            });
          }
        }
      } catch (chunkError) {
        // Safe chunk execution: log error to prevent interrupting other chunks
        this.logger.error(
          `Error occurred in sendToRecipients chunk [${i} to ${i + chunk.length}]: ${chunkError.message}`,
        );
      }
    }
  }

  private async broadcastToAll(
    type: NotificationType,
    content: string,
    link: string | null,
    senderId: string | null,
    excludeUserIds: string[],
    senderInfo: any,
  ) {
    let page = 0;
    const limit = 1000;

    while (true) {
      try {
        const whereCondition = excludeUserIds.length > 0
          ? { id: Not(In(excludeUserIds)) }
          : {};

        const users = await this.userRepository.find({
          where: whereCondition,
          select: ['id'],
          take: limit,
          skip: page * limit,
        });

        if (users.length === 0) {
          break;
        }

        // Build notifications
        const notifications = users.map((user) =>
          this.notificationRepository.create({
            recipientId: user.id,
            senderId,
            type,
            content,
            link,
            isRead: false,
          }),
        );

        // Bulk insert to database
        const insertResult = await this.notificationRepository.insert(notifications);

        // Emit WebSockets strictly to online users
        for (let index = 0; index < users.length; index++) {
          const userId = users[index].id;
          const hasActiveSocket = this.notificationGateway.server?.sockets?.adapter?.rooms?.has(userId);

          if (hasActiveSocket) {
            const savedId = insertResult.generatedMaps[index]?.id;
            const createdAt = insertResult.generatedMaps[index]?.createdAt;

            this.notificationGateway.sendToUser(userId, 'new_notification', {
              id: savedId,
              recipientId: userId,
              type,
              content,
              link,
              isRead: false,
              createdAt,
              sender: senderInfo,
            });
          }
        }

        page++;
      } catch (pageError) {
        // Safe iteration execution
        this.logger.error(
          `Error occurred in broadcastToAll page ${page}: ${pageError.message}`,
        );
        // Advance page to prevent infinite loops in case of persistent errors in specific records
        page++;
      }
    }
  }
}

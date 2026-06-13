import { Repository } from 'typeorm';

import { Injectable, Logger } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { InjectRepository } from '@nestjs/typeorm';

import { Post } from '@modules/forum/entities/post.entity';
import { User } from '@modules/user/entities/user.entity';

import { EVENT_KEYS } from '@shared/constants';
import { ROLE } from '@shared/enums';

import {
  Notification,
  NotificationType,
} from '../entities/notification.entity';
import { NotificationGateway } from '../gateways/notification.gateway';

@Injectable()
export class NotificationService {
  private readonly logger = new Logger(NotificationService.name);

  constructor(
    @InjectRepository(Notification)
    private readonly notificationRepository: Repository<Notification>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Post)
    private readonly postRepository: Repository<Post>,
    private readonly notificationGateway: NotificationGateway,
  ) {}

  async createNotification(
    recipientId: string,
    senderId: string | null,
    type: NotificationType,
    content: string,
    link: string | null,
  ): Promise<Notification> {
    const notification = this.notificationRepository.create({
      recipientId,
      senderId,
      type,
      content,
      link,
      isRead: false,
    });
    const saved = await this.notificationRepository.save(notification);

    // Fetch sender info if available to include in socket payload
    let senderInfo = null;
    if (senderId) {
      senderInfo = await this.userRepository.findOne({
        where: { id: senderId },
        relations: ['profile'],
      });
    }

    const payload = {
      id: saved.id,
      recipientId: saved.recipientId,
      type: saved.type,
      content: saved.content,
      link: saved.link,
      isRead: saved.isRead,
      createdAt: saved.createdAt,
      sender: senderInfo
        ? {
            id: senderInfo.id,
            username: senderInfo.username,
            avatarUrl: senderInfo.avatarUrl,
            fullName: senderInfo.profile?.fullName,
          }
        : null,
    };

    // Send via WebSocket Gateway
    this.notificationGateway.sendToUser(
      recipientId,
      'new_notification',
      payload,
    );
    return saved;
  }

  async findAllForUser(userId: string, page = 1, limit = 20) {
    const [items, total] = await this.notificationRepository.findAndCount({
      where: { recipientId: userId },
      relations: ['sender', 'sender.profile'],
      order: { createdAt: 'DESC' },
      skip: (page - 1) * limit,
      take: limit,
    });

    const unreadCount = await this.notificationRepository.count({
      where: { recipientId: userId, isRead: false },
    });

    const mappedItems = items.map((item) => ({
      id: item.id,
      recipientId: item.recipientId,
      type: item.type,
      content: item.content,
      link: item.link,
      isRead: item.isRead,
      createdAt: item.createdAt,
      sender: item.sender
        ? {
            id: item.sender.id,
            username: item.sender.username,
            avatarUrl: item.sender.avatarUrl,
            fullName: item.sender.profile?.fullName,
          }
        : null,
    }));

    return {
      items: mappedItems,
      total,
      unreadCount,
    };
  }

  async markAsRead(id: string, userId: string): Promise<Notification> {
    const notification = await this.notificationRepository.findOne({
      where: { id, recipientId: userId },
    });
    if (!notification) {
      return null;
    }
    notification.isRead = true;
    return this.notificationRepository.save(notification);
  }

  async markAllAsRead(userId: string): Promise<void> {
    await this.notificationRepository.update(
      { recipientId: userId, isRead: false },
      { isRead: true },
    );
  }

  // EVENT LISTENERS

  @OnEvent(EVENT_KEYS.NOTIFICATION_NEW_COMMENT)
  async handleNewCommentNotification(payload: {
    recipientId: string;
    senderId: string;
    postId: string;
    commentId: string;
  }) {
    try {
      this.logger.log(
        `Handling notification.new_comment event for post ${payload.postId}`,
      );

      const sender = await this.userRepository.findOne({
        where: { id: payload.senderId },
        relations: ['profile'],
      });
      const senderName =
        sender?.profile?.fullName || sender?.username || 'Ai đó';

      const content = `${senderName} đã bình luận vào bài viết của bạn.`;
      const link = `/forum/post/${payload.postId}`;

      await this.createNotification(
        payload.recipientId,
        payload.senderId,
        NotificationType.NEW_COMMENT,
        content,
        link,
      );
    } catch (error) {
      this.logger.error(
        `Error processing notification.new_comment: ${error.message}`,
      );
    }
  }

  @OnEvent(EVENT_KEYS.POST_MODERATED)
  async handlePostModeratedNotification(payload: {
    postId: string;
    status: string; // 'approved' or 'rejected'
    authorId: string;
    flaggedReason?: string;
  }) {
    try {
      this.logger.log(
        `Handling post.moderated event for post ${payload.postId}`,
      );

      const isApproved = payload.status.toLowerCase() === 'approved';
      const type = isApproved
        ? NotificationType.POST_APPROVED
        : NotificationType.POST_REJECTED;

      const content = isApproved
        ? `Bài viết của bạn đã được phê duyệt và hiển thị trên diễn đàn.`
        : `Bài viết của bạn đã bị từ chối duyệt. Lý do: ${payload.flaggedReason || 'Nội dung không phù hợp'}.`;

      const link = isApproved ? `/forum/post/${payload.postId}` : null;

      await this.createNotification(
        payload.authorId,
        null,
        type,
        content,
        link,
      );
    } catch (error) {
      this.logger.error(`Error processing post.moderated: ${error.message}`);
    }
  }

  @OnEvent(EVENT_KEYS.NOTIFICATION_COIN_RECEIVED)
  async handleCoinReceivedNotification(payload: {
    userId: string;
    amount: number;
    reason: string;
  }) {
    try {
      this.logger.log(
        `Handling notification.coin_received event for user ${payload.userId}`,
      );

      const content = payload.amount >= 0
        ? `Bạn đã nhận được ${payload.amount} EcoCoins. Lý do: ${payload.reason || 'Hoàn thành nhiệm vụ'}.`
        : `Bạn đã bị khấu trừ ${Math.abs(payload.amount)} EcoCoins. Lý do: ${payload.reason || 'Khấu trừ hệ thống'}.`;
      const link = `/profile/history`;

      await this.createNotification(
        payload.userId,
        null,
        NotificationType.COIN_RECEIVED,
        content,
        link,
      );
    } catch (error) {
      this.logger.error(
        `Error processing notification.coin_received: ${error.message}`,
      );
    }
  }

  @OnEvent(EVENT_KEYS.NOTIFICATION_ORDER_REFUNDED)
  async handleOrderRefundedNotification(payload: {
    userId: string;
    orderId: string;
    amount: number;
    reason: string;
  }) {
    try {
      this.logger.log(
        `Handling notification.order_refunded event for user ${payload.userId}`,
      );

      const content = `Giao dịch đơn hàng #${payload.orderId.substring(0, 8)} đã bị hủy. Bạn được hoàn lại ${payload.amount} EcoCoins.`;
      const link = `/profile/history`;

      await this.createNotification(
        payload.userId,
        null,
        NotificationType.ORDER_REFUNDED,
        content,
        link,
      );
    } catch (error) {
      this.logger.error(
        `Error processing notification.order_refunded: ${error.message}`,
      );
    }
  }

  @OnEvent(EVENT_KEYS.TASK_SUBMITTED)
  async handleTaskSubmittedNotification(payload: {
    submissionId: string;
    userId: string;
    userFullName: string;
    taskId: string;
    taskTitle: string;
    creatorId: string;
  }) {
    try {
      this.logger.log(
        `Handling task.submitted event for submission ${payload.submissionId}`,
      );

      const creator = await this.userRepository.findOne({
        where: { id: payload.creatorId },
      });

      const content = `Người dùng **${payload.userFullName}** đã nộp minh chứng cho nhiệm vụ **${payload.taskTitle}**. Vui lòng kiểm duyệt.`;

      if (creator && creator.role === ROLE.PARTNER) {
        const link = `/partner/content/missions?tab=submissions&submissionId=${payload.submissionId}`;
        await this.createNotification(
          payload.creatorId,
          payload.userId,
          NotificationType.TASK_SUBMITTED,
          content,
          link,
        );
      } else {
        const admins = await this.userRepository.find({
          where: { role: ROLE.ADMIN },
        });
        const link = `/admin/content/missions?tab=submissions&submissionId=${payload.submissionId}`;
        for (const admin of admins) {
          await this.createNotification(
            admin.id,
            payload.userId,
            NotificationType.TASK_SUBMITTED,
            content,
            link,
          );
        }
      }
    } catch (error) {
      this.logger.error(
        `Error processing task.submitted notification: ${error.message}`,
      );
    }
  }
}

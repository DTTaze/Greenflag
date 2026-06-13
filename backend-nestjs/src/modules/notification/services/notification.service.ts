import { Queue } from 'bullmq';
import { Not, Repository } from 'typeorm';

import { InjectQueue } from '@nestjs/bullmq';
import { Injectable, Logger } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { InjectRepository } from '@nestjs/typeorm';

import { Transaction } from '@modules/commerce/entities/transaction.entity';
import { EventUser } from '@modules/event/entities/event-user.entity';
import { Post } from '@modules/forum/entities/post.entity';
import { User } from '@modules/user/entities/user.entity';

import { EVENT_KEYS, JOB_NAME, QUEUE_NAME } from '@shared/constants';
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
    @InjectRepository(EventUser)
    private readonly eventUserRepository: Repository<EventUser>,
    @InjectRepository(Transaction)
    private readonly transactionRepository: Repository<Transaction>,
    @InjectQueue(QUEUE_NAME.NOTIFICATION)
    private readonly notificationQueue: Queue,
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

  private async addBroadcastJob(payload: {
    type: NotificationType;
    content: string;
    link: string | null;
    senderId: string | null;
    recipientIds?: string[];
    excludeUserIds?: string[];
  }) {
    await this.notificationQueue.add(
      JOB_NAME.BROADCAST_NOTIFICATION,
      payload,
      {
        removeOnComplete: true,
        removeOnFail: { count: 100 },
        attempts: 3,
        backoff: { type: 'exponential', delay: 2000 },
      },
    );
  }

  @OnEvent(EVENT_KEYS.TASK_CREATED)
  async handleTaskCreated(payload: {
    taskId: string;
    taskTitle: string;
    creatorId: string;
  }) {
    try {
      this.logger.log(`Handling task.created for task ${payload.taskId}`);
      await this.addBroadcastJob({
        type: NotificationType.TASK_CREATED,
        content: `Nhiệm vụ mới: "${payload.taskTitle}" đã được tạo. Tham gia ngay!`,
        link: `/missions?taskId=${payload.taskId}`,
        senderId: payload.creatorId,
        excludeUserIds: [payload.creatorId],
      });
    } catch (error) {
      this.logger.error(`Error queuing task.created: ${error.message}`);
    }
  }

  @OnEvent(EVENT_KEYS.POST_CREATED_BY_ADMIN)
  async handlePostCreatedByAdmin(payload: {
    postId: string;
    authorId: string;
  }) {
    try {
      this.logger.log(`Handling post.created_by_admin for post ${payload.postId}`);
      const post = await this.postRepository.findOne({ where: { id: payload.postId } });
      if (!post) return;
      const snippet = post.content ? (post.content.length > 50 ? post.content.substring(0, 50) + '...' : post.content) : '';
      
      await this.addBroadcastJob({
        type: NotificationType.POST_CREATED_BY_ADMIN,
        content: `Bài viết mới từ Admin: "${snippet}". Xem ngay!`,
        link: `/forum/post/${payload.postId}`,
        senderId: payload.authorId,
        excludeUserIds: [payload.authorId],
      });
    } catch (error) {
      this.logger.error(`Error queuing post.created_by_admin: ${error.message}`);
    }
  }

  @OnEvent(EVENT_KEYS.EVENT_CREATED)
  async handleEventCreated(payload: {
    eventId: string;
    eventTitle: string;
    creatorId: string;
  }) {
    try {
      this.logger.log(`Handling event.created for event ${payload.eventId}`);
      await this.addBroadcastJob({
        type: NotificationType.EVENT_CREATED,
        content: `Sự kiện mới sắp diễn ra: "${payload.eventTitle}". Đăng ký tham gia ngay!`,
        link: `/events/${payload.eventId}`,
        senderId: payload.creatorId,
        excludeUserIds: [payload.creatorId],
      });
    } catch (error) {
      this.logger.error(`Error queuing event.created: ${error.message}`);
    }
  }

  @OnEvent(EVENT_KEYS.EVENT_UPDATED)
  async handleEventUpdated(payload: {
    eventId: string;
    eventTitle: string;
    updaterId: string;
  }) {
    try {
      this.logger.log(`Handling event.updated for event ${payload.eventId}`);
      const registrations = await this.eventUserRepository.find({
        where: { eventId: payload.eventId },
        select: ['userId'],
      });
      const recipientIds = registrations
        .map((reg) => reg.userId)
        .filter((id) => id !== payload.updaterId);

      if (recipientIds.length > 0) {
        await this.addBroadcastJob({
          type: NotificationType.EVENT_UPDATED,
          content: `Sự kiện "${payload.eventTitle}" mà bạn đăng ký đã cập nhật thông tin mới.`,
          link: `/events/${payload.eventId}`,
          senderId: payload.updaterId,
          recipientIds,
        });
      }
    } catch (error) {
      this.logger.error(`Error queuing event.updated: ${error.message}`);
    }
  }

  @OnEvent(EVENT_KEYS.TRANSACTION_CREATED)
  async handleTransactionCreated(payload: {
    transactionId: string;
    buyerId: string;
    totalPrice: number;
    name: string;
  }) {
    try {
      this.logger.log(`Handling transaction.created for transaction ${payload.transactionId}`);
      const admins = await this.userRepository.find({
        where: { role: ROLE.ADMIN },
        select: ['id'],
      });
      const adminIds = admins.map((admin) => admin.id);

      const transaction = await this.transactionRepository.findOne({
        where: { id: payload.transactionId },
      });
      const sellerId = transaction?.sellerId;

      const recipientIdsSet = new Set<string>(adminIds);
      if (sellerId && sellerId !== payload.buyerId) {
        recipientIdsSet.add(sellerId);
      }

      const buyer = await this.userRepository.findOne({
        where: { id: payload.buyerId },
        relations: ['profile'],
      });
      const buyerName = buyer?.profile?.fullName || buyer?.username || 'Thành viên';
      
      const recipientIds = Array.from(recipientIdsSet);
      if (recipientIds.length > 0) {
        await this.addBroadcastJob({
          type: NotificationType.TRANSACTION_CREATED,
          content: `${buyerName} đã thực hiện giao dịch "${payload.name}" trị giá ${payload.totalPrice} EcoCoins.`,
          link: `/profile/history`,
          senderId: payload.buyerId,
          recipientIds,
        });
      }
    } catch (error) {
      this.logger.error(`Error queuing transaction.created: ${error.message}`);
    }
  }

  @OnEvent(EVENT_KEYS.SHIPPING_STATUS_CHANGED)
  async handleShippingStatusChanged(payload: {
    orderCode: string;
    status: string;
    buyerId: string;
    sellerId: string;
  }) {
    try {
      this.logger.log(
        `Handling delivery.status_updated for order ${payload.orderCode} with status ${payload.status}`,
      );
      
      const statusTranslations: Record<string, string> = {
        ready_to_pick: 'Sẵn sàng lấy hàng',
        picking: 'Đang lấy hàng',
        money_collect_picking: 'Đang lấy hàng và thu tiền',
        picked: 'Đã lấy hàng',
        storing: 'Đang lưu kho',
        transporting: 'Đang vận chuyển',
        sorting: 'Đang phân loại',
        delivering: 'Đang giao hàng',
        delivered: 'Đã giao hàng thành công',
        money_collect_delivering: 'Đang giao hàng và thu tiền',
        delivery_fail: 'Giao hàng thất bại',
        waiting_to_return: 'Chờ chuyển hoàn',
        return: 'Chuyển hoàn',
        return_transporting: 'Đang vận chuyển hoàn',
        return_sorting: 'Đang phân loại hàng hoàn',
        returning: 'Đang chuyển hoàn',
        return_fail: 'Chuyển hoàn thất bại',
        returned: 'Đã nhận lại hàng hoàn',
        cancel: 'Đơn hàng đã bị hủy',
        exception: 'Đơn hàng ngoại lệ',
        lost: 'Đơn hàng bị mất',
        damage: 'Đơn hàng bị hỏng',
      };
      
      const friendlyStatus = statusTranslations[payload.status] || payload.status;
      const content = `Trạng thái vận chuyển đơn hàng #${payload.orderCode} đã cập nhật: ${friendlyStatus}.`;
      const link = `/profile/history`;

      await this.createNotification(
        payload.buyerId,
        null,
        NotificationType.SHIPPING_STATUS_CHANGED,
        content,
        link,
      );
    } catch (error) {
      this.logger.error(`Error processing delivery.status_updated: ${error.message}`);
    }
  }

  @OnEvent(EVENT_KEYS.TASK_MODERATED)
  async handleTaskModerated(payload: {
    submissionId: string;
    taskId: string;
    taskTitle: string;
    userId: string;
    decision: string;
  }) {
    try {
      this.logger.log(`Handling task.moderated for submission ${payload.submissionId}`);
      const isApproved = payload.decision.toLowerCase() === 'approved';
      const content = isApproved
        ? `Nhiệm vụ "${payload.taskTitle}" của bạn đã được chấp nhận.`
        : `Nhiệm vụ "${payload.taskTitle}" của bạn đã bị từ chối. Vui lòng kiểm tra lại.`;
      const link = `/missions`;

      await this.createNotification(
        payload.userId,
        null,
        NotificationType.TASK_MODERATED,
        content,
        link,
      );
    } catch (error) {
      this.logger.error(`Error processing task.moderated: ${error.message}`);
    }
  }
}

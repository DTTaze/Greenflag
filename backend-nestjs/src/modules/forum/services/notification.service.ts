import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class NotificationService {
  private readonly logger = new Logger(NotificationService.name);

  notifyUsersTaggedInPost(
    taggedUserIds: string[],
    postId: string,
    senderId: string,
  ) {
    // TODO - Implement this later
    this.logger.log(
      `[MOCK NOTIFICATION] Gửi thông báo tới các user: ${JSON.stringify(
        taggedUserIds,
      )} - được tag trong Post: ${postId} bởi User: ${senderId}`,
    );
  }
}

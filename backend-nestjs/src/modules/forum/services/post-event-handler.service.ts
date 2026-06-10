import { Repository } from 'typeorm';

import { Injectable } from '@nestjs/common';
import { EventEmitter2, OnEvent } from '@nestjs/event-emitter';
import { InjectRepository } from '@nestjs/typeorm';

import { EVENT_KEYS } from '@shared/constants';
import { FORUM_POST_STATUS } from '@shared/enums';

import { Comment } from '../entities/comment.entity';
import { Post } from '../entities/post.entity';
import { ModerationService } from './moderation.service';

@Injectable()
export class PostEventHandlerService {
  constructor(
    @InjectRepository(Post)
    private readonly postRepository: Repository<Post>,
    @InjectRepository(Comment)
    private readonly commentRepository: Repository<Comment>,
    private readonly moderationService: ModerationService,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  @OnEvent(EVENT_KEYS.POST_CREATED)
  async handlePostCreated(payload: { postId: string }) {
    const post = await this.postRepository.findOne({
      where: { id: payload.postId },
    });
    if (!post || post.status !== FORUM_POST_STATUS.PENDING || post.isAdminPost)
      return;

    const moderationResult = await this.moderationService.moderatePostContent(
      post.content,
      post.images,
    );

    if (!moderationResult.isSafe) {
      const flaggedReason = moderationResult.reason || 'Bị từ chối tự động';

      // Emit the admin violation alert event
      this.eventEmitter.emit(EVENT_KEYS.ADMIN_ALERT_VIOLATION, {
        targetId: post.id,
        targetType: 'POST',
        flaggedReason,
      });
    } else {
      // Auto-approve if safe
      await this.postRepository.update(post.id, {
        status: FORUM_POST_STATUS.APPROVED,
      });
    }
  }

  @OnEvent(EVENT_KEYS.COMMENT_CREATED)
  async handleCommentCreated(payload: { commentId: string }) {
    const comment = await this.commentRepository.findOne({
      where: { id: payload.commentId },
    });
    if (!comment || comment.status !== FORUM_POST_STATUS.PENDING) return;

    const moderationResult = await this.moderationService.moderatePostContent(
      comment.content,
      comment.imageUrl ? [comment.imageUrl] : [],
    );

    if (!moderationResult.isSafe) {
      const flaggedReason = moderationResult.reason || 'Bị từ chối tự động';

      // Emit the admin violation alert event
      this.eventEmitter.emit(EVENT_KEYS.ADMIN_ALERT_VIOLATION, {
        targetId: comment.id,
        targetType: 'COMMENT',
        flaggedReason,
      });
    } else {
      // Auto-approve if safe
      await this.commentRepository.update(comment.id, {
        status: FORUM_POST_STATUS.APPROVED,
      });

      // Synchronize post commentCount & score
      await this.postRepository.increment(
        { id: comment.postId },
        'commentCount',
        1,
      );
      await this.postRepository.increment({ id: comment.postId }, 'score', 2);
    }
  }

  @OnEvent(EVENT_KEYS.ADMIN_ALERT_VIOLATION)
  async handleAutoReject(payload: {
    targetId: string;
    targetType: 'POST' | 'COMMENT';
    flaggedReason: string;
  }) {
    if (payload.targetType === 'POST') {
      await this.postRepository.update(payload.targetId, {
        status: FORUM_POST_STATUS.REJECTED,
        flaggedReason: payload.flaggedReason,
        rejectedBy: 'AI',
      });
    } else if (payload.targetType === 'COMMENT') {
      await this.commentRepository.update(payload.targetId, {
        status: FORUM_POST_STATUS.REJECTED,
        rejectedBy: 'AI',
      });
    }
  }
}

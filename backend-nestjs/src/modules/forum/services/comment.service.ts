import { DataSource, EntityManager, Repository } from 'typeorm';

import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { InjectRepository } from '@nestjs/typeorm';

import { StorageService } from '@modules/storage/storage.service';
import { SystemConfigService } from '@modules/system-config/system-config.service';

import { VOTE_CONFIG, getStorageFolder } from '@shared/constants';
import {
  FORUM_POST_STATUS,
  FORUM_VOTE_TYPE,
  ROLE,
  SYSTEM_CONFIG_KEY,
} from '@shared/enums';
import { handleVote } from '@shared/helpers/vote-handler.helper';

import {
  CreateCommentDTO,
  GetCommentsQueryDTO,
  UpdateCommentDTO,
} from '../dto/comment.dto';
import { CommentVote } from '../entities/comment-vote.entity';
import { Comment } from '../entities/comment.entity';
import { Post } from '../entities/post.entity';
import { ModerationService } from './moderation.service';

@Injectable()
export class CommentService {
  constructor(
    @InjectRepository(Comment)
    private readonly commentRepository: Repository<Comment>,
    private readonly dataSource: DataSource,
    private readonly storageService: StorageService,
    private readonly moderationService: ModerationService,
    private readonly systemConfigService: SystemConfigService,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  async createComment(
    postId: string,
    dto: CreateCommentDTO,
    authorId: string,
    userRole: ROLE = ROLE.USER,
    file?: Express.Multer.File,
  ): Promise<Comment> {
    const isAutoEnabled =
      (await this.systemConfigService.get(
        SYSTEM_CONFIG_KEY.AI_AUTO_MODERATION_ENABLED,
      )) === 'true';
    const commentRolesStr = await this.systemConfigService.get(
      SYSTEM_CONFIG_KEY.AI_MODERATION_COMMENT_ROLES,
    );
    let commentRoles: string[] = ['USER'];
    if (commentRolesStr) {
      try {
        const parsed = JSON.parse(commentRolesStr);
        if (Array.isArray(parsed)) {
          commentRoles = parsed;
        }
      } catch {
        commentRoles = ['USER'];
      }
    }

    let initialStatus = FORUM_POST_STATUS.APPROVED;
    if (isAutoEnabled && commentRoles.includes(userRole)) {
      initialStatus = FORUM_POST_STATUS.PENDING;
    }

    const savedComment = await this.dataSource.transaction(async (manager) => {
      const post = await manager.findOne(Post, { where: { id: postId } });
      if (!post) {
        throw new NotFoundException('Post not found');
      }

      if (post.status !== FORUM_POST_STATUS.APPROVED) {
        throw new BadRequestException(
          'Không thể bình luận vào bài viết chưa được phê duyệt hoặc đã hết hạn!',
        );
      }

      if (dto.parentId) {
        const parent = await manager.findOne(Comment, {
          where: { id: dto.parentId },
        });
        if (!parent) {
          throw new NotFoundException('Parent comment not found');
        }
        if (parent.postId !== postId) {
          throw new BadRequestException(
            'Bình luận phản hồi phải thuộc cùng một bài viết!',
          );
        }
      }

      // Handle image upload
      let imageUrl: string | null = null;
      if (file) {
        imageUrl = await this.storageService.uploadFile(
          file,
          getStorageFolder().FORUM_COMMENTS,
        );
      }

      // Run synchronous Multimodal Moderation only if bypassed and still approved,
      // but let's keep it clean: if status is PENDING, we moderate in the background,
      // if status is APPROVED, we skip LLM but can keep a basic sanity check or proceed.
      // We proceed directly as instructed by the user request.

      const comment = manager.create(Comment, {
        postId,
        authorId,
        parentId: dto.parentId || null,
        content: dto.content,
        imageUrl,
        status: initialStatus,
      });

      const saved = await manager.save(comment);

      if (initialStatus === FORUM_POST_STATUS.APPROVED) {
        // Increment commentCount by 1 and score by 2
        await manager.increment(Post, { id: postId }, 'commentCount', 1);
        await manager.increment(Post, { id: postId }, 'score', 2);
      }

      return saved;
    });

    if (savedComment.status === FORUM_POST_STATUS.PENDING) {
      this.eventEmitter.emit('comment.created', { commentId: savedComment.id });
    }

    return savedComment;
  }

  async getCommentsForPost(
    postId: string,
    query: GetCommentsQueryDTO,
    currentUserId?: string,
  ) {
    const limit = query.limit || 3;

    const queryBuilder = this.commentRepository
      .createQueryBuilder('comment')
      .leftJoinAndSelect('comment.author', 'author')
      .leftJoinAndSelect('author.profile', 'profile')
      .where('comment.post_id = :postId', { postId })
      .andWhere('comment.parent_id IS NULL')
      .andWhere('comment.status = :approvedStatus', {
        approvedStatus: FORUM_POST_STATUS.APPROVED,
      });

    if (query.cursor) {
      const cursorCreatedAt = new Date(query.cursor);
      queryBuilder.andWhere('comment.created_at > :cursorCreatedAt', {
        cursorCreatedAt,
      });
    }

    queryBuilder.orderBy('comment.created_at', 'ASC');
    queryBuilder.take(limit + 1);

    if (currentUserId) {
      queryBuilder
        .leftJoin(
          'comment_votes',
          'currentUserVote',
          'currentUserVote.comment_id = comment.id AND currentUserVote.user_id = :currentUserId',
          { currentUserId },
        )
        .addSelect('currentUserVote.type', 'userVote');
    }

    const { entities, raw } = await queryBuilder.getRawAndEntities();

    const hasNextPage = entities.length > limit;
    const items = hasNextPage ? entities.slice(0, limit) : entities;

    const mappedComments = items.map((entity) => {
      const rawItem = raw.find(
        (r) => r.comment_id === entity.id || r.id === entity.id,
      );
      entity['userVote'] = rawItem ? rawItem.userVote || null : null;
      return entity;
    });

    // Recursively load replies up to 3 levels for loaded comments
    for (const comment of mappedComments) {
      await this.loadRepliesRecursively(comment, currentUserId, 1);
    }

    let nextCursor: string | null = null;
    if (hasNextPage && items.length > 0) {
      nextCursor = items[items.length - 1].createdAt.toISOString();
    }

    return {
      items: mappedComments,
      nextCursor,
    };
  }

  private async loadRepliesRecursively(
    parentComment: Comment,
    currentUserId?: string,
    depth = 1,
  ) {
    if (depth > 3) return;

    const repliesQuery = this.commentRepository
      .createQueryBuilder('reply')
      .leftJoinAndSelect('reply.author', 'author')
      .leftJoinAndSelect('author.profile', 'profile')
      .where('reply.parent_id = :parentId', { parentId: parentComment.id })
      .andWhere('reply.status = :approvedStatus', {
        approvedStatus: FORUM_POST_STATUS.APPROVED,
      })
      .orderBy('reply.created_at', 'ASC');

    if (currentUserId) {
      repliesQuery
        .leftJoin(
          'comment_votes',
          'cv',
          'cv.comment_id = reply.id AND cv.user_id = :currentUserId',
          { currentUserId },
        )
        .addSelect('cv.type', 'userVote');
    }

    const { entities, raw } = await repliesQuery.getRawAndEntities();

    for (let i = 0; i < entities.length; i++) {
      const entity = entities[i];
      const rawItem = raw.find(
        (r) => r.reply_id === entity.id || r.id === entity.id,
      );
      entity['userVote'] = rawItem ? rawItem.userVote || null : null;
      await this.loadRepliesRecursively(entity, currentUserId, depth + 1);
    }

    parentComment.replies = entities;
  }

  async updateComment(
    commentId: string,
    dto: UpdateCommentDTO,
    userId: string,
  ): Promise<Comment> {
    const comment = await this.commentRepository.findOne({
      where: { id: commentId },
    });
    if (!comment) {
      throw new NotFoundException('Comment not found');
    }

    if (comment.authorId !== userId) {
      throw new ForbiddenException(
        'You are not authorized to update this comment',
      );
    }

    comment.content = dto.content;
    return this.commentRepository.save(comment);
  }

  async voteComment(
    commentId: string,
    userId: string,
    type: FORUM_VOTE_TYPE,
  ): Promise<void> {
    await this.dataSource.transaction(async (manager) => {
      await handleVote({
        manager,
        userId,
        type,
        targetEntityClass: Comment,
        targetId: commentId,
        voteEntityClass: CommentVote,
        ...VOTE_CONFIG.COMMENT,
      });
    });
  }

  async softDeleteComment(
    commentId: string,
    userId: string,
    isAdmin: boolean,
  ): Promise<void> {
    const comment = await this.commentRepository.findOne({
      where: { id: commentId },
    });
    if (!comment) {
      throw new NotFoundException('Comment not found');
    }

    if (!isAdmin && comment.authorId !== userId) {
      throw new ForbiddenException(
        'You are not authorized to delete this comment',
      );
    }

    await this.dataSource.transaction(async (manager) => {
      // Find all child comments recursively
      const getChildCommentIds = async (
        mgr: EntityManager,
        parentId: string,
      ): Promise<string[]> => {
        const children = await mgr.find(Comment, { where: { parentId } });
        let ids = children.map((c) => c.id);
        for (const childId of children.map((c) => c.id)) {
          const subIds = await getChildCommentIds(mgr, childId);
          ids = ids.concat(subIds);
        }
        return ids;
      };

      const childIds = await getChildCommentIds(manager, commentId);
      const allIds = [commentId, ...childIds];

      // Soft delete all targeted comments
      await manager.softDelete(Comment, allIds);

      // Decrement post commentCount by N and score by N * 2
      const N = allIds.length;
      await manager.decrement(Post, { id: comment.postId }, 'commentCount', N);
      await manager.decrement(Post, { id: comment.postId }, 'score', N * 2);
    });
  }
}

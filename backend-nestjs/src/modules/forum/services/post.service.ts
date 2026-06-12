import { ChatGroq } from '@langchain/groq';
import { DataSource, Repository } from 'typeorm';

import {
  ForbiddenException,
  Injectable,
  NotFoundException,
  OnModuleInit,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { InjectRepository } from '@nestjs/typeorm';

import { StorageService } from '@modules/storage/storage.service';
import { SystemConfigService } from '@modules/system-config/system-config.service';
import { UserProfile } from '@modules/user/entities/user-profile.entity';
import { User } from '@modules/user/entities/user.entity';
import { UserService } from '@modules/user/services/user.service';

import {
  ENV_KEY,
  EVENT_KEYS,
  VOTE_CONFIG,
  getStorageFolder,
} from '@shared/constants';
import {
  FORUM_POST_STATUS,
  FORUM_VOTE_TYPE,
  ROLE,
  SYSTEM_CONFIG_KEY,
} from '@shared/enums';
import { handleVote } from '@shared/helpers/vote-handler.helper';

import {
  CreatePostDTO,
  GetPostsQueryDTO,
  UpdatePostDTO,
} from '../dto/post.dto';
import { Comment } from '../entities/comment.entity';
import { PostVote } from '../entities/post-vote.entity';
import { Post } from '../entities/post.entity';
import { ModerationService } from './moderation.service';
import { NotificationService } from './notification.service';

@Injectable()
export class PostService implements OnModuleInit {
  private chatModel: any;

  constructor(
    @InjectRepository(Post)
    private readonly postRepository: Repository<Post>,
    private readonly dataSource: DataSource,
    private readonly configService: ConfigService,
    private readonly moderationService: ModerationService,
    private readonly storageService: StorageService,
    private readonly eventEmitter: EventEmitter2,
    private readonly notificationService: NotificationService,
    private readonly userService: UserService,
    private readonly systemConfigService: SystemConfigService,
  ) {}

  onModuleInit() {
    const groqApiKey = this.configService.get<string>(ENV_KEY.GROQ_API_KEY);
   const groqModel = this.configService.get<string>(ENV_KEY.GROQ_MODEL_NAME);

    if (groqApiKey && groqApiKey.trim() !== '') {
      this.chatModel = new ChatGroq({
        apiKey: groqApiKey,
        model: groqModel,
        temperature: 0.4,
        maxTokens: 4096,
        maxRetries: 3,
      } as any);
    } else {
      this.chatModel = null;
    }
  }

  async aiEnhanceContent(content: string) {
    
    if (!this.chatModel) {
      return {
        enhancedContent: content,
        hashtags: ['Sống xanh', 'Môi trường'],
        category: 'Thảo luận chung',
      };
    }

    const systemPrompt = `You are a strict editorial assistant for an ENVIRONMENTAL PROTECTION & GREEN LIVING (Bảo vệ môi trường & Sống xanh) forum named Greenflag.
The user will provide a raw, often misspelled draft.

Your tasks:
1. Fix spelling and environmental terminology based on Greenflag context (e.g., recycling, planting, reducing plastic waste, clean energy).
2. Expand the draft into a polite, clear forum post asking the community for help, sharing tips, or discussing green activities.
3. CRITICAL RULES:
   - CONTEXT IS ENVIRONMENTAL PROTECTION & SUSTAINABILITY (Bảo vệ môi trường & Phát triển bền vững). Do not discuss unrelated topics.
   - DO NOT answer questions or provide official recommendations.
   - KEEP IT SHORT (maximum 2-3 sentences).
4. Suggest 3-5 relevant tags. Each tag MUST be strictly shorter than 50 characters.
   - TAG FORMAT RULE: Output tags as natural Vietnamese phrases with spaces, capitalized first letter, NO '#' symbol. Example: ["Sống xanh", "Tái chế", "Trồng cây", "Giảm rác nhựa"].
5. Categorize strictly into ONE of these: ['Hỏi đáp', 'Kinh nghiệm', 'Thảo luận chung'].

Output STRICTLY as a JSON object:
{
  "enhancedContent": "string",
  "hashtags": ["string"],
  "category": "string"
}`;

    try {
      const response = await this.chatModel.invoke([
        { role: 'system', content: systemPrompt },
        { role: 'user', content: content },
      ]);
      console.log('🚀 ~ PostService ~ aiEnhanceContent ~ response:', response);

      const rawOutput = response.content as string;
      const cleanJson = rawOutput.replace(/```json|```/g, '').trim();

      const parsedData = JSON.parse(cleanJson);

      // BỘ LỌC CODE: Chuẩn hóa mảng hashtags thành tiếng Việt tự nhiên
      if (parsedData.hashtags && Array.isArray(parsedData.hashtags)) {
        parsedData.hashtags = parsedData.hashtags
          .map((tag: any) => {
            if (typeof tag !== 'string') return '';
            // Xóa mọi ký tự # thừa thãi và khoảng trắng đầu/cuối, chuẩn hóa khoảng trắng giữa các từ
            const cleanString = tag
              .replace(/#/g, '')
              .trim()
              .replace(/\s+/g, ' ');
            if (cleanString.length > 0) {
              // Viết hoa chữ cái đầu tiên cho đẹp tự nhiên (VD: "tái chế" -> "Tái chế")
              const formatted =
                cleanString.charAt(0).toUpperCase() +
                cleanString.slice(1).toLowerCase();
              return formatted.slice(0, 50); // Hard truncate to 50 characters to comply with DTO
            }
            return '';
          })
          .filter((t: string) => t.length > 0)
          .slice(0, 5); // Limit to maximum 5 tags to comply with DTO
      }

      return parsedData;
    } catch (err) {
      return {
        enhancedContent: content,
        hashtags: ['Sống xanh', 'Môi trường'],
        category: 'Thảo luận chung',
      };
    }
  }

  async createPost(
    dto: CreatePostDTO,
    authorId: string,
    userRole: ROLE = ROLE.USER,
    files?: Express.Multer.File[],
  ): Promise<Post> {
    const isAdmin = userRole === ROLE.ADMIN;
    let status = FORUM_POST_STATUS.APPROVED;
    const flaggedReason: string | null = null;
    let isAdminPost = false;

    // Handle image uploads if files exist
    const uploadedImages: string[] = [];
    if (files && files.length > 0) {
      for (const file of files) {
        const url = await this.storageService.uploadFile(
          file,
          getStorageFolder().FORUM_POSTS,
        );
        uploadedImages.push(url);
      }
    }
    const postImages =
      uploadedImages.length > 0 ? uploadedImages : dto.images || [];

    const isDraft = dto.isDraft === true;

    const isAutoEnabled =
      (await this.systemConfigService.get(
        SYSTEM_CONFIG_KEY.AI_AUTO_MODERATION_ENABLED,
      )) === 'true';
    const postRolesStr = await this.systemConfigService.get(
      SYSTEM_CONFIG_KEY.AI_MODERATION_POST_ROLES,
    );
    let postRoles: string[] = ['USER'];
    if (postRolesStr) {
      try {
        const parsed = JSON.parse(postRolesStr);
        if (Array.isArray(parsed)) {
          postRoles = parsed;
        }
      } catch {
        postRoles = ['USER'];
      }
    }

    if (isDraft) {
      status = FORUM_POST_STATUS.DRAFT;
    } else if (isAdmin) {
      status = FORUM_POST_STATUS.APPROVED;
      isAdminPost = true;
    } else {
      status = FORUM_POST_STATUS.PENDING;
    }

    const categoryVal = dto.category_id || dto.category || 'Thảo luận chung';
    let tagsVal = dto.tags || [];
    if (dto.topic_id && !tagsVal.includes(dto.topic_id)) {
      tagsVal = [dto.topic_id, ...tagsVal];
    }

    const post = this.postRepository.create({
      authorId,
      content: dto.content,
      images: postImages,
      tags: tagsVal,
      category: categoryVal,
      status,
      flaggedReason,
      isAdminPost,
      eventId: dto.attachedEventId || null,
    });

    const savedPost = await this.postRepository.save(post);

    if (dto.taggedUsernames && dto.taggedUsernames.length > 0) {
      const users = await this.userService.findUsersByUsernames(
        dto.taggedUsernames,
      );
      const userIds = users.map((u) => u.id);
      if (userIds.length > 0) {
        this.notificationService.notifyUsersTaggedInPost(
          userIds,
          savedPost.id,
          authorId,
        );
      }
    }

    if (
      status === FORUM_POST_STATUS.PENDING &&
      isAutoEnabled &&
      postRoles.includes(userRole)
    ) {
      this.eventEmitter.emit(EVENT_KEYS.POST_CREATED, { postId: savedPost.id });
    }

    return savedPost;
  }

  async getPostsFeed(
    query: GetPostsQueryDTO,
    currentUserId?: string,
    userRole?: ROLE,
  ) {
    const limit = query.limit || 10;
    const sort = query.sort || 'new';

    const queryBuilder = this.postRepository
      .createQueryBuilder('post')
      .leftJoinAndSelect('post.author', 'author')
      .leftJoinAndSelect('author.profile', 'profile')
      .leftJoinAndSelect('post.event', 'event');

    // Filter by status (strict security check to prevent unapproved posts leakage to users)
    const isAdmin = userRole === ROLE.ADMIN;
    if (isAdmin && query.status) {
      queryBuilder.andWhere('post.status = :statusFilter', {
        statusFilter: query.status,
      });
    } else {
      queryBuilder.andWhere('post.status = :statusFilter', {
        statusFilter: FORUM_POST_STATUS.APPROVED,
      });
    }

    // Filter by category
    if (query.category) {
      queryBuilder.andWhere('post.category = :categoryFilter', {
        categoryFilter: query.category,
      });
    }

    // Filter by tag if provided (tags is JSONB array)
    if (query.tag) {
      queryBuilder.andWhere('post.tags ::jsonb @> :tagFilter::jsonb', {
        tagFilter: JSON.stringify([query.tag]),
      });
    }

    // DISTINCT ON subquery for highest-scoring root comment (topComment)
    queryBuilder.leftJoin(
      (qb) => {
        return qb
          .select('c.id', 'id')
          .distinctOn(['c.post_id'])
          .addSelect('c.content', 'content')
          .addSelect('c.upvotes', 'upvotes')
          .addSelect('c.downvotes', 'downvotes')
          .addSelect('c.author_id', 'author_id')
          .addSelect('c.created_at', 'created_at')
          .addSelect('c.post_id', 'post_id')
          .addSelect('u.username', 'author_username')
          .addSelect('up.full_name', 'author_full_name')
          .from(Comment, 'c')
          .leftJoin(User, 'u', 'u.id = c.author_id')
          .leftJoin(UserProfile, 'up', 'up.user_id = u.id')
          .where('c.parent_id IS NULL')
          .andWhere('c.deleted_at IS NULL')
          .andWhere('(c.upvotes - c.downvotes) > 0')
          .orderBy('c.post_id')
          .addOrderBy('(c.upvotes - c.downvotes)', 'DESC')
          .addOrderBy('c.created_at', 'ASC');
      },
      'tc',
      'tc.post_id = post.id',
    );

    queryBuilder
      .addSelect('tc.id', 'tc_id')
      .addSelect('tc.content', 'tc_content')
      .addSelect('tc.upvotes', 'tc_upvotes')
      .addSelect('tc.downvotes', 'tc_downvotes')
      .addSelect('(tc.author_id)', 'tc_authorId')
      .addSelect('(tc.created_at)', 'tc_createdAt')
      .addSelect('(tc.author_username)', 'tc_authorUsername')
      .addSelect('(tc.author_full_name)', 'tc_authorFullName');

    // Attach userVote if user is authenticated
    if (currentUserId) {
      queryBuilder
        .leftJoin(
          'post_votes',
          'currentUserVote',
          'currentUserVote.post_id = post.id AND currentUserVote.user_id = :currentUserId',
          { currentUserId },
        )
        .addSelect('currentUserVote.type', 'userVote');
    }

    // Cursor-based Pagination
    if (sort === 'hot') {
      if (query.cursor) {
        const decoded = Buffer.from(query.cursor, 'base64').toString('ascii');
        const [scoreStr, createdAtStr, id] = decoded.split('_');
        const cursorScore = parseInt(scoreStr, 10);
        const cursorCreatedAt = new Date(createdAtStr);

        queryBuilder.andWhere(
          `(post.score < :cursorScore) OR 
           (post.score = :cursorScore AND post.created_at < :cursorCreatedAt) OR 
           (post.score = :cursorScore AND post.created_at = :cursorCreatedAt AND post.id < :cursorId)`,
          { cursorScore, cursorCreatedAt, cursorId: id },
        );
      }
      queryBuilder
        .orderBy('post.score', 'DESC')
        .addOrderBy('post.createdAt', 'DESC')
        .addOrderBy('post.id', 'DESC');
    } else {
      // sort === 'new'
      if (query.cursor) {
        const decoded = Buffer.from(query.cursor, 'base64').toString('ascii');
        const [createdAtStr, id] = decoded.split('_');
        const cursorCreatedAt = new Date(createdAtStr);

        queryBuilder.andWhere(
          `(post.created_at < :cursorCreatedAt) OR 
           (post.created_at = :cursorCreatedAt AND post.id < :cursorId)`,
          { cursorCreatedAt, cursorId: id },
        );
      }
      queryBuilder
        .orderBy('post.createdAt', 'DESC')
        .addOrderBy('post.id', 'DESC');
    }

    // Limit to load 1 extra item to check for next page availability
    queryBuilder.take(limit + 1);

    const { entities, raw } = await queryBuilder.getRawAndEntities();

    const hasNextPage = entities.length > limit;
    const items = hasNextPage ? entities.slice(0, limit) : entities;

    const mappedItems = items.map((entity) => {
      // Resolve raw row for additional fields
      const rawItem = raw.find(
        (r) =>
          r.post_id === entity.id ||
          r.id === entity.id ||
          r.post_id_original === entity.id,
      );

      // Attach userVote
      entity['userVote'] = rawItem ? rawItem.userVote || null : null;

      // Attach topComment
      if (rawItem && rawItem.tc_id) {
        entity['topComment'] = {
          id: rawItem.tc_id,
          content: rawItem.tc_content,
          upvotes: parseInt(rawItem.tc_upvotes, 10) || 0,
          downvotes: parseInt(rawItem.tc_downvotes, 10) || 0,
          authorId: rawItem.tc_authorId,
          createdAt: new Date(rawItem.tc_createdAt),
          author: {
            id: rawItem.tc_authorId,
            username: rawItem.tc_authorUsername,
            profile: rawItem.tc_authorFullName
              ? {
                  fullName: rawItem.tc_authorFullName,
                }
              : null,
          },
        };
      } else {
        entity['topComment'] = null;
      }

      return entity;
    });

    let nextCursor: string | null = null;
    if (hasNextPage && items.length > 0) {
      const lastItem = items[items.length - 1];
      if (sort === 'hot') {
        const payload = `${lastItem.score}_${lastItem.createdAt.toISOString()}_${lastItem.id}`;
        nextCursor = Buffer.from(payload).toString('base64');
      } else {
        const payload = `${lastItem.createdAt.toISOString()}_${lastItem.id}`;
        nextCursor = Buffer.from(payload).toString('base64');
      }
    }

    return {
      items: mappedItems,
      nextCursor,
    };
  }

  async getPostById(
    postId: string,
    currentUserId?: string,
    currentUserRole?: ROLE,
  ): Promise<Post> {
    const queryBuilder = this.postRepository
      .createQueryBuilder('post')
      .leftJoinAndSelect('post.author', 'author')
      .leftJoinAndSelect('author.profile', 'profile')
      .leftJoinAndSelect('post.event', 'event')
      .where('post.id = :postId', { postId });

    // DISTINCT ON subquery for highest-scoring root comment (topComment)
    queryBuilder.leftJoin(
      (qb) => {
        return qb
          .select('c.id', 'id')
          .distinctOn(['c.post_id'])
          .addSelect('c.content', 'content')
          .addSelect('c.upvotes', 'upvotes')
          .addSelect('c.downvotes', 'downvotes')
          .addSelect('c.author_id', 'author_id')
          .addSelect('c.created_at', 'created_at')
          .addSelect('c.post_id', 'post_id')
          .addSelect('u.username', 'author_username')
          .addSelect('up.full_name', 'author_full_name')
          .from(Comment, 'c')
          .leftJoin(User, 'u', 'u.id = c.author_id')
          .leftJoin(UserProfile, 'up', 'up.user_id = u.id')
          .where('c.parent_id IS NULL')
          .andWhere('c.deleted_at IS NULL')
          .andWhere('(c.upvotes - c.downvotes) > 0')
          .orderBy('c.post_id')
          .addOrderBy('(c.upvotes - c.downvotes)', 'DESC')
          .addOrderBy('c.created_at', 'ASC');
      },
      'tc',
      'tc.post_id = post.id',
    );

    queryBuilder
      .addSelect('tc.id', 'tc_id')
      .addSelect('tc.content', 'tc_content')
      .addSelect('tc.upvotes', 'tc_upvotes')
      .addSelect('tc.downvotes', 'tc_downvotes')
      .addSelect('(tc.author_id)', 'tc_authorId')
      .addSelect('(tc.created_at)', 'tc_createdAt')
      .addSelect('(tc.author_username)', 'tc_authorUsername')
      .addSelect('(tc.author_full_name)', 'tc_authorFullName');

    if (currentUserId) {
      queryBuilder
        .leftJoin(
          'post_votes',
          'currentUserVote',
          'currentUserVote.post_id = post.id AND currentUserVote.user_id = :currentUserId',
          { currentUserId },
        )
        .addSelect('currentUserVote.type', 'userVote');
    }

    const { entities, raw } = await queryBuilder.getRawAndEntities();
    const entity = entities[0];

    if (!entity) {
      throw new NotFoundException('Post not found');
    }

    if (entity.status !== FORUM_POST_STATUS.APPROVED) {
      if (
        !currentUserId ||
        (entity.authorId !== currentUserId && currentUserRole !== ROLE.ADMIN)
      ) {
        throw new ForbiddenException('Bạn không có quyền xem bài viết này');
      }
    }

    const rawItem = raw[0];
    entity['userVote'] = rawItem ? rawItem.userVote || null : null;

    if (rawItem && rawItem.tc_id) {
      entity['topComment'] = {
        id: rawItem.tc_id,
        content: rawItem.tc_content,
        upvotes: parseInt(rawItem.tc_upvotes, 10) || 0,
        downvotes: parseInt(rawItem.tc_downvotes, 10) || 0,
        authorId: rawItem.tc_authorId,
        createdAt: new Date(rawItem.tc_createdAt),
        author: {
          id: rawItem.tc_authorId,
          username: rawItem.tc_authorUsername,
          profile: rawItem.tc_authorFullName
            ? {
                fullName: rawItem.tc_authorFullName,
              }
            : null,
        },
      };
    } else {
      entity['topComment'] = null;
    }

    return entity;
  }

  async updatePost(
    postId: string,
    dto: UpdatePostDTO,
    userId: string,
    userRole: ROLE = ROLE.USER,
  ): Promise<Post> {
    const isAdmin = userRole === ROLE.ADMIN;
    const post = await this.postRepository.findOne({ where: { id: postId } });
    if (!post) {
      throw new NotFoundException('Post not found');
    }

    if (!isAdmin && post.authorId !== userId) {
      throw new ForbiddenException(
        'You are not authorized to update this post',
      );
    }

    if (dto.content !== undefined) post.content = dto.content;
    if (dto.images !== undefined) post.images = dto.images;

    if (dto.category_id !== undefined) {
      post.category = dto.category_id;
    } else if (dto.category !== undefined) {
      post.category = dto.category;
    }

    if (dto.topic_id !== undefined) {
      let tagsVal = dto.tags || post.tags || [];
      if (!tagsVal.includes(dto.topic_id)) {
        tagsVal = [dto.topic_id, ...tagsVal];
      }
      post.tags = tagsVal;
    } else if (dto.tags !== undefined) {
      post.tags = dto.tags;
    }

    const isDraftVal =
      dto.isDraft === undefined ? undefined : dto.isDraft === true;

    let shouldEmitEvent = false;

    // Security Draft Publication Moderation Check
    if (post.status === FORUM_POST_STATUS.DRAFT && isDraftVal === false) {
      if (isAdmin) {
        post.status = FORUM_POST_STATUS.APPROVED;
        post.isAdminPost = true;
        post.flaggedReason = null;
      } else {
        const isAutoEnabled =
          (await this.systemConfigService.get(
            SYSTEM_CONFIG_KEY.AI_AUTO_MODERATION_ENABLED,
          )) === 'true';
        const postRolesStr = await this.systemConfigService.get(
          SYSTEM_CONFIG_KEY.AI_MODERATION_POST_ROLES,
        );
        let postRoles: string[] = ['USER'];
        if (postRolesStr) {
          try {
            const parsed = JSON.parse(postRolesStr);
            if (Array.isArray(parsed)) {
              postRoles = parsed;
            }
          } catch {
            postRoles = ['USER'];
          }
        }

        post.status = FORUM_POST_STATUS.PENDING;
        post.flaggedReason = null;

        if (isAutoEnabled && postRoles.includes(userRole)) {
          shouldEmitEvent = true;
        }
      }
    } else if (isDraftVal === true) {
      post.status = FORUM_POST_STATUS.DRAFT;
    }

    const savedPost = await this.postRepository.save(post);

    if (shouldEmitEvent) {
      this.eventEmitter.emit(EVENT_KEYS.POST_CREATED, { postId: savedPost.id });
    }

    return savedPost;
  }

  async votePost(
    postId: string,
    userId: string,
    type: FORUM_VOTE_TYPE,
  ): Promise<void> {
    await this.dataSource.transaction(async (manager) => {
      await handleVote({
        manager,
        userId,
        type,
        targetEntityClass: Post,
        targetId: postId,
        voteEntityClass: PostVote,
        ...VOTE_CONFIG.POST,
      });
    });
  }

  async softDeletePost(
    postId: string,
    userId: string,
    isAdmin: boolean,
  ): Promise<void> {
    const post = await this.postRepository.findOne({ where: { id: postId } });
    if (!post) {
      throw new NotFoundException('Post not found');
    }

    if (!isAdmin && post.authorId !== userId) {
      throw new ForbiddenException(
        'You are not authorized to delete this post',
      );
    }

    await this.dataSource.transaction(async (manager) => {
      // Soft-delete post
      await manager.softDelete(Post, postId);

      // Explicitly soft delete all associated comments to prevent orphaned threads
      await manager
        .createQueryBuilder()
        .update(Comment)
        .set({ deletedAt: new Date() })
        .where('post_id = :postId', { postId })
        .andWhere('deleted_at IS NULL')
        .execute();
    });
  }

  async moderatePost(
    postId: string,
    status: FORUM_POST_STATUS,
    flaggedReason?: string,
  ): Promise<Post> {
    const post = await this.postRepository.findOne({ where: { id: postId } });
    if (!post) {
      throw new NotFoundException('Post not found');
    }
    post.status = status;
    if (status === FORUM_POST_STATUS.REJECTED) {
      post.rejectedBy = ROLE.ADMIN;
    } else if (status === FORUM_POST_STATUS.APPROVED) {
      post.rejectedBy = null;
    }

    if (flaggedReason !== undefined) {
      post.flaggedReason = flaggedReason;
    }
    const savedPost = await this.postRepository.save(post);
    this.eventEmitter.emit(EVENT_KEYS.POST_MODERATED, {
      postId: savedPost.id,
      status: savedPost.status,
      authorId: savedPost.authorId,
      flaggedReason: savedPost.flaggedReason,
    });
    return savedPost;
  }

  async getMyPosts(
    userId: string,
    status?: string,
    search?: string,
  ): Promise<Post[]> {
    const queryBuilder = this.postRepository
      .createQueryBuilder('post')
      .leftJoinAndSelect('post.author', 'author')
      .leftJoinAndSelect('author.profile', 'profile')
      .leftJoinAndSelect('post.event', 'event')
      .where('post.authorId = :userId', { userId });

    if (status) {
      queryBuilder.andWhere('post.status = :status', { status });
    }

    if (search) {
      queryBuilder.andWhere(
        '(LOWER(post.content) LIKE LOWER(:search) OR LOWER(post.category) LIKE LOWER(:search))',
        { search: `%${search}%` },
      );
    }

    queryBuilder.orderBy('post.createdAt', 'DESC');

    return queryBuilder.getMany();
  }
}

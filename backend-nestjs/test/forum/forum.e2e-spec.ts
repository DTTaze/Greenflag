import * as request from 'supertest';

import {
  ExecutionContext,
  INestApplication,
  ValidationPipe,
} from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';

import { ForumController } from '@modules/forum/controllers/forum.controller';
import { CommentService } from '@modules/forum/services/comment.service';
import { PostService } from '@modules/forum/services/post.service';

import { FORUM_POST_STATUS, FORUM_VOTE_TYPE, ROLE } from '@shared/enums';
import { AuthGuard } from '@shared/guards/auth.guard';
import { OptionalAuthGuard } from '@shared/guards/optional-auth.guard';
import { generateSuccessResult } from '@shared/helpers/operation-result.helper';
import { CallQueueInterceptor } from '@shared/interceptors/call-queue.interceptor';
import { RateLimitingInterceptor } from '@shared/interceptors/rate-limiting.interceptor';

describe('ForumController (e2e)', () => {
  let app: INestApplication;

  const validPostId = '550e8400-e29b-41d4-a716-446655440000';
  const validCommentId = 'a0b1c2d3-e4f5-4789-8123-456789abcdef';
  const validEventId = 'f81d4fae-7dec-11d0-a765-00a0c91e6bf6';
  const validUserId = '9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6d';

  const mockPost = {
    id: validPostId,
    eventId: validEventId,
    authorId: validUserId,
    content: 'This is a test post content',
    images: [],
    tags: ['test'],
    upvotes: 0,
    downvotes: 0,
    commentCount: 0,
    score: 0,
    status: FORUM_POST_STATUS.APPROVED,
    category: 'Thảo luận chung',
    isAdminPost: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  const mockComment = {
    id: validCommentId,
    postId: validPostId,
    authorId: validUserId,
    parentId: null,
    content: 'This is a test comment',
    upvotes: 0,
    downvotes: 0,
    imageUrl: null,
    status: FORUM_POST_STATUS.APPROVED,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  // Mock services
  const mockPostService = {
    getPostsFeed: jest.fn().mockResolvedValue({
      posts: [mockPost],
      total: 1,
    }),
    createPost: jest.fn().mockResolvedValue(mockPost),
    getPostById: jest.fn().mockResolvedValue(mockPost),
    updatePost: jest.fn().mockResolvedValue(mockPost),
    softDeletePost: jest.fn().mockResolvedValue(undefined),
    votePost: jest.fn().mockResolvedValue(undefined),
    aiEnhanceContent: jest.fn().mockResolvedValue({
      enhancedContent: 'Polished post content',
    }),
    getMyPosts: jest.fn().mockResolvedValue([mockPost]),
  };

  const mockCommentService = {
    getCommentsForPost: jest.fn().mockResolvedValue({
      comments: [mockComment],
      total: 1,
    }),
    createComment: jest.fn().mockResolvedValue(mockComment),
    updateComment: jest.fn().mockResolvedValue(mockComment),
    softDeleteComment: jest.fn().mockResolvedValue(undefined),
    voteComment: jest.fn().mockResolvedValue(undefined),
  };

  // AuthGuard and OptionalAuthGuard Bypass Mock
  const mockAuthGuard = {
    canActivate: (context: ExecutionContext) => {
      const req = context.switchToHttp().getRequest();
      req.user = {
        id: validUserId,
        username: 'test_user',
        role: ROLE.USER,
      };
      req.context = {
        user: {
          id: validUserId,
          username: 'test_user',
          role: ROLE.USER,
        },
      };
      return true;
    },
  };

  const mockOptionalAuthGuard = {
    canActivate: (context: ExecutionContext) => {
      const req = context.switchToHttp().getRequest();
      req.user = {
        id: validUserId,
        username: 'test_user',
        role: ROLE.USER,
      };
      return true;
    },
  };

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      controllers: [ForumController],
      providers: [
        {
          provide: PostService,
          useValue: mockPostService,
        },
        {
          provide: CommentService,
          useValue: mockCommentService,
        },
      ],
    })
      .overrideGuard(AuthGuard)
      .useValue(mockAuthGuard)
      .overrideGuard(OptionalAuthGuard)
      .useValue(mockOptionalAuthGuard)
      .overrideInterceptor(RateLimitingInterceptor)
      .useValue({
        intercept: (context: ExecutionContext, next: any) => next.handle(),
      })
      .overrideInterceptor(CallQueueInterceptor)
      .useValue({
        intercept: (context: ExecutionContext, next: any) => next.handle(),
      })
      .compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(
      new ValidationPipe({
        transform: true,
        whitelist: true,
        forbidNonWhitelisted: true,
        forbidUnknownValues: true,
        transformOptions: { enableImplicitConversion: true },
      }),
    );
    await app.init();
  });

  afterAll(async () => {
    if (app) {
      await app.close();
    }
  });

  describe('GET /forum/posts', () => {
    it('should return a paginated feed of posts (200 OK)', () => {
      return request(app.getHttpServer())
        .get('/forum/posts')
        .query({ limit: 10 })
        .expect(200)
        .expect((res) => {
          expect(res.body.success).toBe(true);
          expect(res.body.data.posts).toBeDefined();
          expect(res.body.data.posts[0].content).toBe(
            'This is a test post content',
          );
        });
    });
  });

  describe('POST /forum/posts', () => {
    it('should create a new post (201 Created)', () => {
      return request(app.getHttpServer())
        .post('/forum/posts')
        .send({
          content: 'This is a test post content',
          tags: ['test'],
          category: 'Thảo luận chung',
        })
        .expect(201)
        .expect((res) => {
          expect(res.body.success).toBe(true);
          expect(res.body.data.id).toBe(validPostId);
        });
    });

    it('should fail creation if content is empty (400 Bad Request)', () => {
      return request(app.getHttpServer())
        .post('/forum/posts')
        .send({
          tags: ['test'],
        })
        .expect(400);
    });
  });

  describe('GET /forum/posts/my-posts', () => {
    it('should return my posts (200 OK)', () => {
      return request(app.getHttpServer())
        .get('/forum/posts/my-posts')
        .expect(200)
        .expect((res) => {
          expect(res.body.success).toBe(true);
          expect(Array.isArray(res.body.data)).toBe(true);
        });
    });
  });

  describe('GET /forum/posts/:id', () => {
    it('should return detailed post by ID (200 OK)', () => {
      return request(app.getHttpServer())
        .get(`/forum/posts/${validPostId}`)
        .expect(200)
        .expect((res) => {
          expect(res.body.success).toBe(true);
          expect(res.body.data.id).toBe(validPostId);
        });
    });
  });

  describe('PUT /forum/posts/:id', () => {
    it('should update post content (200 OK)', () => {
      return request(app.getHttpServer())
        .put(`/forum/posts/${validPostId}`)
        .send({
          content: 'Updated content',
        })
        .expect(200)
        .expect((res) => {
          expect(res.body.success).toBe(true);
        });
    });
  });

  describe('POST /forum/posts/:id/vote', () => {
    it('should successfully vote up (201 Created)', () => {
      return request(app.getHttpServer())
        .post(`/forum/posts/${validPostId}/vote`)
        .send({
          type: FORUM_VOTE_TYPE.UP,
        })
        .expect(201)
        .expect((res) => {
          expect(res.body.success).toBe(true);
          expect(res.body.message).toBe('Vote updated successfully');
        });
    });

    it('should fail if vote type is invalid (400 Bad Request)', () => {
      return request(app.getHttpServer())
        .post(`/forum/posts/${validPostId}/vote`)
        .send({
          type: 'INVALID_VOTE',
        })
        .expect(400);
    });
  });

  describe('POST /forum/posts/ai-enhance', () => {
    it('should polish draft content (201 Created)', () => {
      return request(app.getHttpServer())
        .post('/forum/posts/ai-enhance')
        .send({
          content: 'raw content',
        })
        .expect(201)
        .expect((res) => {
          expect(res.body.success).toBe(true);
          expect(res.body.data.enhancedContent).toBe('Polished post content');
        });
    });
  });

  describe('GET /forum/posts/:id/comments', () => {
    it('should return comments for a post (200 OK)', () => {
      return request(app.getHttpServer())
        .get(`/forum/posts/${validPostId}/comments`)
        .expect(200)
        .expect((res) => {
          expect(res.body.success).toBe(true);
          expect(res.body.data.comments).toBeDefined();
        });
    });
  });

  describe('POST /forum/posts/:id/comments', () => {
    it('should create comment (201 Created)', () => {
      return request(app.getHttpServer())
        .post(`/forum/posts/${validPostId}/comments`)
        .send({
          content: 'This is a test comment',
        })
        .expect(201)
        .expect((res) => {
          expect(res.body.success).toBe(true);
          expect(res.body.data.id).toBe(validCommentId);
        });
    });
  });

  describe('PUT /forum/comments/:id', () => {
    it('should update comment (200 OK)', () => {
      return request(app.getHttpServer())
        .put(`/forum/comments/${validCommentId}`)
        .send({
          content: 'Updated comment content',
        })
        .expect(200)
        .expect((res) => {
          expect(res.body.success).toBe(true);
        });
    });
  });

  describe('POST /forum/comments/:id/vote', () => {
    it('should successfully vote on comment (201 Created)', () => {
      return request(app.getHttpServer())
        .post(`/forum/comments/${validCommentId}/vote`)
        .send({
          type: FORUM_VOTE_TYPE.UP,
        })
        .expect(201)
        .expect((res) => {
          expect(res.body.success).toBe(true);
          expect(res.body.message).toBe('Vote updated successfully');
        });
    });
  });

  describe('DELETE /forum/posts/:id', () => {
    it('should soft delete post (200 OK)', () => {
      return request(app.getHttpServer())
        .delete(`/forum/posts/${validPostId}`)
        .expect(200)
        .expect((res) => {
          expect(res.body.success).toBe(true);
          expect(res.body.message).toBe('Post deleted successfully');
        });
    });
  });

  describe('DELETE /forum/comments/:id', () => {
    it('should soft delete comment (200 OK)', () => {
      return request(app.getHttpServer())
        .delete(`/forum/comments/${validCommentId}`)
        .expect(200)
        .expect((res) => {
          expect(res.body.success).toBe(true);
          expect(res.body.message).toBe('Comment deleted successfully');
        });
    });
  });
});

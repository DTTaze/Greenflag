import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  UploadedFile,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';

import { User } from '@modules/user/entities/user.entity';

import { RequestUser } from '@shared/decorators/request-user.decorator';
import { ROLE } from '@shared/enums';
import { AuthGuard } from '@shared/guards/auth.guard';
import { OptionalAuthGuard } from '@shared/guards/optional-auth.guard';
import { generateSuccessResult } from '@shared/helpers/operation-result.helper';
import { UseCallQueue } from '@shared/interceptors/call-queue.interceptor';
import { ApplyRateLimiting } from '@shared/interceptors/rate-limiting.interceptor';

import {
  CreateCommentDTO,
  FindOneCommentParamDTO,
  GetCommentsQueryDTO,
  UpdateCommentDTO,
  VoteCommentDTO,
} from '../dto/comment.dto';
import {
  AiEnhancePostDTO,
  CreatePostDTO,
  FindOnePostParamDTO,
  GetMyPostsQueryDTO,
  GetPostsQueryDTO,
  UpdatePostDTO,
  VotePostDTO,
} from '../dto/post.dto';
import { CommentService } from '../services/comment.service';
import { PostService } from '../services/post.service';

@ApiTags('Forum')
@ApiBearerAuth()
@Controller('forum')
export class ForumController {
  constructor(
    private readonly postService: PostService,
    private readonly commentService: CommentService,
  ) {}

  @Get('posts')
  @UseGuards(OptionalAuthGuard)
  @ApiOperation({ summary: 'Get paginated post feed' })
  async getPostsFeed(
    @Query() query: GetPostsQueryDTO,
    @RequestUser('optional') user?: User,
  ) {
    const data = await this.postService.getPostsFeed(
      query,
      user?.id,
      user?.role,
    );
    return generateSuccessResult(data);
  }

  @Post('posts/ai-enhance')
  @UseGuards(AuthGuard)
  @UseCallQueue()
  @ApplyRateLimiting(5)
  @ApiOperation({ summary: 'AI Polish draft post content' })
  async aiEnhanceContent(@Body() dto: AiEnhancePostDTO) {
    const result = await this.postService.aiEnhanceContent(dto.content);
    return generateSuccessResult(result);
  }

  @Post('posts')
  @UseGuards(AuthGuard)
  @UseInterceptors(
    FilesInterceptor('images', 5, {
      limits: { fileSize: 5 * 1024 * 1024 },
    }),
  )
  @UseCallQueue()
  @ApplyRateLimiting(10)
  @ApiOperation({ summary: 'Create a new forum post' })
  async createPost(
    @Body() dto: CreatePostDTO,
    @RequestUser() user: User,
    @UploadedFiles() files?: Express.Multer.File[],
  ) {
    const post = await this.postService.createPost(
      dto,
      user.id,
      user.role,
      files,
    );
    return generateSuccessResult(post);
  }

  @Get('posts/my-posts')
  @UseGuards(AuthGuard)
  @ApiOperation({ summary: 'Get post history of current user' })
  async getMyPosts(
    @RequestUser() user: User,
    @Query() query: GetMyPostsQueryDTO,
  ) {
    const data = await this.postService.getMyPosts(
      user.id,
      query.status,
      query.search,
    );
    return generateSuccessResult(data);
  }

  @Get('posts/:id')
  @UseGuards(OptionalAuthGuard)
  @ApiOperation({ summary: 'Get detailed post by ID' })
  async getPostById(
    @Param() params: FindOnePostParamDTO,
    @RequestUser('optional') user?: User,
  ) {
    const post = await this.postService.getPostById(params.id, user?.id);
    return generateSuccessResult(post);
  }

  @Put('posts/:id')
  @UseGuards(AuthGuard)
  @ApplyRateLimiting(10)
  @ApiOperation({ summary: 'Update post content' })
  async updatePost(
    @Param() params: FindOnePostParamDTO,
    @Body() dto: UpdatePostDTO,
    @RequestUser() user: User,
  ) {
    const isAdmin = user.role === ROLE.ADMIN;
    const post = await this.postService.updatePost(
      params.id,
      dto,
      user.id,
      isAdmin,
    );
    return generateSuccessResult(post);
  }

  @Delete('posts/:id')
  @UseGuards(AuthGuard)
  @ApplyRateLimiting(10)
  @ApiOperation({ summary: 'Soft delete a post' })
  async softDeletePost(
    @Param() params: FindOnePostParamDTO,
    @RequestUser() user: User,
  ) {
    const isAdmin = user.role === ROLE.ADMIN;
    await this.postService.softDeletePost(params.id, user.id, isAdmin);
    return generateSuccessResult(null, 'Post deleted successfully');
  }

  @Post('posts/:id/vote')
  @UseGuards(AuthGuard)
  @UseCallQueue()
  @ApplyRateLimiting(30)
  @ApiOperation({ summary: 'Vote (up/down/none) a post' })
  async votePost(
    @Param() params: FindOnePostParamDTO,
    @Body() dto: VotePostDTO,
    @RequestUser() user: User,
  ) {
    await this.postService.votePost(params.id, user.id, dto.type);
    return generateSuccessResult(null, 'Vote updated successfully');
  }

  @Get('posts/:id/comments')
  @UseGuards(OptionalAuthGuard)
  @ApiOperation({ summary: 'Get comments of a post' })
  async getComments(
    @Param() params: FindOnePostParamDTO,
    @Query() query: GetCommentsQueryDTO,
    @RequestUser('optional') user?: User,
  ) {
    const data = await this.commentService.getCommentsForPost(
      params.id,
      query,
      user?.id,
    );
    return generateSuccessResult(data);
  }

  @Post('posts/:id/comments')
  @UseGuards(AuthGuard)
  @UseInterceptors(
    FileInterceptor('image', {
      limits: { fileSize: 5 * 1024 * 1024 },
      fileFilter: (req, file, cb) => {
        if (!file.mimetype.match(/\/(jpg|jpeg|png|webp)$/)) {
          return cb(
            new BadRequestException('Chỉ chấp nhận định dạng ảnh hợp lệ!'),
            false,
          );
        }
        cb(null, true);
      },
    }),
  )
  @UseCallQueue()
  @ApplyRateLimiting(15)
  @ApiOperation({ summary: 'Create comment or reply' })
  async createComment(
    @Param() params: FindOnePostParamDTO,
    @Body() dto: CreateCommentDTO,
    @RequestUser() user: User,
    @UploadedFile() file?: Express.Multer.File,
  ) {
    const comment = await this.commentService.createComment(
      params.id,
      dto,
      user.id,
      user.role,
      file,
    );
    return generateSuccessResult(comment);
  }

  @Put('comments/:id')
  @UseGuards(AuthGuard)
  @ApplyRateLimiting(10)
  @ApiOperation({ summary: 'Update a comment' })
  async updateComment(
    @Param() params: FindOneCommentParamDTO,
    @Body() dto: UpdateCommentDTO,
    @RequestUser() user: User,
  ) {
    const comment = await this.commentService.updateComment(
      params.id,
      dto,
      user.id,
    );
    return generateSuccessResult(comment);
  }

  @Delete('comments/:id')
  @UseGuards(AuthGuard)
  @ApplyRateLimiting(10)
  @ApiOperation({ summary: 'Soft delete a comment' })
  async softDeleteComment(
    @Param() params: FindOneCommentParamDTO,
    @RequestUser() user: User,
  ) {
    const isAdmin = user.role === ROLE.ADMIN;
    await this.commentService.softDeleteComment(params.id, user.id, isAdmin);
    return generateSuccessResult(null, 'Comment deleted successfully');
  }

  @Post('comments/:id/vote')
  @UseGuards(AuthGuard)
  @UseCallQueue()
  @ApplyRateLimiting(30)
  @ApiOperation({ summary: 'Vote (up/down/none) a comment' })
  async voteComment(
    @Param() params: FindOneCommentParamDTO,
    @Body() dto: VoteCommentDTO,
    @RequestUser() user: User,
  ) {
    await this.commentService.voteComment(params.id, user.id, dto.type);
    return generateSuccessResult(null, 'Vote updated successfully');
  }
}

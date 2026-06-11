import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';

import { Roles } from '@shared/decorators/roles.decorator';
import { FORUM_POST_STATUS, ROLE } from '@shared/enums';
import { AuthGuard } from '@shared/guards/auth.guard';
import { RolesGuard } from '@shared/guards/roles.guard';
import { generateSuccessResult } from '@shared/helpers/operation-result.helper';

import { PostService } from '../services/post.service';

@ApiTags('Admin Forum')
@ApiBearerAuth()
@Controller('admin/forum')
@UseGuards(AuthGuard, RolesGuard)
@Roles(ROLE.ADMIN)
export class AdminForumController {
  constructor(private readonly postService: PostService) {}

  @Get('posts')
  @ApiOperation({ summary: 'Get posts by status for admin moderation' })
  async getPosts(@Query('status') status: FORUM_POST_STATUS) {
    const data = await this.postService.getPostsFeed(
      { status, limit: 100 },
      undefined,
      ROLE.ADMIN,
    );
    return generateSuccessResult(data);
  }

  @Patch('posts/:id/approve')
  @ApiOperation({ summary: 'Approve a forum post' })
  async approvePost(@Param('id') id: string) {
    const post = await this.postService.moderatePost(
      id,
      FORUM_POST_STATUS.APPROVED,
    );
    return generateSuccessResult(post);
  }

  @Patch('posts/:id/reject')
  @ApiOperation({ summary: 'Reject/Hide a forum post' })
  async rejectPost(
    @Param('id') id: string,
    @Body() dto: { flaggedReason?: string },
  ) {
    const post = await this.postService.moderatePost(
      id,
      FORUM_POST_STATUS.REJECTED,
      dto.flaggedReason,
    );
    return generateSuccessResult(post);
  }

  @Put('posts/:id/moderate')
  @ApiOperation({ summary: 'Approve or Reject/Hide forum post' })
  async moderatePost(
    @Param('id') id: string,
    @Body() dto: { status: FORUM_POST_STATUS; flaggedReason?: string },
  ) {
    const post = await this.postService.moderatePost(
      id,
      dto.status,
      dto.flaggedReason,
    );
    return generateSuccessResult(post);
  }
}

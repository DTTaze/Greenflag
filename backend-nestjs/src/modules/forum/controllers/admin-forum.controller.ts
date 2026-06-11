import { Body, Controller, Param, Put, UseGuards } from '@nestjs/common';
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

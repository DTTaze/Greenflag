import { HttpResponse } from 'mvc-common-toolkit';

import { Controller, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

import { Roles } from '@shared/decorators/roles.decorator';
import { ROLE } from '@shared/enums';
import { AuthGuard } from '@shared/guards/auth.guard';
import { RolesGuard } from '@shared/guards/roles.guard';

import { RankService } from '../services/rank.service';

@ApiTags('Admin Ranks')
@ApiBearerAuth()
@Controller('admin/ranks')
@UseGuards(AuthGuard, RolesGuard)
@Roles(ROLE.ADMIN)
export class AdminRankController {
  constructor(private readonly rankService: RankService) {}

  @Post('rearrange')
  async rearrangeRanks(): Promise<HttpResponse> {
    return this.rankService.rearrangeRanks();
  }
}

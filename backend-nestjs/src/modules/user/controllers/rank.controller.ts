import { Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

import { Roles } from '@shared/decorators/roles.decorator';
import { ROLE } from '@shared/enums';
import { AuthGuard } from '@shared/guards/auth.guard';
import { RolesGuard } from '@shared/guards/roles.guard';

import { RankService } from '../services/rank.service';

@ApiTags('Ranks')
@ApiBearerAuth()
@Controller('ranks')
@UseGuards(AuthGuard)
export class RankController {
  constructor(private readonly rankService: RankService) {}

  @Get(':id')
  async getRank(@Param('id') id: string) {
    return this.rankService.getRankById(id);
  }

  @Post('rearrange')
  @UseGuards(RolesGuard)
  @Roles(ROLE.ADMIN, ROLE.PARTNER)
  async rearrangeRanks() {
    return this.rankService.rearrangeRanks();
  }
}

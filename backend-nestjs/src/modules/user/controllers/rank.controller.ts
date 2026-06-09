import { HttpResponse } from 'mvc-common-toolkit';

import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

import { AuthGuard } from '@shared/guards/auth.guard';

import { RankService } from '../services/rank.service';

@ApiTags('Ranks')
@ApiBearerAuth()
@Controller('ranks')
@UseGuards(AuthGuard)
export class RankController {
  constructor(private readonly rankService: RankService) {}

  @Get(':id')
  async getRank(@Param('id') id: string): Promise<HttpResponse> {
    return this.rankService.getRankById(id);
  }
}

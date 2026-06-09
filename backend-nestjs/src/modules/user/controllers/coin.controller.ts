import { HttpResponse } from 'mvc-common-toolkit';

import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

import { AuthGuard } from '@shared/guards/auth.guard';

import { CoinService } from '../services/coin.service';

@ApiTags('Coins')
@ApiBearerAuth()
@Controller('coins')
@UseGuards(AuthGuard)
export class CoinController {
  constructor(private readonly coinService: CoinService) {}

  @Get(':id')
  async getCoin(@Param('id') id: string): Promise<HttpResponse> {
    return this.coinService.getCoin(id);
  }
}

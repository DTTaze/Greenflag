import { HttpResponse } from 'mvc-common-toolkit';

import { Body, Controller, Param, Put, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

import { Roles } from '@shared/decorators/roles.decorator';
import { ROLE } from '@shared/enums';
import { AuthGuard } from '@shared/guards/auth.guard';
import { RolesGuard } from '@shared/guards/roles.guard';

import { UpdateCoinDto } from '../dtos/coin.dto';
import { CoinService } from '../services/coin.service';

@ApiTags('Admin Coins')
@ApiBearerAuth()
@Controller('admin/coins')
@UseGuards(AuthGuard, RolesGuard)
@Roles(ROLE.ADMIN)
export class AdminCoinController {
  constructor(private readonly coinService: CoinService) {}

  @Put(':id')
  async updateCoin(
    @Param('id') id: string,
    @Body() dto: UpdateCoinDto,
  ): Promise<HttpResponse> {
    return this.coinService.updateCoin(id, dto);
  }

  @Put(':id/increase')
  async increaseCoin(
    @Param('id') id: string,
    @Body() dto: UpdateCoinDto,
  ): Promise<HttpResponse> {
    return this.coinService.updateIncreaseCoin(id, dto);
  }

  @Put(':id/decrease')
  async decreaseCoin(
    @Param('id') id: string,
    @Body() dto: UpdateCoinDto,
  ): Promise<HttpResponse> {
    return this.coinService.updateDecreaseCoin(id, dto);
  }
}

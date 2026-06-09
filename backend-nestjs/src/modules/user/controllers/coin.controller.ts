import { Body, Controller, Get, Param, Put, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

import { Roles } from '@shared/decorators/roles.decorator';
import { ROLE } from '@shared/enums';
import { AuthGuard } from '@shared/guards/auth.guard';
import { RolesGuard } from '@shared/guards/roles.guard';

import { UpdateCoinDto } from '../dtos/coin.dto';
import { CoinService } from '../services/coin.service';

@ApiTags('Coins')
@ApiBearerAuth()
@Controller('coins')
@UseGuards(AuthGuard)
export class CoinController {
  constructor(private readonly coinService: CoinService) {}

  @Get(':id')
  async getCoin(@Param('id') id: string) {
    return this.coinService.getCoin(id);
  }

  @Put('update/:id')
  @UseGuards(RolesGuard)
  @Roles(ROLE.ADMIN, ROLE.PARTNER)
  async updateCoin(@Param('id') id: string, @Body() dto: UpdateCoinDto) {
    return this.coinService.updateCoin(id, dto.coins);
  }

  @Put('increase/:id')
  @UseGuards(RolesGuard)
  @Roles(ROLE.ADMIN, ROLE.PARTNER)
  async increaseCoin(@Param('id') id: string, @Body() dto: UpdateCoinDto) {
    return this.coinService.updateIncreaseCoin(id, dto.coins);
  }

  @Put('decrease/:id')
  @UseGuards(RolesGuard)
  @Roles(ROLE.ADMIN, ROLE.PARTNER)
  async decreaseCoin(@Param('id') id: string, @Body() dto: UpdateCoinDto) {
    return this.coinService.updateDecreaseCoin(id, dto.coins);
  }
}

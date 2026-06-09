import { HttpResponse } from 'mvc-common-toolkit';

import {
  Body,
  Controller,
  Delete,
  Get,
  Headers,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

import { User } from '@modules/user/entities/user.entity';

import { RequestUser } from '@shared/decorators/request-user.decorator';
import { Roles } from '@shared/decorators/roles.decorator';
import { CARRIER_TYPE, ROLE } from '@shared/enums';
import { AuthGuard } from '@shared/guards/auth.guard';
import { RolesGuard } from '@shared/guards/roles.guard';
import { mapToDeliveryAccountEntity } from '@shared/helpers/delivery-mapping.helper';

import {
  CreateDeliveryAccountDto,
  UpdateDeliveryAccountDto,
} from './dtos/delivery.dto';
import { DeliveryAccountService } from './services/delivery-account.service';
import { DeliveryOrderService } from './services/delivery-order.service';

@ApiTags('Partner Delivery')
@ApiBearerAuth()
@Controller('partner/delivery')
@UseGuards(AuthGuard, RolesGuard)
@Roles(ROLE.PARTNER)
export class PartnerDeliveryController {
  constructor(
    private readonly deliveryAccountService: DeliveryAccountService,
    private readonly deliveryOrderService: DeliveryOrderService,
  ) {}

  @Get('accounts')
  public async getMyDeliveryAccounts(
    @RequestUser() user: User,
  ): Promise<HttpResponse> {
    return this.deliveryAccountService.getAllDeliveryAccounts(user.id);
  }

  @Get('accounts/:id')
  public async getMyDeliveryAccountById(
    @Param('id') id: string,
    @RequestUser() user: User,
  ): Promise<HttpResponse> {
    return this.deliveryAccountService.getDeliveryAccountById(
      id,
      user.id,
      false,
    );
  }

  @Post('accounts')
  public async createDeliveryAccount(
    @RequestUser() user: User,
    @Body() dto: CreateDeliveryAccountDto,
  ): Promise<HttpResponse> {
    const mapped = mapToDeliveryAccountEntity(dto);
    return this.deliveryAccountService.create({
      ...mapped,
      userId: user.id,
    });
  }

  @Patch('accounts/:id')
  public async updateDeliveryAccount(
    @Param('id') id: string,
    @Body() dto: UpdateDeliveryAccountDto,
    @RequestUser() user: User,
  ): Promise<HttpResponse> {
    const mapped = mapToDeliveryAccountEntity(dto);
    return this.deliveryAccountService.updateDeliveryAccount(
      id,
      mapped,
      user.id,
      false,
    );
  }

  @Delete('accounts/:id')
  public async deleteDeliveryAccount(
    @Param('id') id: string,
    @RequestUser() user: User,
  ): Promise<HttpResponse> {
    return this.deliveryAccountService.deleteDeliveryAccount(
      id,
      user.id,
      false,
    );
  }

  @Patch('accounts/:id/default')
  public async setDefaultDeliveryAccount(
    @Param('id') id: string,
    @RequestUser() user: User,
  ): Promise<HttpResponse> {
    return this.deliveryAccountService.setDefaultDeliveryAccount(
      id,
      user.id,
      false,
    );
  }

  @Get('orders')
  public async getDeliveryOrdersBySeller(
    @RequestUser() user: User,
  ): Promise<HttpResponse> {
    return this.deliveryOrderService.getDeliveryOrdersBySeller(user.id);
  }

  @Post('orders/:orderCode/cancel')
  public async cancelDeliveryOrder(
    @RequestUser() user: User,
    @Param('orderCode') orderCode: string,
    @Query('carrier') carrier: CARRIER_TYPE = CARRIER_TYPE.GHN,
    @Headers('token') token?: string,
    @Headers('shop_id') shopId?: string,
  ): Promise<HttpResponse> {
    return this.deliveryOrderService.cancelDeliveryOrder(
      orderCode,
      token,
      shopId,
      user.id,
      false,
      carrier,
    );
  }
}

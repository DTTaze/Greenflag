import { HttpResponse } from 'mvc-common-toolkit';

import {
  Controller,
  Get,
  Headers,
  Param,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

import { User } from '@modules/user/entities/user.entity';

import { RequestUser } from '@shared/decorators/request-user.decorator';
import { Roles } from '@shared/decorators/roles.decorator';
import { CARRIER_TYPE, DELIVERY_ORDER_STATUS, ROLE } from '@shared/enums';
import { AuthGuard } from '@shared/guards/auth.guard';
import { RolesGuard } from '@shared/guards/roles.guard';

import { DeliveryAccountService } from './services/delivery-account.service';
import { DeliveryOrderService } from './services/delivery-order.service';

@ApiTags('Admin Delivery')
@ApiBearerAuth()
@Controller('admin/delivery')
@UseGuards(AuthGuard, RolesGuard)
@Roles(ROLE.ADMIN)
export class AdminDeliveryController {
  constructor(
    private readonly deliveryAccountService: DeliveryAccountService,
    private readonly deliveryOrderService: DeliveryOrderService,
  ) {}

  @Get('accounts')
  public async getAllDeliveryAccounts(): Promise<HttpResponse> {
    return this.deliveryAccountService.findAll();
  }

  @Get('orders')
  public async getAllDeliveryOrders(): Promise<HttpResponse> {
    return this.deliveryOrderService.findAll();
  }

  @Get('orders/status/:status')
  public async getAllDeliveryOrdersByStatus(
    @Param('status') status: DELIVERY_ORDER_STATUS,
  ): Promise<HttpResponse> {
    return this.deliveryOrderService.getAllDeliveryOrdersByStatus(status);
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
      true, // isAdmin = true
      carrier,
    );
  }
}

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
@Roles(ROLE.PARTNER, ROLE.ADMIN)
export class PartnerDeliveryController {
  constructor(
    private readonly deliveryAccountService: DeliveryAccountService,
    private readonly deliveryOrderService: DeliveryOrderService,
  ) {}

  @Get('accounts')
  public async getMyDeliveryAccounts(
    @RequestUser() user: any,
  ): Promise<HttpResponse> {
    const isAdmin = user.role === ROLE.ADMIN;
    return this.deliveryAccountService.getAllDeliveryAccounts(user.id, isAdmin);
  }

  @Get('accounts/:id')
  public async getMyDeliveryAccountById(
    @Param('id') id: string,
    @RequestUser() user: any,
  ): Promise<HttpResponse> {
    const isAdmin = user.role === ROLE.ADMIN;
    return this.deliveryAccountService.getDeliveryAccountById(
      id,
      user.id,
      isAdmin,
    );
  }

  @Post('accounts')
  public async createDeliveryAccount(
    @RequestUser() user: any,
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
    @RequestUser() user: any,
  ): Promise<HttpResponse> {
    const mapped = mapToDeliveryAccountEntity(dto);
    const isAdmin = user.role === ROLE.ADMIN;
    return this.deliveryAccountService.updateDeliveryAccount(
      id,
      mapped,
      user.id,
      isAdmin,
    );
  }

  @Delete('accounts/:id')
  public async deleteDeliveryAccount(
    @Param('id') id: string,
    @RequestUser() user: any,
  ): Promise<HttpResponse> {
    const isAdmin = user.role === ROLE.ADMIN;
    return this.deliveryAccountService.deleteDeliveryAccount(
      id,
      user.id,
      isAdmin,
    );
  }

  @Patch('accounts/:id/default')
  public async setDefaultDeliveryAccount(
    @Param('id') id: string,
    @RequestUser() user: any,
  ): Promise<HttpResponse> {
    const isAdmin = user.role === ROLE.ADMIN;
    return this.deliveryAccountService.setDefaultDeliveryAccount(
      id,
      user.id,
      isAdmin,
    );
  }

  @Get('orders')
  public async getDeliveryOrdersBySeller(
    @RequestUser() user: any,
  ): Promise<HttpResponse> {
    const isAdmin = user.role === ROLE.ADMIN;
    return this.deliveryOrderService.getDeliveryOrdersBySeller(
      user.id,
      isAdmin,
    );
  }

  @Post('orders/:orderCode/cancel')
  public async cancelDeliveryOrder(
    @RequestUser() user: any,
    @Param('orderCode') orderCode: string,
    @Query('carrier') carrier: CARRIER_TYPE = CARRIER_TYPE.GHN,
    @Headers('token') token?: string,
    @Headers('shop_id') shopId?: string,
  ): Promise<HttpResponse> {
    const isAdmin = user.role === ROLE.ADMIN;
    return this.deliveryOrderService.cancelDeliveryOrder(
      orderCode,
      token,
      shopId,
      user.id,
      isAdmin,
      carrier,
    );
  }
}

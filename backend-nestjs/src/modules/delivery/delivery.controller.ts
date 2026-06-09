import { HttpResponse } from 'mvc-common-toolkit';

import {
  BadRequestException,
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
import { CARRIER_TYPE, DELIVERY_ORDER_STATUS } from '@shared/enums';
import { AuthGuard } from '@shared/guards/auth.guard';
import {
  mapToDeliveryAccountEntity,
  mapToReceiverInfoEntity,
} from '@shared/helpers/delivery-mapping.helper';

import {
  CreateDeliveryAccountDto,
  CreateDeliveryOrderDto,
  CreateDeliveryOrderFromTransactionDto,
  CreateReceiverInfoDto,
  UpdateDeliveryAccountDto,
  UpdateDeliveryOrderDto,
  UpdateReceiverInfoDto,
} from './dtos/delivery.dto';
import { DeliveryAccount } from './entities/delivery-account.entity';
import { DeliveryAccountService } from './services/delivery-account.service';
import { DeliveryOrderService } from './services/delivery-order.service';
import { ReceiverInformationService } from './services/receiver-information.service';
import { ShippingFactoryService } from './services/shipping-factory.service';

@ApiTags('Delivery')
@Controller('delivery')
@UseGuards(AuthGuard)
@ApiBearerAuth()
export class DeliveryController {
  constructor(
    private readonly deliveryAccountService: DeliveryAccountService,
    private readonly receiverInformationService: ReceiverInformationService,
    private readonly deliveryOrderService: DeliveryOrderService,
    private readonly shippingFactoryService: ShippingFactoryService,
  ) {}

  // --- Delivery Accounts ---

  @Get('accounts')
  public async getAllDeliveryAccounts(
    @RequestUser() user: User,
  ): Promise<HttpResponse> {
    const accounts = await this.deliveryAccountService.getAllDeliveryAccounts(
      user.id,
    );
    return {
      success: true,
      message: 'Get all delivery accounts success',
      data: accounts,
    };
  }

  @Get('accounts/:id')
  public async getDeliveryAccountById(
    @Param('id') id: string,
  ): Promise<HttpResponse> {
    const account =
      await this.deliveryAccountService.getDeliveryAccountById(id);
    return {
      success: true,
      message: 'Get delivery account success',
      data: account,
    };
  }

  @Post('accounts')
  public async createDeliveryAccount(
    @RequestUser() user: User,
    @Body() dto: CreateDeliveryAccountDto,
  ): Promise<HttpResponse> {
    const mapped = mapToDeliveryAccountEntity(dto);
    const account = await this.deliveryAccountService.create({
      ...mapped,
      userId: user.id,
    });
    return {
      success: true,
      message: 'Create delivery account success',
      data: account,
    };
  }

  @Patch('accounts/:id')
  public async updateDeliveryAccount(
    @Param('id') id: string,
    @Body() dto: UpdateDeliveryAccountDto,
  ): Promise<HttpResponse> {
    const mapped = mapToDeliveryAccountEntity(dto);
    const account = await this.deliveryAccountService.updateByID(id, mapped);
    return {
      success: true,
      message: 'Update delivery account success',
      data: account,
    };
  }

  @Delete('accounts/:id')
  public async deleteDeliveryAccount(
    @Param('id') id: string,
  ): Promise<HttpResponse> {
    await this.deliveryAccountService.deleteByID(id);
    return {
      success: true,
      message: 'Delete delivery account success',
    };
  }

  @Patch('accounts/:id/default')
  public async setDefaultDeliveryAccount(
    @Param('id') id: string,
  ): Promise<HttpResponse> {
    const account =
      await this.deliveryAccountService.setDefaultDeliveryAccount(id);
    return {
      success: true,
      message: 'Set default delivery account success',
      data: account,
    };
  }

  // --- Receiver Informations ---

  @Get('receivers')
  public async getReceiverInfoByUserId(
    @RequestUser() user: User,
  ): Promise<HttpResponse> {
    const receivers =
      await this.receiverInformationService.getReceiverInfoByUserId(user.id);
    return {
      success: true,
      message: 'Receiver informations fetched successfully',
      data: receivers,
    };
  }

  @Get('receivers/:id')
  public async getReceiverInfoById(
    @Param('id') id: string,
  ): Promise<HttpResponse> {
    const receiver =
      await this.receiverInformationService.getReceiverInfoById(id);
    return {
      success: true,
      message: 'Receiver information fetched successfully',
      data: receiver,
    };
  }

  @Post('receivers')
  public async createReceiverInfo(
    @RequestUser() user: User,
    @Body() dto: CreateReceiverInfoDto,
  ): Promise<HttpResponse> {
    const mapped = mapToReceiverInfoEntity(dto);
    const receiver = await this.receiverInformationService.create({
      ...mapped,
      userId: user.id,
    });
    return {
      success: true,
      message: 'Receiver information created successfully',
      data: receiver,
    };
  }

  @Patch('receivers/:id')
  public async updateReceiverInfoById(
    @Param('id') id: string,
    @Body() dto: UpdateReceiverInfoDto,
  ): Promise<HttpResponse> {
    const mapped = mapToReceiverInfoEntity(dto);
    const receiver = await this.receiverInformationService.updateByID(
      id,
      mapped,
    );
    return {
      success: true,
      message: 'Receiver information updated successfully',
      data: receiver,
    };
  }

  @Delete('receivers/:id')
  public async deleteReceiverInfoById(
    @Param('id') id: string,
  ): Promise<HttpResponse> {
    await this.receiverInformationService.deleteByID(id);
    return {
      success: true,
      message: 'Receiver information deleted successfully',
    };
  }

  @Patch('receivers/:id/default')
  public async setDefaultReceiverInfoById(
    @Param('id') id: string,
  ): Promise<HttpResponse> {
    const receiver =
      await this.receiverInformationService.setDefaultReceiverInfoById(id);
    return {
      success: true,
      message: 'Receiver information set default successfully',
      data: receiver,
    };
  }

  // --- Delivery Orders ---

  @Get('provinces')
  public async getAllProvinces(
    @Query('carrier') carrier: CARRIER_TYPE = CARRIER_TYPE.GHN,
    @Headers('token') token?: string,
    @Headers('shop_id') shopId?: string,
  ): Promise<HttpResponse> {
    const provider = this.shippingFactoryService.getProvider(carrier);
    const tempAccount = new DeliveryAccount();
    tempAccount.carrier = carrier;
    tempAccount.apiConfig = { token, shopId };

    const data = await provider.getProvinces(tempAccount);
    return {
      success: true,
      message: 'Get all provinces success',
      data,
    };
  }

  @Post('districts')
  public async getAllDistrictsByProvince(
    @Query('carrier') carrier: CARRIER_TYPE = CARRIER_TYPE.GHN,
    @Headers('token') token?: string,
    @Headers('shop_id') shopId?: string,
    @Body('province_id') provinceId?: number,
  ): Promise<HttpResponse> {
    if (!provinceId) {
      throw new BadRequestException('province_id is required');
    }
    const provider = this.shippingFactoryService.getProvider(carrier);
    const tempAccount = new DeliveryAccount();
    tempAccount.carrier = carrier;
    tempAccount.apiConfig = { token, shopId };

    const data = await provider.getDistricts(tempAccount, provinceId);
    return {
      success: true,
      message: 'Get all districts success',
      data,
    };
  }

  @Get('wards')
  public async getWardsByDistrict(
    @Query('carrier') carrier: CARRIER_TYPE = CARRIER_TYPE.GHN,
    @Headers('token') token?: string,
    @Headers('shop_id') shopId?: string,
    @Query('district_id') districtId?: number,
  ): Promise<HttpResponse> {
    if (!districtId) {
      throw new BadRequestException('district_id is required');
    }
    const provider = this.shippingFactoryService.getProvider(carrier);
    const tempAccount = new DeliveryAccount();
    tempAccount.carrier = carrier;
    tempAccount.apiConfig = { token, shopId };

    const data = await provider.getWards(tempAccount, districtId);
    return {
      success: true,
      message: 'Get all wards success',
      data,
    };
  }

  @Post('preview')
  public async previewOrderWithoutOrderCode(
    @Query('carrier') carrier: CARRIER_TYPE = CARRIER_TYPE.GHN,
    @Headers('token') token?: string,
    @Headers('shop_id') shopId?: string,
    @Body() dto?: any,
  ): Promise<HttpResponse> {
    const provider = this.shippingFactoryService.getProvider(carrier);
    const tempAccount = new DeliveryAccount();
    tempAccount.carrier = carrier;
    tempAccount.apiConfig = { token, shopId };

    // GHN specific preview order implementation
    let data;
    if (typeof (provider as any).previewOrder === 'function') {
      data = await (provider as any).previewOrder(tempAccount, dto);
    } else {
      data = await provider.calculateFee(tempAccount, {
        receiverAddress: {
          name: dto.to_name,
          phone: dto.to_phone,
          address: dto.to_address,
          wardName: dto.to_ward_name || '',
          districtName: dto.to_district_name || '',
          provinceName: dto.to_province_name || '',
        },
        weight: dto.weight,
        items: dto.items || [],
        codAmount: dto.cod_amount || 0,
      });
    }

    return {
      success: true,
      message: 'Preview order success',
      data,
    };
  }

  @Post('orders')
  public async createDeliveryOrder(
    @RequestUser() user: User,
    @Query('carrier') carrier: CARRIER_TYPE = CARRIER_TYPE.GHN,
    @Headers('token') token?: string,
    @Headers('shop_id') shopId?: string,
    @Body() dto?: CreateDeliveryOrderDto,
  ): Promise<HttpResponse> {
    const result = await this.deliveryOrderService.createDeliveryOrder(
      dto,
      token,
      shopId,
      user.id,
      undefined,
      carrier,
    );
    return {
      success: true,
      message: 'Create order success',
      data: result,
    };
  }

  @Post('orders/transaction/:transactionId')
  public async createDeliveryOrderFromTransaction(
    @RequestUser() user: User,
    @Param('transactionId') transactionId: string,
    @Query('carrier') carrier: CARRIER_TYPE = CARRIER_TYPE.GHN,
    @Headers('token') token?: string,
    @Headers('shop_id') shopId?: string,
    @Body() dto?: CreateDeliveryOrderFromTransactionDto,
  ): Promise<HttpResponse> {
    const result =
      await this.deliveryOrderService.createDeliveryOrderFromTransaction(
        transactionId,
        token,
        shopId,
        user.id,
        dto,
        undefined,
        carrier,
      );
    return {
      success: true,
      message: 'Create order from transaction success',
      data: result,
    };
  }

  @Get('orders/:orderCode')
  public async getDeliveryOrderInfo(
    @Param('orderCode') orderCode: string,
    @Query('carrier') carrier: CARRIER_TYPE = CARRIER_TYPE.GHN,
    @Headers('token') token?: string,
    @Headers('shop_id') shopId?: string,
  ): Promise<HttpResponse> {
    const provider = this.shippingFactoryService.getProvider(carrier);
    const tempAccount = new DeliveryAccount();
    tempAccount.carrier = carrier;
    tempAccount.apiConfig = { token, shopId };

    // GHN specific getOrderDetail call
    let data;
    if (typeof (provider as any).getOrderDetail === 'function') {
      data = await (provider as any).getOrderDetail(tempAccount, orderCode);
    } else {
      data = { orderCode, status: DELIVERY_ORDER_STATUS.READY_TO_PICK };
    }

    return {
      success: true,
      message: 'Get order info success',
      data,
    };
  }

  @Patch('orders')
  public async updateDeliveryOrder(
    @Headers('token') token?: string,
    @Headers('shop_id') shopId?: string,
    @Body() dto?: UpdateDeliveryOrderDto,
  ): Promise<HttpResponse> {
    const data = await this.deliveryOrderService.updateDeliveryOrder(
      dto,
      token,
      shopId,
    );
    return {
      success: true,
      message: 'Update order success',
      data,
    };
  }

  @Post('orders/:orderCode/cancel')
  public async cancelDeliveryOrder(
    @RequestUser() user: User,
    @Param('orderCode') orderCode: string,
    @Query('carrier') carrier: CARRIER_TYPE = CARRIER_TYPE.GHN,
    @Headers('token') token?: string,
    @Headers('shop_id') shopId?: string,
  ): Promise<HttpResponse> {
    const data = await this.deliveryOrderService.cancelDeliveryOrder(
      orderCode,
      token,
      shopId,
      user.id,
      carrier,
    );
    return {
      success: true,
      message: 'Cancel order success',
      data,
    };
  }

  @Get('orders/seller/all')
  public async getDeliveryOrdersBySeller(
    @RequestUser() user: User,
  ): Promise<HttpResponse> {
    const orders = await this.deliveryOrderService.getDeliveryOrdersBySeller(
      user.id,
    );
    return {
      success: true,
      message: 'Get all delivery orders by sellerId success',
      data: orders,
    };
  }

  @Get('orders/buyer/all')
  public async getDeliveryOrdersByBuyer(
    @RequestUser() user: User,
  ): Promise<HttpResponse> {
    const orders = await this.deliveryOrderService.getDeliveryOrdersByBuyer(
      user.id,
    );
    return {
      success: true,
      message: 'Get all delivery orders by buyerId success',
      data: orders,
    };
  }

  @Get('orders/all')
  public async getAllDeliveryOrders(): Promise<HttpResponse> {
    const orders = await this.deliveryOrderService.findAll();
    return {
      success: true,
      message: 'Get all delivery orders success',
      data: orders,
    };
  }

  @Get('orders/status/:status')
  public async getAllDeliveryOrdersByStatus(
    @Param('status') status: DELIVERY_ORDER_STATUS,
  ): Promise<HttpResponse> {
    const orders =
      await this.deliveryOrderService.getAllDeliveryOrdersByStatus(status);
    return {
      success: true,
      message: 'Get all delivery orders success',
      data: orders,
    };
  }
}

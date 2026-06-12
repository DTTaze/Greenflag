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
import { CARRIER_TYPE, DELIVERY_ORDER_STATUS } from '@shared/enums';
import { AuthGuard } from '@shared/guards/auth.guard';
import { mapToReceiverInfoEntity } from '@shared/helpers/delivery-mapping.helper';
import {
  generateBadRequestResult,
  generateForbiddenResult,
  generateSuccessResult,
} from '@shared/helpers/operation-result.helper';

import {
  CreateDeliveryOrderDto,
  CreateDeliveryOrderFromTransactionDto,
  CreateReceiverInfoDto,
  UpdateReceiverInfoDto,
} from './dtos/delivery.dto';
import { DeliveryAccount } from './entities/delivery-account.entity';
import { DeliveryOrderService } from './services/delivery-order.service';
import { ReceiverInformationService } from './services/receiver-information.service';
import { ShippingFactoryService } from './services/shipping-factory.service';

@ApiTags('Delivery')
@Controller('delivery')
@UseGuards(AuthGuard)
@ApiBearerAuth()
export class DeliveryController {
  constructor(
    private readonly receiverInformationService: ReceiverInformationService,
    private readonly deliveryOrderService: DeliveryOrderService,
    private readonly shippingFactoryService: ShippingFactoryService,
  ) {}

  // --- Receiver Informations ---

  @Get('receivers')
  public async getReceiverInfoByUserId(
    @RequestUser() user: User,
  ): Promise<HttpResponse> {
    return this.receiverInformationService.getReceiverInfoByUserId(user.id);
  }

  @Get('receivers/:id')
  public async getReceiverInfoById(
    @Param('id') id: string,
    @RequestUser() user: User,
  ): Promise<HttpResponse> {
    return this.receiverInformationService.getReceiverInfoById(
      id,
      user.id,
      false,
    );
  }

  @Post('receivers')
  public async createReceiverInfo(
    @RequestUser() user: User,
    @Body() dto: CreateReceiverInfoDto,
  ): Promise<HttpResponse> {
    const mapped = mapToReceiverInfoEntity(dto);
    return this.receiverInformationService.create({
      ...mapped,
      userId: user.id,
    });
  }

  @Patch('receivers/:id')
  public async updateReceiverInfoById(
    @Param('id') id: string,
    @Body() dto: UpdateReceiverInfoDto,
    @RequestUser() user: User,
  ): Promise<HttpResponse> {
    const mapped = mapToReceiverInfoEntity(dto);
    return this.receiverInformationService.updateReceiverInfo(
      id,
      mapped,
      user.id,
      false,
    );
  }

  @Delete('receivers/:id')
  public async deleteReceiverInfoById(
    @Param('id') id: string,
    @RequestUser() user: User,
  ): Promise<HttpResponse> {
    return this.receiverInformationService.deleteReceiverInfo(
      id,
      user.id,
      false,
    );
  }

  @Patch('receivers/:id/default')
  public async setDefaultReceiverInfoById(
    @Param('id') id: string,
    @RequestUser() user: User,
  ): Promise<HttpResponse> {
    return this.receiverInformationService.setDefaultReceiverInfoById(
      id,
      user.id,
      false,
    );
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
    tempAccount.apiConfig = { token, shop_id: shopId };

    const data = await provider.getProvinces(tempAccount);
    return generateSuccessResult(data, 'Get all provinces success');
  }

  @Post('districts')
  public async getAllDistrictsByProvince(
    @Query('carrier') carrier: CARRIER_TYPE = CARRIER_TYPE.GHN,
    @Headers('token') token?: string,
    @Headers('shop_id') shopId?: string,
    @Body('province_id') provinceId?: number,
  ): Promise<HttpResponse> {
    if (!provinceId) {
      return generateBadRequestResult('province_id is required');
    }
    const provider = this.shippingFactoryService.getProvider(carrier);
    const tempAccount = new DeliveryAccount();
    tempAccount.carrier = carrier;
    tempAccount.apiConfig = { token, shop_id: shopId };

    const data = await provider.getDistricts(tempAccount, provinceId);
    return generateSuccessResult(data, 'Get all districts success');
  }

  @Get('wards')
  public async getWardsByDistrict(
    @Query('carrier') carrier: CARRIER_TYPE = CARRIER_TYPE.GHN,
    @Headers('token') token?: string,
    @Headers('shop_id') shopId?: string,
    @Query('district_id') districtId?: number,
  ): Promise<HttpResponse> {
    if (!districtId) {
      return generateBadRequestResult('district_id is required');
    }
    const provider = this.shippingFactoryService.getProvider(carrier);
    const tempAccount = new DeliveryAccount();
    tempAccount.carrier = carrier;
    tempAccount.apiConfig = { token, shop_id: shopId };

    const data = await provider.getWards(tempAccount, districtId);
    return generateSuccessResult(data, 'Get all wards success');
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
    tempAccount.apiConfig = { token, shop_id: shopId };

    let data;
    if (typeof (provider as any).previewOrder === 'function') {
      data = await (provider as any).previewOrder(tempAccount, dto);
    } else {
      data = await provider.calculateFee(tempAccount, {
        senderAddress: dto.from_name ? {
          name: dto.from_name,
          phone: dto.from_phone,
          address: dto.from_address,
          wardName: dto.from_ward_name || '',
          districtName: dto.from_district_name || '',
          provinceName: dto.from_province_name || '',
        } : undefined,
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

    return generateSuccessResult(data, 'Preview order success');
  }

  @Post('orders')
  public async createDeliveryOrder(
    @RequestUser() user: User,
    @Query('carrier') carrier: CARRIER_TYPE = CARRIER_TYPE.GHN,
    @Headers('token') token?: string,
    @Headers('shop_id') shopId?: string,
    @Body() dto?: CreateDeliveryOrderDto,
  ): Promise<HttpResponse> {
    return this.deliveryOrderService.createDeliveryOrder(
      dto,
      token,
      shopId,
      user.id,
      undefined,
      carrier,
    );
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
    return this.deliveryOrderService.createDeliveryOrderFromTransaction(
      transactionId,
      token,
      shopId,
      user.id,
      dto,
      undefined,
      carrier,
    );
  }

  @Get('orders/:orderCode')
  public async getDeliveryOrderInfo(
    @RequestUser() user: User,
    @Param('orderCode') orderCode: string,
    @Query('carrier') carrier: CARRIER_TYPE = CARRIER_TYPE.GHN,
    @Headers('token') token?: string,
    @Headers('shop_id') shopId?: string,
  ): Promise<HttpResponse> {
    const localOrderRes = await this.deliveryOrderService.findOne({
      orderCode,
    });
    if (localOrderRes.success && localOrderRes.data) {
      const localOrder = localOrderRes.data;
      if (localOrder.buyerId !== user.id && localOrder.sellerId !== user.id) {
        return generateForbiddenResult(
          'Bạn không có quyền xem thông tin đơn giao hàng này',
        );
      }
    }

    const provider = this.shippingFactoryService.getProvider(carrier);
    const tempAccount = new DeliveryAccount();
    tempAccount.carrier = carrier;
    tempAccount.apiConfig = { token, shop_id: shopId };

    let data;
    try {
      if (typeof (provider as any).getOrderDetail === 'function') {
        data = await (provider as any).getOrderDetail(tempAccount, orderCode);
      } else {
        data = { orderCode, status: DELIVERY_ORDER_STATUS.READY_TO_PICK };
      }
      return generateSuccessResult(data, 'Get order info success');
    } catch (error) {
      return generateBadRequestResult(error.message);
    }
  }

  @Get('orders')
  public async getDeliveryOrdersByBuyer(
    @RequestUser() user: User,
  ): Promise<HttpResponse> {
    return this.deliveryOrderService.getDeliveryOrdersByBuyer(user.id);
  }
}

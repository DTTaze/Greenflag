import { Injectable } from '@nestjs/common';

import { DELIVERY_ORDER_STATUS } from '@shared/enums';

import { DeliveryAccount } from '../entities/delivery-account.entity';
import {
  IShippingProvider,
  StandardShippingPayload,
  StandardShippingResponse,
} from '../interfaces/shipping-provider.interface';

@Injectable()
export class GhtkShippingStrategy implements IShippingProvider {
  public async calculateFee(
    account: DeliveryAccount,
    payload: StandardShippingPayload,
  ): Promise<number> {
    return 30000; // Mock GHTK fee
  }

  public async createOrder(
    account: DeliveryAccount,
    payload: StandardShippingPayload,
  ): Promise<StandardShippingResponse> {
    const orderCode = `GHTK_MOCK_${Date.now()}`;
    return {
      orderCode,
      status: DELIVERY_ORDER_STATUS.READY_TO_PICK,
      totalFee: 30000,
      expectedDeliveryTime: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000), // 2 days from now
      rawResponse: { mock: true, carrier: 'GHTK', payload },
    };
  }

  public async cancelOrder(
    account: DeliveryAccount,
    trackingCode: string,
  ): Promise<boolean> {
    return true;
  }

  public async getProvinces(account: DeliveryAccount): Promise<any> {
    return {
      code: 200,
      message: 'Success',
      data: [
        { ProvinceID: 999, ProvinceName: 'Mock Province GHTK 1' },
        { ProvinceID: 998, ProvinceName: 'Mock Province GHTK 2' },
      ],
    };
  }

  public async getDistricts(
    account: DeliveryAccount,
    provinceId: number | string,
  ): Promise<any> {
    return {
      code: 200,
      message: 'Success',
      data: [
        {
          DistrictID: 888,
          DistrictName: `Mock District GHTK under Province ${provinceId}`,
        },
      ],
    };
  }

  public async getWards(
    account: DeliveryAccount,
    districtId: number | string,
  ): Promise<any> {
    return {
      code: 200,
      message: 'Success',
      data: [
        {
          WardCode: '777',
          WardName: `Mock Ward GHTK under District ${districtId}`,
        },
      ],
    };
  }

  public async validateConfig(config: Record<string, any>): Promise<boolean> {
    if (!config || !config.token) {
      return false;
    }
    return (
      config.token === 'GHTK_MOCK_TOKEN' || config.token.startsWith('mock')
    );
  }

  public async getOrderStatus(
    account: DeliveryAccount,
    orderCode: string,
  ): Promise<DELIVERY_ORDER_STATUS> {
    return DELIVERY_ORDER_STATUS.DELIVERED;
  }
}

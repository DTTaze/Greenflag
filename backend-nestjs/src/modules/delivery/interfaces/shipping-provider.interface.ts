import { DELIVERY_ORDER_STATUS } from '@shared/enums';

import { DeliveryAccount } from '../entities/delivery-account.entity';

export interface ShippingAddress {
  name: string;
  phone: string;
  address: string;
  wardName: string;
  districtName: string;
  provinceName: string;
}

export interface ShippingItem {
  name: string;
  code: string;
  quantity: number;
  price: number;
}

export interface StandardShippingPayload {
  senderAddress?: ShippingAddress;
  receiverAddress: ShippingAddress;
  weight: number;
  length?: number;
  width?: number;
  height?: number;
  items: ShippingItem[];
  codAmount: number;
}

export interface StandardShippingResponse {
  orderCode: string;
  status: DELIVERY_ORDER_STATUS;
  totalFee: number;
  expectedDeliveryTime?: Date;
  rawResponse: any;
}

export interface IShippingProvider {
  calculateFee(
    account: DeliveryAccount,
    payload: StandardShippingPayload,
  ): Promise<number>;
  createOrder(
    account: DeliveryAccount,
    payload: StandardShippingPayload,
  ): Promise<StandardShippingResponse>;
  cancelOrder(account: DeliveryAccount, trackingCode: string): Promise<boolean>;
  getProvinces(account: DeliveryAccount): Promise<any>;
  getDistricts(
    account: DeliveryAccount,
    provinceId: number | string,
  ): Promise<any>;
  getWards(account: DeliveryAccount, districtId: number | string): Promise<any>;
  validateConfig(config: Record<string, any>): Promise<boolean>;
}

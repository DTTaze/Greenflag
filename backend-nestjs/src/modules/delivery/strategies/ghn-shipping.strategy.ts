import { SpanStatusCode, trace } from '@opentelemetry/api';
import { CacheService, SET_CACHE_POLICY } from 'mvc-common-toolkit';
import { firstValueFrom } from 'rxjs';

import { HttpService } from '@nestjs/axios';
import { Inject, Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { CACHE_KEYS } from '@shared/cache-key';
import { CACHE_TTL, ENV_KEY, INJECTION_TOKEN } from '@shared/constants';
import { DELIVERY_ORDER_STATUS } from '@shared/enums';

import { DeliveryAccount } from '../entities/delivery-account.entity';
import {
  IShippingProvider,
  ShippingAddress,
  StandardShippingPayload,
  StandardShippingResponse,
} from '../interfaces/shipping-provider.interface';

@Injectable()
export class GhnShippingStrategy implements IShippingProvider {
  private readonly logger = new Logger(GhnShippingStrategy.name);
  private readonly baseUrl: string;

  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
    @Inject(INJECTION_TOKEN.REDIS_SERVICE)
    private readonly cacheService: CacheService,
  ) {
    this.baseUrl = this.configService.getOrThrow<string>(ENV_KEY.GHN_URL);
  }

  private buildHeaders(account: DeliveryAccount) {
    const dbToken = account.apiConfig?.token;
    const isMockToken = !dbToken || dbToken.startsWith('sample-');

    const token = !isMockToken
      ? dbToken
      : this.configService.get<string>('GHN_TOKEN') ||
        process.env.GHN_TOKEN ||
        'c3f24415-29b9-11f0-9b81-222185cb68c8';

    const shopId = !isMockToken && account.apiConfig?.shop_id
      ? account.apiConfig.shop_id
      : this.configService.get<string>('GHN_SHOP_ID') ||
        process.env.GHN_SHOP_ID ||
        '196506';

    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      Token: token,
    };
    if (shopId) {
      headers['ShopId'] = String(shopId);
    }
    return headers;
  }

  private mapGhnStatus(ghnStatus: string): DELIVERY_ORDER_STATUS {
    if (!ghnStatus) return DELIVERY_ORDER_STATUS.READY_TO_PICK;
    const lower = ghnStatus.toLowerCase();
    switch (lower) {
      case 'ready_to_pick':
        return DELIVERY_ORDER_STATUS.READY_TO_PICK;
      case 'picking':
        return DELIVERY_ORDER_STATUS.PICKING;
      case 'money_collect_picking':
        return DELIVERY_ORDER_STATUS.MONEY_COLLECT_PICKING;
      case 'picked':
        return DELIVERY_ORDER_STATUS.PICKED;
      case 'storing':
        return DELIVERY_ORDER_STATUS.STORING;
      case 'transporting':
        return DELIVERY_ORDER_STATUS.TRANSPORTING;
      case 'sorting':
        return DELIVERY_ORDER_STATUS.SORTING;
      case 'delivering':
        return DELIVERY_ORDER_STATUS.DELIVERING;
      case 'delivered':
        return DELIVERY_ORDER_STATUS.DELIVERED;
      case 'money_collect_delivering':
        return DELIVERY_ORDER_STATUS.MONEY_COLLECT_DELIVERING;
      case 'delivery_fail':
        return DELIVERY_ORDER_STATUS.DELIVERY_FAIL;
      case 'waiting_to_return':
        return DELIVERY_ORDER_STATUS.WAITING_TO_RETURN;
      case 'return':
        return DELIVERY_ORDER_STATUS.RETURN;
      case 'return_transporting':
        return DELIVERY_ORDER_STATUS.RETURN_TRANSPORTING;
      case 'return_sorting':
        return DELIVERY_ORDER_STATUS.RETURN_SORTING;
      case 'returning':
        return DELIVERY_ORDER_STATUS.RETURNING;
      case 'return_fail':
        return DELIVERY_ORDER_STATUS.RETURN_FAIL;
      case 'returned':
        return DELIVERY_ORDER_STATUS.RETURNED;
      case 'cancel':
        return DELIVERY_ORDER_STATUS.CANCEL;
      case 'exception':
        return DELIVERY_ORDER_STATUS.EXCEPTION;
      case 'lost':
        return DELIVERY_ORDER_STATUS.LOST;
      case 'damage':
        return DELIVERY_ORDER_STATUS.DAMAGE;
      default:
        return DELIVERY_ORDER_STATUS.READY_TO_PICK;
    }
  }

  private cleanAddressName(name: string): string {
    if (!name) return '';
    let cleaned = name.toLowerCase().trim();
    if (cleaned === 'hcm' || cleaned === 'tp. hcm' || cleaned === 'tphcm' || cleaned === 'tp.hcm') {
      cleaned = 'ho chi minh';
    }
    if (cleaned === 'ha noi' || cleaned === 'hn' || cleaned === 'tp. ha noi') {
      cleaned = 'ha noi';
    }
    return cleaned
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '') // Remove diacritics
      .replace(/\b(tinh|thanh pho|tp|quan|huyen|phuong|xa|thi tran|thi xa)\b/g, '') // Remove prefixes
      .replace(/\s+/g, ' ')
      .trim();
  }

  private async resolveAddressIds(
    account: DeliveryAccount,
    address: ShippingAddress,
  ): Promise<{ districtId: number; wardCode: string } | null> {
    try {
      // 1. Get provinces
      const provinceRes = await this.getProvinces(account);
      const provinces = provinceRes?.data || [];
      const provinceNameClean = this.cleanAddressName(address.provinceName);

      // Match province by name
      let matchedProvince = provinces.find(
        (p: any) => this.cleanAddressName(p.ProvinceName) === provinceNameClean,
      );
      if (!matchedProvince) {
        matchedProvince = provinces.find(
          (p: any) =>
            this.cleanAddressName(p.ProvinceName).includes(provinceNameClean) ||
            provinceNameClean.includes(this.cleanAddressName(p.ProvinceName)),
        );
      }
      if (!matchedProvince) {
        this.logger.warn(`Province not found for: ${address.provinceName}`);
        return null;
      }

      // 2. Get districts in this province
      const districtRes = await this.getDistricts(
        account,
        matchedProvince.ProvinceID,
      );
      const districts = districtRes?.data || [];
      const districtNameClean = this.cleanAddressName(address.districtName);

      // Try exact match first
      let matchedDistrict = districts.find(
        (d: any) => this.cleanAddressName(d.DistrictName) === districtNameClean,
      );
      if (!matchedDistrict) {
        matchedDistrict = districts.find(
          (d: any) =>
            this.cleanAddressName(d.DistrictName).includes(districtNameClean) ||
            districtNameClean.includes(this.cleanAddressName(d.DistrictName)),
        );
      }
      if (!matchedDistrict) {
        this.logger.warn(
          `District not found for: ${address.districtName} in province: ${matchedProvince.ProvinceName}`,
        );
        return null;
      }

      // 3. Get wards in this district
      const wardRes = await this.getWards(account, matchedDistrict.DistrictID);
      const wards = wardRes?.data || [];
      const wardNameClean = this.cleanAddressName(address.wardName);

      // Try exact match first
      let matchedWard = wards.find(
        (w: any) => this.cleanAddressName(w.WardName) === wardNameClean,
      );
      if (!matchedWard) {
        matchedWard = wards.find(
          (w: any) =>
            this.cleanAddressName(w.WardName).includes(wardNameClean) ||
            wardNameClean.includes(this.cleanAddressName(w.WardName)),
        );
      }
      if (!matchedWard) {
        this.logger.warn(
          `Ward not found for: ${address.wardName} in district: ${matchedDistrict.DistrictName}`,
        );
        return null;
      }

      return {
        districtId: parseInt(matchedDistrict.DistrictID, 10),
        wardCode: String(matchedWard.WardCode),
      };
    } catch (error) {
      this.logger.error(`Error resolving address IDs: ${error.message}`);
      return null;
    }
  }

  public async calculateFee(
    account: DeliveryAccount,
    payload: StandardShippingPayload,
    serviceTypeId: number = 2,
  ): Promise<number> {
    const ghnPayload = await this.mapToGhnPayload(account, payload, serviceTypeId);
    const url = `${this.baseUrl}/v2/shipping-order/fee`;
    try {
      const response = await firstValueFrom(
        this.httpService.post(url, ghnPayload, {
          headers: this.buildHeaders(account),
        }),
      );
      return Number(response.data?.data?.total_fee) || 0;
    } catch (error) {
      if (serviceTypeId === 2) {
        this.logger.warn(
          `calculateFee with service_type_id 2 failed: ${error.message}. Retrying with service_type_id 5...`,
        );
        return this.calculateFee(account, payload, 5);
      }
      this.logger.error(
        `GHN calculateFee failed: ${error.response?.data ? JSON.stringify(error.response.data) : error.message}`,
      );
      throw error;
    }
  }

  public async createOrder(
    account: DeliveryAccount,
    payload: StandardShippingPayload,
    serviceTypeId: number = 2,
  ): Promise<StandardShippingResponse> {
    const tracer = trace.getTracer('ghn-shipping');
    return tracer.startActiveSpan('ghn-create-order', async (span) => {
      try {
        const ghnPayload = await this.mapToGhnPayload(account, payload, serviceTypeId);
        const url = `${this.baseUrl}/v2/shipping-order/create`;

        span.setAttribute('http.url', url);
        span.setAttribute('http.method', 'POST');

        const response = await firstValueFrom(
          this.httpService.post(url, ghnPayload, {
            headers: this.buildHeaders(account),
          }),
        );

        const orderData = response.data.data;
        const orderCode = orderData.order_code;
        const totalFee = Number(orderData.total_fee) || 0;

        span.setAttribute('ghn.order_code', orderCode);
        span.setAttribute('ghn.total_fee', totalFee);

        // Fetch initial order status from GHN detail API
        let status = DELIVERY_ORDER_STATUS.READY_TO_PICK;
        try {
          const detailUrl = `${this.baseUrl}/v2/shipping-order/detail`;
          const detailRes = await firstValueFrom(
            this.httpService.post(
              detailUrl,
              { order_code: orderCode },
              { headers: this.buildHeaders(account) },
            ),
          );
          status = this.mapGhnStatus(detailRes.data?.data?.status);
        } catch (err) {
          this.logger.warn(
            `Failed to fetch GHN detail for mapping status: ${err.message}`,
          );
          span.recordException(err);
        }

        span.setStatus({ code: SpanStatusCode.OK });
        return {
          orderCode,
          status,
          totalFee,
          expectedDeliveryTime: orderData.expected_delivery_time
            ? new Date(orderData.expected_delivery_time)
            : undefined,
          rawResponse: response.data,
        };
      } catch (error) {
        if (serviceTypeId === 2) {
          this.logger.warn(
            `createOrder with service_type_id 2 failed: ${error.message}. Retrying with service_type_id 5...`,
          );
          span.end();
          return this.createOrder(account, payload, 5);
        }
        this.logger.error(
          `GHN createOrder failed: ${error.response?.data ? JSON.stringify(error.response.data) : error.message}`,
        );
        span.recordException(error);
        span.setStatus({ code: SpanStatusCode.ERROR, message: error.message });
        throw error;
      } finally {
        span.end();
      }
    });
  }

  public async cancelOrder(
    account: DeliveryAccount,
    trackingCode: string,
  ): Promise<boolean> {
    const url = `${this.baseUrl}/v2/switch-status/cancel`;
    const response = await firstValueFrom(
      this.httpService.post(
        url,
        { order_codes: [trackingCode] },
        { headers: this.buildHeaders(account) },
      ),
    );
    return response.data?.code === 200;
  }

  public async getProvinces(account: DeliveryAccount): Promise<any> {
    const cacheKey = CACHE_KEYS.SHIPPING.GHN_PROVINCES();
    const cached = await this.cacheService.get(cacheKey);
    if (cached) {
      return JSON.parse(cached);
    }
    const url = `${this.baseUrl}/master-data/province`;
    const response = await firstValueFrom(
      this.httpService.get(url, { headers: this.buildHeaders(account) }),
    );
    const data = response.data;
    await this.cacheService.set(cacheKey, JSON.stringify(data), {
      policy: SET_CACHE_POLICY.WITH_TTL,
      value: CACHE_TTL.ONE_DAY,
    });
    return data;
  }

  public async getDistricts(
    account: DeliveryAccount,
    provinceId: number | string,
  ): Promise<any> {
    const cacheKey = CACHE_KEYS.SHIPPING.GHN_DISTRICTS(provinceId);
    const cached = await this.cacheService.get(cacheKey);
    if (cached) {
      return JSON.parse(cached);
    }
    const url = `${this.baseUrl}/master-data/district`;
    const response = await firstValueFrom(
      this.httpService.post(
        url,
        { province_id: Number(provinceId) },
        { headers: this.buildHeaders(account) },
      ),
    );
    const data = response.data;
    await this.cacheService.set(cacheKey, JSON.stringify(data), {
      policy: SET_CACHE_POLICY.WITH_TTL,
      value: CACHE_TTL.ONE_DAY,
    });
    return data;
  }

  public async getWards(
    account: DeliveryAccount,
    districtId: number | string,
  ): Promise<any> {
    const cacheKey = CACHE_KEYS.SHIPPING.GHN_WARDS(districtId);
    const cached = await this.cacheService.get(cacheKey);
    if (cached) {
      return JSON.parse(cached);
    }
    const url = `${this.baseUrl}/master-data/ward?district_id=${Number(districtId)}`;
    const response = await firstValueFrom(
      this.httpService.get(url, { headers: this.buildHeaders(account) }),
    );
    const data = response.data;
    await this.cacheService.set(cacheKey, JSON.stringify(data), {
      policy: SET_CACHE_POLICY.WITH_TTL,
      value: CACHE_TTL.ONE_DAY,
    });
    return data;
  }

  private async mapToGhnPayload(
    account: DeliveryAccount,
    payload: StandardShippingPayload,
    serviceTypeId: number = 2,
  ) {
    const toAddressIds = await this.resolveAddressIds(
      account,
      payload.receiverAddress,
    );
    const fromAddressIds = payload.senderAddress
      ? await this.resolveAddressIds(account, payload.senderAddress)
      : null;

    const to_district_id = toAddressIds?.districtId || 1442;
    const to_ward_code = toAddressIds?.wardCode || '20107';
    const from_district_id = fromAddressIds?.districtId || 1442;
    const from_ward_code = fromAddressIds?.wardCode || '20107';

    return {
      payment_type_id: 1, // Shop pays fee
      note: 'Giao hang tu heartify platform',
      required_note: 'KHONGCHOXEMHANG',
      to_name: payload.receiverAddress.name,
      to_phone: payload.receiverAddress.phone,
      to_address: payload.receiverAddress.address,
      to_ward_name: payload.receiverAddress.wardName,
      to_district_name: payload.receiverAddress.districtName,
      to_province_name: payload.receiverAddress.provinceName,

      to_district_id: parseInt(to_district_id as any, 10),
      to_ward_code: String(to_ward_code),
      from_district_id: parseInt(from_district_id as any, 10),
      from_ward_code: String(from_ward_code),

      weight: payload.weight,
      length: payload.length || 10,
      width: payload.width || 10,
      height: payload.height || 10,
      service_type_id: serviceTypeId,
      cod_amount: payload.codAmount,
      items: payload.items.map((i) => ({
        name: i.name,
        code: i.code,
        quantity: i.quantity,
        price: i.price,
      })),
    };
  }

  public async validateConfig(config: Record<string, any>): Promise<boolean> {
    if (!config || !config.token || !config.shopId) {
      return false;
    }
    try {
      const url = `${this.baseUrl}/v2/shop/all`;
      const response = await firstValueFrom(
        this.httpService.post(
          url,
          {},
          {
            headers: {
              'Content-Type': 'application/json',
              Token: config.token,
            },
          },
        ),
      );
      if (
        response.status !== 200 ||
        !response.data ||
        response.data.code !== 200
      ) {
        return false;
      }
      const shops = response.data.data?.shops || [];
      const shopIdNum = Number(config.shopId);
      return shops.some(
        (shop: any) =>
          Number(shop.shop_id) === shopIdNum || Number(shop._id) === shopIdNum,
      );
    } catch (err) {
      this.logger.error(`Validation config failed: ${err.message}`);
      return false;
    }
  }

  public async getOrderStatus(
    account: DeliveryAccount,
    orderCode: string,
  ): Promise<DELIVERY_ORDER_STATUS> {
    const detailUrl = `${this.baseUrl}/v2/shipping-order/detail`;
    const response = await firstValueFrom(
      this.httpService.post(
        detailUrl,
        { order_code: orderCode },
        { headers: this.buildHeaders(account) },
      ),
    );
    return this.mapGhnStatus(response.data?.data?.status);
  }
}

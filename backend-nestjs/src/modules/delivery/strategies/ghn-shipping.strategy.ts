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
    const token = account.apiConfig?.token || '';
    const shopId = account.apiConfig?.shop_id;
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

  public async calculateFee(
    account: DeliveryAccount,
    payload: StandardShippingPayload,
  ): Promise<number> {
    const ghnPayload = this.mapToGhnPayload(payload);
    const url = `${this.baseUrl}/v2/shipping-order/preview`;
    const response = await firstValueFrom(
      this.httpService.post(url, ghnPayload, {
        headers: this.buildHeaders(account),
      }),
    );
    return Number(response.data?.data?.total_fee) || 0;
  }

  public async createOrder(
    account: DeliveryAccount,
    payload: StandardShippingPayload,
  ): Promise<StandardShippingResponse> {
    const tracer = trace.getTracer('ghn-shipping');
    return tracer.startActiveSpan('ghn-create-order', async (span) => {
      try {
        const ghnPayload = this.mapToGhnPayload(payload);
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

  private mapToGhnPayload(payload: StandardShippingPayload) {
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
      weight: payload.weight,
      length: payload.length || 10,
      width: payload.width || 10,
      height: payload.height || 10,
      service_type_id: 2,
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

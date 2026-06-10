import { Repository } from 'typeorm';

import { Inject, Injectable, forwardRef } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { TransactionService } from '@modules/commerce/services/transaction.service';

import { ERR_CODE } from '@shared/constants';
import {
  CARRIER_TYPE,
  DELIVERY_ORDER_STATUS,
  TRANSACTION_STATUS,
} from '@shared/enums';
import {
  OperationResult,
  generateBadRequestResult,
  generateForbiddenResult,
  generateNotFoundResult,
  generateSuccessResult,
} from '@shared/helpers/operation-result.helper';
import { BaseCRUDService } from '@shared/services/base-crud.service';

import { DeliveryAccount } from '../entities/delivery-account.entity';
import { DeliveryOrder } from '../entities/delivery-order.entity';
import { StandardShippingPayload } from '../interfaces/shipping-provider.interface';
import { DeliveryAccountService } from './delivery-account.service';
import { ShippingFactoryService } from './shipping-factory.service';

@Injectable()
export class DeliveryOrderService extends BaseCRUDService<DeliveryOrder> {
  constructor(
    @InjectRepository(DeliveryOrder)
    private readonly deliveryOrderRepository: Repository<DeliveryOrder>,
    @Inject(forwardRef(() => TransactionService))
    private readonly transactionService: TransactionService,
    private readonly deliveryAccountService: DeliveryAccountService,
    private readonly shippingFactoryService: ShippingFactoryService,
  ) {
    super(deliveryOrderRepository);
  }

  public async getDeliveryAccount(
    userId: string,
    deliveryAccountId?: string,
    carrier: CARRIER_TYPE = CARRIER_TYPE.GHN,
    token?: string,
    shopId?: string,
  ): Promise<OperationResult<DeliveryAccount>> {
    if (deliveryAccountId) {
      const accRes = await this.deliveryAccountService.findOne({
        id: deliveryAccountId,
      });
      if (accRes.success && accRes.data) return accRes;
    }

    const defaultAccRes = await this.deliveryAccountService.findOne({
      userId,
      carrier,
      isDefault: true,
    });
    if (defaultAccRes.success && defaultAccRes.data) return defaultAccRes;

    const anyAccRes = await this.deliveryAccountService.findOne({
      userId,
      carrier,
    });
    if (anyAccRes.success && anyAccRes.data) return anyAccRes;

    // Construct a transient/temporary account using headers if available
    const tempAcc = new DeliveryAccount();
    tempAcc.carrier = carrier;
    tempAcc.apiConfig = { token, shop_id: shopId };
    return generateSuccessResult(tempAcc);
  }

  public async createDeliveryOrder(
    shipmentData: any,
    token: string,
    shopId: string,
    sellerId: string,
    deliveryAccountId?: string,
    carrier: CARRIER_TYPE = CARRIER_TYPE.GHN,
  ): Promise<OperationResult<any>> {
    const accountRes = await this.getDeliveryAccount(
      sellerId,
      deliveryAccountId,
      carrier,
      token,
      shopId,
    );
    if (!accountRes.success || !accountRes.data) {
      return generateNotFoundResult(
        'Delivery account not found',
        ERR_CODE.DELIVERY_ACCOUNT_NOT_FOUND,
      );
    }
    const account = accountRes.data;
    const provider = this.shippingFactoryService.getProvider(account.carrier);

    const payload: StandardShippingPayload = {
      receiverAddress: {
        name: shipmentData.to_name,
        phone: shipmentData.to_phone,
        address: shipmentData.to_address,
        wardName: shipmentData.to_ward_name || '',
        districtName: shipmentData.to_district_name || '',
        provinceName: shipmentData.to_province_name || '',
      },
      weight: shipmentData.weight,
      length: shipmentData.length,
      width: shipmentData.width,
      height: shipmentData.height,
      items: shipmentData.items || [
        {
          name: shipmentData.item_name || 'Product Item',
          code: shipmentData.item_id || 'item-id',
          quantity: shipmentData.quantity || 1,
          price: shipmentData.price || 0,
        },
      ],
      codAmount: shipmentData.cod_amount || 0,
    };

    try {
      const response = await provider.createOrder(account, payload);

      const createdOrderRes = await this.create({
        sellerId,
        deliveryAccountId: account.id,
        orderCode: response.orderCode,
        status: response.status,
        toName: payload.receiverAddress.name,
        toPhone: payload.receiverAddress.phone,
        toAddress: payload.receiverAddress.address,
        isPrinted: false,
        createdDate: response.expectedDeliveryTime || new Date(),
        codAmount: payload.codAmount,
        weight: payload.weight,
        paymentTypeId: shipmentData.payment_type_id || 1,
        totalAmount: response.totalFee + payload.codAmount,
      });

      if (!createdOrderRes.success || !createdOrderRes.data) {
        return OperationResult.fail(
          createdOrderRes.code || 'create_failed',
          createdOrderRes.message,
        );
      }

      return generateSuccessResult({
        response: response.rawResponse,
        createdOrder: createdOrderRes.data,
      });
    } catch (error) {
      return this.handleError('createOrder', error);
    }
  }

  public async createDeliveryOrderFromTransaction(
    transactionId: string,
    token: string,
    shopId: string,
    sellerId: string,
    orderData: any,
    deliveryAccountId?: string,
    carrier: CARRIER_TYPE = CARRIER_TYPE.GHN,
  ): Promise<OperationResult<any>> {
    if (
      !transactionId ||
      !sellerId ||
      !orderData.payment_type_id ||
      !orderData.required_note ||
      !orderData.weight
    ) {
      return generateBadRequestResult(
        'Missing parameters',
        ERR_CODE.BAD_REQUEST,
      );
    }
    if (orderData.weight <= 0) {
      return generateBadRequestResult(
        'Weight must be positive',
        ERR_CODE.BAD_REQUEST,
      );
    }

    const transactionRes = await this.transactionService.findOne(
      { id: transactionId },
      { relations: { receiverInformation: true } },
    );

    if (!transactionRes.success || !transactionRes.data) {
      return generateNotFoundResult(
        'Transaction not found',
        ERR_CODE.TRANSACTION_NOT_FOUND,
      );
    }
    const transaction = transactionRes.data;
    if (transaction.status !== TRANSACTION_STATUS.ACCEPTED) {
      return generateBadRequestResult(
        'Transaction was not accepted',
        ERR_CODE.BAD_REQUEST,
      );
    }
    if (!transaction.receiverInformation) {
      return generateNotFoundResult(
        'Receiver information not found',
        ERR_CODE.RECEIVER_INFO_NOT_FOUND,
      );
    }

    const accountRes = await this.getDeliveryAccount(
      sellerId,
      deliveryAccountId,
      carrier,
      token,
      shopId,
    );
    if (!accountRes.success || !accountRes.data) {
      return generateNotFoundResult(
        'Delivery account not found',
        ERR_CODE.DELIVERY_ACCOUNT_NOT_FOUND,
      );
    }
    const account = accountRes.data;
    const provider = this.shippingFactoryService.getProvider(account.carrier);

    const payload: StandardShippingPayload = {
      receiverAddress: {
        name: transaction.receiverInformation.toName,
        phone: transaction.receiverInformation.toPhone,
        address: transaction.receiverInformation.toAddress,
        wardName: transaction.receiverInformation.toWardName,
        districtName: transaction.receiverInformation.toDistrictName,
        provinceName: transaction.receiverInformation.toProvinceName,
      },
      weight: orderData.weight,
      items: [
        {
          name: transaction.itemSnapshot?.name || 'Item',
          code: transaction.itemId,
          quantity: transaction.quantity,
          price: transaction.itemSnapshot?.price || 0,
        },
      ],
      codAmount: orderData.cod_amount || 0,
    };

    try {
      const response = await provider.createOrder(account, payload);

      const createdOrderRes = await this.create({
        transactionId,
        sellerId: transaction.sellerId,
        buyerId: transaction.buyerId,
        deliveryAccountId: account.id,
        orderCode: response.orderCode,
        status: response.status,
        toName: payload.receiverAddress.name,
        toPhone: payload.receiverAddress.phone,
        toAddress: payload.receiverAddress.address,
        isPrinted: false,
        createdDate: response.expectedDeliveryTime || new Date(),
        codAmount: payload.codAmount,
        weight: payload.weight,
        paymentTypeId: orderData.payment_type_id,
        totalAmount: response.totalFee + payload.codAmount,
        itemSnapshot: transaction.itemSnapshot,
      });

      if (!createdOrderRes.success || !createdOrderRes.data) {
        return OperationResult.fail(
          createdOrderRes.code || 'create_failed',
          createdOrderRes.message,
        );
      }

      return generateSuccessResult({
        response: response.rawResponse,
        createdOrder: createdOrderRes.data,
      });
    } catch (error) {
      return this.handleError('createOrderFromTransaction', error);
    }
  }

  public async updateDeliveryOrder(
    updateData: any,
    token: string,
    shopId: string,
    sellerId?: string,
  ): Promise<OperationResult<any>> {
    return generateBadRequestResult(
      'Updating shipping order is not supported. Please cancel and recreate the order.',
      ERR_CODE.BAD_REQUEST,
    );
  }

  public async cancelDeliveryOrder(
    orderCode: string,
    token: string,
    shopId: string,
    currentUserId?: string,
    isAdmin: boolean = false,
    carrier: CARRIER_TYPE = CARRIER_TYPE.GHN,
  ): Promise<OperationResult<any>> {
    const orderRes = await this.findOne({ orderCode });
    if (!orderRes.success || !orderRes.data) {
      return generateNotFoundResult(
        'Delivery order not found',
        ERR_CODE.DELIVERY_ORDER_NOT_FOUND,
      );
    }
    const order = orderRes.data;
    if (!isAdmin && currentUserId && order.sellerId !== currentUserId) {
      return generateForbiddenResult(
        'Bạn không có quyền hủy đơn giao hàng của người khác',
        ERR_CODE.FORBIDDEN,
      );
    }

    const sellerId = order.sellerId;
    const accountRes = await this.getDeliveryAccount(
      sellerId,
      order.deliveryAccountId || undefined,
      carrier,
      token,
      shopId,
    );
    if (!accountRes.success || !accountRes.data) {
      return generateNotFoundResult(
        'Delivery account not found',
        ERR_CODE.DELIVERY_ACCOUNT_NOT_FOUND,
      );
    }
    const account = accountRes.data;
    const provider = this.shippingFactoryService.getProvider(account.carrier);

    try {
      const success = await provider.cancelOrder(account, orderCode);
      if (success) {
        await this.bulkUpdate(
          { orderCode },
          { status: DELIVERY_ORDER_STATUS.CANCEL },
        );
      }
      return generateSuccessResult({ success });
    } catch (error) {
      return this.handleError('cancelOrder', error);
    }
  }

  public async getDeliveryOrdersBySeller(
    sellerId: string,
  ): Promise<OperationResult<DeliveryOrder[]>> {
    return this.findAll({ sellerId });
  }

  public async getDeliveryOrdersByBuyer(
    buyerId: string,
  ): Promise<OperationResult<DeliveryOrder[]>> {
    return this.findAll({ buyerId });
  }

  public async getAllDeliveryOrdersByStatus(
    status: DELIVERY_ORDER_STATUS,
  ): Promise<OperationResult<DeliveryOrder[]>> {
    return this.findAll({ status });
  }

  private handleError(action: string, error: any): OperationResult<any> {
    const errData = error.response?.data?.code_message_value || {
      message: error.message || 'Unknown shipping provider error',
    };
    const errorMsg =
      typeof errData === 'object' ? JSON.stringify(errData) : String(errData);
    return OperationResult.fail(
      ERR_CODE.BAD_REQUEST,
      `Shipping Provider Error (${action}): ${errorMsg}`,
    );
  }
}

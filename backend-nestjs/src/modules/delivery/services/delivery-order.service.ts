import { Repository } from 'typeorm';

import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { Transaction } from '@modules/commerce/entities/transaction.entity';

import {
  CARRIER_TYPE,
  DELIVERY_ORDER_STATUS,
  TRANSACTION_STATUS,
} from '@shared/enums';
import { BaseCRUDService } from '@shared/services/base-crud.service';

import { DeliveryAccount } from '../entities/delivery-account.entity';
import { DeliveryOrder } from '../entities/delivery-order.entity';
import { StandardShippingPayload } from '../interfaces/shipping-provider.interface';
import { ShippingFactoryService } from './shipping-factory.service';

@Injectable()
export class DeliveryOrderService extends BaseCRUDService<DeliveryOrder> {
  constructor(
    @InjectRepository(DeliveryOrder)
    private readonly deliveryOrderRepository: Repository<DeliveryOrder>,
    @InjectRepository(Transaction)
    private readonly transactionRepository: Repository<Transaction>,
    @InjectRepository(DeliveryAccount)
    private readonly deliveryAccountRepository: Repository<DeliveryAccount>,
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
  ): Promise<DeliveryAccount> {
    if (deliveryAccountId) {
      const acc = await this.deliveryAccountRepository.findOne({
        where: { id: deliveryAccountId },
      });
      if (acc) return acc;
    }

    const defaultAcc = await this.deliveryAccountRepository.findOne({
      where: { userId, carrier, isDefault: true },
    });
    if (defaultAcc) return defaultAcc;

    const anyAcc = await this.deliveryAccountRepository.findOne({
      where: { userId, carrier },
    });
    if (anyAcc) return anyAcc;

    // Construct a transient/temporary account using headers if available
    const tempAcc = new DeliveryAccount();
    tempAcc.carrier = carrier;
    tempAcc.apiConfig = { token, shopId };
    return tempAcc;
  }

  public async createDeliveryOrder(
    shipmentData: any,
    token: string,
    shopId: string,
    sellerId: string,
    deliveryAccountId?: string,
    carrier: CARRIER_TYPE = CARRIER_TYPE.GHN,
  ): Promise<any> {
    const account = await this.getDeliveryAccount(
      sellerId,
      deliveryAccountId,
      carrier,
      token,
      shopId,
    );
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

      const createdOrder = await this.create({
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

      return { response: response.rawResponse, createdOrder };
    } catch (error) {
      this.handleError('createOrder', error);
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
  ): Promise<any> {
    if (
      !transactionId ||
      !sellerId ||
      !orderData.payment_type_id ||
      !orderData.required_note ||
      !orderData.weight
    ) {
      throw new BadRequestException('Missing parameters');
    }
    if (orderData.weight <= 0) {
      throw new BadRequestException('Weight must be positive');
    }

    const transaction = await this.transactionRepository.findOne({
      where: { id: transactionId },
      relations: { receiverInformation: true },
    });

    if (!transaction) {
      throw new NotFoundException('Transaction not found');
    }
    if (transaction.status !== TRANSACTION_STATUS.ACCEPTED) {
      throw new BadRequestException('Transaction was not accepted');
    }
    if (!transaction.receiverInformation) {
      throw new NotFoundException('Receiver information not found');
    }

    const account = await this.getDeliveryAccount(
      sellerId,
      deliveryAccountId,
      carrier,
      token,
      shopId,
    );
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

      const createdOrder = await this.create({
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

      return { response: response.rawResponse, createdOrder };
    } catch (error) {
      this.handleError('createOrderFromTransaction', error);
    }
  }

  public async updateDeliveryOrder(
    updateData: any,
    token: string,
    shopId: string,
    sellerId?: string,
  ): Promise<any> {
    throw new BadRequestException(
      'Updating shipping order is not supported. Please cancel and recreate the order.',
    );
  }

  public async cancelDeliveryOrder(
    orderCode: string,
    token: string,
    shopId: string,
    sellerId: string,
    carrier: CARRIER_TYPE = CARRIER_TYPE.GHN,
  ): Promise<any> {
    const account = await this.getDeliveryAccount(
      sellerId,
      undefined,
      carrier,
      token,
      shopId,
    );
    const provider = this.shippingFactoryService.getProvider(account.carrier);

    try {
      const success = await provider.cancelOrder(account, orderCode);
      if (success) {
        await this.bulkUpdate(
          { orderCode },
          { status: DELIVERY_ORDER_STATUS.CANCEL },
        );
      }
      return { success };
    } catch (error) {
      this.handleError('cancelOrder', error);
    }
  }

  public async getDeliveryOrdersBySeller(
    sellerId: string,
  ): Promise<DeliveryOrder[]> {
    return this.findAll({ sellerId });
  }

  public async getDeliveryOrdersByBuyer(
    buyerId: string,
  ): Promise<DeliveryOrder[]> {
    return this.findAll({ buyerId });
  }

  public async getAllDeliveryOrdersByStatus(
    status: DELIVERY_ORDER_STATUS,
  ): Promise<DeliveryOrder[]> {
    return this.findAll({ status });
  }

  private handleError(action: string, error: any): never {
    const errData = error.response?.data?.code_message_value || {
      message: error.message || 'Unknown shipping provider error',
    };
    const errorMsg =
      typeof errData === 'object' ? JSON.stringify(errData) : String(errData);
    throw new BadRequestException(
      `Shipping Provider Error (${action}): ${errorMsg}`,
    );
  }
}

import { Job } from 'bullmq';
import { Repository } from 'typeorm';

import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { DeliveryAccount } from '@modules/delivery/entities/delivery-account.entity';
import { DeliveryOrder } from '@modules/delivery/entities/delivery-order.entity';
import { StandardShippingPayload } from '@modules/delivery/interfaces/shipping-provider.interface';
import { ShippingFactoryService } from '@modules/delivery/services/shipping-factory.service';

import { JOB_NAME, QUEUE_NAME } from '@shared/constants';
import { TRANSACTION_STATUS } from '@shared/enums';

import { Transaction } from '../entities/transaction.entity';
import { TransactionService } from '../services/transaction.service';

@Processor(QUEUE_NAME.COMMERCE)
export class CommerceProcessor extends WorkerHost {
  private readonly logger = new Logger(CommerceProcessor.name);

  constructor(
    @InjectRepository(Transaction)
    private readonly transactionRepository: Repository<Transaction>,
    @InjectRepository(DeliveryAccount)
    private readonly deliveryAccountRepository: Repository<DeliveryAccount>,
    @InjectRepository(DeliveryOrder)
    private readonly deliveryOrderRepository: Repository<DeliveryOrder>,
    private readonly transactionService: TransactionService,
    private readonly shippingFactoryService: ShippingFactoryService,
  ) {
    super();
  }

  public async process(job: Job<any, any, string>): Promise<any> {
    if (job.name !== JOB_NAME.PROCESS_ITEM_PURCHASE) {
      this.logger.warn(`Unknown job name: ${job.name}`);
      return;
    }

    const { transactionId } = job.data;
    this.logger.log(
      `Processing item purchase for transaction: ${transactionId}`,
    );

    // 1. Fetch transaction with buyer, receiver, and item details
    const transaction = await this.transactionRepository.findOne({
      where: { id: transactionId },
      relations: { receiverInformation: true, item: true },
    });

    if (!transaction) {
      this.logger.error(`Transaction not found: ${transactionId}`);
      throw new Error(`Transaction not found: ${transactionId}`);
    }

    // If transaction is already cancelled, rejected, or accepted, skip
    if (transaction.status !== TRANSACTION_STATUS.PENDING) {
      this.logger.warn(
        `Transaction ${transactionId} is not PENDING (status: ${transaction.status}). Skipping.`,
      );
      return;
    }

    // 2. Obtain seller's shipping carrier/delivery account
    const sellerDeliveryAccount = await this.deliveryAccountRepository.findOne({
      where: { userId: transaction.sellerId },
      order: { isDefault: 'DESC' }, // prefer default account
    });

    if (!sellerDeliveryAccount) {
      const errorMsg = `Seller ${transaction.sellerId} has no delivery account configured`;
      this.logger.error(errorMsg);
      await this.transactionService.refundTransaction(
        transactionId,
        errorMsg,
        TRANSACTION_STATUS.CANCELLED,
      );
      throw new Error(errorMsg);
    }

    try {
      // 3. Prepare standard shipping payload
      const payload: StandardShippingPayload = {
        receiverAddress: {
          name: transaction.receiverInformation.toName,
          phone: transaction.receiverInformation.toPhone,
          address: transaction.receiverInformation.toAddress,
          wardName: transaction.receiverInformation.toWardName,
          districtName: transaction.receiverInformation.toDistrictName,
          provinceName: transaction.receiverInformation.toProvinceName,
        },
        weight: transaction.item?.weight || 200,
        length: transaction.item?.length || 10,
        width: transaction.item?.width || 10,
        height: transaction.item?.height || 10,
        codAmount: 0, // item paid via coins
        items: [
          {
            name: transaction.itemSnapshot?.name || 'Item',
            code: transaction.itemId,
            quantity: transaction.quantity,
            price: transaction.itemSnapshot?.price || 0,
          },
        ],
      };

      this.logger.log(
        `Calling shipping provider to create shipping order for Transaction: ${transactionId}`,
      );

      const provider = this.shippingFactoryService.getProvider(
        sellerDeliveryAccount.carrier,
      );
      const res = await provider.createOrder(sellerDeliveryAccount, payload);

      const orderCode = res.orderCode;
      const totalFee = res.totalFee;
      const totalAmount = totalFee; // cod_amount is 0
      const orderStatus = res.status;

      // 4. Create local DeliveryOrder record
      const deliveryOrder = this.deliveryOrderRepository.create({
        transactionId: transaction.id,
        sellerId: transaction.sellerId,
        buyerId: transaction.buyerId,
        deliveryAccountId: sellerDeliveryAccount.id,
        orderCode,
        status: orderStatus,
        toName: payload.receiverAddress.name,
        toPhone: payload.receiverAddress.phone,
        toAddress: payload.receiverAddress.address,
        isPrinted: false,
        createdDate: res.expectedDeliveryTime || new Date(),
        codAmount: 0,
        weight: payload.weight,
        paymentTypeId: 1, // Shop pays fee
        totalAmount,
        itemSnapshot: transaction.itemSnapshot,
      });

      await this.deliveryOrderRepository.save(deliveryOrder);

      // 5. Update transaction status to ACCEPTED
      await this.transactionRepository.update(transaction.id, {
        status: TRANSACTION_STATUS.ACCEPTED,
      });

      this.logger.log(
        `Successfully completed purchase flow for transaction: ${transactionId}`,
      );
    } catch (error) {
      const errorMsg = error.response?.data?.code_message_value
        ? JSON.stringify(error.response.data.code_message_value)
        : error.message;

      this.logger.error(
        `Shipping order creation failed: ${errorMsg}. Executing Compensating Refund SAGA.`,
      );

      // SAGA Compensating Action (Refund Coins & Revert Stock)
      await this.transactionService.refundTransaction(
        transactionId,
        `Shipping Order Failure: ${errorMsg}`,
        TRANSACTION_STATUS.CANCELLED,
      );

      throw error;
    }
  }
}

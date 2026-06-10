import { LessThan, Repository } from 'typeorm';

import { Injectable, Logger } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { Cron, CronExpression } from '@nestjs/schedule';
import { InjectRepository } from '@nestjs/typeorm';

import { DELIVERY_ORDER_STATUS } from '@shared/enums';

import { DeliveryAccount } from '../entities/delivery-account.entity';
import { DeliveryOrder } from '../entities/delivery-order.entity';
import { ShippingFactoryService } from '../services/shipping-factory.service';

@Injectable()
export class ShippingReconciliationCron {
  private readonly logger = new Logger(ShippingReconciliationCron.name);

  constructor(
    @InjectRepository(DeliveryOrder)
    private readonly deliveryOrderRepository: Repository<DeliveryOrder>,
    @InjectRepository(DeliveryAccount)
    private readonly deliveryAccountRepository: Repository<DeliveryAccount>,
    private readonly shippingFactoryService: ShippingFactoryService,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  @Cron(CronExpression.EVERY_HOUR)
  public async reconcileShippingOrders(): Promise<void> {
    this.logger.log('Starting shipping reconciliation cron job...');

    const cutOffTime = new Date(Date.now() - 24 * 60 * 60 * 1000);
    const ongoingStatuses = [
      DELIVERY_ORDER_STATUS.READY_TO_PICK,
      DELIVERY_ORDER_STATUS.PICKING,
      DELIVERY_ORDER_STATUS.STORING,
      DELIVERY_ORDER_STATUS.TRANSPORTING,
      DELIVERY_ORDER_STATUS.SORTING,
      DELIVERY_ORDER_STATUS.DELIVERING,
      DELIVERY_ORDER_STATUS.MONEY_COLLECT_DELIVERING,
      DELIVERY_ORDER_STATUS.DELIVERY_FAIL,
      DELIVERY_ORDER_STATUS.WAITING_TO_RETURN,
      DELIVERY_ORDER_STATUS.RETURN,
      DELIVERY_ORDER_STATUS.RETURN_TRANSPORTING,
      DELIVERY_ORDER_STATUS.RETURN_SORTING,
      DELIVERY_ORDER_STATUS.RETURNING,
      DELIVERY_ORDER_STATUS.RETURN_FAIL,
    ];

    const ordersToReconcile = await this.deliveryOrderRepository.find({
      where: {
        status: ongoingStatuses as any,
        createdDate: LessThan(cutOffTime),
      },
      relations: { deliveryAccount: true },
    });

    this.logger.log(
      `Found ${ordersToReconcile.length} orders requiring reconciliation`,
    );

    for (const order of ordersToReconcile) {
      try {
        let account = order.deliveryAccount;
        if (!account && order.deliveryAccountId) {
          account = await this.deliveryAccountRepository.findOne({
            where: { id: order.deliveryAccountId },
          });
        }

        if (!account) {
          this.logger.warn(
            `No delivery account found for order ${order.orderCode}`,
          );
          continue;
        }

        const provider = this.shippingFactoryService.getProvider(
          account.carrier,
        );
        const latestStatus = await provider.getOrderStatus(
          account,
          order.orderCode!,
        );

        if (latestStatus && latestStatus !== order.status) {
          this.logger.log(
            `Updating order ${order.orderCode} status from ${order.status} to ${latestStatus}`,
          );

          order.status = latestStatus;
          await this.deliveryOrderRepository.save(order);

          // Emit notification event
          this.eventEmitter.emit('delivery.status_updated', {
            orderCode: order.orderCode,
            status: latestStatus,
            buyerId: order.buyerId,
            sellerId: order.sellerId,
          });
        }
      } catch (error) {
        this.logger.error(
          `Failed to reconcile order ${order.orderCode}: ${error.message}`,
        );
      }
    }

    this.logger.log('Shipping reconciliation cron job completed.');
  }
}

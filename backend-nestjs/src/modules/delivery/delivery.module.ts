import { HttpModule } from '@nestjs/axios';
import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { CommerceModule } from '@modules/commerce/commerce.module';
import { Transaction } from '@modules/commerce/entities/transaction.entity';

import { AdminDeliveryController } from './admin-delivery.controller';
import { ShippingReconciliationCron } from './cron/shipping-reconciliation.cron';
import { DeliveryController } from './delivery.controller';
import { DeliveryAccount } from './entities/delivery-account.entity';
import { DeliveryOrder } from './entities/delivery-order.entity';
import { ReceiverInformation } from './entities/receiver-information.entity';
import { PartnerDeliveryController } from './partner-delivery.controller';
import { DeliveryAccountService } from './services/delivery-account.service';
import { DeliveryOrderService } from './services/delivery-order.service';
import { ReceiverInformationService } from './services/receiver-information.service';
import { ShippingFactoryService } from './services/shipping-factory.service';
import { GhnShippingStrategy } from './strategies/ghn-shipping.strategy';
import { GhtkShippingStrategy } from './strategies/ghtk-shipping.strategy';

@Module({
  imports: [
    HttpModule,
    TypeOrmModule.forFeature([
      DeliveryAccount,
      ReceiverInformation,
      DeliveryOrder,
      Transaction,
    ]),
    forwardRef(() => CommerceModule),
  ],
  controllers: [
    DeliveryController,
    PartnerDeliveryController,
    AdminDeliveryController,
  ],
  providers: [
    GhnShippingStrategy,
    GhtkShippingStrategy,
    ShippingFactoryService,
    DeliveryAccountService,
    ReceiverInformationService,
    DeliveryOrderService,
    ShippingReconciliationCron,
  ],
  exports: [
    GhnShippingStrategy,
    GhtkShippingStrategy,
    ShippingFactoryService,
    DeliveryAccountService,
    ReceiverInformationService,
    DeliveryOrderService,
    ShippingReconciliationCron,
  ],
})
export class DeliveryModule {}

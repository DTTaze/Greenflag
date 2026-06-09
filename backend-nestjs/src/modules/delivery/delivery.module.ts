import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Transaction } from '@modules/commerce/entities/transaction.entity';

import { DeliveryController } from './delivery.controller';
import { DeliveryAccount } from './entities/delivery-account.entity';
import { DeliveryOrder } from './entities/delivery-order.entity';
import { ReceiverInformation } from './entities/receiver-information.entity';
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
  ],
  controllers: [DeliveryController],
  providers: [
    GhnShippingStrategy,
    GhtkShippingStrategy,
    ShippingFactoryService,
    DeliveryAccountService,
    ReceiverInformationService,
    DeliveryOrderService,
  ],
  exports: [
    GhnShippingStrategy,
    GhtkShippingStrategy,
    ShippingFactoryService,
    DeliveryAccountService,
    ReceiverInformationService,
    DeliveryOrderService,
  ],
})
export class DeliveryModule {}

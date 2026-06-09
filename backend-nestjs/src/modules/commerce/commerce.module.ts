import { BullModule } from '@nestjs/bullmq';
import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { DeliveryModule } from '@modules/delivery/delivery.module';
import { DeliveryAccount } from '@modules/delivery/entities/delivery-account.entity';
import { DeliveryOrder } from '@modules/delivery/entities/delivery-order.entity';
import { ReceiverInformation } from '@modules/delivery/entities/receiver-information.entity';
import { Coin } from '@modules/user/entities/coin.entity';

import { QUEUE_NAME } from '@shared/constants';

import { AdminCommerceController } from './admin-commerce.controller';
import { CommerceController } from './commerce.controller';
import { Item } from './entities/item.entity';
import { Product } from './entities/product.entity';
import { Transaction } from './entities/transaction.entity';
import { PartnerCommerceController } from './partner-commerce.controller';
import { CommerceProcessor } from './processors/commerce.processor';
import { ItemService } from './services/item.service';
import { ProductService } from './services/product.service';
import { TransactionService } from './services/transaction.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Product,
      Item,
      Transaction,
      Coin,
      DeliveryAccount,
      DeliveryOrder,
      ReceiverInformation,
    ]),
    BullModule.registerQueue({
      name: QUEUE_NAME.COMMERCE,
    }),
    forwardRef(() => DeliveryModule),
  ],
  controllers: [
    CommerceController,
    PartnerCommerceController,
    AdminCommerceController,
  ],
  providers: [
    ProductService,
    ItemService,
    TransactionService,
    CommerceProcessor,
  ],
  exports: [ProductService, ItemService, TransactionService],
})
export class CommerceModule {}

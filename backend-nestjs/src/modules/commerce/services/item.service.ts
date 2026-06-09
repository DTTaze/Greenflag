import { Queue } from 'bullmq';
import { DataSource, Repository } from 'typeorm';

import { InjectQueue } from '@nestjs/bullmq';
import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { ReceiverInformation } from '@modules/delivery/entities/receiver-information.entity';
import { Coin } from '@modules/user/entities/coin.entity';

import { JOB_NAME, QUEUE_NAME } from '@shared/constants';
import { ITEM_STATUS, TRANSACTION_STATUS } from '@shared/enums';
import { BaseCRUDService } from '@shared/services/base-crud.service';

import { PurchaseItemDto } from '../dtos/item.dto';
import { Item } from '../entities/item.entity';
import { Transaction } from '../entities/transaction.entity';

@Injectable()
export class ItemService extends BaseCRUDService<Item> {
  constructor(
    @InjectRepository(Item)
    private readonly itemRepository: Repository<Item>,
    @InjectRepository(Transaction)
    private readonly transactionRepository: Repository<Transaction>,
    @InjectQueue(QUEUE_NAME.COMMERCE)
    private readonly commerceQueue: Queue,
    private readonly dataSource: DataSource,
  ) {
    super(itemRepository);
  }

  public async purchaseItem(
    userId: string,
    itemId: string,
    dto: PurchaseItemDto,
  ): Promise<{ message: string; jobId: string }> {
    const { quantity, name, receiver_information_id } = dto;

    if (quantity <= 0) {
      throw new BadRequestException('Quantity must be greater than 0');
    }

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      // 1. Lock and retrieve Item
      const item = await queryRunner.manager.findOne(Item, {
        where: { id: itemId },
        lock: { mode: 'pessimistic_write' },
        relations: { creator: true },
      });

      if (!item) {
        throw new NotFoundException('Item not found');
      }

      if (item.status !== ITEM_STATUS.AVAILABLE) {
        throw new BadRequestException('Item is not available for purchase');
      }

      if (item.stock < quantity) {
        throw new BadRequestException('Insufficient stock');
      }

      // 2. Lock and retrieve buyer's Coin
      const buyerCoin = await queryRunner.manager.findOne(Coin, {
        where: { userId },
        lock: { mode: 'pessimistic_write' },
      });

      if (!buyerCoin) {
        throw new NotFoundException("Buyer's coin account not found");
      }

      const totalCost = item.price * quantity;
      if (buyerCoin.amount < totalCost) {
        throw new BadRequestException('Insufficient balance');
      }

      // 3. Resolve Receiver Information
      let receiverInfoId = receiver_information_id;
      if (!receiverInfoId) {
        const defaultReceiver = await queryRunner.manager.findOne(
          ReceiverInformation,
          {
            where: { userId, isDefault: true },
          },
        );
        if (!defaultReceiver) {
          throw new BadRequestException(
            'Missing receiver information and no default address found',
          );
        }
        receiverInfoId = defaultReceiver.id;
      } else {
        const receiverExists = await queryRunner.manager.findOne(
          ReceiverInformation,
          {
            where: { id: receiverInfoId },
          },
        );
        if (!receiverExists) {
          throw new NotFoundException('Receiver information not found');
        }
      }

      // 4. Deduct buyer's coins
      buyerCoin.amount -= totalCost;
      await queryRunner.manager.save(Coin, buyerCoin);

      // 5. Deduct item stock
      item.stock -= quantity;
      if (item.stock === 0) {
        item.status = ITEM_STATUS.SOLD_OUT;
      }
      await queryRunner.manager.save(Item, item);

      // 6. Create Item snapshot for transaction
      const itemSnapshot = {
        id: item.id,
        creator: {
          id: item.creator.id,
          username: item.creator.username,
        },
        name: item.name,
        description: item.description,
        price: item.price,
      };

      // 7. Create Pending Transaction
      const transaction = queryRunner.manager.create(Transaction, {
        receiverInformationId: receiverInfoId,
        buyerId: userId,
        sellerId: item.creator.id,
        itemId: item.id,
        name,
        itemSnapshot,
        totalPrice: totalCost,
        quantity,
        status: TRANSACTION_STATUS.PENDING,
      });

      const savedTransaction = await queryRunner.manager.save(
        Transaction,
        transaction,
      );

      // Commit DB Transaction
      await queryRunner.commitTransaction();

      // 8. Dispatch BullMQ Job
      const job = await this.commerceQueue.add(JOB_NAME.PROCESS_ITEM_PURCHASE, {
        transactionId: savedTransaction.id,
        buyerId: userId,
        itemId: item.id,
        quantity,
      });

      return {
        message: 'Purchase request is in queue',
        jobId: job.id,
      };
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }
}

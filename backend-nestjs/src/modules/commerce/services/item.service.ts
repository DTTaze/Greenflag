import { Queue } from 'bullmq';
import { DataSource, Repository } from 'typeorm';

import { InjectQueue } from '@nestjs/bullmq';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { ReceiverInformation } from '@modules/delivery/entities/receiver-information.entity';
import { Coin } from '@modules/user/entities/coin.entity';

import { ERR_CODE, JOB_NAME, QUEUE_NAME } from '@shared/constants';
import { ITEM_STATUS, TRANSACTION_STATUS } from '@shared/enums';
import {
  OperationResult,
  generateBadRequestResult,
  generateForbiddenResult,
  generateNotFoundResult,
  generateSuccessResult,
} from '@shared/helpers/operation-result.helper';
import { BaseCRUDService } from '@shared/services/base-crud.service';

import { PurchaseItemDto } from '../dtos/item.dto';
import { Item } from '../entities/item.entity';
import { Transaction } from '../entities/transaction.entity';

@Injectable()
export class ItemService extends BaseCRUDService<Item> {
  constructor(
    @InjectRepository(Item)
    private readonly itemRepository: Repository<Item>,
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
  ): Promise<OperationResult<{ message: string; jobId: string }>> {
    const { quantity, name, receiver_information_id } = dto;

    if (quantity <= 0) {
      return generateBadRequestResult(
        'Quantity must be greater than 0',
        ERR_CODE.BAD_REQUEST,
      );
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
        await queryRunner.rollbackTransaction();
        return generateNotFoundResult(
          'Item not found',
          ERR_CODE.ITEM_NOT_FOUND,
        );
      }

      if (item.status !== ITEM_STATUS.AVAILABLE) {
        await queryRunner.rollbackTransaction();
        return generateBadRequestResult(
          'Item is not available for purchase',
          ERR_CODE.ITEM_ALREADY_SOLD,
        );
      }

      if (item.stock < quantity) {
        await queryRunner.rollbackTransaction();
        return generateBadRequestResult(
          'Insufficient stock',
          ERR_CODE.BAD_REQUEST,
        );
      }

      // 2. Lock and retrieve buyer's Coin
      const buyerCoin = await queryRunner.manager.findOne(Coin, {
        where: { userId: userId },
        lock: { mode: 'pessimistic_write' },
      });

      if (!buyerCoin) {
        await queryRunner.rollbackTransaction();
        return generateNotFoundResult(
          "Buyer's coin account not found",
          ERR_CODE.COIN_NOT_FOUND,
        );
      }

      const totalCost = item.price * quantity;
      if (buyerCoin.amount < totalCost) {
        await queryRunner.rollbackTransaction();
        return generateBadRequestResult(
          'Insufficient balance',
          ERR_CODE.INSUFFICIENT_BALANCE,
        );
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
          await queryRunner.rollbackTransaction();
          return generateBadRequestResult(
            'Missing receiver information and no default address found',
            ERR_CODE.BAD_REQUEST,
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
          await queryRunner.rollbackTransaction();
          return generateNotFoundResult(
            'Receiver information not found',
            ERR_CODE.RECEIVER_INFO_NOT_FOUND,
          );
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

      return generateSuccessResult({
        message: 'Purchase request is in queue',
        jobId: job.id as string,
      });
    } catch (error) {
      await queryRunner.rollbackTransaction();
      return OperationResult.fail(
        ERR_CODE.INTERNAL_SERVER_ERROR,
        error.message,
      );
    } finally {
      await queryRunner.release();
    }
  }

  async updateItem(
    id: string,
    dto: Partial<Item>,
    currentUserId?: string,
    isAdmin: boolean = false,
  ): Promise<OperationResult<Item>> {
    const itemRes = await this.findByID(id);
    if (!itemRes.success || !itemRes.data) {
      return generateNotFoundResult('Item not found', ERR_CODE.ITEM_NOT_FOUND);
    }
    const item = itemRes.data;

    if (!isAdmin && currentUserId && item.creatorId !== currentUserId) {
      return generateForbiddenResult(
        'Bạn không có quyền chỉnh sửa vật phẩm của người khác',
        ERR_CODE.FORBIDDEN,
      );
    }
    const updateRes = await this.updateByID(id, dto);
    if (!updateRes.success) {
      return updateRes;
    }
    return this.findByID(id);
  }

  async deleteItem(
    id: string,
    currentUserId?: string,
    isAdmin: boolean = false,
  ): Promise<OperationResult<void>> {
    const itemRes = await this.findByID(id);
    if (!itemRes.success || !itemRes.data) {
      return generateNotFoundResult('Item not found', ERR_CODE.ITEM_NOT_FOUND);
    }
    const item = itemRes.data;

    if (!isAdmin && currentUserId && item.creatorId !== currentUserId) {
      return generateForbiddenResult(
        'Bạn không có quyền xóa vật phẩm của người khác',
        ERR_CODE.FORBIDDEN,
      );
    }
    await this.deleteByID(id);
    return generateSuccessResult(undefined);
  }
}

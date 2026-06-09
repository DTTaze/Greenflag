import { DataSource, In, Repository } from 'typeorm';

import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { Coin } from '@modules/user/entities/coin.entity';

import { ITEM_STATUS, TRANSACTION_STATUS } from '@shared/enums';
import { BaseCRUDService } from '@shared/services/base-crud.service';
import { SocketStubService } from '@shared/services/socket-stub.service';

import { Item } from '../entities/item.entity';
import { Transaction } from '../entities/transaction.entity';

@Injectable()
export class TransactionService extends BaseCRUDService<Transaction> {
  constructor(
    @InjectRepository(Transaction)
    private readonly transactionRepository: Repository<Transaction>,
    private readonly dataSource: DataSource,
    private readonly socketStubService: SocketStubService,
  ) {
    super(transactionRepository);
  }

  public async getTransactionByBuyerId(
    buyerId: string,
  ): Promise<Transaction[]> {
    return this.findAll(
      { buyerId },
      { relations: { receiverInformation: true, item: true } },
    );
  }

  public async getItemsByUserId(userId: string): Promise<Transaction[]> {
    return this.transactionRepository.find({
      where: {
        buyerId: userId,
        status: In([TRANSACTION_STATUS.PENDING, TRANSACTION_STATUS.ACCEPTED]),
      },
      relations: {
        item: true,
      },
      select: {
        id: true,
        totalPrice: true,
        quantity: true,
        status: true,
      },
    });
  }

  public async getTransactionBySellerId(
    sellerId: string,
  ): Promise<Transaction[]> {
    return this.findAll(
      { sellerId },
      { relations: { receiverInformation: true, item: true } },
    );
  }

  public async getTransactionById(id: string): Promise<Transaction> {
    const tx = await this.findOne(
      { id },
      { relations: { receiverInformation: true, item: true } },
    );
    if (!tx) {
      throw new NotFoundException('Transaction not found');
    }
    return tx;
  }

  public async cancelTransactionById(id: string): Promise<Transaction> {
    const transaction = await this.findByID(id);
    if (!transaction) {
      throw new NotFoundException('Transaction not found');
    }

    if (transaction.status === TRANSACTION_STATUS.CANCELLED) {
      throw new BadRequestException('Transaction is already cancelled');
    }

    if (transaction.status === TRANSACTION_STATUS.ACCEPTED) {
      throw new BadRequestException('Cannot cancel accepted transaction');
    }

    return this.refundTransaction(
      id,
      'User cancelled',
      TRANSACTION_STATUS.CANCELLED,
    );
  }

  public async makeDecision(
    id: string,
    decision: TRANSACTION_STATUS,
  ): Promise<Transaction> {
    if (
      ![
        TRANSACTION_STATUS.ACCEPTED,
        TRANSACTION_STATUS.REJECTED,
        TRANSACTION_STATUS.PENDING,
      ].includes(decision)
    ) {
      throw new BadRequestException('Invalid decision status');
    }

    const transaction = await this.findByID(id);
    if (!transaction) {
      throw new NotFoundException('Transaction not found');
    }

    if (transaction.status === decision) {
      throw new BadRequestException('Transaction is already in this status');
    }

    if (
      transaction.status === TRANSACTION_STATUS.ACCEPTED &&
      decision === TRANSACTION_STATUS.PENDING
    ) {
      throw new BadRequestException(
        'Cannot revert accepted transaction to pending',
      );
    }

    if (decision === TRANSACTION_STATUS.REJECTED) {
      return this.refundTransaction(
        id,
        'Rejected by seller/admin',
        TRANSACTION_STATUS.REJECTED,
      );
    }

    const updated = await this.updateByID(id, { status: decision });
    return updated;
  }

  /**
   * SAGA Compensating Action - Refund coins, restore stock, set exception status.
   */
  public async refundTransaction(
    transactionId: string,
    reason: string,
    targetStatus: TRANSACTION_STATUS = TRANSACTION_STATUS.CANCELLED,
  ): Promise<Transaction> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const transaction = await queryRunner.manager.findOne(Transaction, {
        where: { id: transactionId },
        lock: { mode: 'pessimistic_write' },
      });

      if (!transaction) {
        throw new NotFoundException('Transaction not found');
      }

      if (
        transaction.status === TRANSACTION_STATUS.CANCELLED ||
        transaction.status === TRANSACTION_STATUS.REJECTED
      ) {
        // Already refunded
        return transaction;
      }

      // 1. Update transaction status
      transaction.status = targetStatus;
      if (transaction.itemSnapshot) {
        transaction.itemSnapshot.cancelReason = reason;
      }
      await queryRunner.manager.save(Transaction, transaction);

      // 2. Refund coins to buyer
      const buyerCoin = await queryRunner.manager.findOne(Coin, {
        where: { userId: transaction.buyerId },
        lock: { mode: 'pessimistic_write' },
      });

      if (buyerCoin) {
        buyerCoin.amount += transaction.totalPrice;
        await queryRunner.manager.save(Coin, buyerCoin);
      }

      // 3. Restore stock and update Item status
      const item = await queryRunner.manager.findOne(Item, {
        where: { id: transaction.itemId },
        lock: { mode: 'pessimistic_write' },
      });

      if (item) {
        item.stock += transaction.quantity;
        if (item.stock > 0) {
          item.status = ITEM_STATUS.AVAILABLE;
        }
        await queryRunner.manager.save(Item, item);

        this.socketStubService.emitStockUpdate(item.id, item.stock, {
          name: item.name,
          price: item.price,
          status: item.status,
        });
      }

      await queryRunner.commitTransaction();
      return transaction;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }
}

import { DataSource, In, Repository } from 'typeorm';

import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { Coin } from '@modules/user/entities/coin.entity';

import { ERR_CODE } from '@shared/constants';
import { ITEM_STATUS, TRANSACTION_STATUS } from '@shared/enums';
import {
  OperationResult,
  generateBadRequestResult,
  generateForbiddenResult,
  generateNotFoundResult,
  generateSuccessResult,
} from '@shared/helpers/operation-result.helper';
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
  ): Promise<OperationResult<Transaction[]>> {
    return this.findAll(
      { buyerId },
      { relations: { receiverInformation: true, item: true } },
    );
  }

  public async getItemsByUserId(
    userId: string,
  ): Promise<OperationResult<Transaction[]>> {
    try {
      const list = await this.transactionRepository.find({
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
      return generateSuccessResult(list);
    } catch (error) {
      return OperationResult.fail('find_failed', error.message);
    }
  }

  public async getTransactionBySellerId(
    sellerId: string,
  ): Promise<OperationResult<Transaction[]>> {
    return this.findAll(
      { sellerId },
      { relations: { receiverInformation: true, item: true } },
    );
  }

  public async getTransactionById(
    id: string,
  ): Promise<OperationResult<Transaction>> {
    const txRes = await this.findOne(
      { id },
      { relations: { receiverInformation: true, item: true } },
    );
    if (!txRes.success || !txRes.data) {
      return generateNotFoundResult(
        'Transaction not found',
        ERR_CODE.TRANSACTION_NOT_FOUND,
      );
    }
    return txRes;
  }

  public async cancelTransactionById(
    id: string,
    currentUserId?: string,
    isAdmin: boolean = false,
  ): Promise<OperationResult<Transaction>> {
    const transactionRes = await this.findByID(id);
    if (!transactionRes.success || !transactionRes.data) {
      return generateNotFoundResult(
        'Transaction not found',
        ERR_CODE.TRANSACTION_NOT_FOUND,
      );
    }
    const transaction = transactionRes.data;

    if (!isAdmin && currentUserId && transaction.buyerId !== currentUserId) {
      return generateForbiddenResult(
        'Bạn không có quyền hủy giao dịch của người khác',
        ERR_CODE.FORBIDDEN,
      );
    }

    if (transaction.status === TRANSACTION_STATUS.CANCELLED) {
      return generateBadRequestResult(
        'Transaction is already cancelled',
        ERR_CODE.BAD_REQUEST,
      );
    }

    if (transaction.status === TRANSACTION_STATUS.ACCEPTED) {
      return generateBadRequestResult(
        'Cannot cancel accepted transaction',
        ERR_CODE.BAD_REQUEST,
      );
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
    currentUserId?: string,
    isAdmin: boolean = false,
  ): Promise<OperationResult<Transaction>> {
    if (
      ![
        TRANSACTION_STATUS.ACCEPTED,
        TRANSACTION_STATUS.REJECTED,
        TRANSACTION_STATUS.PENDING,
      ].includes(decision)
    ) {
      return generateBadRequestResult(
        'Invalid decision status',
        ERR_CODE.BAD_REQUEST,
      );
    }

    const transactionRes = await this.findByID(id);
    if (!transactionRes.success || !transactionRes.data) {
      return generateNotFoundResult(
        'Transaction not found',
        ERR_CODE.TRANSACTION_NOT_FOUND,
      );
    }
    const transaction = transactionRes.data;

    if (!isAdmin && currentUserId && transaction.sellerId !== currentUserId) {
      return generateForbiddenResult(
        'Bạn không có quyền duyệt giao dịch này',
        ERR_CODE.FORBIDDEN,
      );
    }

    if (transaction.status === decision) {
      return generateBadRequestResult(
        'Transaction is already in this status',
        ERR_CODE.BAD_REQUEST,
      );
    }

    if (
      transaction.status === TRANSACTION_STATUS.ACCEPTED &&
      decision === TRANSACTION_STATUS.PENDING
    ) {
      return generateBadRequestResult(
        'Cannot revert accepted transaction to pending',
        ERR_CODE.BAD_REQUEST,
      );
    }

    if (decision === TRANSACTION_STATUS.REJECTED) {
      return this.refundTransaction(
        id,
        'Rejected by seller/admin',
        TRANSACTION_STATUS.REJECTED,
      );
    }

    const updatedRes = await this.updateByID(id, { status: decision });
    return updatedRes;
  }

  /**
   * SAGA Compensating Action - Refund coins, restore stock, set exception status.
   */
  public async refundTransaction(
    transactionId: string,
    reason: string,
    targetStatus: TRANSACTION_STATUS = TRANSACTION_STATUS.CANCELLED,
  ): Promise<OperationResult<Transaction>> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const transaction = await queryRunner.manager.findOne(Transaction, {
        where: { id: transactionId },
        lock: { mode: 'pessimistic_write' },
      });

      if (!transaction) {
        await queryRunner.rollbackTransaction();
        return generateNotFoundResult(
          'Transaction not found',
          ERR_CODE.TRANSACTION_NOT_FOUND,
        );
      }

      if (
        transaction.status === TRANSACTION_STATUS.CANCELLED ||
        transaction.status === TRANSACTION_STATUS.REJECTED
      ) {
        // Already refunded
        await queryRunner.rollbackTransaction();
        return generateSuccessResult(transaction);
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
      return generateSuccessResult(transaction);
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
}

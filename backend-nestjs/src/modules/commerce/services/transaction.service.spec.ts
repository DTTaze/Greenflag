import { DataSource, Repository } from 'typeorm';

import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';

import { Coin } from '@modules/user/entities/coin.entity';

import { ERR_CODE } from '@shared/constants';
import { ITEM_STATUS, TRANSACTION_STATUS } from '@shared/enums';
import { SocketStubService } from '@shared/services/socket-stub.service';

import { Item } from '../entities/item.entity';
import { Transaction } from '../entities/transaction.entity';
import { TransactionService } from './transaction.service';

describe('TransactionService', () => {
  let service: TransactionService;
  let transactionRepo: Repository<Transaction>;
  let socketStubService: SocketStubService;

  const mockTransactionRepository = {
    find: jest.fn(),
    findOne: jest.fn(),
    save: jest.fn(),
  };

  const mockSocketStubService = {
    emitStockUpdate: jest.fn(),
  };

  const mockQueryRunner = {
    connect: jest.fn(),
    startTransaction: jest.fn(),
    commitTransaction: jest.fn(),
    rollbackTransaction: jest.fn(),
    release: jest.fn(),
    manager: {
      findOne: jest.fn(),
      save: jest.fn(),
    },
  };

  const mockDataSource = {
    createQueryRunner: jest.fn().mockReturnValue(mockQueryRunner),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TransactionService,
        {
          provide: getRepositoryToken(Transaction),
          useValue: mockTransactionRepository,
        },
        {
          provide: DataSource,
          useValue: mockDataSource,
        },
        {
          provide: SocketStubService,
          useValue: mockSocketStubService,
        },
      ],
    }).compile();

    service = module.get<TransactionService>(TransactionService);
    transactionRepo = module.get<Repository<Transaction>>(
      getRepositoryToken(Transaction),
    );
    socketStubService = module.get<SocketStubService>(SocketStubService);

    jest.clearAllMocks();
  });

  describe('cancelTransactionById', () => {
    it('should cancel transaction successfully if status is PENDING and buyer matches', async () => {
      const mockTx = {
        id: 'tx-123',
        buyerId: 'user-456',
        sellerId: 'user-789',
        itemId: 'item-101',
        totalPrice: 100,
        quantity: 2,
        status: TRANSACTION_STATUS.PENDING,
      } as Transaction;

      jest.spyOn(service, 'findByID').mockResolvedValue({
        success: true,
        data: mockTx,
      });

      const refundSpy = jest
        .spyOn(service, 'refundTransaction')
        .mockResolvedValue({
          success: true,
          data: { ...mockTx, status: TRANSACTION_STATUS.CANCELLED },
        });

      const result = await service.cancelTransactionById('tx-123', 'user-456');

      expect(result.success).toBe(true);
      expect(result.data.status).toBe(TRANSACTION_STATUS.CANCELLED);
      expect(refundSpy).toHaveBeenCalledWith(
        'tx-123',
        'User cancelled',
        TRANSACTION_STATUS.CANCELLED,
      );
    });

    it('should throw FORBIDDEN if currentUserId is not the buyer', async () => {
      const mockTx = {
        id: 'tx-123',
        buyerId: 'user-456',
        status: TRANSACTION_STATUS.PENDING,
      } as Transaction;

      jest.spyOn(service, 'findByID').mockResolvedValue({
        success: true,
        data: mockTx,
      });

      const result = await service.cancelTransactionById(
        'tx-123',
        'other-user',
        false,
      );

      expect(result.success).toBe(false);
      expect(result.code).toBe(ERR_CODE.FORBIDDEN);
    });

    it('should return BAD_REQUEST if transaction is already CANCELLED', async () => {
      const mockTx = {
        id: 'tx-123',
        buyerId: 'user-456',
        status: TRANSACTION_STATUS.CANCELLED,
      } as Transaction;

      jest.spyOn(service, 'findByID').mockResolvedValue({
        success: true,
        data: mockTx,
      });

      const result = await service.cancelTransactionById('tx-123', 'user-456');

      expect(result.success).toBe(false);
      expect(result.code).toBe(ERR_CODE.BAD_REQUEST);
    });

    it('should return BAD_REQUEST if transaction is already ACCEPTED', async () => {
      const mockTx = {
        id: 'tx-123',
        buyerId: 'user-456',
        status: TRANSACTION_STATUS.ACCEPTED,
      } as Transaction;

      jest.spyOn(service, 'findByID').mockResolvedValue({
        success: true,
        data: mockTx,
      });

      const result = await service.cancelTransactionById('tx-123', 'user-456');

      expect(result.success).toBe(false);
      expect(result.code).toBe(ERR_CODE.BAD_REQUEST);
    });
  });

  describe('makeDecision', () => {
    it('should accept transaction successfully if currentUserId is the seller', async () => {
      const mockTx = {
        id: 'tx-123',
        sellerId: 'user-789',
        status: TRANSACTION_STATUS.PENDING,
      } as Transaction;

      jest.spyOn(service, 'findByID').mockResolvedValue({
        success: true,
        data: mockTx,
      });

      const updateSpy = jest.spyOn(service, 'updateByID').mockResolvedValue({
        success: true,
        data: { ...mockTx, status: TRANSACTION_STATUS.ACCEPTED },
      });

      const result = await service.makeDecision(
        'tx-123',
        TRANSACTION_STATUS.ACCEPTED,
        'user-789',
      );

      expect(result.success).toBe(true);
      expect(result.data.status).toBe(TRANSACTION_STATUS.ACCEPTED);
      expect(updateSpy).toHaveBeenCalledWith('tx-123', {
        status: TRANSACTION_STATUS.ACCEPTED,
      });
    });

    it('should throw FORBIDDEN if currentUserId is not the seller', async () => {
      const mockTx = {
        id: 'tx-123',
        sellerId: 'user-789',
        status: TRANSACTION_STATUS.PENDING,
      } as Transaction;

      jest.spyOn(service, 'findByID').mockResolvedValue({
        success: true,
        data: mockTx,
      });

      const result = await service.makeDecision(
        'tx-123',
        TRANSACTION_STATUS.ACCEPTED,
        'other-user',
      );

      expect(result.success).toBe(false);
      expect(result.code).toBe(ERR_CODE.FORBIDDEN);
    });
  });

  describe('refundTransaction', () => {
    it('should execute compensating transaction and refund successfully', async () => {
      const mockTx = {
        id: 'tx-123',
        buyerId: 'user-456',
        itemId: 'item-101',
        totalPrice: 1500,
        quantity: 1,
        status: TRANSACTION_STATUS.PENDING,
        itemSnapshot: {},
      } as unknown as Transaction;

      const mockCoin = {
        userId: 'user-456',
        amount: 500,
      } as Coin;

      const mockItem = {
        id: 'item-101',
        stock: 5,
        name: 'Eco Cup',
        price: 1500,
        status: ITEM_STATUS.PENDING,
      } as Item;

      mockQueryRunner.manager.findOne
        .mockResolvedValueOnce(mockTx) // Find Transaction
        .mockResolvedValueOnce(mockCoin) // Find Coin
        .mockResolvedValueOnce(mockItem); // Find Item

      const result = await service.refundTransaction(
        'tx-123',
        'Rejected by seller',
        TRANSACTION_STATUS.REJECTED,
      );

      expect(result.success).toBe(true);
      expect(mockQueryRunner.connect).toHaveBeenCalled();
      expect(mockQueryRunner.startTransaction).toHaveBeenCalled();
      expect(mockQueryRunner.manager.save).toHaveBeenCalledTimes(3); // Save Transaction, Coin, Item

      expect(mockCoin.amount).toBe(2000); // 500 + 1500 refund
      expect(mockItem.stock).toBe(6); // 5 + 1 restored
      expect(mockItem.status).toBe(ITEM_STATUS.AVAILABLE); // status updated since stock > 0
      expect(socketStubService.emitStockUpdate).toHaveBeenCalledWith(
        'item-101',
        6,
        { name: 'Eco Cup', price: 1500, status: ITEM_STATUS.AVAILABLE },
      );
      expect(mockQueryRunner.commitTransaction).toHaveBeenCalled();
    });

    it('should return NOT_FOUND if transaction to refund is missing', async () => {
      mockQueryRunner.manager.findOne.mockResolvedValueOnce(null);

      const result = await service.refundTransaction('tx-not-exists', 'Reason');

      expect(result.success).toBe(false);
      expect(result.code).toBe(ERR_CODE.TRANSACTION_NOT_FOUND);
      expect(mockQueryRunner.rollbackTransaction).toHaveBeenCalled();
    });
  });
});

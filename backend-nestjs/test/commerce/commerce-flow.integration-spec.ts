import { getQueueToken } from '@nestjs/bullmq';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { Job, Queue } from 'bullmq';
import { EventEmitter2 } from '@nestjs/event-emitter';

import { DeliveryAccount } from '@modules/delivery/entities/delivery-account.entity';
import { DeliveryOrder } from '@modules/delivery/entities/delivery-order.entity';
import { ReceiverInformation } from '@modules/delivery/entities/receiver-information.entity';
import { ShippingFactoryService } from '@modules/delivery/services/shipping-factory.service';
import { ShippingReconciliationCron } from '@modules/delivery/cron/shipping-reconciliation.cron';
import { Coin } from '@modules/user/entities/coin.entity';
import { User } from '@modules/user/entities/user.entity';
import { MetricsService } from '@modules/global/metrics.service';

import { JOB_NAME, QUEUE_NAME } from '@shared/constants';
import { ITEM_STATUS, TRANSACTION_STATUS, DELIVERY_ORDER_STATUS } from '@shared/enums';

import { CommerceProcessor } from '@modules/commerce/processors/commerce.processor';
import { Item } from '@modules/commerce/entities/item.entity';
import { Transaction } from '@modules/commerce/entities/transaction.entity';
import { ItemService } from '@modules/commerce/services/item.service';
import { TransactionService } from '@modules/commerce/services/transaction.service';

describe('Commerce Flow Integration', () => {
  let itemService: ItemService;
  let commerceProcessor: CommerceProcessor;
  let commerceQueue: Queue;
  let shippingReconciliationCron: ShippingReconciliationCron;

  // Mock repositories
  const mockItemRepo = {
    findOne: jest.fn(),
  };
  const mockTxRepo = {
    findOne: jest.fn(),
    save: jest.fn(),
    update: jest.fn().mockResolvedValue({ affected: 1 }),
  };
  const mockDeliveryAccRepo = {
    findOne: jest.fn(),
  };
  const mockDeliveryOrderRepo = {
    create: jest.fn().mockImplementation((dto) => dto),
    save: jest.fn().mockImplementation((entity) => Promise.resolve(entity)),
    find: jest.fn(),
  };

  // Mock BullMQ Queue
  const mockQueue = {
    add: jest.fn().mockResolvedValue({ id: 'mock-job-123' }),
  };

  // Mock services
  const mockTransactionService = {
    refundTransaction: jest.fn(),
  };

  const mockShippingFactoryService = {
    getProvider: jest.fn().mockReturnValue({
      createOrder: jest.fn().mockResolvedValue({
        success: true,
        orderCode: 'GHN-SHIPPED-123',
        totalFee: 50,
        status: 'ready_to_pick',
      }),
    }),
  };

  const mockMetricsService = {
    incrementSuccessfulPurchases: jest.fn(),
    incrementFailedPurchases: jest.fn(),
  };

  const mockEventEmitter = {
    emit: jest.fn(),
  };

  // Mock QueryRunner
  const mockQueryRunner = {
    connect: jest.fn(),
    startTransaction: jest.fn(),
    commitTransaction: jest.fn(),
    rollbackTransaction: jest.fn(),
    release: jest.fn(),
    manager: {
      findOne: jest.fn(),
      save: jest.fn().mockImplementation((entityClass, entity) => {
        const target = entity || entityClass;
        if (target && typeof target === 'object' && !target.id) {
          target.id = 'tx-123';
        }
        return Promise.resolve(target);
      }),
      create: jest.fn().mockImplementation((entityClass, dto) => dto),
    },
  };

  const mockDataSource = {
    createQueryRunner: jest.fn().mockReturnValue(mockQueryRunner),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ItemService,
        CommerceProcessor,
        {
          provide: getRepositoryToken(Item),
          useValue: mockItemRepo,
        },
        {
          provide: getRepositoryToken(Transaction),
          useValue: mockTxRepo,
        },
        {
          provide: getRepositoryToken(DeliveryAccount),
          useValue: mockDeliveryAccRepo,
        },
        {
          provide: getRepositoryToken(DeliveryOrder),
          useValue: mockDeliveryOrderRepo,
        },
        {
          provide: getQueueToken(QUEUE_NAME.COMMERCE),
          useValue: mockQueue,
        },
        {
          provide: DataSource,
          useValue: mockDataSource,
        },
        {
          provide: TransactionService,
          useValue: mockTransactionService,
        },
        {
          provide: ShippingFactoryService,
          useValue: mockShippingFactoryService,
        },
        {
          provide: MetricsService,
          useValue: mockMetricsService,
        },
        ShippingReconciliationCron,
        {
          provide: EventEmitter2,
          useValue: mockEventEmitter,
        },
      ],
    }).compile();

    itemService = module.get<ItemService>(ItemService);
    commerceProcessor = module.get<CommerceProcessor>(CommerceProcessor);
    commerceQueue = module.get<Queue>(getQueueToken(QUEUE_NAME.COMMERCE));
    shippingReconciliationCron = module.get<ShippingReconciliationCron>(ShippingReconciliationCron);

    jest.clearAllMocks();
  });

  it('should successfully push a purchase request to the queue via ItemService', async () => {
    const mockUser = { id: 'buyer-123' } as User;
    const mockItem = {
      id: 'item-123',
      name: 'Test Item',
      price: 100,
      stock: 10,
      status: ITEM_STATUS.AVAILABLE,
      creator: { id: 'seller-123' },
    } as unknown as Item;

    const mockCoin = {
      userId: 'buyer-123',
      amount: 1000,
    } as Coin;

    // Simulate database lookup during purchase creation
    mockQueryRunner.manager.findOne.mockImplementation((entityClass, options) => {
      if (entityClass === Item) return Promise.resolve(mockItem);
      if (entityClass === Coin) return Promise.resolve(mockCoin);
      if (entityClass === ReceiverInformation) {
        return Promise.resolve({
          id: 'receiver-info-123',
          userId: 'buyer-123',
          isDefault: true,
          toName: 'Recipient Name',
          toPhone: '0901234567',
          toAddress: '123 Test Street',
        });
      }
      return Promise.resolve(null);
    });

    const result = await itemService.purchaseItem('buyer-123', 'item-123', {
      name: 'Test Item',
      quantity: 2,
      to_name: 'Recipient Name',
      to_phone: '0901234567',
      to_address: '123 Test Street',
    });

    expect(result.success).toBe(true);
    expect(result.data.jobId).toBe('mock-job-123');
    expect(mockQueue.add).toHaveBeenCalledWith(
      JOB_NAME.PROCESS_ITEM_PURCHASE,
      expect.objectContaining({
        transactionId: expect.any(String),
      }),
    );
    expect(mockQueryRunner.commitTransaction).toHaveBeenCalled();
  });

  it('should process the queue job and create a shipping order via CommerceProcessor', async () => {
    const mockTx = {
      id: 'tx-123',
      buyerId: 'buyer-123',
      sellerId: 'seller-123',
      itemId: 'item-123',
      totalPrice: 200,
      quantity: 2,
      status: TRANSACTION_STATUS.PENDING,
      receiverInformation: {
        toName: 'Recipient Name',
        toPhone: '0901234567',
        toAddress: '123 Test Street',
        toWardName: 'Ward 1',
        toDistrictName: 'District 1',
        toProvinceName: 'Province 1',
      },
      item: {
        id: 'item-123',
        name: 'Test Item',
        weight: 200,
        length: 10,
        width: 10,
        height: 10,
      },
    } as unknown as Transaction;

    const mockSellerDeliveryAccount = {
      id: 'delivery-acc-123',
      userId: 'seller-123',
      carrier: 'ghn',
      apiConfig: { token: 'mock-token', shop_id: 'mock-shop-id' },
    } as DeliveryAccount;

    // Simulate database lookups inside worker process()
    mockTxRepo.findOne.mockResolvedValue(mockTx);
    mockDeliveryAccRepo.findOne.mockResolvedValue(mockSellerDeliveryAccount);

    const mockJob = {
      name: JOB_NAME.PROCESS_ITEM_PURCHASE,
      data: {
        transactionId: 'tx-123',
        traceContext: {},
      },
    } as unknown as Job;

    await commerceProcessor.process(mockJob);

    // Verify delivery order creation
    expect(mockDeliveryOrderRepo.save).toHaveBeenCalledWith(
      expect.objectContaining({
        transactionId: 'tx-123',
        sellerId: 'seller-123',
        buyerId: 'buyer-123',
        orderCode: 'GHN-SHIPPED-123',
        status: 'ready_to_pick',
      }),
    );
    // Verify successful metrics increment
    expect(mockMetricsService.incrementSuccessfulPurchases).toHaveBeenCalled();
  });

  it('should reconcile shipping orders, update status, and emit event via ShippingReconciliationCron', async () => {
    const mockOrder = {
      id: 'order-123',
      orderCode: 'GHN-SHIPPED-123',
      status: DELIVERY_ORDER_STATUS.PICKING,
      deliveryAccountId: 'delivery-acc-123',
      buyerId: 'buyer-123',
      sellerId: 'seller-123',
    } as unknown as DeliveryOrder;

    const mockAccount = {
      id: 'delivery-acc-123',
      carrier: 'ghn',
    } as DeliveryAccount;

    // Setup mock repositories behaviour
    mockDeliveryOrderRepo.find = jest.fn().mockResolvedValue([mockOrder]);
    mockDeliveryAccRepo.findOne = jest.fn().mockResolvedValue(mockAccount);
    mockDeliveryOrderRepo.save = jest.fn().mockResolvedValue(mockOrder);

    // Mock provider getOrderStatus
    const mockProvider = mockShippingFactoryService.getProvider('ghn');
    mockProvider.getOrderStatus = jest.fn().mockResolvedValue(DELIVERY_ORDER_STATUS.DELIVERED);

    await shippingReconciliationCron.reconcileShippingOrders();

    // Verify order status updated
    expect(mockOrder.status).toBe(DELIVERY_ORDER_STATUS.DELIVERED);
    expect(mockDeliveryOrderRepo.save).toHaveBeenCalledWith(mockOrder);

    // Verify event emitted
    expect(mockEventEmitter.emit).toHaveBeenCalledWith(
      'delivery.status_updated',
      expect.objectContaining({
        orderCode: 'GHN-SHIPPED-123',
        status: DELIVERY_ORDER_STATUS.DELIVERED,
      }),
    );
  });
});

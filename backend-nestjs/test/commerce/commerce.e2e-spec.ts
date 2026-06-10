import { ExecutionContext, INestApplication, ValidationPipe } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import * as request from 'supertest';

import { AuthGuard } from '@shared/guards/auth.guard';
import { ITEM_STATUS, TRANSACTION_STATUS } from '@shared/enums';
import { generateSuccessResult } from '@shared/helpers/operation-result.helper';

import { CommerceController } from '@modules/commerce/commerce.controller';
import { ItemService } from '@modules/commerce/services/item.service';
import { ProductService } from '@modules/commerce/services/product.service';
import { TransactionService } from '@modules/commerce/services/transaction.service';

describe('CommerceController (e2e)', () => {
  let app: INestApplication;

  const mockItem = {
    id: 'item-uuid-123',
    name: 'Eco Bottle',
    price: 150,
    stock: 5,
    status: ITEM_STATUS.AVAILABLE,
  };

  // Mock services
  const mockItemService = {
    findAll: jest.fn().mockResolvedValue(generateSuccessResult([mockItem])),
    findOne: jest.fn().mockResolvedValue(generateSuccessResult(mockItem)),
    purchaseItem: jest.fn().mockResolvedValue(
      generateSuccessResult({
        message: 'Purchase request is in queue',
        jobId: 'job-123',
      }),
    ),
  };

  const mockProductService = {
    findAll: jest.fn().mockResolvedValue(generateSuccessResult([])),
    findByID: jest.fn().mockResolvedValue(generateSuccessResult(null)),
  };

  const mockTransactionService = {
    getTransactionByBuyerId: jest.fn().mockResolvedValue(generateSuccessResult([])),
    getTransactionById: jest.fn().mockResolvedValue(generateSuccessResult(null)),
    cancelTransactionById: jest.fn().mockResolvedValue(generateSuccessResult(null)),
  };

  // AuthGuard Bypass Mock
  const mockAuthGuard = {
    canActivate: (context: ExecutionContext) => {
      const req = context.switchToHttp().getRequest();
      req.user = {
        id: 'buyer-uuid-456',
        username: 'buyer_test',
        role: 'user',
      };
      req.context = {
        user: {
          id: 'buyer-uuid-456',
          username: 'buyer_test',
          role: 'user',
        },
      };
      return true;
    },
  };

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      controllers: [CommerceController],
      providers: [
        {
          provide: ItemService,
          useValue: mockItemService,
        },
        {
          provide: ProductService,
          useValue: mockProductService,
        },
        {
          provide: TransactionService,
          useValue: mockTransactionService,
        },
      ],
    })
      .overrideGuard(AuthGuard)
      .useValue(mockAuthGuard)
      .compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  describe('GET /commerce/items', () => {
    it('should return a list of items (200 OK)', () => {
      return request(app.getHttpServer())
        .get('/commerce/items')
        .expect(200)
        .expect((res) => {
          expect(res.body.success).toBe(true);
          expect(Array.isArray(res.body.data)).toBe(true);
          expect(res.body.data[0].name).toBe('Eco Bottle');
        });
    });
  });

  describe('POST /commerce/items/:itemId/purchase', () => {
    it('should successfully initiate a purchase and return 201 Created', () => {
      return request(app.getHttpServer())
        .post('/commerce/items/item-uuid-123/purchase')
        .send({
          name: 'Eco Bottle',
          quantity: 1,
          to_name: 'Nguyen Van A',
          to_phone: '0901234567',
          to_address: '123 Test Street, Ward 1, District 1, HCMC',
        })
        .expect(201)
        .expect((res) => {
          expect(res.body.success).toBe(true);
          expect(res.body.data.message).toBe('Purchase request is in queue');
          expect(res.body.data.jobId).toBe('job-123');
        });
    });

    it('should return 400 Bad Request if validation fails (e.g. quantity <= 0)', () => {
      return request(app.getHttpServer())
        .post('/commerce/items/item-uuid-123/purchase')
        .send({
          name: 'Eco Bottle',
          quantity: -1, // Invalid quantity
          to_name: 'Nguyen Van A',
          to_phone: '0901234567',
          to_address: '123 Test Street',
        })
        .expect(400);
    });
  });
});

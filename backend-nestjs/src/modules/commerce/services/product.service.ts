import { DataSource, Repository } from 'typeorm';

import { Injectable } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { InjectRepository } from '@nestjs/typeorm';

import { ReceiverInformation } from '@modules/delivery/entities/receiver-information.entity';
import { Coin } from '@modules/user/entities/coin.entity';

import { ERR_CODE, EVENT_KEYS } from '@shared/constants';
import { PRODUCT_POST_STATUS, TRANSACTION_STATUS, ROLE } from '@shared/enums';
import {
  OperationResult,
  generateBadRequestResult,
  generateForbiddenResult,
  generateNotFoundResult,
  generateSuccessResult,
} from '@shared/helpers/operation-result.helper';
import { BaseCRUDService } from '@shared/services/base-crud.service';

import { PurchaseItemDto } from '../dtos/item.dto';
import { Product } from '../entities/product.entity';
import { Transaction } from '../entities/transaction.entity';


@Injectable()
export class ProductService extends BaseCRUDService<Product> {
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
    private readonly dataSource: DataSource,
    private readonly eventEmitter: EventEmitter2,
  ) {
    super(productRepository);
  }


  async updateProduct(
    id: string,
    dto: Partial<Product>,
    currentUserId?: string,
    isAdmin: boolean = false,
  ): Promise<OperationResult<Product>> {
    const productRes = await this.findByID(id);
    if (!productRes.success || !productRes.data) {
      return generateNotFoundResult(
        'Product not found',
        ERR_CODE.PRODUCT_NOT_FOUND,
      );
    }
    const product = productRes.data;

    if (!isAdmin && currentUserId && product.sellerId !== currentUserId) {
      return generateForbiddenResult(
        'Bạn không có quyền chỉnh sửa sản phẩm của người khác',
        ERR_CODE.FORBIDDEN,
      );
    }
    const updateRes = await this.updateByID(id, dto);
    if (!updateRes.success) {
      return updateRes;
    }
    return this.findByID(id);
  }

  async deleteProduct(
    id: string,
    currentUserId?: string,
    isAdmin: boolean = false,
  ): Promise<OperationResult<void>> {
    const productRes = await this.findByID(id);
    if (!productRes.success || !productRes.data) {
      return generateNotFoundResult(
        'Product not found',
        ERR_CODE.PRODUCT_NOT_FOUND,
      );
    }
    const product = productRes.data;

    if (!isAdmin && currentUserId && product.sellerId !== currentUserId) {
      return generateForbiddenResult(
        'Bạn không có quyền xóa sản phẩm của người khác',
        ERR_CODE.FORBIDDEN,
      );
    }
    await this.deleteByID(id);
    return generateSuccessResult(undefined);
  }

  async getProductDetail(id: string): Promise<OperationResult<Product>> {
    return this.findByID(id, {
      relations: {
        seller: {
          profile: true,
        },
      },
      select: {
        id: true,
        sellerId: true,
        name: true,
        description: true,
        price: true,
        stock: true,
        category: true,
        productStatus: true,
        postStatus: true,
        images: true,
        createdAt: true,
        updatedAt: true,
        deletedAt: true,
        seller: {
          id: true,
          email: true,
          username: true,
          avatarUrl: true,
          profile: {
            id: true,
            fullName: true,
          } as any,
        } as any,
      } as any,
    });
  }

  async findAllProducts(options: {
    withDeleted?: boolean;
    sellerId?: string;
    postStatus?: PRODUCT_POST_STATUS;
    currentUser?: any;
  }): Promise<OperationResult<Product[]>> {
    const { currentUser, sellerId, postStatus, withDeleted } = options;
    const where: any = {};

    const isAdmin = currentUser?.role === ROLE.ADMIN;
    const isQueryingOwnProducts = sellerId && currentUser && String(sellerId) === String(currentUser.id);

    if (isAdmin) {
      if (sellerId) where.sellerId = sellerId;
      if (postStatus) where.postStatus = postStatus;
    } else if (isQueryingOwnProducts) {
      where.sellerId = sellerId;
      if (postStatus) where.postStatus = postStatus;
    } else {
      where.postStatus = PRODUCT_POST_STATUS.PUBLIC;
      if (sellerId) where.sellerId = sellerId;
    }

    return this.findAll(
      where,
      {
        withDeleted,
        relations: {
          seller: {
            profile: true,
          },
        },
        select: {
          id: true,
          sellerId: true,
          name: true,
          description: true,
          price: true,
          stock: true,
          category: true,
          productStatus: true,
          postStatus: true,
          images: true,
          createdAt: true,
          updatedAt: true,
          deletedAt: true,
          seller: {
            id: true,
            email: true,
            username: true,
            avatarUrl: true,
            profile: {
              id: true,
              fullName: true,
            } as any,
          } as any,
        } as any,
      },
    );
  }

  public async purchaseProduct(
    userId: string,
    productId: string,
    dto: PurchaseItemDto,
  ): Promise<OperationResult<{ message: string; transactionId: string }>> {
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
      // 1. Lock and retrieve Product (without relations to avoid lock amplification or errors)
      const product = await queryRunner.manager.findOne(Product, {
        where: { id: productId },
        lock: { mode: 'pessimistic_write' },
      });

      if (!product) {
        await queryRunner.rollbackTransaction();
        return generateNotFoundResult(
          'Product not found',
          ERR_CODE.PRODUCT_NOT_FOUND,
        );
      }

      // Load seller relation separately without lock
      product.seller = (await queryRunner.manager.findOne(Product, {
        where: { id: productId },
        relations: { seller: true },
      }))?.seller;

      if (product.sellerId === userId) {
        await queryRunner.rollbackTransaction();
        return generateBadRequestResult(
          'You cannot purchase your own product',
          ERR_CODE.BAD_REQUEST,
        );
      }

      if (product.postStatus !== PRODUCT_POST_STATUS.PUBLIC) {
        await queryRunner.rollbackTransaction();
        return generateBadRequestResult(
          'Product is not public for purchase',
          ERR_CODE.BAD_REQUEST,
        );
      }

      if (product.stock < quantity) {
        await queryRunner.rollbackTransaction();
        return generateBadRequestResult(
          'Insufficient stock',
          ERR_CODE.BAD_REQUEST,
        );
      }

      // 2. Deadlock prevention: Lock buyer and seller Coin records in alphabetical order of user IDs
      const [firstId, secondId] = [userId, product.sellerId].sort();

      let buyerCoin: Coin | null = null;
      let sellerCoin: Coin | null = null;

      const firstCoin = await queryRunner.manager.findOne(Coin, {
        where: { userId: firstId },
        lock: { mode: 'pessimistic_write' },
      });

      const secondCoin = await queryRunner.manager.findOne(Coin, {
        where: { userId: secondId },
        lock: { mode: 'pessimistic_write' },
      });

      if (firstId === userId) {
        buyerCoin = firstCoin;
        sellerCoin = secondCoin;
      } else {
        buyerCoin = secondCoin;
        sellerCoin = firstCoin;
      }

      if (!buyerCoin) {
        await queryRunner.rollbackTransaction();
        return generateNotFoundResult(
          "Buyer's coin account not found",
          ERR_CODE.COIN_NOT_FOUND,
        );
      }

      if (!sellerCoin) {
        sellerCoin = queryRunner.manager.create(Coin, {
          userId: product.sellerId,
          amount: 0,
        });
      }

      const totalCost = product.price * quantity;
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

      // 4. Deduct buyer's coins and add seller's coins
      buyerCoin.amount -= totalCost;
      await queryRunner.manager.save(Coin, buyerCoin);

      sellerCoin.amount += totalCost;
      await queryRunner.manager.save(Coin, sellerCoin);

      // 5. Deduct product stock
      product.stock -= quantity;
      await queryRunner.manager.save(Product, product);

      // 6. Create product snapshot for transaction
      const itemSnapshot = {
        id: product.id,
        creator: {
          id: product.seller.id,
          username: product.seller.username,
        },
        name: product.name,
        description: product.description,
        price: product.price,
        imageUrl: product.images?.[0] || null,
        image_url: product.images?.[0] || null,
      };

      // 7. Create transaction with ACCEPTED status immediately
      const transaction = queryRunner.manager.create(Transaction, {
        receiverInformationId: receiverInfoId,
        buyerId: userId,
        sellerId: product.sellerId,
        productId: product.id,
        name,
        itemSnapshot,
        totalPrice: totalCost,
        quantity,
        status: TRANSACTION_STATUS.ACCEPTED,
      });

      const savedTransaction = await queryRunner.manager.save(
        Transaction,
        transaction,
      );

      // Commit DB Transaction
      await queryRunner.commitTransaction();

      this.eventEmitter.emit(EVENT_KEYS.TRANSACTION_CREATED, {
        transactionId: savedTransaction.id,
        buyerId: userId,
        totalPrice: totalCost,
        name,
      });

      return generateSuccessResult({
        message: 'Purchase successful',
        transactionId: savedTransaction.id,
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
}


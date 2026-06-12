import { Repository } from 'typeorm';

import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { ERR_CODE } from '@shared/constants';
import {
  OperationResult,
  generateForbiddenResult,
  generateNotFoundResult,
  generateSuccessResult,
} from '@shared/helpers/operation-result.helper';
import { BaseCRUDService } from '@shared/services/base-crud.service';

import { Product } from '../entities/product.entity';

@Injectable()
export class ProductService extends BaseCRUDService<Product> {
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
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
  }): Promise<OperationResult<Product[]>> {
    return this.findAll(
      {},
      {
        withDeleted: options.withDeleted,
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
}

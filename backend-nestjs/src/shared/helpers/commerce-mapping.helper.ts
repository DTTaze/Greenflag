import { CreateItemDto, UpdateItemDto } from '@modules/commerce/dtos/item.dto';
import {
  CreateProductDto,
  UpdateProductDto,
} from '@modules/commerce/dtos/product.dto';
import { Item } from '@modules/commerce/entities/item.entity';
import { Product } from '@modules/commerce/entities/product.entity';

export function mapToProductEntity(
  dto: CreateProductDto | UpdateProductDto,
): Partial<Product> {
  const entity: any = {};
  if (dto.name !== undefined) entity.name = dto.name;
  if (dto.description !== undefined) entity.description = dto.description;
  if (dto.price !== undefined) entity.price = dto.price;
  if (dto.category !== undefined) entity.category = dto.category;
  if ('product_status' in dto && dto.product_status !== undefined) {
    entity.productStatus = dto.product_status;
  }
  if ('post_status' in dto && dto.post_status !== undefined) {
    entity.postStatus = dto.post_status;
  }
  return entity;
}

export function mapToItemEntity(
  dto: CreateItemDto | UpdateItemDto,
): Partial<Item> {
  const entity: any = {};
  if (dto.name !== undefined) entity.name = dto.name;
  if (dto.price !== undefined) entity.price = dto.price;
  if (dto.stock !== undefined) entity.stock = dto.stock;
  if (dto.description !== undefined) entity.description = dto.description;
  if (dto.status !== undefined) entity.status = dto.status;
  if (dto.weight !== undefined) entity.weight = dto.weight;
  if (dto.length !== undefined) entity.length = dto.length;
  if (dto.width !== undefined) entity.width = dto.width;
  if (dto.height !== undefined) entity.height = dto.height;
  if (dto.purchase_limit_per_day !== undefined) {
    entity.purchaseLimitPerDay = dto.purchase_limit_per_day;
  }
  return entity;
}

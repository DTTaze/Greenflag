import { IsEnum, IsInt, IsOptional, IsString, Min } from 'class-validator';

import {
  PRODUCT_CATEGORY,
  PRODUCT_CONDITION,
  PRODUCT_POST_STATUS,
} from '@shared/enums';

export class CreateProductDto {
  @IsString()
  name: string;

  @IsInt()
  @Min(1)
  price: number;

  @IsString()
  @IsOptional()
  description?: string;

  @IsEnum(PRODUCT_CATEGORY)
  category: PRODUCT_CATEGORY;

  @IsEnum(PRODUCT_CONDITION)
  @IsOptional()
  product_status?: PRODUCT_CONDITION;

  @IsEnum(PRODUCT_POST_STATUS)
  @IsOptional()
  post_status?: PRODUCT_POST_STATUS;
}

export class UpdateProductDto {
  @IsString()
  @IsOptional()
  name?: string;

  @IsInt()
  @Min(1)
  @IsOptional()
  price?: number;

  @IsString()
  @IsOptional()
  description?: string;

  @IsEnum(PRODUCT_CATEGORY)
  @IsOptional()
  category?: PRODUCT_CATEGORY;

  @IsEnum(PRODUCT_CONDITION)
  @IsOptional()
  product_status?: PRODUCT_CONDITION;

  @IsEnum(PRODUCT_POST_STATUS)
  @IsOptional()
  post_status?: PRODUCT_POST_STATUS;
}

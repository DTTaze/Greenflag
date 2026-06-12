import {
  IsArray,
  IsEnum,
  IsInt,
  IsOptional,
  IsString,
  IsUUID,
  Matches,
  Min,
} from 'class-validator';

import { ITEM_STATUS } from '@shared/enums';

export class CreateItemDto {
  @IsString()
  name: string;

  @IsInt()
  @Min(1)
  price: number;

  @IsInt()
  @Min(0)
  stock: number;

  @IsString()
  @IsOptional()
  description?: string;

  @IsEnum(ITEM_STATUS)
  @IsOptional()
  status?: ITEM_STATUS;

  @IsInt()
  @Min(1)
  @IsOptional()
  purchase_limit_per_day?: number;

  @IsInt()
  @Min(1)
  weight: number;

  @IsInt()
  @Min(1)
  length: number;

  @IsInt()
  @Min(1)
  width: number;

  @IsInt()
  @Min(1)
  height: number;

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  images?: string[];
}

export class UpdateItemDto {
  @IsString()
  @IsOptional()
  name?: string;

  @IsInt()
  @Min(1)
  @IsOptional()
  price?: number;

  @IsInt()
  @Min(0)
  @IsOptional()
  stock?: number;

  @IsString()
  @IsOptional()
  description?: string;

  @IsEnum(ITEM_STATUS)
  @IsOptional()
  status?: ITEM_STATUS;

  @IsInt()
  @Min(1)
  @IsOptional()
  purchase_limit_per_day?: number;

  @IsInt()
  @Min(1)
  @IsOptional()
  weight?: number;

  @IsInt()
  @Min(1)
  @IsOptional()
  length?: number;

  @IsInt()
  @Min(1)
  @IsOptional()
  width?: number;

  @IsInt()
  @Min(1)
  @IsOptional()
  height?: number;

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  images?: string[];
}

export class PurchaseItemDto {
  @IsString()
  name: string;

  @IsInt()
  @Min(1)
  quantity: number;

  @IsUUID()
  @IsOptional()
  receiver_information_id?: string;

  @IsString()
  @IsOptional()
  to_name?: string;

  @IsString()
  @Matches(/(84|0[3|5|7|8|9])+([0-9]{8})\b/, {
    message: 'Phone number is invalid',
  })
  @IsOptional()
  to_phone?: string;

  @IsString()
  @IsOptional()
  to_address?: string;
}

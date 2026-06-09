import {
  IsEnum,
  IsInt,
  IsOptional,
  IsString,
  IsUUID,
  Min,
} from 'class-validator';

import { TRANSACTION_STATUS } from '@shared/enums';

export class CreateTransactionDto {
  @IsString()
  name: string;

  @IsInt()
  @Min(1)
  @IsOptional()
  quantity?: number;

  @IsUUID()
  buyer_id: string;

  @IsUUID()
  item_id: string;

  @IsEnum(TRANSACTION_STATUS)
  @IsOptional()
  status?: TRANSACTION_STATUS;
}

export class UpdateTransactionDto {
  @IsString()
  @IsOptional()
  name?: string;

  @IsInt()
  @Min(1)
  @IsOptional()
  quantity?: number;

  @IsUUID()
  @IsOptional()
  buyer_id?: string;

  @IsUUID()
  @IsOptional()
  item_id?: string;

  @IsEnum(TRANSACTION_STATUS)
  @IsOptional()
  status?: TRANSACTION_STATUS;
}

import {
  IsBoolean,
  IsEnum,
  IsInt,
  IsOptional,
  IsPositive,
  IsString,
  IsUUID,
  Matches,
  Min,
} from 'class-validator';

import { CARRIER_TYPE, RECEIVER_ACCOUNT_TYPE } from '@shared/enums';

const phoneRegex = /(84|0[3|5|7|8|9])+([0-9]{8})\b/;

// --- Delivery Account DTOs ---
export class CreateDeliveryAccountDto {
  @IsString()
  name: string;

  @IsEnum(CARRIER_TYPE)
  @IsOptional()
  carrier?: CARRIER_TYPE;

  @IsString()
  token: string;

  @IsString()
  shop_id: string;

  @IsBoolean()
  @IsOptional()
  is_default?: boolean;

  @IsUUID()
  @IsOptional()
  user_id?: string;
}

export class UpdateDeliveryAccountDto {
  @IsString()
  @IsOptional()
  name?: string;

  @IsEnum(CARRIER_TYPE)
  @IsOptional()
  carrier?: CARRIER_TYPE;

  @IsString()
  @IsOptional()
  token?: string;

  @IsString()
  @IsOptional()
  shop_id?: string;

  @IsBoolean()
  @IsOptional()
  is_default?: boolean;
}

// --- Receiver Information DTOs ---
export class CreateReceiverInfoDto {
  @IsUUID()
  @IsOptional()
  user_id?: string;

  @IsString()
  to_name: string;

  @IsString()
  @Matches(phoneRegex, { message: 'Phone number is invalid' })
  to_phone: string;

  @IsString()
  to_address: string;

  @IsString()
  to_ward_name: string;

  @IsString()
  to_district_name: string;

  @IsString()
  to_province_name: string;

  @IsEnum(RECEIVER_ACCOUNT_TYPE)
  @IsOptional()
  account_type?: RECEIVER_ACCOUNT_TYPE;

  @IsBoolean()
  @IsOptional()
  is_default?: boolean;
}

export class UpdateReceiverInfoDto {
  @IsString()
  @IsOptional()
  to_name?: string;

  @IsString()
  @Matches(phoneRegex, { message: 'Phone number is invalid' })
  @IsOptional()
  to_phone?: string;

  @IsString()
  @IsOptional()
  to_address?: string;

  @IsString()
  @IsOptional()
  to_ward_name?: string;

  @IsString()
  @IsOptional()
  to_district_name?: string;

  @IsString()
  @IsOptional()
  to_province_name?: string;

  @IsEnum(RECEIVER_ACCOUNT_TYPE)
  @IsOptional()
  account_type?: RECEIVER_ACCOUNT_TYPE;

  @IsBoolean()
  @IsOptional()
  is_default?: boolean;
}

// --- Delivery Order DTOs ---
export class CreateDeliveryOrderDto {
  @IsString()
  to_name: string;

  @IsString()
  @Matches(phoneRegex, { message: 'Recipient phone number is invalid' })
  to_phone: string;

  @IsString()
  to_address: string;

  @IsString()
  to_ward_name: string;

  @IsString()
  to_district_name: string;

  @IsString()
  to_province_name: string;

  @IsInt()
  @Min(0)
  @IsOptional()
  cod_amount?: number;

  @IsInt()
  @IsPositive({ message: 'Weight must be positive' })
  weight: number;

  @IsInt()
  @IsPositive({ message: 'Payment type ID is required' })
  payment_type_id: number;

  @IsString()
  @IsOptional()
  required_note?: string;

  @IsInt()
  @IsPositive()
  @IsOptional()
  service_type_id?: number;
}

export class CreateDeliveryOrderFromTransactionDto {
  @IsInt()
  @IsPositive({ message: 'Payment type ID is required' })
  payment_type_id: number;

  @IsString()
  required_note: string;

  @IsInt()
  @IsPositive({ message: 'Weight must be positive' })
  weight: number;
}

export class UpdateDeliveryOrderDto {
  @IsString()
  order_code: string;

  @IsString()
  @IsOptional()
  to_name?: string;

  @IsString()
  @Matches(phoneRegex, { message: 'Recipient phone number is invalid' })
  @IsOptional()
  to_phone?: string;

  @IsString()
  @IsOptional()
  to_address?: string;

  @IsInt()
  @IsPositive()
  @IsOptional()
  weight?: number;

  @IsInt()
  @IsPositive()
  @IsOptional()
  payment_type_id?: number;
}

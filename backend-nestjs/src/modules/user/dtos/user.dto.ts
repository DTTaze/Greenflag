import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  Matches,
  MinLength,
} from 'class-validator';

import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

import {
  SanitizeInput,
  TrimAndLowercase,
} from '@shared/decorators/sanitize-input.decorator';
import { ENTITY_STATUS, ROLE } from '@shared/enums';

export class CreateUserDto {
  @ApiProperty({ example: 'user@example.com' })
  @IsEmail({}, { message: 'Email không hợp lệ' })
  @IsNotEmpty()
  @TrimAndLowercase()
  @SanitizeInput()
  email: string;

  @ApiProperty({ example: 'password123' })
  @IsString()
  @IsNotEmpty()
  @MinLength(6, { message: 'Mật khẩu phải có ít nhất 6 ký tự' })
  password: string;

  @ApiProperty({ example: 'johndoe' })
  @IsString()
  @IsNotEmpty()
  @MinLength(2, { message: 'Username phải có ít nhất 2 ký tự' })
  @TrimAndLowercase()
  @SanitizeInput()
  username: string;

  @ApiProperty({ example: 'John Doe' })
  @IsString()
  @IsNotEmpty()
  @MinLength(2, { message: 'Tên phải có ít nhất 2 ký tự' })
  @SanitizeInput()
  fullName: string;

  @ApiPropertyOptional({ enum: ROLE, example: ROLE.USER })
  @IsOptional()
  @IsEnum(ROLE, { message: 'Role không hợp lệ' })
  role?: ROLE;

  @ApiPropertyOptional({ example: '0987654321' })
  @IsOptional()
  @IsString()
  @Matches(/(84|0[3|5|7|8|9])+([0-9]{8})\b/, {
    message: 'Số điện thoại không hợp lệ',
  })
  @SanitizeInput()
  phoneNumber?: string;
}

export class UpdateUserProfileDto {
  @ApiPropertyOptional({ example: 'johndoe_updated' })
  @IsOptional()
  @IsString()
  @MinLength(2, { message: 'Username phải có ít nhất 2 ký tự' })
  @TrimAndLowercase()
  @SanitizeInput()
  username?: string;

  @ApiPropertyOptional({ example: 'John Doe Updated' })
  @IsOptional()
  @IsString()
  @MinLength(2, { message: 'Tên phải có ít nhất 2 ký tự' })
  @SanitizeInput()
  fullName?: string;

  @ApiPropertyOptional({ example: '0987654321' })
  @IsOptional()
  @IsString()
  @Matches(/(84|0[3|5|7|8|9])+([0-9]{8})\b/, {
    message: 'Số điện thoại không hợp lệ',
  })
  @SanitizeInput()
  phoneNumber?: string;

  @ApiPropertyOptional({ example: 'updated@example.com' })
  @IsOptional()
  @IsEmail({}, { message: 'Email không hợp lệ' })
  @TrimAndLowercase()
  @SanitizeInput()
  email?: string;

  @ApiPropertyOptional({ example: '1995-01-01' })
  @IsOptional()
  @IsString()
  birthDate?: string;

  @ApiPropertyOptional({ example: 'male' })
  @IsOptional()
  @IsString()
  gender?: string;
}

export class AdminUpdateUserDto extends UpdateUserProfileDto {
  @ApiPropertyOptional({ enum: ROLE, example: ROLE.USER })
  @IsOptional()
  @IsEnum(ROLE, { message: 'Role không hợp lệ' })
  role?: ROLE;

  @ApiPropertyOptional({ enum: ENTITY_STATUS, example: ENTITY_STATUS.ACTIVE })
  @IsOptional()
  @IsEnum(ENTITY_STATUS, { message: 'Trạng thái không hợp lệ' })
  status?: ENTITY_STATUS;

  @ApiPropertyOptional({ example: 10 })
  @IsOptional()
  coinAdjustment?: number;

  @ApiPropertyOptional({ example: 'Thưởng sự kiện' })
  @IsOptional()
  @IsString({ message: 'Lý do phải là chuỗi' })
  coinAdjustmentReason?: string;
}

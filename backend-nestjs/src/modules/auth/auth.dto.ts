import {
  IsAlphanumeric,
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsNotIn,
  IsOptional,
  IsString,
  IsStrongPassword,
  Length,
  MaxLength,
  MinLength,
} from 'class-validator';
import { OperationResult } from 'mvc-common-toolkit';

import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

import { ERR_CODE, RESERVED_USERNAMES } from '@shared/constants';
import {
  OnlyTextAndNumbers,
  TrimAndLowercase,
} from '@shared/decorators/sanitize-input.decorator';
import { SOCIAL_PROVIDER, VERIFY_OTP_ACTION } from '@shared/enums';
import { generateBadRequestResult } from '@shared/helpers/operation-result.helper';

export class RegisterDTO {
  @ApiProperty({
    description: 'The email of the user',
  })
  @IsEmail()
  @TrimAndLowercase()
  email: string;

  @ApiProperty({
    description: 'The username of the user',
  })
  @IsString()
  @IsAlphanumeric()
  @OnlyTextAndNumbers({
    includeWhitespaces: false,
    onlyASCII: true,
    throwOnError: true,
    allowedSymbols: false,
  })
  @TrimAndLowercase()
  @IsNotIn(RESERVED_USERNAMES, {
    message: 'Tên người dùng này không hợp lệ hoặc đã được hệ thống bảo lưu.',
  })
  username: string;

  @ApiProperty({
    description: 'The password of the user',
  })
  @IsString()
  @IsStrongPassword()
  password: string;
}

export class VerifyOtpDTO {
  @ApiProperty({
    description: 'The username or email of the user',
  })
  @IsNotEmpty()
  @IsString()
  @TrimAndLowercase()
  usernameOrEmail: string;

  @ApiProperty({
    description: 'The otp code',
  })
  @IsNotEmpty()
  @IsString()
  @Length(6, 6)
  code: string;

  @ApiProperty({
    description: 'The verify OTP action',
    enum: VERIFY_OTP_ACTION,
    example: VERIFY_OTP_ACTION.REGISTER,
  })
  @IsNotEmpty()
  @IsEnum(VERIFY_OTP_ACTION)
  action: VERIFY_OTP_ACTION;
}

export class ResendEmailDTO {
  @ApiProperty({
    description: 'The email to resend',
  })
  @IsNotEmpty()
  @IsEmail()
  @TrimAndLowercase()
  email: string;
}

export class LoginDTO {
  @ApiProperty({
    description: 'The username or email of the user',
  })
  @IsNotEmpty()
  @IsString()
  @TrimAndLowercase()
  usernameOrEmail: string;

  @ApiProperty({
    description: 'The password of the user',
  })
  @IsString()
  @MinLength(8)
  @MaxLength(60)
  password: string;
}

export class ChangePasswordDTO {
  @ApiPropertyOptional({
    description: 'The old password of the user',
  })
  @IsOptional()
  @IsString()
  oldPassword?: string;

  @ApiProperty({
    description: 'The new password of the user',
  })
  @IsNotEmpty()
  @IsStrongPassword()
  @Length(8, 60)
  newPassword: string;
}

export class ForgotPasswordDTO {
  @ApiProperty({
    example: 'abc@gmail.com',
  })
  @MinLength(3)
  @MaxLength(255)
  @IsEmail()
  @TrimAndLowercase()
  email: string;
}

export class ResetPasswordDTO extends ForgotPasswordDTO {
  public validate(): OperationResult {
    if (this.newPassword !== this.confirmNewPassword) {
      return generateBadRequestResult(
        'Password confirmation does not match',
        ERR_CODE.PASSWORD_CONFIRMATION_MISMATCH,
      );
    }

    return {
      success: true,
    };
  }

  @ApiProperty({
    description: 'The new password of the user',
  })
  @IsNotEmpty()
  @IsString()
  @MinLength(8)
  @MaxLength(60)
  @IsStrongPassword()
  newPassword: string;

  @ApiProperty({
    description: 'Confirm the new password of the user',
  })
  @IsNotEmpty()
  @IsString()
  @MinLength(8)
  @MaxLength(60)
  confirmNewPassword: string;

  @ApiProperty({
    description: 'The token to verify',
  })
  @IsString()
  @IsAlphanumeric()
  @OnlyTextAndNumbers({
    includeWhitespaces: false,
    onlyASCII: true,
    throwOnError: true,
    allowedSymbols: false,
  })
  otpCode: string;
}

export class SocialAccountDTO {
  @ApiProperty({
    enum: SOCIAL_PROVIDER,
    description: 'The name of provider',
  })
  @IsEnum(SOCIAL_PROVIDER)
  provider: string;

  @ApiPropertyOptional({
    description: 'The code from provider',
  })
  @IsOptional()
  @IsString()
  code?: string;

  // Google OAuth callback query parameters (whitelisted to bypass strict DTO verification)
  @IsOptional()
  @IsString()
  iss?: string;

  @IsOptional()
  @IsString()
  scope?: string;

  @IsOptional()
  @IsString()
  authuser?: string;

  @IsOptional()
  @IsString()
  prompt?: string;

  @IsOptional()
  @IsString()
  state?: string;

  @IsOptional()
  @IsString()
  hd?: string;

  @IsOptional()
  @IsString()
  session_state?: string;
}

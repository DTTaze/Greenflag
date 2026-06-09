import { HttpResponse, stringUtils } from 'mvc-common-toolkit';

import { Body, Controller, Get, Post, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';

import { User } from '@modules/user/entities/user.entity';

import {
  ApiOperationError,
  ApiOperationSuccess,
} from '@shared/decorators/api-response.decorator';
import { LogId } from '@shared/decorators/logging.decorator';
import { RequestUser } from '@shared/decorators/request-user.decorator';
import { AuthGuard } from '@shared/guards/auth.guard';
import { extractUserPublicInfo } from '@shared/helpers/user.helper';
import { UseCallQueue } from '@shared/interceptors/call-queue.interceptor';
import { ApplyRateLimiting } from '@shared/interceptors/rate-limiting.interceptor';
import {
  UseUserIdExtractor,
  emailAsIdExtractor,
} from '@shared/interceptors/user-api-call.interceptor';
import { UseMaxAttempts } from '@shared/interceptors/user-failed-attempts-ban.interceptor';

import {
  ChangePasswordDTO,
  ForgotPasswordDTO,
  LoginDTO,
  RegisterDTO,
  ResendEmailDTO,
  ResetPasswordDTO,
  SocialAccountDTO,
  VerifyOtpDTO,
} from './auth.dto';
import { AuthService } from './auth.service';

@ApiTags('Auth')
@Controller('auth')
@ApiOperationSuccess()
@ApiOperationError()
export class AuthController {
  constructor(protected authService: AuthService) {}

  @ApiOperation({ summary: 'Register a new user' })
  @UseCallQueue()
  @UseUserIdExtractor([emailAsIdExtractor])
  @ApplyRateLimiting(5)
  @Post('register')
  public async register(
    @LogId() logId: string,
    @Body() dto: RegisterDTO,
  ): Promise<HttpResponse> {
    return this.authService.register(logId, dto);
  }

  @ApiOperation({ summary: 'Resend email' })
  @UseCallQueue()
  @ApplyRateLimiting(5)
  @Post('resend-email')
  public async resendEmail(@Body() dto: ResendEmailDTO): Promise<HttpResponse> {
    const logId = stringUtils.generateRandomId();
    return this.authService.resendVerificationEmail(logId, dto);
  }

  @ApiOperation({ summary: 'Verify OTP' })
  @UseCallQueue()
  @ApplyRateLimiting(5)
  @Post('verify-otp')
  public async verifyOtp(@Body() dto: VerifyOtpDTO): Promise<HttpResponse> {
    const logId = stringUtils.generateRandomId();
    return this.authService.verifyOTP(logId, dto);
  }

  @ApiOperation({ summary: 'Who am i' })
  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @Get('whoami')
  public whoami(@RequestUser() user: User): HttpResponse {
    return {
      success: true,
      data: extractUserPublicInfo(user),
    };
  }

  @ApiOperation({ summary: 'Login' })
  @UseCallQueue()
  @ApplyRateLimiting(5)
  @Post('login')
  public async login(
    @LogId() logId: string,
    @Body() dto: LoginDTO,
  ): Promise<HttpResponse> {
    return this.authService.login(logId, dto);
  }

  @ApiOperation({ summary: 'Forgot password' })
  @UseCallQueue()
  @ApplyRateLimiting(1)
  @Post('forgot-password')
  public async forgotPassword(
    @LogId() logId: string,
    @Body() dto: ForgotPasswordDTO,
  ): Promise<HttpResponse> {
    return this.authService.beginForgotUserPassword(logId, dto);
  }

  @ApiOperation({ summary: 'Reset password' })
  @UseCallQueue()
  @ApplyRateLimiting(1)
  @UseMaxAttempts(3)
  @Post('reset-password')
  public async resetPassword(
    @LogId() logId: string,
    @Body() dto: ResetPasswordDTO,
  ): Promise<HttpResponse> {
    const validationResult = dto.validate();
    if (!validationResult.success) return validationResult;

    return this.authService.resetPassword(logId, dto);
  }

  @ApiOperation({ summary: 'Change password' })
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @UseCallQueue()
  @ApplyRateLimiting(3)
  @Post('change-password')
  public async changePassword(
    @LogId() logId: string,
    @RequestUser() user: User,
    @Body() dto: ChangePasswordDTO,
  ): Promise<HttpResponse> {
    return this.authService.changePassword(logId, user.id, dto);
  }

  @ApiOperation({ summary: 'Get provider URL for social login' })
  @Get('login/social')
  @ApplyRateLimiting(10)
  public async getSocialLoginProviderUrl(
    @Query() dto: SocialAccountDTO,
  ): Promise<HttpResponse> {
    const response = await this.authService.getSocialLoginProviderUrl(
      dto.provider,
    );

    if (!response.success) {
      return response;
    }

    return {
      success: true,
      data: response.data,
    };
  }

  @ApiOperation({ summary: 'Handle provider callback for social login' })
  @Get('login/social/callback')
  @ApplyRateLimiting(10)
  public async handleSocialCallback(
    @Query() dto: SocialAccountDTO,
  ): Promise<HttpResponse> {
    const callbackResponse = await this.authService.socialLoginCallback(
      dto.provider,
      dto.code,
    );

    if (!callbackResponse.success) {
      return callbackResponse;
    }

    const response = await this.authService.loginOrCreateSocialAccount(
      callbackResponse.data,
    );

    if (!response.success) {
      return response;
    }

    return {
      success: true,
      data: response.data,
    };
  }
}

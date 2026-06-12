import { isEmail } from 'class-validator';
import {
  AuditService,
  CacheService,
  ErrorLog,
  HttpService,
  SET_CACHE_POLICY,
  bcryptHelper,
  stringUtils,
} from 'mvc-common-toolkit';

import { Inject, Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';

import { EmailService } from '@modules/email/email.service';
import { UserSocialAccount } from '@modules/user/entities/user-social-account.entity';
import { User } from '@modules/user/entities/user.entity';
import { UserSocialAccountService } from '@modules/user/services/user-social-account.service';
import { UserService } from '@modules/user/services/user.service';

import { otpCacheKey, resetPasswordCacheKey } from '@shared/cache-key';
import {
  APP_ACTION,
  CACHE_TTL,
  ENV_KEY,
  ERR_CODE,
  INJECTION_TOKEN,
} from '@shared/constants';
import {
  EMAIL_TEMPLATE,
  ENTITY_STATUS,
  VERIFY_OTP_ACTION,
} from '@shared/enums';
import {
  OperationResult,
  generateBadRequestResult,
  generateConflictResult,
  generateForbiddenResult,
  generateInternalServerResult,
  generateNotFoundResult,
} from '@shared/helpers/operation-result.helper';
import { extractUserPublicInfo } from '@shared/helpers/user.helper';
import { UserAuthProfile, UserAuthSocialProfile } from '@shared/interfaces';
import { generateOtpCode } from '@shared/utils/hash.util';
import { SOCIAL_CONFIG } from '@shared/utils/social-provider.util';

import {
  ChangePasswordDTO,
  ForgotPasswordDTO,
  LoginDTO,
  RegisterDTO,
  ResendEmailDTO,
  ResetPasswordDTO,
  SetupPasswordDTO,
  VerifyOtpDTO,
} from './auth.dto';

@Injectable()
export class AuthService {
  protected logger = new Logger(AuthService.name);

  constructor(
    @Inject(INJECTION_TOKEN.AUDIT_SERVICE)
    protected auditService: AuditService,

    @Inject(INJECTION_TOKEN.HTTP_SERVICE)
    protected httpService: HttpService,

    @Inject(INJECTION_TOKEN.REDIS_SERVICE)
    protected cacheService: CacheService,

    protected userService: UserService,
    protected userSocialAccountService: UserSocialAccountService,
    protected configService: ConfigService,
    protected jwtService: JwtService,
    protected emailService: EmailService,
  ) {}

  protected get appUrl(): string {
    return this.configService.getOrThrow(ENV_KEY.APP_PUBLIC_URL);
  }

  protected getEmailSubject(content: string): string {
    return `[${this.configService.get(ENV_KEY.APP_NAME, 'HEARTIFY').toUpperCase()}] - ${content}`;
  }

  protected resetPasswordUrl(email: string, otpCode: string): string {
    return `${this.appUrl}/reset-password?email=${email}&otpCode=${otpCode}`;
  }

  public async register(
    logId: string,
    dto: RegisterDTO,
  ): Promise<OperationResult> {
    try {
      const verifyUniquenessRes = await this.userService.verifyUniquenessUser({
        email: dto.email,
        username: dto.username,
      });

      if (!verifyUniquenessRes.success) {
        return verifyUniquenessRes;
      }

      const passwordHash = await bcryptHelper.hash(dto.password, 10);

      const userRes = await this.userService.create({
        email: dto.email,
        username: dto.username,
        password: passwordHash,
        status: ENTITY_STATUS.INACTIVE,
      });

      if (!userRes.success || !userRes.data) {
        return OperationResult.fail(
          userRes.code || 'create_failed',
          userRes.message,
        );
      }
      const user = userRes.data;

      const otpCode = generateOtpCode();

      await this.cacheService.set(
        otpCacheKey(user.id, VERIFY_OTP_ACTION.REGISTER),
        otpCode,
        {
          policy: SET_CACHE_POLICY.WITH_TTL,
          value: CACHE_TTL.TEN_MINUTES,
        },
      );

      this.emailService.send({
        to: user.email,
        subject: this.getEmailSubject('Verify your email'),
        content: {
          username: user.username,
          passCode: otpCode,
        },
        templatePath: EMAIL_TEMPLATE.EMAIL_VERIFICATION,
      });

      return {
        success: true,
        data: user,
      };
    } catch (error) {
      this.logger.error(error.message, error.stack);

      this.auditService.emitLog(
        new ErrorLog({
          logId,
          message: error.message,
          payload: JSON.stringify(dto, stringUtils.maskFn),
          action: APP_ACTION.REGISTER,
        }),
      );
    }
  }

  public async resendVerificationEmail(
    logId: string,
    dto: ResendEmailDTO,
  ): Promise<OperationResult> {
    try {
      const userRes = await this.userService.findOne({ email: dto.email });

      if (!userRes.success || !userRes.data) {
        return generateNotFoundResult(
          'User not found',
          ERR_CODE.USER_NOT_FOUND,
        );
      }
      const user = userRes.data;

      if (user.status !== ENTITY_STATUS.INACTIVE) {
        return generateConflictResult(
          'Your account is active',
          ERR_CODE.ALREADY_EXISTS,
        );
      }

      const otpCode = generateOtpCode();

      await this.cacheService.set(
        otpCacheKey(user.id, VERIFY_OTP_ACTION.REGISTER),
        otpCode,
        {
          policy: SET_CACHE_POLICY.WITH_TTL,
          value: CACHE_TTL.TEN_MINUTES,
        },
      );

      this.emailService.send({
        to: user.email,
        subject: this.getEmailSubject('Verify your email'),
        content: {
          username: user.username,
          passCode: otpCode,
        },
        templatePath: EMAIL_TEMPLATE.EMAIL_VERIFICATION,
      });

      return {
        success: true,
      };
    } catch (error) {
      this.logger.error(error.message, error.stack);

      this.auditService.emitLog(
        new ErrorLog({
          logId,
          message: error.message,
          payload: JSON.stringify(dto, stringUtils.maskFn),
          action: APP_ACTION.SEND_EMAIL,
        }),
      );

      return generateInternalServerResult();
    }
  }

  public async verifyOTP(
    logId: string,
    dto: VerifyOtpDTO,
  ): Promise<OperationResult> {
    try {
      const identifier = dto.usernameOrEmail;
      const query = isEmail(identifier)
        ? { email: identifier }
        : { username: identifier };

      const userRes = await this.userService.findOne(query);

      if (!userRes.success || !userRes.data) {
        return generateNotFoundResult(
          'User not found',
          ERR_CODE.USER_NOT_FOUND,
        );
      }
      const user = userRes.data;

      const cacheKey = otpCacheKey(user.id, dto.action);
      const cachedOtp = await this.cacheService.get(cacheKey);

      if (!cachedOtp) {
        return generateForbiddenResult('OTP expired', ERR_CODE.INVALID_OTP);
      }

      if (cachedOtp !== dto.code) {
        return generateForbiddenResult('Invalid OTP', ERR_CODE.INVALID_OTP);
      }

      await this.cacheService.del(cacheKey);

      if (dto.action === VERIFY_OTP_ACTION.REGISTER) {
        await this.userService.updateByID(user.id, {
          status: ENTITY_STATUS.ACTIVE,
        });
      }

      return {
        success: true,
      };
    } catch (error) {
      this.logger.error(error.message, error.stack);

      this.auditService.emitLog(
        new ErrorLog({
          logId,
          message: error.message,
          payload: JSON.stringify(dto, stringUtils.maskFn),
          action: APP_ACTION.REGISTER,
        }),
      );

      return generateInternalServerResult();
    }
  }

  public async login(
    logId: string,
    data: LoginDTO,
  ): Promise<OperationResult<{ accessToken: string; user: UserAuthProfile }>> {
    try {
      const identifier = data.usernameOrEmail;
      const query = isEmail(identifier)
        ? { email: identifier }
        : { username: identifier };

      const userRes = await this.userService.findOne(query, {
        relations: { profile: true },
      });

      if (!userRes.success || !userRes.data) {
        return generateNotFoundResult(
          'User not found',
          ERR_CODE.USER_NOT_FOUND,
        );
      }
      const user = userRes.data;

      if (user.status !== ENTITY_STATUS.ACTIVE) {
        return generateForbiddenResult(
          'User is not active',
          ERR_CODE.ACCOUNT_IS_NOT_ACTIVE,
        );
      }

      if (!user.password) {
        return generateConflictResult(
          'Password incorrect',
          ERR_CODE.PASSWORD_INCORRECT,
        );
      }

      const isPasswordValid = await bcryptHelper.compare(
        data.password,
        user.password,
      );

      if (!isPasswordValid) {
        return generateConflictResult(
          'Password incorrect',
          ERR_CODE.PASSWORD_INCORRECT,
        );
      }

      const accessToken = await this.jwtService.signAsync({
        id: user.id,
        username: user.username,
        role: user.role,
        email: user.email,
        phoneNumber: user.profile?.phoneNumber || '',
        streak: user.profile?.streak || 0,
        lastCompletedTask: user.profile?.lastCompletedTask || null,
        avatarUrl: user.avatarUrl,
        requirePasswordSetup: !user.password,
      });

      return {
        success: true,
        data: {
          accessToken,
          user: extractUserPublicInfo(user),
        },
      };
    } catch (error) {
      this.logger.error(error.message, error.stack);

      this.auditService.emitLog(
        new ErrorLog({
          logId: logId,
          message: error.message,
          payload: JSON.stringify(data, stringUtils.maskFn),
          action: APP_ACTION.LOGIN,
        }),
      );

      return generateInternalServerResult();
    }
  }

  public async beginForgotUserPassword(
    logId: string,
    dto: ForgotPasswordDTO,
  ): Promise<OperationResult> {
    const userRes = await this.userService.findOne({ email: dto.email });

    if (!userRes.success || !userRes.data) {
      return generateNotFoundResult('User not found', ERR_CODE.USER_NOT_FOUND);
    }
    const user = userRes.data;

    if (user.status !== ENTITY_STATUS.ACTIVE) {
      return generateForbiddenResult(
        'User is not active',
        ERR_CODE.ACCOUNT_IS_NOT_ACTIVE,
      );
    }

    try {
      const cacheKey = resetPasswordCacheKey(user.email);
      const existingOtp = await this.cacheService.get(cacheKey);

      if (existingOtp) {
        return generateConflictResult(
          'OTP already sent',
          ERR_CODE.OTP_ALREADY_SENT,
        );
      }

      const oneTimeCode = generateOtpCode();

      await this.cacheService.set(cacheKey, oneTimeCode, {
        policy: SET_CACHE_POLICY.WITH_TTL,
        value: CACHE_TTL.ONE_HOUR,
      });

      await this.emailService.send({
        to: user.email,
        subject: this.getEmailSubject('Reset Your Password'),
        content: {
          appUrl: this.appUrl,
          resetPasswordUrl: this.resetPasswordUrl(user.email, oneTimeCode),
          username: user.username,
        },
        templatePath: EMAIL_TEMPLATE.EMAIL_RESET_PASSWORD,
      });

      return {
        success: true,
      };
    } catch (error) {
      this.logger.error(error.message, error.stack);

      this.auditService.emitLog(
        new ErrorLog({
          logId,
          message: error.message,
          userId: user.id,
          action: APP_ACTION.FORGOT_PASSWORD,
        }),
      );

      return generateInternalServerResult();
    }
  }

  public async resetPassword(
    logId: string,
    dto: ResetPasswordDTO,
  ): Promise<OperationResult> {
    const userRes = await this.userService.findOne({ email: dto.email });

    if (!userRes.success || !userRes.data) {
      return generateNotFoundResult('User not found', ERR_CODE.USER_NOT_FOUND);
    }
    const user = userRes.data;

    if (user.status !== ENTITY_STATUS.ACTIVE) {
      return generateForbiddenResult(
        'User is not active',
        ERR_CODE.ACCOUNT_IS_NOT_ACTIVE,
      );
    }

    try {
      const cacheKey = resetPasswordCacheKey(dto.email);
      const otpCode = await this.cacheService.get(cacheKey);

      if (!otpCode || otpCode !== dto.otpCode) {
        return generateForbiddenResult('Invalid OTP', ERR_CODE.INVALID_OTP);
      }

      const hashedPassword = await bcryptHelper.hash(dto.newPassword);

      await this.userService.updateByID(user.id, {
        password: hashedPassword,
      });

      this.cacheService.del(cacheKey);

      return {
        success: true,
      };
    } catch (error) {
      this.logger.error(error.message, error.stack);

      this.auditService.emitLog(
        new ErrorLog({
          logId,
          message: error.message,
          userId: user.id,
          action: APP_ACTION.RESET_PASSWORD,
        }),
      );

      return generateInternalServerResult();
    }
  }

  public async changePassword(
    logId: string,
    userId: string,
    dto: ChangePasswordDTO,
  ): Promise<OperationResult> {
    try {
      const foundUserRes = await this.userService.findByID(userId);

      if (!foundUserRes.success || !foundUserRes.data) {
        return generateNotFoundResult(
          'user not found',
          ERR_CODE.USER_NOT_FOUND,
        );
      }
      const foundUser = foundUserRes.data;

      const hasPassword = !!foundUser.password;

      if (dto.oldPassword && dto.oldPassword === dto.newPassword) {
        return generateBadRequestResult(
          'New password must be different from old password',
          ERR_CODE.PASSWORD_SAME_AS_OLD,
        );
      }

      const isOldPasswordValid = hasPassword
        ? dto.oldPassword
          ? await bcryptHelper.compare(dto.oldPassword, foundUser.password)
          : false
        : true;

      if (!isOldPasswordValid) {
        return generateBadRequestResult(
          'Old password is incorrect',
          ERR_CODE.PASSWORD_INCORRECT,
        );
      }

      const hashedPassword = await bcryptHelper.hash(dto.newPassword);

      await this.userService.updateByID(userId, {
        password: hashedPassword,
      });

      return {
        success: true,
      };
    } catch (error) {
      this.logger.error(error.message, error.stack);

      this.auditService.emitLog(
        new ErrorLog({
          logId: logId,
          message: error.message,
          payload: JSON.stringify(dto, stringUtils.maskFn),
          action: APP_ACTION.CHANGE_PASSWORD,
        }),
      );

      return generateInternalServerResult();
    }
  }

  public async getSocialLoginProviderUrl(
    provider: string,
  ): Promise<OperationResult> {
    const config = SOCIAL_CONFIG[provider];

    const queryParams = new URLSearchParams({
      client_id: this.configService.getOrThrow(config.clientId),
      redirect_uri: this.configService.getOrThrow(config.redirectUri),
      response_type: config.responseType,
      scope: config.scope.join(' '),
      ...config.extraParams,
    });

    return {
      success: true,
      data: { url: `${config.authUrl}?${queryParams.toString()}` },
    };
  }

  public async loginOrCreateSocialAccount(
    user: UserAuthSocialProfile,
  ): Promise<OperationResult> {
    const foundUserSocialAccountRes =
      await this.userSocialAccountService.findOne({
        provider: user.provider,
        providerUserId: user.providerUserId,
      });

    if (foundUserSocialAccountRes.success && foundUserSocialAccountRes.data) {
      const foundUserSocialAccount = foundUserSocialAccountRes.data;
      const foundUserRes = await this.userService.findByID(
        foundUserSocialAccount.userId,
        { relations: { profile: true } },
      );
      if (foundUserRes.success && foundUserRes.data) {
        const foundUser = foundUserRes.data;
        if (user.avatarUrl && !foundUser.avatarUrl) {
          foundUser.avatarUrl = user.avatarUrl;
          await this.userService.updateByID(foundUser.id, {
            avatarUrl: user.avatarUrl,
          });
        }
        return this.handleLoginBySocialAccount(foundUserSocialAccount);
      }
    }

    const foundUserRes = await this.userService.findOne(
      { email: user.email },
      { relations: { profile: true } },
    );

    if (foundUserRes.success && foundUserRes.data) {
      const foundUser = foundUserRes.data;
      if (user.avatarUrl && !foundUser.avatarUrl) {
        foundUser.avatarUrl = user.avatarUrl;
        await this.userService.updateByID(foundUser.id, {
          avatarUrl: user.avatarUrl,
        });
      }
      return this.handleNormalAccountLogin(foundUser, user);
    }

    const registerSocialAccountResult =
      await this.handleRegisterSocialAccount(user);

    if (!registerSocialAccountResult.success) {
      return registerSocialAccountResult;
    }

    const newUser = registerSocialAccountResult.data;

    const accessToken = await this.jwtService.signAsync({
      id: newUser.id,
      username: newUser.username,
      role: newUser.role,
      email: newUser.email,
      phoneNumber: newUser.profile?.phoneNumber || '',
      streak: newUser.profile?.streak || 0,
      lastCompletedTask: newUser.profile?.lastCompletedTask || null,
      avatarUrl: newUser.avatarUrl,
      requirePasswordSetup: !newUser.password,
    });

    return {
      success: true,
      data: {
        accessToken,
        user: extractUserPublicInfo(newUser),
        requirePasswordSetup: !newUser.password,
      },
    };
  }

  protected async handleLoginBySocialAccount(
    socialAccount: UserSocialAccount,
  ): Promise<OperationResult> {
    const foundUserRes = await this.userService.findByID(socialAccount.userId, {
      relations: { profile: true },
    });

    if (!foundUserRes.success || !foundUserRes.data) {
      return generateNotFoundResult('user not found', ERR_CODE.NOT_FOUND);
    }
    const foundUser = foundUserRes.data;

    if (foundUser.status === ENTITY_STATUS.INACTIVE) {
      foundUser.status = ENTITY_STATUS.ACTIVE;
      await this.userService.updateByID(foundUser.id, {
        status: ENTITY_STATUS.ACTIVE,
      });
    }

    const userStatusVerifyResult = this.verifyUserStatus(foundUser);
    if (!userStatusVerifyResult.success) {
      return userStatusVerifyResult;
    }

    const accessToken = await this.jwtService.signAsync({
      id: foundUser.id,
      username: foundUser.username,
      role: foundUser.role,
      email: foundUser.email,
      phoneNumber: foundUser.profile?.phoneNumber || '',
      streak: foundUser.profile?.streak || 0,
      lastCompletedTask: foundUser.profile?.lastCompletedTask || null,
      avatarUrl: foundUser.avatarUrl,
      requirePasswordSetup: !foundUser.password,
    });

    return {
      success: true,
      data: {
        accessToken,
        user: extractUserPublicInfo(foundUser),
        requirePasswordSetup: !foundUser.password,
      },
    };
  }

  protected async handleNormalAccountLogin(
    foundUser: User,
    userSocialProfile: UserAuthSocialProfile,
  ): Promise<OperationResult> {
    if (foundUser.password) {
      if (foundUser.status === ENTITY_STATUS.INACTIVE) {
        foundUser.status = ENTITY_STATUS.ACTIVE;
        await this.userService.updateByID(foundUser.id, {
          status: ENTITY_STATUS.ACTIVE,
        });
      }

      const userStatusVerifyResult = this.verifyUserStatus(foundUser);
      if (!userStatusVerifyResult.success) {
        return userStatusVerifyResult;
      }

      const createdResultRes = await this.userSocialAccountService.create({
        userId: foundUser.id,
        provider: userSocialProfile.provider,
        providerUserId: userSocialProfile.providerUserId,
      });

      if (!createdResultRes.success || !createdResultRes.data) {
        return generateInternalServerResult();
      }

      const accessToken = await this.jwtService.signAsync({
        id: foundUser.id,
        username: foundUser.username,
        role: foundUser.role,
        email: foundUser.email,
        phoneNumber: foundUser.profile?.phoneNumber || '',
        streak: foundUser.profile?.streak || 0,
        lastCompletedTask: foundUser.profile?.lastCompletedTask || null,
        avatarUrl: foundUser.avatarUrl,
        requirePasswordSetup: !foundUser.password,
      });

      return {
        success: true,
        data: {
          accessToken,
          user: extractUserPublicInfo(foundUser),
          requirePasswordSetup: !foundUser.password,
        },
      };
    }

    return generateForbiddenResult(
      'password or username incorrect',
      ERR_CODE.PASSWORD_OR_USERNAME_INCORRECT,
    );
  }

  protected async handleRegisterSocialAccount(
    user: UserAuthSocialProfile,
  ): Promise<OperationResult> {
    const newUserRes = await this.userService.create({
      email: user.email,
      username: user.email,
      password: null,
      status: ENTITY_STATUS.ACTIVE,
      avatarUrl: user.avatarUrl,
    });

    if (!newUserRes.success || !newUserRes.data) {
      return OperationResult.fail(
        newUserRes.code || 'create_failed',
        newUserRes.message,
      );
    }
    const newUser = newUserRes.data;

    const createSocialRes = await this.userSocialAccountService.create({
      userId: newUser.id,
      provider: user.provider,
      providerUserId: user.providerUserId,
    });

    if (!createSocialRes.success || !createSocialRes.data) {
      return OperationResult.fail(
        createSocialRes.code || 'create_failed',
        createSocialRes.message,
      );
    }

    return {
      success: true,
      data: newUser,
    };
  }

  public async socialLoginCallback(
    provider: string,
    code: string,
  ): Promise<OperationResult> {
    try {
      const config = SOCIAL_CONFIG[provider];
      const tokenResponse = await this.httpService.send(
        'post',
        config.tokenUrl,
        {
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
          data: new URLSearchParams({
            code,
            client_id: this.configService.get(config.clientId),
            client_secret: this.configService.get(config.clientSecret),
            redirect_uri: this.configService.get(config.redirectUri),
            grant_type: 'authorization_code',
          }).toString(),
        },
      );

      const accessToken = tokenResponse.data.access_token;
      const refreshToken = tokenResponse.data.refresh_token;

      const profileResponse = await this.httpService.send(
        'get',
        config.userInfoUrl,
        {
          headers: { Authorization: `Bearer ${accessToken}` },
        },
      );
      const profile = profileResponse.data;

      const user: UserAuthSocialProfile = {
        provider,
        providerUserId: profile.sub,
        email: profile.email,
        accessToken,
        refreshToken,
        avatarUrl: profile.picture,
      };

      return {
        success: true,
        data: user,
      };
    } catch (error) {
      this.logger.error(error.message, error.stack);

      this.auditService.emitLog(
        new ErrorLog({
          logId: stringUtils.generateRandomId(),
          message: error.message,
          payload: provider,
          action: APP_ACTION.SOCIAL_LOGIN,
        }),
      );

      return generateInternalServerResult();
    }
  }

  public async getWhoAmI(userId: string): Promise<User | null> {
    const userRes = await this.userService.findByID(userId, {
      relations: { profile: true, coin: true },
    });
    if (!userRes.success || !userRes.data) {
      return null;
    }
    return userRes.data;
  }

  public verifyUserStatus(user: User): OperationResult {
    if (user.status !== ENTITY_STATUS.ACTIVE) {
      return generateForbiddenResult(
        'User is not active',
        ERR_CODE.ACCOUNT_IS_NOT_ACTIVE,
      );
    }

    return {
      success: true,
    };
  }

  public async setupPassword(
    logId: string,
    userId: string,
    dto: SetupPasswordDTO,
  ): Promise<OperationResult<{ accessToken: string; user: UserAuthProfile }>> {
    try {
      const foundUserRes = await this.userService.findByID(userId, {
        relations: { profile: true },
      });

      if (!foundUserRes.success || !foundUserRes.data) {
        return generateNotFoundResult(
          'user not found',
          ERR_CODE.USER_NOT_FOUND,
        );
      }
      const foundUser = foundUserRes.data;

      if (foundUser.password) {
        return generateBadRequestResult(
          'Mật khẩu đã được thiết lập.',
          ERR_CODE.ALREADY_EXISTS,
        );
      }

      const hashedPassword = await bcryptHelper.hash(dto.password, 10);

      const updateRes = await this.userService.updateByID(userId, {
        password: hashedPassword,
      });

      if (!updateRes.success) {
        return OperationResult.fail(
          updateRes.code || 'update_failed',
          updateRes.message,
        );
      }

      const accessToken = await this.jwtService.signAsync({
        id: foundUser.id,
        username: foundUser.username,
        role: foundUser.role,
        email: foundUser.email,
        phoneNumber: foundUser.profile?.phoneNumber || '',
        streak: foundUser.profile?.streak || 0,
        lastCompletedTask: foundUser.profile?.lastCompletedTask || null,
        avatarUrl: foundUser.avatarUrl,
        requirePasswordSetup: false,
      });

      return {
        success: true,
        data: {
          accessToken,
          user: extractUserPublicInfo(foundUser),
        },
      };
    } catch (error) {
      this.logger.error(error.message, error.stack);

      this.auditService.emitLog(
        new ErrorLog({
          logId: logId,
          message: error.message,
          userId,
          action: APP_ACTION.CHANGE_PASSWORD,
        }),
      );

      return generateInternalServerResult();
    }
  }
}

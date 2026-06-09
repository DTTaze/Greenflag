import { AuditService, ErrorLog, RedisService } from 'mvc-common-toolkit';
import { Observable, lastValueFrom, of } from 'rxjs';

import {
  CallHandler,
  ExecutionContext,
  ForbiddenException,
  HttpStatus,
  Inject,
  Injectable,
  Logger,
  NestInterceptor,
  SetMetadata,
  UseInterceptors,
  applyDecorators,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Reflector } from '@nestjs/core';

import { UserService } from '@modules/user/services/user.service';

import { failedAttemptCacheKey as getFailedAttemptCacheKey } from '@shared/cache-key';
import {
  APP_ACTION,
  DEFAULT_FAILED_ATTEMPTS_BAN,
  INJECTION_TOKEN,
} from '@shared/constants';
import { ENTITY_STATUS, METADATA_KEY } from '@shared/enums';

import { UserAPICallInterceptor } from './user-api-call.interceptor';

const incrementAndCompareNumberScript = `
local current = redis.call('incr', KEYS[1])
if current == 1 then
    redis.call('expire', KEYS[1], tonumber(ARGV[3]))
end
local op = ARGV[1]
local limit = tonumber(ARGV[2])
if op == 'gte' and current >= limit then
    return 1
elseif op == 'gt' and current > limit then
    return 1
else
    return 0
end
`;

@Injectable()
export class UserInvalidAttemptBanInterceptor
  extends UserAPICallInterceptor
  implements NestInterceptor
{
  protected logger = new Logger(UserInvalidAttemptBanInterceptor.name);

  constructor(
    configService: ConfigService,
    reflector: Reflector,

    @Inject(INJECTION_TOKEN.REDIS_SERVICE)
    protected cacheEngine: RedisService,

    @Inject(INJECTION_TOKEN.AUDIT_SERVICE)
    protected auditService: AuditService,

    protected userService: UserService,
  ) {
    super(configService, reflector);
  }

  public async intercept(
    context: ExecutionContext,
    next: CallHandler<any>,
  ): Promise<Observable<any>> {
    const { routeIdentifier, userId, logId } =
      this.getUserAndAPICallInfo(context);

    const maxAttemptsAllowed =
      this.reflector.get(
        METADATA_KEY.MAX_ATTEMPTS_ALLOWED,
        context.getHandler(),
      ) ?? DEFAULT_FAILED_ATTEMPTS_BAN;

    let responseBody: any;

    try {
      responseBody = await lastValueFrom(next.handle());

      if (responseBody?.success) return of(responseBody);
      if (responseBody?.httpCode === HttpStatus.FORBIDDEN) {
        await this.increaseForbiddenCount(
          userId,
          routeIdentifier,
          maxAttemptsAllowed,
          logId,
        );
      }
    } catch (error) {
      if (error instanceof ForbiddenException) {
        await this.increaseForbiddenCount(
          userId,
          routeIdentifier,
          maxAttemptsAllowed,
          logId,
        );
      }

      throw error;
    }

    return of(responseBody);
  }

  protected async increaseForbiddenCount(
    userId: string,
    routeIdentifier: string,
    maxAttemptsAllowed: number,
    logId: string,
  ) {
    const cacheKey = getFailedAttemptCacheKey(userId, routeIdentifier);

    try {
      const result = await this.cacheEngine.eval(
        incrementAndCompareNumberScript,
        1,
        cacheKey,
        'gte',
        maxAttemptsAllowed,
        60 * 60 * 24 * 30, // TTL
      );

      if (Number(result) === 1) {
        const msg = `userId ${userId} locked for reaching max attempts`;
        this.auditService.emitLog(
          new ErrorLog({
            message: msg,
            action: APP_ACTION.BAN_TOO_MANY_FAILED_ATTEMPTS,
            logId,
            userId,
            payload: {
              cacheKey,
            },
          }),
        );

        const userRes = await this.userService.findByID(userId);
        if (userRes.success && userRes.data) {
          const user = userRes.data;
          await Promise.all([
            this.userService.updateByID(userId, {
              status: ENTITY_STATUS.SUSPENDED,
              metadata: {
                ...user.metadata,
                reason: 'reached_max_failed_attempts',
                endpoint: routeIdentifier,
              },
            }),
            this.cacheEngine.del(cacheKey),
          ]);
        }
      }
    } catch (error) {
      this.logger.error(error.message, error.stack);
      this.auditService.emitLog(
        new ErrorLog({
          message: error.message,
          action: APP_ACTION.BAN_TOO_MANY_FAILED_ATTEMPTS,
          logId,
          userId,
          payload: {
            cacheKey,
          },
        }),
      );
    }
  }
}

export function UseMaxAttempts(maxAttemptsAllowed = 3) {
  return applyDecorators(
    UseInterceptors(UserInvalidAttemptBanInterceptor),
    SetMetadata(METADATA_KEY.MAX_ATTEMPTS_ALLOWED, maxAttemptsAllowed),
  );
}

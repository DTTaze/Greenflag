import { Request } from 'express';
import { CacheService, SET_CACHE_POLICY } from 'mvc-common-toolkit';
import { Observable, throwError } from 'rxjs';

import {
  CallHandler,
  ExecutionContext,
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  NestInterceptor,
  SetMetadata,
  UseInterceptors,
  applyDecorators,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Reflector } from '@nestjs/core';

import { rateLimitCacheKey } from '@shared/cache-key';
import { ERR_CODE, INJECTION_TOKEN } from '@shared/constants';
import { METADATA_KEY } from '@shared/enums';

@Injectable()
export class RateLimitingInterceptor implements NestInterceptor {
  constructor(
    protected configService: ConfigService,
    protected reflector: Reflector,

    @Inject(INJECTION_TOKEN.REDIS_SERVICE)
    protected cacheService: CacheService,
  ) {}

  public async intercept(
    context: ExecutionContext,
    next: CallHandler<any>,
  ): Promise<Observable<any>> {
    const config = this.reflector.get<{ limit: number; ttl: number }>(
      METADATA_KEY.RATE_LIMITING,
      context.getHandler(),
    ) || { limit: 60, ttl: 60 };

    const request: Request = context.switchToHttp().getRequest();
    const requestIp = request.ips.length ? request.ips[0] : request.ip;
    const endpoint = request.originalUrl;
    const method = request.method;

    const key = rateLimitCacheKey(method, endpoint, requestIp);

    const rawCount = await this.cacheService.get(key);
    const userReqCount = (parseInt(rawCount) || 0) + 1;

    if (userReqCount > config.limit) {
      return throwError(() => {
        return new HttpException(
          {
            statusCode: HttpStatus.TOO_MANY_REQUESTS,
            message: `You are sending too many requests. Please wait ${config.ttl} seconds`,
            error: ERR_CODE.TOO_MANY_REQUESTS,
          },
          HttpStatus.TOO_MANY_REQUESTS,
        );
      });
    }

    await this.cacheService.set(key, userReqCount, {
      policy: SET_CACHE_POLICY.WITH_TTL,
      value: config.ttl,
    });

    return next.handle();
  }
}

export const RateLimit = (limit: number, ttlInSeconds: number = 60) =>
  SetMetadata(METADATA_KEY.RATE_LIMITING, { limit, ttl: ttlInSeconds });

export const ApplyRateLimiting = (limit = 60, ttl = 60) => {
  return applyDecorators(
    UseInterceptors(RateLimitingInterceptor),
    RateLimit(limit, ttl),
  );
};

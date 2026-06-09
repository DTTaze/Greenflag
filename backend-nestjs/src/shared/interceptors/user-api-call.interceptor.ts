import { ExecutionContext, Optional, SetMetadata } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Reflector } from '@nestjs/core';

import { ENV_KEY } from '@shared/constants';
import { HEADER_KEY, METADATA_KEY } from '@shared/enums';
import { AppRequest } from '@shared/interfaces';

export type UserIdExtractor = (req: AppRequest) => string;

export const emailAsIdExtractor: UserIdExtractor = (httpReq: any): string =>
  httpReq?.body?.email;

export const UseUserIdExtractor = (extractors: UserIdExtractor[]) =>
  SetMetadata(METADATA_KEY.USER_ID_EXTRACTOR, extractors);

export const userIdExtractor: UserIdExtractor = (httpReq: any): string => {
  const user = httpReq.activeUser ||
    httpReq.user ||
    httpReq.activeSystemUser ||
    httpReq.systemUser || { id: '' };

  return user?.id;
};

export const userIpExtractor: UserIdExtractor = (httpReq: any): string => {
  return (
    httpReq.ip ||
    httpReq.headers['x-forwarded-for']?.split(',').shift() ||
    httpReq.connection?.remoteAddress ||
    'unknown_ip'
  );
};

export const defaultUserIdExtractors = [userIdExtractor, userIpExtractor];

export abstract class UserAPICallInterceptor {
  constructor(
    @Optional()
    protected configService: ConfigService,

    @Optional()
    protected reflector: Reflector,
  ) {}

  protected getUserAndAPICallInfo(ctx: ExecutionContext) {
    const appName = this.configService.get(
      ENV_KEY.SERVICE_NAME,
      'aidacity-backend',
    );
    const httpReq: any = ctx.switchToHttp().getRequest();
    const logId = httpReq.headers[HEADER_KEY.LOG_ID];

    const customUserIdExtractors: UserIdExtractor[] =
      this.reflector.get(METADATA_KEY.USER_ID_EXTRACTOR, ctx.getHandler()) ||
      [];

    const userIdExtractors = [
      ...customUserIdExtractors,
      ...defaultUserIdExtractors,
    ];

    const userId = userIdExtractors
      .map((extractor) => extractor(httpReq))
      .filter(Boolean)[0];

    const method = httpReq.method;

    const reqUrl = httpReq.path;

    const routeIdentifier = `${appName}:${userId}:${method}:${reqUrl}`;

    return {
      logId,
      userId,
      routeIdentifier,
      appName,
    };
  }
}

import { Request } from 'express';
import { stringUtils } from 'mvc-common-toolkit';
import { Observable, tap } from 'rxjs';

import {
  CallHandler,
  ExecutionContext,
  Injectable,
  Logger,
  NestInterceptor,
} from '@nestjs/common';

import { getLogId } from '@shared/decorators/logging.decorator';

@Injectable()
export class HttpLoggingInterceptor implements NestInterceptor {
  private logger = new Logger(this.constructor.name, { timestamp: true });

  public intercept(
    context: ExecutionContext,
    next: CallHandler<any>,
  ): Observable<any> | Promise<Observable<any>> {
    const request: Request = context.switchToHttp().getRequest();
    const logId = getLogId(request);

    const userIp =
      request.ip ||
      (request.headers['x-forwarded-for'] as string)?.split(',').shift() ||
      'unknown_ip';

    this.logger.debug(
      `[${logId}]: IP:${userIp}: Request: ${(request as any).user?.email || ''} ${
        request.method
      } ${request.url} ${
        request.body
          ? JSON.stringify(request.body, stringUtils.maskFn).slice(0, 100)
          : ''
      }`,
    );

    return next.handle().pipe(
      tap((responseBody) => {
        this.logger.debug(
          `[${logId}]: IP:${userIp}: Response: ${JSON.stringify(
            responseBody,
            stringUtils.maskFn,
          ).slice(0, 100)}`,
        );
      }),
    );
  }
}

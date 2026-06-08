import { Request } from 'express';
import { AuditService, ErrorLog, stringUtils } from 'mvc-common-toolkit';

import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Inject,
  Logger,
} from '@nestjs/common';

import {
  APP_ACTION,
  ERR_CODE,
  HEADER_KEY,
  INJECTION_TOKEN,
} from '@shared/constants';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  private readonly logger = new Logger(AllExceptionsFilter.name);

  constructor(
    @Inject(INJECTION_TOKEN.AUDIT_SERVICE)
    private readonly auditService: AuditService,
  ) {}

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const request = ctx.getRequest<Request>();

    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    const message =
      exception instanceof HttpException
        ? exception.getResponse()
        : (exception as Error).message || 'Internal server error';

    const logId = request.headers[HEADER_KEY.LOG_ID] as string;
    const user = (request as any).activeUser || (request as any).user;

    this.logger.error(
      `[${logId}] Error: ${JSON.stringify(message)}`,
      exception instanceof Error ? exception.stack : '',
    );

    if (status === HttpStatus.INTERNAL_SERVER_ERROR) {
      this.auditService.emitLog(
        new ErrorLog({
          logId,
          action: APP_ACTION.HANDLE_EXCEPTION,
          message: (exception as Error).message,
          userId: user?.id || 'unknown',
          metadata: {
            url: request.url,
            user: JSON.stringify(user, stringUtils.maskFn),
            payload: request.body
              ? JSON.stringify(request.body, stringUtils.maskFn)
              : '',
          },
        }),
      );
    }

    response.status(status).json({
      success: false,
      code:
        exception instanceof HttpException
          ? (exception as any).code || ERR_CODE.INTERNAL_SERVER_ERROR
          : ERR_CODE.INTERNAL_SERVER_ERROR,
      message:
        typeof message === 'string'
          ? message
          : (message as any).message || message,
    });
  }
}

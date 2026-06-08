import { stringUtils } from 'mvc-common-toolkit';

import { ExecutionContext, createParamDecorator } from '@nestjs/common';

import { HEADER_KEY } from '@shared/constants';

export const getLogId = (request: any) => {
  if (!request.headers[HEADER_KEY.LOG_ID]) {
    request.headers[HEADER_KEY.LOG_ID] = stringUtils.generateRandomId();
  }

  return request.headers[HEADER_KEY.LOG_ID];
};

export const LogId = createParamDecorator(
  (_: any, ctx: ExecutionContext): string => {
    const request = ctx.switchToHttp().getRequest();

    if (!request.headers[HEADER_KEY.LOG_ID]) {
      request.headers[HEADER_KEY.LOG_ID] = stringUtils.generateRandomId();
    }

    return request.headers[HEADER_KEY.LOG_ID];
  },
);

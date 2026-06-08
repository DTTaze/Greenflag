import {
  AuditService,
  ErrorLog,
  HttpMethod,
  HttpRequestOption,
  HttpResponse,
  HttpService,
  OperationResult,
  stringUtils,
} from 'mvc-common-toolkit';

import { Injectable } from '@nestjs/common';

import { APP_ACTION } from '@shared/constants';
import { getLogId } from '@shared/decorators/logging.decorator';

enum HttpMethodEnum {
  GET = 'get',
  POST = 'post',
  PUT = 'put',
  PATCH = 'patch',
  DELETE = 'delete',
}

const httpMethodsWithBody = [
  HttpMethodEnum.POST,
  HttpMethodEnum.PUT,
  HttpMethodEnum.PATCH,
];

export interface SendToPartnerOptions {
  emitAudit: boolean | ((response: HttpResponse | OperationResult) => boolean);
  appAction: string;
}

@Injectable()
export abstract class OutboundPartnerService {
  constructor(
    protected httpService: HttpService,
    protected auditService: AuditService,
  ) {}

  protected abstract get partnerServerUrl(): string;
  protected abstract partnerRequestOption(): HttpRequestOption;

  public async sendToPartner<T = any>(
    method: HttpMethod,
    path: string,
    payload?: any,
    options: Partial<SendToPartnerOptions> = {
      emitAudit: true,
      appAction: APP_ACTION.SEND_TO_PARTNER,
    },
  ): Promise<HttpResponse<T>> {
    const url = this.partnerServerUrl + path;
    const requestOptions = this.partnerRequestOption();

    if (httpMethodsWithBody.some((m) => m === method)) {
      requestOptions.body = payload;
    } else if (method === 'get') {
      requestOptions.query = payload;
    }

    const response = await this.httpService.send<T>(
      method,
      url,
      requestOptions,
    );

    if (!response || !response.success || !response.data) {
      if (
        (typeof options.emitAudit === 'boolean' && options.emitAudit) ||
        (typeof options.emitAudit === 'function' &&
          options.emitAudit?.(response))
      ) {
        this.auditService.emitLog(
          new ErrorLog({
            logId: getLogId(requestOptions),
            message: response?.message,
            action: options?.appAction,
            payload: JSON.stringify(payload, stringUtils.maskFn),
            metadata: {
              response: JSON.stringify(response, stringUtils.maskFn),
              url,
              method,
            },
          }),
        );
      }

      return {
        success: false,
        message: response?.message || 'Partner request failed',
        code: response?.code,
        httpCode: response?.httpCode,
      };
    }

    return {
      success: true,
      data: response.data,
    };
  }
}

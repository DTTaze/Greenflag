import { trace } from '@opentelemetry/api';
import pino from 'pino';

import { LoggerService } from '@nestjs/common';

export class PinoLogger implements LoggerService {
  private readonly logger = pino({
    level: process.env.LOG_LEVEL || 'debug',
  });

  private getTraceContext() {
    const activeSpan = trace.getActiveSpan();
    if (activeSpan) {
      const spanContext = activeSpan.spanContext();
      return {
        trace_id: spanContext.traceId,
        span_id: spanContext.spanId,
      };
    }
    return {};
  }

  log(message: any, ...optionalParams: any[]) {
    const context = optionalParams[0];
    this.logger.info({
      ...this.getTraceContext(),
      message: typeof message === 'object' ? JSON.stringify(message) : message,
      context,
    });
  }

  error(message: any, ...optionalParams: any[]) {
    const context = optionalParams[0];
    const traceStack = optionalParams[1];
    this.logger.error({
      ...this.getTraceContext(),
      message: typeof message === 'object' ? JSON.stringify(message) : message,
      context,
      trace: traceStack,
    });
  }

  warn(message: any, ...optionalParams: any[]) {
    const context = optionalParams[0];
    this.logger.warn({
      ...this.getTraceContext(),
      message: typeof message === 'object' ? JSON.stringify(message) : message,
      context,
    });
  }

  debug(message: any, ...optionalParams: any[]) {
    const context = optionalParams[0];
    this.logger.debug({
      ...this.getTraceContext(),
      message: typeof message === 'object' ? JSON.stringify(message) : message,
      context,
    });
  }

  verbose(message: any, ...optionalParams: any[]) {
    const context = optionalParams[0];
    this.logger.trace({
      ...this.getTraceContext(),
      message: typeof message === 'object' ? JSON.stringify(message) : message,
      context,
    });
  }
}

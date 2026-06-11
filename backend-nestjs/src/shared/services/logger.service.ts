import { trace } from '@opentelemetry/api';
import pino from 'pino';
import pretty from 'pino-pretty';

import { LoggerService } from '@nestjs/common';

export class PinoLogger implements LoggerService {
  private readonly logger = pino(
    {
      level: process.env.LOG_LEVEL || 'debug',
    },
    pretty({
      colorize: true,
      levelFirst: true,
      translateTime: 'SYS:dd/mm/yyyy, h:MM:ss TT',
      ignore: 'pid,hostname,context',
      messageFormat: (log: Record<string, unknown>, messageKey: string) => {
        const context = (log.context as string) || 'Application';
        const msg = log[messageKey] as string;
        const level = log.level as number;

        let msgColor = '\x1b[32m';
        if (level >= 50) msgColor = '\x1b[31m';
        else if (level >= 40) msgColor = '\x1b[33m';
        else if (level >= 30) msgColor = '\x1b[32m';
        else if (level >= 20) msgColor = '\x1b[36m';
        else msgColor = '\x1b[90m';

        const contextColor = '\x1b[33m';
        const resetColor = '\x1b[0m';

        return `${contextColor}[${context}]${resetColor} ${msgColor}${msg}${resetColor}`;
      },
    }),
  );

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
    const context = optionalParams[0] || 'Application';
    const msgString =
      typeof message === 'object' ? JSON.stringify(message) : message;

    this.logger.info({ ...this.getTraceContext(), context }, msgString);
  }

  error(message: any, ...optionalParams: any[]) {
    let msgString = message;
    let errorStack = '';

    if (message instanceof Error) {
      msgString = message.message;
      errorStack = message.stack || '';
    } else if (typeof message === 'object' && message !== null) {
      msgString = message.message || JSON.stringify(message);
      if (message.stack) {
        errorStack = message.stack;
      }
    }

    let context = 'Application';
    let traceStack = errorStack;

    if (optionalParams.length === 1) {
      const param = optionalParams[0];
      if (typeof param === 'string' && param.includes('\n')) {
        traceStack = param;
      } else {
        context = param || 'Application';
      }
    } else if (optionalParams.length >= 2) {
      traceStack = optionalParams[0] || traceStack;
      context = optionalParams[1] || 'Application';
    }

    this.logger.error(
      { ...this.getTraceContext(), context, trace: traceStack },
      msgString,
    );
  }

  warn(message: any, ...optionalParams: any[]) {
    const context = optionalParams[0] || 'Application';
    const msgString =
      typeof message === 'object' ? JSON.stringify(message) : message;

    this.logger.warn({ ...this.getTraceContext(), context }, msgString);
  }

  debug(message: any, ...optionalParams: any[]) {
    const context = optionalParams[0] || 'Application';
    const msgString =
      typeof message === 'object' ? JSON.stringify(message) : message;

    this.logger.debug({ ...this.getTraceContext(), context }, msgString);
  }

  verbose(message: any, ...optionalParams: any[]) {
    const context = optionalParams[0] || 'Application';
    const msgString =
      typeof message === 'object' ? JSON.stringify(message) : message;

    this.logger.trace({ ...this.getTraceContext(), context }, msgString);
  }
}

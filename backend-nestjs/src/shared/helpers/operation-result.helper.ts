import {
  PaginationResult,
  OperationResult as ToolkitOperationResult,
} from 'mvc-common-toolkit';

import { HttpStatus } from '@nestjs/common';

import { ERR_CODE } from '@shared/constants';

export class OperationResult<T = any> implements ToolkitOperationResult<T> {
  success: boolean;
  data?: T;
  message?: string;
  code?: string;
  httpCode?: number;
  metadata?: any;
  action?: string;

  static success<T>(data?: T, message?: string): OperationResult<T> {
    const res = new OperationResult<T>();
    res.success = true;
    res.data = data;
    res.message = message;
    res.httpCode = HttpStatus.OK;
    return res;
  }

  static fail<T>(code: string, message?: string): OperationResult<T> {
    const res = new OperationResult<T>();
    res.success = false;
    res.code = code;
    res.message = message;

    // Map error code to appropriate HTTP status
    const lowercaseCode = code ? code.toLowerCase() : '';
    if (lowercaseCode.includes('not_found')) {
      res.httpCode = HttpStatus.NOT_FOUND;
    } else if (
      lowercaseCode.includes('forbidden') ||
      lowercaseCode.includes('unauthorized_role')
    ) {
      res.httpCode = HttpStatus.FORBIDDEN;
    } else if (lowercaseCode.includes('unauthorized')) {
      res.httpCode = HttpStatus.UNAUTHORIZED;
    } else if (
      lowercaseCode.includes('already_exists') ||
      lowercaseCode.includes('conflict')
    ) {
      res.httpCode = HttpStatus.CONFLICT;
    } else if (lowercaseCode.includes('too_many_requests')) {
      res.httpCode = HttpStatus.TOO_MANY_REQUESTS;
    } else if (lowercaseCode.includes('internal_server_error')) {
      res.httpCode = HttpStatus.INTERNAL_SERVER_ERROR;
    } else {
      res.httpCode = HttpStatus.BAD_REQUEST;
    }

    return res;
  }
}

export const generateTooManyRequestsResult = (
  message?: string,
  code = ERR_CODE.TOO_MANY_REQUESTS,
): OperationResult =>
  OperationResult.fail(code, message || 'Too many requests');

export const generateUnauthorizedResult = (
  message?: string,
  code = ERR_CODE.UNAUTHORIZED,
): OperationResult => OperationResult.fail(code, message || 'Unauthorized');

export const generateInternalServerResult = (
  message?: string,
): OperationResult =>
  OperationResult.fail(
    ERR_CODE.INTERNAL_SERVER_ERROR,
    message || 'Internal server error',
  );

export const generateNotFoundResult = (
  message?: string,
  code = ERR_CODE.NOT_FOUND,
): OperationResult => OperationResult.fail(code, message || 'Not found');

export const generateBadRequestResult = (
  message?: string,
  code = ERR_CODE.BAD_REQUEST,
): OperationResult => OperationResult.fail(code, message || 'Bad request');

export const generateConflictResult = (
  message?: string,
  code = ERR_CODE.ALREADY_EXISTS,
): OperationResult => OperationResult.fail(code, message || 'Already exists');

export const generateForbiddenResult = (
  message?: string,
  code = ERR_CODE.FORBIDDEN,
): OperationResult => OperationResult.fail(code, message || 'Forbidden');

export const generateUnprocessableEntityResult = (
  message?: string,
  code = ERR_CODE.UNPROCESSABLE_ENTITY,
): OperationResult =>
  OperationResult.fail(code, message || 'Unprocessable entity');

export const generateSuccessResult = <T>(
  data?: T,
  message?: string,
): OperationResult<T> => OperationResult.success(data, message);

export const generateEmptyPaginationData = (): Partial<PaginationResult> => ({
  rows: [],
  total: 0,
  offset: 0,
  limit: 0,
});

export const generatePaginationResult = <T>(
  rows: T[] | undefined | null,
  total: number,
  offset: number,
  limit: number,
): OperationResult<PaginationResult<T>> => {
  return OperationResult.success({
    rows: rows ?? [],
    total: total ?? 0,
    offset: offset ?? 0,
    limit: limit ?? 0,
  });
};

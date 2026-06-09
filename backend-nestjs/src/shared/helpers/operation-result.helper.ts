import { OperationResult, PaginationResult } from 'mvc-common-toolkit';

import { HttpStatus } from '@nestjs/common';

import { ERR_CODE } from '@shared/constants';

export const generateTooManyRequestsResult = (
  message?: string,
  code = ERR_CODE.TOO_MANY_REQUESTS,
): OperationResult => ({
  success: false,
  message: message || 'Too many requests',
  code,
  httpCode: HttpStatus.TOO_MANY_REQUESTS,
});

export const generateUnauthorizedResult = (
  message?: string,
  code = ERR_CODE.UNAUTHORIZED,
): OperationResult => ({
  success: false,
  message: message || 'Unauthorized',
  code,
  httpCode: HttpStatus.UNAUTHORIZED,
});

export const generateInternalServerResult = (
  message?: string,
): OperationResult => ({
  success: false,
  message: message || 'Internal server error',
  code: ERR_CODE.INTERNAL_SERVER_ERROR,
  httpCode: HttpStatus.INTERNAL_SERVER_ERROR,
});

export const generateNotFoundResult = (
  message?: string,
  code = ERR_CODE.NOT_FOUND,
): OperationResult => ({
  success: false,
  message: message || 'Not found',
  code,
  httpCode: HttpStatus.NOT_FOUND,
});

export const generateBadRequestResult = (
  message?: string,
  code = ERR_CODE.BAD_REQUEST,
): OperationResult => ({
  success: false,
  message: message || 'Bad request',
  code,
  httpCode: HttpStatus.BAD_REQUEST,
});

export const generateConflictResult = (
  message?: string,
  code = ERR_CODE.ALREADY_EXISTS,
): OperationResult => ({
  success: false,
  message: message || 'Already exists',
  code,
  httpCode: HttpStatus.CONFLICT,
});

export const generateForbiddenResult = (
  message?: string,
  code = ERR_CODE.FORBIDDEN,
): OperationResult => ({
  success: false,
  message: message || 'Forbidden',
  code,
  httpCode: HttpStatus.FORBIDDEN,
});

export const generateUnprocessableEntityResult = (
  message?: string,
  code = ERR_CODE.UNPROCESSABLE_ENTITY,
): OperationResult => ({
  success: false,
  message: message || 'Unprocessable entity',
  code,
  httpCode: HttpStatus.UNPROCESSABLE_ENTITY,
});

export const generateSuccessResult = (
  data?: any,
  message?: string,
): OperationResult => ({
  success: true,
  data,
  message,
  httpCode: HttpStatus.OK,
});

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
): OperationResult<PaginationResult<T>> => ({
  success: true,
  data: {
    rows: rows ?? [],
    total: total ?? 0,
    offset: offset ?? 0,
    limit: limit ?? 0,
  },
  httpCode: HttpStatus.OK,
});

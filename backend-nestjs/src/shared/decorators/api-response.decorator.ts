import { HttpStatus, Type, applyDecorators } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiConflictResponse,
  ApiExtraModels,
  ApiForbiddenResponse,
  ApiInternalServerErrorResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiUnauthorizedResponse,
  ApiUnprocessableEntityResponse,
  getSchemaPath,
} from '@nestjs/swagger';

import { SuccessResponseDTO } from '@shared/common/response.dto';
import { ERR_CODE } from '@shared/constants';

export function ApiOperationSuccess<T>(
  model?: Type<T>,
  options?: { description?: string; isRaw?: boolean },
) {
  const extraModels = model
    ? [SuccessResponseDTO, model]
    : [SuccessResponseDTO];

  const schemaReference =
    options?.isRaw && model
      ? { $ref: getSchemaPath(model) }
      : model
        ? {
            allOf: [
              { $ref: getSchemaPath(SuccessResponseDTO) },
              {
                properties: {
                  data: { $ref: getSchemaPath(model) },
                },
              },
            ],
          }
        : {
            $ref: getSchemaPath(SuccessResponseDTO),
          };

  return applyDecorators(
    ApiExtraModels(...extraModels),
    ApiOkResponse({
      description: options?.description || 'Thực hiện thành công',
      schema: schemaReference,
    }),
  );
}

export function ApiOperationError() {
  return applyDecorators(
    ApiBadRequestResponse({
      description: 'Bad request',
      schema: {
        example: {
          success: false,
          message: 'Bad request',
          code: ERR_CODE.BAD_REQUEST,
          httpCode: HttpStatus.BAD_REQUEST,
        },
      },
    }),

    ApiUnauthorizedResponse({
      description: 'Unauthorized',
      schema: {
        example: {
          success: false,
          message: 'Unauthorized',
          code: ERR_CODE.UNAUTHORIZED,
          httpCode: HttpStatus.UNAUTHORIZED,
        },
      },
    }),

    ApiForbiddenResponse({
      description: 'Forbidden',
      schema: {
        example: {
          success: false,
          message: 'Forbidden',
          code: ERR_CODE.FORBIDDEN,
          httpCode: HttpStatus.FORBIDDEN,
        },
      },
    }),

    ApiNotFoundResponse({
      description: 'Not found',
      schema: {
        example: {
          success: false,
          message: 'Not found',
          code: ERR_CODE.NOT_FOUND,
          httpCode: HttpStatus.NOT_FOUND,
        },
      },
    }),

    ApiConflictResponse({
      description: 'Already exists',
      schema: {
        example: {
          success: false,
          message: 'Already exists',
          code: ERR_CODE.ALREADY_EXISTS,
          httpCode: HttpStatus.CONFLICT,
        },
      },
    }),

    ApiUnprocessableEntityResponse({
      description: 'Unprocessable entity',
      schema: {
        example: {
          success: false,
          message: 'Unprocessable entity',
          code: ERR_CODE.UNPROCESSABLE_ENTITY,
          httpCode: HttpStatus.UNPROCESSABLE_ENTITY,
        },
      },
    }),

    ApiInternalServerErrorResponse({
      description: 'Internal server error',
      schema: {
        example: {
          success: false,
          message: 'Internal server error',
          code: ERR_CODE.INTERNAL_SERVER_ERROR,
          httpCode: HttpStatus.INTERNAL_SERVER_ERROR,
        },
      },
    }),
  );
}

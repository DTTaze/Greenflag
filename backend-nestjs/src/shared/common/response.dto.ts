import { HttpStatus } from '@nestjs/common';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

import { ERR_CODE } from '@shared/constants';

export class SuccessResponseDTO<T> {
  @ApiProperty({ example: true })
  success: true;

  @ApiProperty()
  data: T;

  @ApiPropertyOptional({ example: 'Success' })
  message?: string;

  @ApiPropertyOptional({ example: HttpStatus.OK })
  httpCode?: number;
}

export class ErrorResponseDTO {
  @ApiProperty({ example: false })
  success: false;

  @ApiProperty({ example: 'Unauthorized' })
  message: string;

  @ApiProperty({
    enum: ERR_CODE,
    example: ERR_CODE.UNAUTHORIZED,
  })
  code: string;

  @ApiProperty({
    example: HttpStatus.UNAUTHORIZED,
  })
  httpCode: number;
}

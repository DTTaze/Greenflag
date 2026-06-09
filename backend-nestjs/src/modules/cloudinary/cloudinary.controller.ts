import { HttpResponse } from 'mvc-common-toolkit';

import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';

import {
  ApiOperationError,
  ApiOperationSuccess,
} from '@shared/decorators/api-response.decorator';
import { AuthGuard } from '@shared/guards/auth.guard';
import { ApplyRateLimiting } from '@shared/interceptors/rate-limiting.interceptor';

import { GetSignatureDto, GetSignatureResponseDto } from './cloudinary.dto';
import { CloudinaryService } from './services/cloudinary.service';

@ApiBearerAuth()
@ApiTags('Cloudinary')
@Controller('cloudinary')
@UseGuards(AuthGuard)
@ApiOperationError()
export class CloudinaryController {
  constructor(private readonly cloudinaryService: CloudinaryService) {}

  @Get('signature')
  @ApiOperation({
    summary: 'Get Upload Signature',
    description: 'Get upload signature for Cloudinary',
  })
  @ApplyRateLimiting(10)
  @ApiOperationSuccess(GetSignatureResponseDto)
  getSignature(
    @Query() dto: GetSignatureDto,
  ): HttpResponse<GetSignatureResponseDto> {
    return this.cloudinaryService.getUploadSignature(dto);
  }
}

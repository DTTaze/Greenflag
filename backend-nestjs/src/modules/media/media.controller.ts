import {
  Controller,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';

import { CloudinaryService } from '@modules/cloudinary/services/cloudinary.service';

import { getStorageFolder } from '@shared/constants';
import { AuthGuard } from '@shared/guards/auth.guard';

@ApiTags('Media')
@ApiBearerAuth()
@Controller('media')
@UseGuards(AuthGuard)
export class MediaController {
  constructor(private readonly cloudinaryService: CloudinaryService) {}

  @Post('upload')
  @ApiOperation({ summary: 'Upload generic media file to Cloudinary' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(@UploadedFile() file: Express.Multer.File) {
    const uploadResult = await this.cloudinaryService.uploadImage(
      file,
      getStorageFolder().MEDIA,
    );
    return { secureUrl: uploadResult.secure_url };
  }
}

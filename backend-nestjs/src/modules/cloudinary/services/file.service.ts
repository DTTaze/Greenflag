import { BadRequestException, Injectable } from '@nestjs/common';

import { SystemConfigService } from '@modules/system-config/system-config.service';

import { SYSTEM_CONFIG_KEY } from '@shared/enums';

@Injectable()
export class FileService {
  constructor(private readonly systemConfigService: SystemConfigService) {}

  async validateImageSize(file: Express.Multer.File): Promise<void> {
    if (!file) {
      throw new BadRequestException('No file uploaded');
    }

    const maxImageSizeMbStr = await this.systemConfigService.get(
      SYSTEM_CONFIG_KEY.MAX_IMAGE_SIZE_MB,
    );
    const maxImageSizeMb = maxImageSizeMbStr ? Number(maxImageSizeMbStr) : 10;
    const maxSizeBytes = maxImageSizeMb * 1024 * 1024;

    if (file.size > maxSizeBytes) {
      throw new BadRequestException(
        `File size exceeds the maximum limit of ${maxImageSizeMb}MB`,
      );
    }
  }
}

import { v2 as cloudinary } from 'cloudinary';

import { Module, Provider } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';

import cloudinaryConfig from '@configs/cloudinary.config';

import { SystemConfigModule } from '@modules/system-config/system-config.module';

import { INJECTION_TOKEN } from '@shared/constants';

import { CloudinaryController } from './cloudinary.controller';
import { CloudinaryService } from './services/cloudinary.service';
import { FileService } from './services/file.service';

export const cloudinaryProvider: Provider = {
  provide: INJECTION_TOKEN.CLOUDINARY_SERVICE,
  useFactory: (config: ConfigType<typeof cloudinaryConfig>) => {
    cloudinary.config({
      cloud_name: config.cloudName,
      api_key: config.apiKey,
      api_secret: config.apiSecret,
    });
    return cloudinary;
  },
  inject: [cloudinaryConfig.KEY],
};

@Module({
  imports: [SystemConfigModule],
  controllers: [CloudinaryController],
  providers: [CloudinaryService, FileService, cloudinaryProvider],
  exports: [CloudinaryService, FileService, cloudinaryProvider],
})
export class CloudinaryModule {}

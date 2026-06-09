import { IsString } from 'class-validator';

import { registerAs } from '@nestjs/config';

import { CONFIG_KEY } from '@shared/enums';
import { validateConfig } from '@shared/helpers/validate-config.helper';

class CloudinaryConfig {
  @IsString()
  cloudName: string;

  @IsString()
  apiKey: string;

  @IsString()
  apiSecret: string;
}

export const cloudinaryConfig = registerAs(CONFIG_KEY.CLOUDINARY, () => {
  const config = {
    cloudName: process.env.CLOUDINARY_CLOUD_NAME || 'mock_cloud_name',
    apiKey: process.env.CLOUDINARY_API_KEY || 'mock_api_key',
    apiSecret: process.env.CLOUDINARY_API_SECRET || 'mock_api_secret',
  };

  validateConfig(config, CloudinaryConfig);

  return config;
});

export default cloudinaryConfig;

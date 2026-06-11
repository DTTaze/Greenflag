import { IsString } from 'class-validator';

import { registerAs } from '@nestjs/config';

import { validateConfig } from '@shared/helpers/validate-config.helper';

class R2Config {
  @IsString()
  accountId: string;

  @IsString()
  accessKeyId: string;

  @IsString()
  secretAccessKey: string;

  @IsString()
  bucketName: string;

  @IsString()
  publicDomain: string;
}

export const r2Config = registerAs('r2', () => {
  const config = {
    accountId: process.env.R2_ACCOUNT_ID || 'mock_account_id',
    accessKeyId: process.env.R2_ACCESS_KEY_ID || 'mock_access_key_id',
    secretAccessKey:
      process.env.R2_SECRET_ACCESS_KEY || 'mock_secret_access_key',
    bucketName: process.env.R2_BUCKET_NAME || 'mock_bucket_name',
    publicDomain: process.env.R2_PUBLIC_DOMAIN || 'http://localhost/r2-mock',
  };

  validateConfig(config, R2Config);

  return config;
});

export default r2Config;

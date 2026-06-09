import {
  IsBoolean,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { APP_ENV } from 'mvc-common-toolkit';

import { registerAs } from '@nestjs/config';

import { CONFIG_KEY } from '@shared/constants';
import { validateConfig } from '@shared/helpers/validate-config.helper';

class AppConfig {
  @IsEnum(APP_ENV)
  nodeEnv: APP_ENV;

  @IsNumber()
  port: number;

  @IsBoolean()
  enableCors: boolean;

  @IsBoolean()
  enableSwagger: boolean;

  @IsString()
  serviceName: string;

  @IsString()
  @IsOptional()
  auditWebhookUrl?: string;

  @IsString()
  jwtSecret: string;

  @IsString()
  jwtExpiration: string;

  @IsString()
  redisHost: string;

  @IsNumber()
  redisPort: number;

  @IsString()
  @IsOptional()
  redisPassword?: string;

  @IsString()
  @IsOptional()
  googleClientId?: string;

  @IsString()
  @IsOptional()
  googleClientSecret?: string;

  @IsString()
  @IsOptional()
  googleCallbackUrl?: string;

  @IsString()
  @IsOptional()
  ghnUrl?: string;
}

export const appConfig = registerAs(CONFIG_KEY.APP, () => {
  const config = {
    nodeEnv: (process.env.NODE_ENV as APP_ENV) || APP_ENV.DEVELOPMENT,
    port: parseInt(process.env.PORT || '3000', 10),
    enableCors: process.env.ENABLE_CORS === 'true',
    enableSwagger: process.env.ENABLE_SWAGGER === 'true',
    serviceName:
      process.env.SERVICE_NAME || 'boilerplate-backend-nestjs-postgresql',
    auditWebhookUrl: process.env.AUDIT_WEBHOOK_URL,
    jwtSecret: process.env.JWT_SECRET,
    jwtExpiration: process.env.JWT_EXPIRATION || '365d',
    redisHost: process.env.REDIS_HOST || 'localhost',
    redisPort: parseInt(process.env.REDIS_PORT || '6379', 10),
    redisPassword: process.env.REDIS_PASSWORD,
    googleClientId: process.env.GOOGLE_CLIENT_ID,
    googleClientSecret: process.env.GOOGLE_CLIENT_SECRET,
    googleCallbackUrl: process.env.GOOGLE_CALLBACK_URL,
    ghnUrl:
      process.env.GHN_URL ||
      'https://dev-online-gateway.ghn.vn/shiip/public-api',
  };

  validateConfig(config, AppConfig);

  return config;
});

export default appConfig;

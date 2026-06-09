import { IsBoolean, IsNumber, IsOptional, IsString } from 'class-validator';

import { registerAs } from '@nestjs/config';

import { CONFIG_KEY } from '@shared/enums';
import { validateConfig } from '@shared/helpers/validate-config.helper';

class EmailConfig {
  @IsString()
  @IsOptional()
  smtpUsername?: string;

  @IsString()
  @IsOptional()
  smtpPassword?: string;

  @IsString()
  @IsOptional()
  smtpHost?: string;

  @IsNumber()
  @IsOptional()
  smtpPort?: number;

  @IsBoolean()
  @IsOptional()
  smtpSecure?: boolean;

  @IsString()
  @IsOptional()
  adminEmails?: string;
}

export const emailConfig = registerAs(CONFIG_KEY.EMAIL, () => {
  const config = {
    smtpUsername: process.env.SMTP_USERNAME,
    smtpPassword: process.env.SMTP_PASSWORD,
    smtpHost: process.env.SMTP_HOST,
    smtpPort: process.env.SMTP_PORT
      ? parseInt(process.env.SMTP_PORT, 10)
      : undefined,
    smtpSecure: process.env.SMTP_SECURE === 'true',
    adminEmails: process.env.ADMIN_EMAILS,
  };

  validateConfig(config, EmailConfig);

  return config;
});

export default emailConfig;

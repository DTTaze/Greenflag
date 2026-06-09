import { IsBoolean, IsNumber, IsOptional, IsString } from 'class-validator';

import { registerAs } from '@nestjs/config';

import { CONFIG_KEY } from '@shared/constants';
import { validateConfig } from '@shared/helpers/validate-config.helper';

class DatabaseConfig {
  @IsString()
  host: string;

  @IsNumber()
  port: number;

  @IsString()
  username: string;

  @IsString()
  @IsOptional()
  password?: string;

  @IsString()
  schema: string;

  @IsBoolean()
  synchronize: boolean;

  @IsBoolean()
  @IsOptional()
  logging?: boolean;
}

export const databaseConfig = registerAs(CONFIG_KEY.DATABASE, () => {
  const config = {
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT || '5432', 10),
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    schema: process.env.DB_SCHEMA,
    synchronize: process.env.DB_SYNCHRONIZE === 'true',
    logging: process.env.DB_LOGGING === 'true',
  };

  validateConfig(config, DatabaseConfig);

  return config;
});

export default databaseConfig;

import * as dayjs from 'dayjs';
import * as timezone from 'dayjs/plugin/timezone';
import * as utc from 'dayjs/plugin/utc';

import { Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';

import { ENV_KEY } from '@shared/constants';

import { AppModule } from './app.module';
import { setup } from './setup';

dayjs.extend(utc);
dayjs.extend(timezone);

// Set it once if you want all dayjs() calls to default to that zone
dayjs.tz.setDefault('Asia/Ho_Chi_Minh');

async function bootstrap() {
  const logger = new Logger('Bootstrap');
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  const configService = app.get(ConfigService);

  setup(app);

  const port = configService.get<number>(ENV_KEY.PORT) || 3000;
  const mainUrl = `http://localhost:${port}`;

  await app.listen(port);

  logger.log(`Server is listening on ${mainUrl}`);

  const enableSwagger = configService.get<boolean>(ENV_KEY.ENABLE_SWAGGER);
  if (enableSwagger) {
    logger.log(`Swagger UI is running on ${mainUrl}/docs`);
  }
}

bootstrap();

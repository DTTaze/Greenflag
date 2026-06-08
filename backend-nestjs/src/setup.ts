import {
  INestApplication,
  ValidationPipe,
  VersioningType,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  DocumentBuilder,
  SwaggerCustomOptions,
  SwaggerModule,
} from '@nestjs/swagger';

import { ENV_KEY, INJECTION_TOKEN } from '@shared/constants';
import { AllExceptionsFilter } from '@shared/filters/all-exceptions.filter';
import { HttpLoggingInterceptor } from '@shared/interceptors/http-logging.interceptor';
import { HttpResponseInterceptor } from '@shared/interceptors/http-response.interceptor';

export function setup(app: INestApplication) {
  const configService = app.get(ConfigService);

  // Enable graceful shutdown
  app.enableShutdownHooks();

  const enableCors = configService.get<boolean>(ENV_KEY.ENABLE_CORS);
  if (enableCors) {
    app.enableCors({
      origin: '*',
      methods: '*',
      credentials: true,
    });
  }

  // Validate data of all HTTP requests
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
      forbidUnknownValues: true,
      transformOptions: { enableImplicitConversion: true },
    }),
  );

  app.setGlobalPrefix('api');
  app.enableVersioning({
    type: VersioningType.URI,
    defaultVersion: '1',
  });

  const auditService = app.get(INJECTION_TOKEN.AUDIT_SERVICE);

  // Global Filters
  app.useGlobalFilters(new AllExceptionsFilter(auditService));

  // Global Interceptors
  app.useGlobalInterceptors(
    new HttpLoggingInterceptor(),
    new HttpResponseInterceptor(),
  );

  // Swagger config
  const enableSwagger = configService.get<boolean>(ENV_KEY.ENABLE_SWAGGER);

  if (enableSwagger) {
    const config = new DocumentBuilder()
      .setTitle('Backend APIs')
      .setDescription('All backend APIs for the product.')
      .setVersion('1.0')
      .addBearerAuth({ type: 'http', in: 'header' })
      .build();

    const document = SwaggerModule.createDocument(app, config);
    const customOptions: SwaggerCustomOptions = {
      swaggerOptions: {
        persistAuthorization: true,
      },
    };
    SwaggerModule.setup('docs', app, document, customOptions);
  }
}

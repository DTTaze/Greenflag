import {
  APP_ENV,
  AuditService,
  AxiosHttpService,
  RedisService,
  StdOutAuditGateway,
  WebhookAuditGateway,
  stringUtils,
  workflows,
} from 'mvc-common-toolkit';
import { appConfig } from 'src/configs/app.config';

import { Global, Logger, Module, Provider } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';

import { INJECTION_TOKEN } from '@shared/constants';

const httpServiceProvider: Provider = {
  provide: INJECTION_TOKEN.HTTP_SERVICE,
  useFactory: () => {
    return new AxiosHttpService();
  },
};

const redisServiceProvider: Provider = {
  provide: INJECTION_TOKEN.REDIS_SERVICE,
  useFactory: (app: ConfigType<typeof appConfig>) => {
    return new RedisService({
      host: app.redisHost,
      port: app.redisPort,
      password: app.redisPassword,
      keyPrefix: app.serviceName,
    });
  },
  inject: [appConfig.KEY],
};

const jwtModuleProvider = JwtModule.registerAsync({
  inject: [appConfig.KEY],
  useFactory: (app: ConfigType<typeof appConfig>) => {
    const logger = new Logger('JwtModule');
    let secret = app.jwtSecret;
    if (!secret) {
      logger.warn(
        'JWT_SECRET config is not set. A random secret will be used, and all JWTs will be invalid after a restart.',
      );

      secret = stringUtils.generatePassword();
    }
    return {
      secret,
      signOptions: {
        expiresIn: app.jwtExpiration,
      },
    };
  },
});

const syncTaskQueueProvider: Provider = {
  provide: INJECTION_TOKEN.SYNC_TASK_QUEUE,
  useFactory: () => {
    return new workflows.SyncTaskQueue();
  },
};

const auditServiceProvider: Provider = {
  provide: INJECTION_TOKEN.AUDIT_SERVICE,
  useFactory: (app: ConfigType<typeof appConfig>) => {
    const isProd = app.nodeEnv === APP_ENV.PRODUCTION;

    const webhookUrl = app.auditWebhookUrl;
    const httpService = new AxiosHttpService();
    const shouldUseWebhook = (webhookUrl && isProd) || !!webhookUrl;

    const gateway = shouldUseWebhook
      ? new WebhookAuditGateway(webhookUrl, httpService, {
          projectName: app.serviceName,
        })
      : new StdOutAuditGateway();

    const auditService = new AuditService(gateway);

    return auditService;
  },
  inject: [appConfig.KEY],
};

@Global()
@Module({
  providers: [
    httpServiceProvider,
    redisServiceProvider,
    syncTaskQueueProvider,
    auditServiceProvider,
  ],
  exports: [
    INJECTION_TOKEN.HTTP_SERVICE,
    INJECTION_TOKEN.REDIS_SERVICE,
    INJECTION_TOKEN.SYNC_TASK_QUEUE,
    jwtModuleProvider,
    auditServiceProvider,
  ],
  imports: [jwtModuleProvider],
})
export class GlobalModule {}

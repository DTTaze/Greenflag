import { appConfig } from 'src/configs/app.config';
import databaseConfig from 'src/configs/database.config';

import { BullModule } from '@nestjs/bullmq';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigType } from '@nestjs/config';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { ScheduleModule } from '@nestjs/schedule';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AuthModule } from '@modules/auth/auth.module';
import { CloudinaryModule } from '@modules/cloudinary/cloudinary.module';
import { CommerceModule } from '@modules/commerce/commerce.module';
import { DeliveryModule } from '@modules/delivery/delivery.module';
import { EmailModule } from '@modules/email/email.module';
import { EventModule } from '@modules/event/event.module';
import { ForumModule } from '@modules/forum/forum.module';
import { GlobalModule } from '@modules/global/global.module';
import { HealthModule } from '@modules/health/health.module';
import { MediaModule } from '@modules/media/media.module';
import { NotificationModule } from '@modules/notification/notification.module';
import { StorageModule } from '@modules/storage/storage.module';
import { SystemConfigModule } from '@modules/system-config/system-config.module';
import { TaskModule } from '@modules/task/task.module';
import { UserModule } from '@modules/user/user.module';

import configs from './configs';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: configs,
      envFilePath: ['.env'],
    }),
    TypeOrmModule.forRootAsync({
      inject: [databaseConfig.KEY],
      useFactory: (dbConfig: ConfigType<typeof databaseConfig>) => ({
        type: 'postgres',
        host: dbConfig.host,
        port: dbConfig.port,
        username: dbConfig.username,
        password: dbConfig.password,
        database: dbConfig.schema,
        autoLoadEntities: true,
        entities: [],
        synchronize: dbConfig.synchronize,
        logging: dbConfig.logging,
      }),
    }),
    EventEmitterModule.forRoot(),
    ScheduleModule.forRoot(),
    BullModule.forRootAsync({
      inject: [appConfig.KEY],
      useFactory: (config: ConfigType<typeof appConfig>) => ({
        connection: {
          host: config.redisHost,
          port: config.redisPort,
          password: config.redisPassword,
        },
      }),
    }),
    GlobalModule,
    HealthModule,
    UserModule,
    AuthModule,
    SystemConfigModule,
    CloudinaryModule,
    TaskModule,
    EmailModule,
    CommerceModule,
    DeliveryModule,
    EventModule,
    MediaModule,
    StorageModule,
    ForumModule,
    NotificationModule,
  ],
})
export class AppModule {}

import databaseConfig from 'src/configs/database.config';

import { Module } from '@nestjs/common';
import { ConfigModule, ConfigType } from '@nestjs/config';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { ScheduleModule } from '@nestjs/schedule';
import { TypeOrmModule } from '@nestjs/typeorm';

import { GlobalModule } from '@modules/global/global.module';
import { HealthModule } from '@modules/health/health.module';

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
    GlobalModule,
    HealthModule,
  ],
})
export class AppModule {}

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { CloudinaryModule } from '@modules/cloudinary/cloudinary.module';
import { UserModule } from '@modules/user/user.module';

import { EventUser } from './entities/event-user.entity';
import { Event } from './entities/event.entity';
import { EventController } from './event.controller';
import { EventUserService } from './services/event-user.service';
import { EventService } from './services/event.service';
import { QrService } from './services/qr.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Event, EventUser]),
    CloudinaryModule,
    UserModule,
  ],
  controllers: [EventController],
  providers: [EventService, EventUserService, QrService],
  exports: [EventService, EventUserService, QrService],
})
export class EventModule {}

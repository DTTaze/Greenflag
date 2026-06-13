import { BullModule } from '@nestjs/bullmq';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Transaction } from '@modules/commerce/entities/transaction.entity';
import { EventUser } from '@modules/event/entities/event-user.entity';
import { Post } from '@modules/forum/entities/post.entity';
import { User } from '@modules/user/entities/user.entity';

import { QUEUE_NAME } from '@shared/constants';

import { NotificationController } from './controllers/notification.controller';
import { Notification } from './entities/notification.entity';
import { NotificationGateway } from './gateways/notification.gateway';
import { NotificationProcessor } from './processors/notification.processor';
import { NotificationService } from './services/notification.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Notification, User, Post, EventUser, Transaction]),
    BullModule.registerQueue({
      name: QUEUE_NAME.NOTIFICATION,
    }),
  ],
  controllers: [NotificationController],
  providers: [NotificationService, NotificationGateway, NotificationProcessor],
  exports: [NotificationService, NotificationGateway, BullModule],
})
export class NotificationModule {}

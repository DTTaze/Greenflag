import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { SystemConfigModule } from '@modules/system-config/system-config.module';
import { UserModule } from '@modules/user/user.module';

import { AdminForumController } from './controllers/admin-forum.controller';
import { ForumController } from './controllers/forum.controller';
import { ModerationCron } from './cron/moderation.cron';
import { PostExpirationCron } from './cron/post-expiration.cron';
import { Event } from '@modules/event/entities/event.entity';
import { CommentVote } from './entities/comment-vote.entity';
import { Comment } from './entities/comment.entity';
import { PostVote } from './entities/post-vote.entity';
import { Post } from './entities/post.entity';
import { CommentService } from './services/comment.service';
import { ModerationService } from './services/moderation.service';
import { NotificationService } from './services/notification.service';
import { PostEventHandlerService } from './services/post-event-handler.service';
import { PostService } from './services/post.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Post, Comment, PostVote, CommentVote, Event]),
    UserModule,
    SystemConfigModule,
  ],
  controllers: [ForumController, AdminForumController],
  providers: [
    PostService,
    CommentService,
    ModerationService,
    PostEventHandlerService,
    PostExpirationCron,
    ModerationCron,
    NotificationService,
  ],
  exports: [
    PostService,
    CommentService,
    ModerationService,
    PostEventHandlerService,
    NotificationService,
  ],
})
export class ForumModule {}

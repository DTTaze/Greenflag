import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { CloudinaryModule } from '@modules/cloudinary/cloudinary.module';
import { Coin } from '@modules/user/entities/coin.entity';
import { UserProfile } from '@modules/user/entities/user-profile.entity';
import { User } from '@modules/user/entities/user.entity';

import { TaskSubmit } from './entities/task-submit.entity';
import { TaskType } from './entities/task-type.entity';
import { TaskUser } from './entities/task-user.entity';
import { Task } from './entities/task.entity';
import { Type } from './entities/type.entity';
import { TaskSubmitService } from './services/task-submit.service';
import { TaskService } from './services/task.service';
import { TaskController } from './task.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Task,
      Type,
      TaskType,
      TaskUser,
      TaskSubmit,
      User,
      Coin,
      UserProfile,
    ]),
    CloudinaryModule,
  ],
  controllers: [TaskController],
  providers: [TaskService, TaskSubmitService],
  exports: [TaskService, TaskSubmitService],
})
export class TaskModule {}

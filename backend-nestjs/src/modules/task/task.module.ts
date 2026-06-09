import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { CloudinaryModule } from '@modules/cloudinary/cloudinary.module';
import { UserModule } from '@modules/user/user.module';

import { AdminTaskController } from './admin-task.controller';
import { TaskSubmit } from './entities/task-submit.entity';
import { TaskType } from './entities/task-type.entity';
import { TaskUser } from './entities/task-user.entity';
import { Task } from './entities/task.entity';
import { Type } from './entities/type.entity';
import { PartnerTaskController } from './partner-task.controller';
import { TaskSubmitService } from './services/task-submit.service';
import { TaskTypeService } from './services/task-type.service';
import { TaskUserService } from './services/task-user.service';
import { TaskService } from './services/task.service';
import { TypeService } from './services/type.service';
import { TaskController } from './task.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([Task, Type, TaskType, TaskUser, TaskSubmit]),
    CloudinaryModule,
    forwardRef(() => UserModule),
  ],
  controllers: [TaskController, PartnerTaskController, AdminTaskController],
  providers: [
    TaskService,
    TaskSubmitService,
    TypeService,
    TaskTypeService,
    TaskUserService,
  ],
  exports: [
    TaskService,
    TaskSubmitService,
    TypeService,
    TaskTypeService,
    TaskUserService,
  ],
})
export class TaskModule {}

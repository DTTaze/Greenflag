import { Repository } from 'typeorm';

import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { BaseCRUDService } from '@shared/services/base-crud.service';

import { TaskUser } from '../entities/task-user.entity';

@Injectable()
export class TaskUserService extends BaseCRUDService<TaskUser> {
  constructor(
    @InjectRepository(TaskUser)
    private readonly taskUserRepository: Repository<TaskUser>,
  ) {
    super(taskUserRepository);
  }
}

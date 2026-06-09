import { Repository } from 'typeorm';

import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { BaseCRUDService } from '@shared/services/base-crud.service';

import { TaskType } from '../entities/task-type.entity';

@Injectable()
export class TaskTypeService extends BaseCRUDService<TaskType> {
  constructor(
    @InjectRepository(TaskType)
    private readonly taskTypeRepository: Repository<TaskType>,
  ) {
    super(taskTypeRepository);
  }
}

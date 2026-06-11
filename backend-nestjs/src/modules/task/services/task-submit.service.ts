import { Repository } from 'typeorm';

import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import {
  OperationResult,
  generateSuccessResult,
} from '@shared/helpers/operation-result.helper';
import { BaseCRUDService } from '@shared/services/base-crud.service';

import { TaskSubmit } from '../entities/task-submit.entity';

@Injectable()
export class TaskSubmitService extends BaseCRUDService<TaskSubmit> {
  constructor(
    @InjectRepository(TaskSubmit)
    private readonly taskSubmitRepository: Repository<TaskSubmit>,
  ) {
    super(taskSubmitRepository);
  }

  async getTaskSubmitByUserId(userId: string): Promise<OperationResult<any[]>> {
    const submits = await this.taskSubmitRepository.find({
      where: {
        taskUser: {
          userId,
        },
      },
      relations: ['taskUser', 'taskUser.task'],
      order: { submittedAt: 'DESC' },
    });

    const mapped = submits.map((submit) => ({
      id: submit.id,
      task_user: {
        progress_count: submit.taskUser.progressCount,
        assigned_at: submit.taskUser.assignedAt,
        task: {
          id: submit.taskUser.task.id,
          title: submit.taskUser.task.title,
          description: submit.taskUser.task.description,
          coins: submit.taskUser.task.coins,
          difficulty: submit.taskUser.task.difficulty,
        },
        user: {
          id: submit.taskUser.userId,
        },
      },
      images: submit.images || [],
    }));

    return generateSuccessResult(mapped);
  }

  async getTaskSubmitByCustomerId(
    customerId: string,
    isAdmin: boolean = false,
  ): Promise<OperationResult<any[]>> {
    const whereCondition = isAdmin
      ? {}
      : {
          taskUser: {
            task: {
              creatorId: customerId,
            },
          },
        };
    const submits = await this.taskSubmitRepository.find({
      where: whereCondition,
      relations: ['taskUser', 'taskUser.task'],
      order: { submittedAt: 'DESC' },
    });

    const mapped = submits.map((submit) => ({
      id: submit.id,
      task_user: {
        progress_count: submit.taskUser.progressCount,
        assigned_at: submit.taskUser.assignedAt,
        task: {
          id: submit.taskUser.task.id,
          title: submit.taskUser.task.title,
          description: submit.taskUser.task.description,
          coins: submit.taskUser.task.coins,
          difficulty: submit.taskUser.task.difficulty,
        },
        user: {
          id: submit.taskUser.userId,
        },
      },
      images: submit.images || [],
    }));

    return generateSuccessResult(mapped);
  }
}

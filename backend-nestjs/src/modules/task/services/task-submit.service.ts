import { Repository } from 'typeorm';

import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { TASK_SUBMIT_STATUS } from '@shared/enums';
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

  async getPendingCount(): Promise<OperationResult<number>> {
    const count = await this.taskSubmitRepository.count({
      where: {
        status: TASK_SUBMIT_STATUS.PENDING,
      },
    });
    return generateSuccessResult(count);
  }

  async getTaskSubmitByUserId(userId: string): Promise<OperationResult<any[]>> {
    const submits = await this.taskSubmitRepository.find({
      where: {
        taskUser: {
          userId,
        },
      },
      relations: ['taskUser', 'taskUser.task', 'taskUser.user', 'taskUser.user.profile'],
      order: { submittedAt: 'DESC' },
    });

    const mapped = submits.map((submit) => ({
      id: submit.id,
      description: submit.description || '',
      status: submit.status,
      submittedAt: submit.submittedAt,
      createdAt: submit.createdAt,
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
          username: submit.taskUser.user?.username,
          email: submit.taskUser.user?.email,
          avatarUrl: submit.taskUser.user?.avatarUrl,
          profile: {
            fullName: submit.taskUser.user?.profile?.fullName,
          },
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
      relations: ['taskUser', 'taskUser.task', 'taskUser.user', 'taskUser.user.profile'],
      order: { submittedAt: 'DESC' },
    });

    const mapped = submits.map((submit) => ({
      id: submit.id,
      description: submit.description || '',
      status: submit.status,
      submittedAt: submit.submittedAt,
      createdAt: submit.createdAt,
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
          username: submit.taskUser.user?.username,
          email: submit.taskUser.user?.email,
          avatarUrl: submit.taskUser.user?.avatarUrl,
          profile: {
            fullName: submit.taskUser.user?.profile?.fullName,
          },
        },
      },
      images: submit.images || [],
    }));

    return generateSuccessResult(mapped);
  }
}

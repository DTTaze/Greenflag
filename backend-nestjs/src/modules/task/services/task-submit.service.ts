import { Repository } from 'typeorm';

import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { TaskSubmit } from '../entities/task-submit.entity';

@Injectable()
export class TaskSubmitService {
  constructor(
    @InjectRepository(TaskSubmit)
    private readonly taskSubmitRepository: Repository<TaskSubmit>,
  ) {}

  async getTaskSubmitByUserId(userId: string) {
    const submits = await this.taskSubmitRepository.find({
      where: {
        taskUser: {
          userId,
        },
      },
      relations: ['taskUser', 'taskUser.task'],
      order: { submittedAt: 'DESC' },
    });

    return submits.map((submit) => ({
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
  }

  async getTaskSubmitByCustomerId(customerId: string) {
    const submits = await this.taskSubmitRepository.find({
      where: {
        taskUser: {
          task: {
            creatorId: customerId,
          },
        },
      },
      relations: ['taskUser', 'taskUser.task'],
      order: { submittedAt: 'DESC' },
    });

    return submits.map((submit) => ({
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
  }
}

import { Repository } from 'typeorm';

import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
  OnModuleInit,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { CloudinaryService } from '@modules/cloudinary/services/cloudinary.service';
import { Coin } from '@modules/user/entities/coin.entity';
import { UserProfile } from '@modules/user/entities/user-profile.entity';
import { User } from '@modules/user/entities/user.entity';

import { getStorageFolder } from '@shared/constants';
import {
  TASK_DIFFICULTY,
  TASK_SUBMIT_STATUS,
  TASK_VISIBILITY,
} from '@shared/enums';
import { BaseCRUDService } from '@shared/services/base-crud.service';

import { CreateTaskDto, UpdateTaskDto } from '../dtos/task.dto';
import { TaskSubmit } from '../entities/task-submit.entity';
import { TaskType } from '../entities/task-type.entity';
import { TaskUser } from '../entities/task-user.entity';
import { Task } from '../entities/task.entity';
import { Type } from '../entities/type.entity';

@Injectable()
export class TaskService extends BaseCRUDService<Task> implements OnModuleInit {
  constructor(
    @InjectRepository(Task)
    private readonly taskRepository: Repository<Task>,
    @InjectRepository(Type)
    private readonly typeRepository: Repository<Type>,
    @InjectRepository(TaskType)
    private readonly taskTypeRepository: Repository<TaskType>,
    @InjectRepository(TaskUser)
    private readonly taskUserRepository: Repository<TaskUser>,
    @InjectRepository(TaskSubmit)
    private readonly taskSubmitRepository: Repository<TaskSubmit>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Coin)
    private readonly coinRepository: Repository<Coin>,
    @InjectRepository(UserProfile)
    private readonly userProfileRepository: Repository<UserProfile>,
    private readonly cloudinaryService: CloudinaryService,
  ) {
    super(taskRepository);
  }

  async onModuleInit() {
    // Check and seed default task types if the table is empty
    const count = await this.typeRepository.count();
    if (count === 0) {
      await this.typeRepository.save([
        { type: 'daily' },
        { type: 'weekly' },
        { type: 'event' },
        { type: 'others' },
      ]);
    }
  }

  async createTask(dto: CreateTaskDto, creatorId: string): Promise<Task> {
    const { title, content, description, coins, difficulty, total, typeIds } =
      dto;

    return this.model.manager.transaction(
      async (transactionalEntityManager) => {
        const task = transactionalEntityManager.create(Task, {
          title,
          content,
          description,
          coins,
          difficulty,
          total: total ?? 1,
          creatorId,
          status: TASK_VISIBILITY.PUBLIC,
        });

        const savedTask = await transactionalEntityManager.save(Task, task);

        if (typeIds && typeIds.length > 0) {
          const taskTypes = typeIds.map((typeId) =>
            transactionalEntityManager.create(TaskType, {
              taskId: savedTask.id,
              typeId,
            }),
          );
          await transactionalEntityManager.save(TaskType, taskTypes);
        }

        return savedTask;
      },
    );
  }

  async getAllTasks(): Promise<Task[]> {
    return this.taskRepository.find({
      relations: ['creator', 'creator.profile'],
      order: { createdAt: 'DESC' },
    });
  }

  async getTaskById(id: string): Promise<Task> {
    const task = await this.model.findOne({
      where: { id },
      relations: ['creator', 'creator.profile', 'taskTypes', 'taskTypes.type'],
    });
    if (!task) {
      throw new NotFoundException('Task not found');
    }
    return task;
  }

  async updateTask(id: string, dto: UpdateTaskDto): Promise<Task> {
    const task = await this.getTaskById(id);

    return this.model.manager.transaction(
      async (transactionalEntityManager) => {
        const { typeIds, ...updateFields } = dto;

        Object.assign(task, updateFields);
        await transactionalEntityManager.save(Task, task);

        if (typeIds !== undefined) {
          // Clear old mappings
          await transactionalEntityManager.delete(TaskType, { taskId: id });

          if (typeIds.length > 0) {
            const taskTypes = typeIds.map((typeId) =>
              transactionalEntityManager.create(TaskType, {
                taskId: id,
                typeId,
              }),
            );
            await transactionalEntityManager.save(TaskType, taskTypes);
          }
        }

        return this.getTaskById(id);
      },
    );
  }

  async deleteTask(id: string): Promise<void> {
    const task = await this.taskRepository.findOne({ where: { id } });
    if (!task) {
      throw new NotFoundException('Task not found');
    }
    await this.taskRepository.softDelete({ id });
  }

  async acceptTask(taskId: string, userId: string): Promise<TaskUser> {
    const task = await this.taskRepository.findOne({ where: { id: taskId } });
    if (!task) {
      throw new NotFoundException('Task not found');
    }
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    const existingTaskUser = await this.taskUserRepository.findOne({
      where: { userId, taskId },
    });

    if (existingTaskUser) {
      return existingTaskUser;
    }

    const taskUser = this.taskUserRepository.create({
      userId,
      taskId,
      progressCount: 0,
      assignedAt: new Date(),
    });

    return this.taskUserRepository.save(taskUser);
  }

  async submitTask(
    taskId: string,
    userId: string,
    description: string,
    files: Express.Multer.File[],
  ): Promise<{ taskSubmit: TaskSubmit; images: string[] }> {
    const taskUser = await this.acceptTask(taskId, userId);

    if (!files || files.length === 0) {
      throw new BadRequestException('No files provided.');
    }

    // Upload to Cloudinary
    const imageUrls: string[] = [];
    for (const file of files) {
      const uploadResult = await this.cloudinaryService.uploadImage(
        file,
        getStorageFolder().TASK_SUBMIT,
      );
      if (uploadResult && uploadResult.secure_url) {
        imageUrls.push(uploadResult.secure_url);
      }
    }

    const taskSubmit = this.taskSubmitRepository.create({
      taskUserId: taskUser.id,
      description: description || '',
      status: TASK_SUBMIT_STATUS.PENDING,
      submittedAt: new Date(),
      images: imageUrls,
    });

    const savedSubmit = await this.taskSubmitRepository.save(taskSubmit);

    return {
      taskSubmit: savedSubmit,
      images: imageUrls,
    };
  }

  async completeTask(taskUser: TaskUser, user: User): Promise<void> {
    taskUser.completedAt = new Date();
    await this.taskUserRepository.save(taskUser);

    let newStreak = user.profile?.streak || 0;
    if (user.profile?.lastCompletedTask) {
      const lastCompletedTaskDate = new Date(user.profile.lastCompletedTask);
      lastCompletedTaskDate.setHours(0, 0, 0, 0);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const differenceInDays =
        (today.getTime() - lastCompletedTaskDate.getTime()) /
        (1000 * 60 * 60 * 24);

      if (differenceInDays > 1) {
        newStreak = 1;
      } else if (differenceInDays === 1) {
        newStreak += 1;
      }
    } else {
      newStreak = 1;
    }

    if (user.profile) {
      user.profile.streak = newStreak;
      user.profile.lastCompletedTask = new Date();
      await this.userProfileRepository.save(user.profile);
    }

    // Fetch coins configuration from task
    const task = await this.taskRepository.findOne({
      where: { id: taskUser.taskId },
    });
    if (task) {
      const coin = await this.coinRepository.findOne({
        where: { userId: user.id },
      });
      if (coin) {
        coin.amount += task.coins;
        await this.coinRepository.save(coin);
      }
    }
  }

  async increaseProgressCount(taskUserId: string): Promise<TaskUser> {
    const taskUser = await this.taskUserRepository.findOne({
      where: { id: taskUserId },
      relations: ['task'],
    });

    if (!taskUser) {
      throw new NotFoundException('Task user not found.');
    }
    if (!taskUser.task) {
      throw new NotFoundException('Task not found.');
    }
    if (taskUser.progressCount >= taskUser.task.total) {
      throw new BadRequestException('Task is already completed.');
    }

    taskUser.progressCount += 1;
    const updated = await this.taskUserRepository.save(taskUser);

    if (updated.progressCount >= taskUser.task.total) {
      const user = await this.userRepository.findOne({
        where: { id: taskUser.userId },
        relations: ['profile'],
      });
      if (!user) {
        throw new NotFoundException('User not found.');
      }
      await this.completeTask(updated, user);
    }

    return updated;
  }

  async updateDecisionTaskSubmit(
    taskSubmitId: string,
    decision: TASK_SUBMIT_STATUS,
  ): Promise<TaskSubmit> {
    if (
      decision !== TASK_SUBMIT_STATUS.APPROVED &&
      decision !== TASK_SUBMIT_STATUS.REJECTED
    ) {
      throw new BadRequestException(
        "Decision must be either 'approved' or 'rejected'.",
      );
    }

    const taskSubmit = await this.taskSubmitRepository.findOne({
      where: { id: taskSubmitId },
      relations: ['taskUser'],
    });

    if (!taskSubmit) {
      throw new NotFoundException('Task submit not found.');
    }

    taskSubmit.status = decision;
    const updated = await this.taskSubmitRepository.save(taskSubmit);

    if (decision === TASK_SUBMIT_STATUS.APPROVED) {
      await this.increaseProgressCount(taskSubmit.taskUserId);
    }

    return updated;
  }

  async getAllTasksByTypeName(typeName: string): Promise<Task[]> {
    const type = await this.typeRepository.findOne({
      where: { type: typeName },
    });
    if (!type) return [];

    const taskTypes = await this.taskTypeRepository.find({
      where: { typeId: type.id },
      relations: ['task', 'task.creator', 'task.creator.profile'],
    });

    return taskTypes.map((tt) => tt.task).filter(Boolean);
  }

  async getAllTasksByDifficultyName(
    difficultyName: TASK_DIFFICULTY,
  ): Promise<Task[]> {
    return this.taskRepository.find({
      where: { difficulty: difficultyName },
      relations: ['creator', 'creator.profile'],
    });
  }

  async getAllTasksStatusPublic(): Promise<Task[]> {
    return this.taskRepository.find({
      where: { status: TASK_VISIBILITY.PUBLIC },
      relations: ['creator', 'creator.profile'],
    });
  }

  async getAllTasksOfCustomer(customerId: string): Promise<Task[]> {
    return this.taskRepository.find({
      where: { creatorId: customerId },
      relations: ['creator', 'creator.profile'],
    });
  }

  async changeTaskStatus(
    taskId: string,
    status: TASK_VISIBILITY,
  ): Promise<Task> {
    const task = await this.getTaskById(taskId);
    task.status = status;
    return this.taskRepository.save(task);
  }

  async getCompletedTasksByUserId(userId: string): Promise<Task[]> {
    const taskUsers = await this.taskUserRepository.find({
      where: { userId },
      relations: ['task'],
    });

    const completed: Task[] = [];
    for (const tu of taskUsers) {
      if (tu.task && tu.progressCount >= tu.task.total) {
        completed.push(tu.task);
      }
    }
    return completed;
  }

  async getAllTasksByUserId(userId: string): Promise<TaskUser[]> {
    return this.taskUserRepository.find({
      where: { userId },
      relations: ['task'],
    });
  }
}

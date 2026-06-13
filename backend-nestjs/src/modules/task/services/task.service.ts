import { EntityManager, Repository } from 'typeorm';

import { Inject, Injectable, OnModuleInit, forwardRef } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { InjectRepository } from '@nestjs/typeorm';

import { CloudinaryService } from '@modules/cloudinary/services/cloudinary.service';
import { Coin } from '@modules/user/entities/coin.entity';
import { User } from '@modules/user/entities/user.entity';
import { CoinService } from '@modules/user/services/coin.service';
import { UserProfileService } from '@modules/user/services/user-profile.service';
import { UserService } from '@modules/user/services/user.service';

import { ERR_CODE, EVENT_KEYS, getStorageFolder } from '@shared/constants';
import {
  ROLE,
  TASK_DIFFICULTY,
  TASK_SUBMIT_STATUS,
  TASK_VISIBILITY,
} from '@shared/enums';
import {
  OperationResult,
  generateBadRequestResult,
  generateForbiddenResult,
  generateNotFoundResult,
  generateSuccessResult,
} from '@shared/helpers/operation-result.helper';
import { BaseCRUDService } from '@shared/services/base-crud.service';

import { CreateTaskDto, UpdateTaskDto } from '../dtos/task.dto';
import { TaskSubmit } from '../entities/task-submit.entity';
import { TaskType } from '../entities/task-type.entity';
import { TaskUser } from '../entities/task-user.entity';
import { Task } from '../entities/task.entity';
import { Type } from '../entities/type.entity';
import { TaskSubmitService } from './task-submit.service';
import { TaskTypeService } from './task-type.service';
import { TaskUserService } from './task-user.service';
import { TypeService } from './type.service';

@Injectable()
export class TaskService extends BaseCRUDService<Task> implements OnModuleInit {
  constructor(
    @InjectRepository(Task)
    private readonly taskRepository: Repository<Task>,
    private readonly typeService: TypeService,
    private readonly taskTypeService: TaskTypeService,
    private readonly taskUserService: TaskUserService,
    private readonly taskSubmitService: TaskSubmitService,
    @Inject(forwardRef(() => UserService))
    private readonly userService: UserService,
    @Inject(forwardRef(() => CoinService))
    private readonly coinService: CoinService,
    @Inject(forwardRef(() => UserProfileService))
    private readonly userProfileService: UserProfileService,
    private readonly cloudinaryService: CloudinaryService,
    private readonly eventEmitter: EventEmitter2,
  ) {
    super(taskRepository);
  }

  async onModuleInit() {
    const countRes = await this.typeService.count({});
    const count = countRes.success ? countRes.data : 0;
    if (count === 0) {
      await this.typeService.create({ type: 'daily' });
      await this.typeService.create({ type: 'weekly' });
      await this.typeService.create({ type: 'event' });
      await this.typeService.create({ type: 'others' });
    }
  }

  async createTask(
    dto: CreateTaskDto,
    creatorId: string,
  ): Promise<OperationResult<Task>> {
    const { title, content, description, coins, difficulty, total, typeIds } =
      dto;

    let finalTypeIds = typeIds;
    if (dto.type) {
      const typeRes = await this.typeService.findOne({ type: dto.type });
      if (typeRes.success && typeRes.data) {
        finalTypeIds = [typeRes.data.id];
      }
    }
    if (!finalTypeIds || finalTypeIds.length === 0) {
      const defaultTypeRes = await this.typeService.findOne({ type: 'others' });
      if (defaultTypeRes.success && defaultTypeRes.data) {
        finalTypeIds = [defaultTypeRes.data.id];
      }
    }

    const savedTask = await this.model.manager.transaction(
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

        const saved = await transactionalEntityManager.save(Task, task);

        if (finalTypeIds && finalTypeIds.length > 0) {
          const taskTypes = finalTypeIds.map((typeId) =>
            transactionalEntityManager.create(TaskType, {
              taskId: saved.id,
              typeId,
            }),
          );
          await transactionalEntityManager.save(TaskType, taskTypes);
        }

        return saved;
      },
    );

    const creatorRes = await this.userService.getUserByID(creatorId);
    if (creatorRes.success && creatorRes.data && creatorRes.data.role === ROLE.ADMIN) {
      this.eventEmitter.emit(EVENT_KEYS.TASK_CREATED, {
        taskId: savedTask.id,
        taskTitle: savedTask.title,
        creatorId,
      });
    }

    return generateSuccessResult(savedTask);
  }

  async getAllTasks(withDeleted = false): Promise<OperationResult<Task[]>> {
    const tasks = await this.taskRepository.find({
      relations: ['creator', 'creator.profile'],
      order: { createdAt: 'DESC' },
      withDeleted,
    });
    return generateSuccessResult(tasks);
  }

  async getTaskById(id: string): Promise<OperationResult<Task>> {
    const task = await this.model.findOne({
      where: { id },
      relations: ['creator', 'creator.profile', 'taskTypes', 'taskTypes.type'],
    });
    if (!task) {
      return generateNotFoundResult('Task not found', ERR_CODE.TASK_NOT_FOUND);
    }
    return generateSuccessResult(task);
  }

  async updateTask(
    id: string,
    dto: UpdateTaskDto,
    currentUserId?: string,
    isAdmin: boolean = false,
  ): Promise<OperationResult<Task>> {
    const taskResult = await this.getTaskById(id);
    if (!taskResult.success) {
      return taskResult;
    }
    const task = taskResult.data;

    if (!isAdmin && currentUserId && task.creatorId !== currentUserId) {
      return generateForbiddenResult(
        'Bạn không có quyền chỉnh sửa nhiệm vụ của người khác',
        ERR_CODE.FORBIDDEN,
      );
    }

    const savedTask = await this.model.manager.transaction(
      async (transactionalEntityManager) => {
        const { typeIds, type, ...updateFields } = dto;

        Object.assign(task, updateFields);
        await transactionalEntityManager.save(Task, task);

        let finalTypeIds = typeIds;
        if (type !== undefined) {
          if (type) {
            const typeRes = await this.typeService.findOne({ type });
            if (typeRes.success && typeRes.data) {
              finalTypeIds = [typeRes.data.id];
            }
          } else {
            finalTypeIds = [];
          }
        }

        if (finalTypeIds !== undefined) {
          // Clear old mappings
          await transactionalEntityManager.delete(TaskType, { taskId: id });

          if (finalTypeIds.length > 0) {
            const taskTypes = finalTypeIds.map((typeId) =>
              transactionalEntityManager.create(TaskType, {
                taskId: id,
                typeId,
              }),
            );
            await transactionalEntityManager.save(TaskType, taskTypes);
          }
        }

        const freshTask = await transactionalEntityManager.findOne(Task, {
          where: { id },
          relations: [
            'creator',
            'creator.profile',
            'taskTypes',
            'taskTypes.type',
          ],
        });
        return freshTask!;
      },
    );

    return generateSuccessResult(savedTask);
  }

  async deleteTask(
    id: string,
    currentUserId?: string,
    isAdmin: boolean = false,
  ): Promise<OperationResult<void>> {
    const task = await this.taskRepository.findOne({ where: { id } });
    if (!task) {
      return generateNotFoundResult('Task not found', ERR_CODE.TASK_NOT_FOUND);
    }
    if (!isAdmin && currentUserId && task.creatorId !== currentUserId) {
      return generateForbiddenResult(
        'Bạn không có quyền xóa nhiệm vụ của người khác',
        ERR_CODE.FORBIDDEN,
      );
    }
    await this.taskRepository.softDelete({ id });
    return generateSuccessResult(undefined);
  }

  async acceptTask(
    taskId: string,
    userId: string,
  ): Promise<OperationResult<TaskUser>> {
    const task = await this.taskRepository.findOne({ where: { id: taskId } });
    if (!task) {
      return generateNotFoundResult('Task not found', ERR_CODE.TASK_NOT_FOUND);
    }
    const userResult = await this.userService.getUserByID(userId);
    if (!userResult.success) {
      return generateNotFoundResult('User not found', ERR_CODE.USER_NOT_FOUND);
    }

    const existingTaskUserRes = await this.taskUserService.findOne({
      userId,
      taskId,
    });

    if (existingTaskUserRes.success && existingTaskUserRes.data) {
      return generateSuccessResult(existingTaskUserRes.data);
    }

    const taskUserRes = await this.taskUserService.create({
      userId,
      taskId,
      progressCount: 0,
      assignedAt: new Date(),
    });

    if (!taskUserRes.success || !taskUserRes.data) {
      return OperationResult.fail(
        taskUserRes.code || 'create_failed',
        taskUserRes.message,
      );
    }

    return generateSuccessResult(taskUserRes.data);
  }

  async submitTask(
    taskId: string,
    userId: string,
    description: string,
    files: Express.Multer.File[],
  ): Promise<OperationResult<{ taskSubmit: TaskSubmit; images: string[] }>> {
    const acceptResult = await this.acceptTask(taskId, userId);
    if (!acceptResult.success) {
      return OperationResult.fail(
        acceptResult.code || ERR_CODE.BAD_REQUEST,
        acceptResult.message,
      );
    }
    const taskUser = acceptResult.data;

    if (!files || files.length === 0) {
      return generateBadRequestResult(
        'No files provided.',
        ERR_CODE.BAD_REQUEST,
      );
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

    const taskSubmitRes = await this.taskSubmitService.create({
      taskUserId: taskUser.id,
      description: description || '',
      status: TASK_SUBMIT_STATUS.PENDING,
      submittedAt: new Date(),
      images: imageUrls,
    });

    if (!taskSubmitRes.success || !taskSubmitRes.data) {
      return OperationResult.fail(
        taskSubmitRes.code || 'create_failed',
        taskSubmitRes.message,
      );
    }

    try {
      const task = await this.taskRepository.findOne({ where: { id: taskId } });
      const userRes = await this.userService.getUserByID(userId);
      if (task && userRes.success) {
        const user = userRes.data;
        const userFullName = user.profile?.fullName || user.username || 'Người dùng';
        this.eventEmitter.emit(EVENT_KEYS.TASK_SUBMITTED, {
          submissionId: taskSubmitRes.data.id,
          userId,
          userFullName,
          taskId,
          taskTitle: task.title,
          creatorId: task.creatorId,
        });
      }
    } catch (err) {
      // Ignore or log error to prevent breaking user flow on notification emission errors
    }

    return generateSuccessResult({
      taskSubmit: taskSubmitRes.data,
      images: imageUrls,
    });
  }

  async completeTask(
    taskUser: TaskUser,
    user: User,
  ): Promise<OperationResult<void>> {
    return this.taskRepository.manager.transaction(async (manager) => {
      taskUser.completedAt = new Date();
      await manager.save(TaskUser, taskUser);

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
        await manager.save(user.profile);
      }

      const task = await manager.findOne(Task, {
        where: { id: taskUser.taskId },
      });
      if (task) {
        const userCoin = await manager.findOne(Coin, {
          where: { userId: user.id },
          lock: { mode: 'pessimistic_write' },
        });

        if (userCoin) {
          userCoin.amount += task.coins;
          await manager.save(Coin, userCoin);

          // Emit coin received event
          try {
            this.eventEmitter.emit(EVENT_KEYS.NOTIFICATION_COIN_RECEIVED, {
              userId: user.id,
              amount: task.coins,
              reason: `Hoàn thành nhiệm vụ: ${task.title}`,
            });
          } catch (err) {
            console.error('Error emitting task coin notification:', err);
          }
        }
      }

      return generateSuccessResult(undefined);
    });
  }

  async increaseProgressCount(
    taskUserId: string,
  ): Promise<OperationResult<TaskUser>> {
    try {
      const result = await this.taskRepository.manager.transaction(
        async (manager) => {
          // 1. Lock and find TaskUser (without relations to avoid outer join FOR UPDATE locking error)
          const taskUser = await manager.findOne(TaskUser, {
            where: { id: taskUserId },
            lock: { mode: 'pessimistic_write' },
          });

          if (!taskUser) {
            return generateNotFoundResult(
              'Task user not found.',
              ERR_CODE.TASK_USER_NOT_FOUND,
            );
          }

          // Fetch task relation separately
          taskUser.task = await manager.findOne(Task, {
            where: { id: taskUser.taskId },
          });

          if (!taskUser.task) {
            return generateNotFoundResult(
              'Task not found.',
              ERR_CODE.TASK_NOT_FOUND,
            );
          }

          if (
            taskUser.completedAt ||
            taskUser.progressCount >= taskUser.task.total
          ) {
            return generateBadRequestResult(
              'Task is already completed.',
              ERR_CODE.TASK_COMPLETED,
            );
          }

          taskUser.progressCount += 1;

          if (taskUser.progressCount >= taskUser.task.total) {
            taskUser.completedAt = new Date();

            const userResult = await this.userService.getUserByID(
              taskUser.userId,
            );
            if (!userResult.success || !userResult.data) {
              return generateNotFoundResult(
                'User not found.',
                ERR_CODE.USER_NOT_FOUND,
              );
            }
            const user = userResult.data;

            // Streak logic
            let newStreak = user.profile?.streak || 0;
            if (user.profile?.lastCompletedTask) {
              const lastCompletedTaskDate = new Date(
                user.profile.lastCompletedTask,
              );
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
              await manager.save(user.profile);
            }

            // Coin reward logic: Lock Coin row and increment atomically
            const userCoin = await manager.findOne(Coin, {
              where: { userId: user.id },
              lock: { mode: 'pessimistic_write' },
            });

            if (userCoin) {
              userCoin.amount += taskUser.task.coins;
              await manager.save(Coin, userCoin);

              // Emit coin received event
              try {
                this.eventEmitter.emit(EVENT_KEYS.NOTIFICATION_COIN_RECEIVED, {
                  userId: user.id,
                  amount: taskUser.task.coins,
                  reason: `Hoàn thành nhiệm vụ: ${taskUser.task.title}`,
                });
              } catch (err) {
                console.error(
                  'Error emitting task progress coin notification:',
                  err,
                );
              }
            }
          }

          const savedTaskUser = await manager.save(TaskUser, taskUser);
          return generateSuccessResult(savedTaskUser);
        },
      );

      return result;
    } catch (error) {
      return OperationResult.fail(
        ERR_CODE.INTERNAL_SERVER_ERROR,
        error.message,
      );
    }
  }

  async updateDecisionTaskSubmit(
    taskSubmitId: string,
    decision: TASK_SUBMIT_STATUS,
    currentUserId?: string,
    isAdmin: boolean = false,
  ): Promise<OperationResult<TaskSubmit>> {
    if (
      decision !== TASK_SUBMIT_STATUS.APPROVED &&
      decision !== TASK_SUBMIT_STATUS.REJECTED
    ) {
      return generateBadRequestResult(
        "Decision must be either 'approved' or 'rejected'.",
        ERR_CODE.BAD_REQUEST,
      );
    }

    const taskSubmitRes = await this.taskSubmitService.findOne(
      { id: taskSubmitId },
      { relations: { taskUser: { task: true } } },
    );

    if (!taskSubmitRes.success || !taskSubmitRes.data) {
      return generateNotFoundResult(
        'Task submit not found.',
        ERR_CODE.TASK_SUBMIT_NOT_FOUND,
      );
    }
    const taskSubmit = taskSubmitRes.data;

    if (
      !isAdmin &&
      currentUserId &&
      taskSubmit.taskUser?.task?.creatorId !== currentUserId
    ) {
      return generateForbiddenResult(
        'Bạn không có quyền duyệt bài nộp của nhiệm vụ người khác',
        ERR_CODE.FORBIDDEN,
      );
    }

    taskSubmit.status = decision;
    const updatedRes = await this.taskSubmitService.updateByID(taskSubmit.id, {
      status: decision,
    });
    if (!updatedRes.success || !updatedRes.data) {
      return OperationResult.fail(
        updatedRes.code || 'update_failed',
        updatedRes.message,
      );
    }
    const updated = updatedRes.data;
    // Restore relation
    updated.taskUser = taskSubmit.taskUser;

    if (decision === TASK_SUBMIT_STATUS.APPROVED) {
      const progressResult = await this.increaseProgressCount(
        taskSubmit.taskUserId,
      );
      if (!progressResult.success) {
        return OperationResult.fail(
          progressResult.code || ERR_CODE.BAD_REQUEST,
          progressResult.message,
        );
      }
    }

    if (taskSubmit.taskUser) {
      this.eventEmitter.emit(EVENT_KEYS.TASK_MODERATED, {
        submissionId: taskSubmit.id,
        taskId: taskSubmit.taskUser.taskId || taskSubmit.taskUser.task?.id,
        taskTitle: taskSubmit.taskUser.task?.title || 'nhiệm vụ',
        userId: taskSubmit.taskUser.userId,
        decision,
      });
    }

    return generateSuccessResult(updated);
  }

  async getAllTasksByTypeName(
    typeName: string,
  ): Promise<OperationResult<Task[]>> {
    const typeRes = await this.typeService.findOne({ type: typeName });
    if (!typeRes.success || !typeRes.data) {
      return generateSuccessResult([]);
    }
    const type = typeRes.data;

    const taskTypesRes = await this.taskTypeService.findAll(
      { typeId: type.id },
      { relations: { task: { creator: { profile: true } } } },
    );
    if (!taskTypesRes.success || !taskTypesRes.data) {
      return generateSuccessResult([]);
    }
    const taskTypes = taskTypesRes.data;

    const tasks = taskTypes.map((tt) => tt.task).filter(Boolean);
    return generateSuccessResult(tasks);
  }

  async getAllTasksByDifficultyName(
    difficultyName: TASK_DIFFICULTY,
  ): Promise<OperationResult<Task[]>> {
    const tasks = await this.taskRepository.find({
      where: { difficulty: difficultyName },
      relations: ['creator', 'creator.profile'],
    });
    return generateSuccessResult(tasks);
  }

  async getAllTasksStatusPublic(): Promise<OperationResult<Task[]>> {
    const tasks = await this.taskRepository.find({
      where: { status: TASK_VISIBILITY.PUBLIC },
      relations: ['creator', 'creator.profile'],
    });
    return generateSuccessResult(tasks);
  }

  async getAllTasksOfCustomer(
    customerId: string,
    isAdmin: boolean = false,
  ): Promise<OperationResult<Task[]>> {
    const whereCondition = isAdmin ? {} : { creatorId: customerId };
    const tasks = await this.taskRepository.find({
      where: whereCondition,
      relations: ['creator', 'creator.profile'],
    });
    return generateSuccessResult(tasks);
  }

  async changeTaskStatus(
    taskId: string,
    status: TASK_VISIBILITY,
    currentUserId?: string,
    isAdmin: boolean = false,
  ): Promise<OperationResult<Task>> {
    const taskResult = await this.getTaskById(taskId);
    if (!taskResult.success) {
      return taskResult;
    }
    const task = taskResult.data;

    if (!isAdmin && currentUserId && task.creatorId !== currentUserId) {
      return generateForbiddenResult(
        'Bạn không có quyền chỉnh sửa trạng thái nhiệm vụ của người khác',
        ERR_CODE.FORBIDDEN,
      );
    }
    task.status = status;
    const saved = await this.taskRepository.save(task);
    return generateSuccessResult(saved);
  }

  async getCompletedTasksByUserId(
    userId: string,
  ): Promise<OperationResult<Task[]>> {
    const taskUsersRes = await this.taskUserService.findAll(
      { userId },
      { relations: { task: true } },
    );
    if (!taskUsersRes.success || !taskUsersRes.data) {
      return generateSuccessResult([]);
    }
    const taskUsers = taskUsersRes.data;

    const completed: Task[] = [];
    for (const tu of taskUsers) {
      if (tu.task && tu.progressCount >= tu.task.total) {
        completed.push(tu.task);
      }
    }
    return generateSuccessResult(completed);
  }

  async getAllTasksByUserId(
    userId: string,
  ): Promise<OperationResult<TaskUser[]>> {
    const taskUsersRes = await this.taskUserService.findAll(
      { userId },
      { relations: { task: true } },
    );
    if (!taskUsersRes.success || !taskUsersRes.data) {
      return generateSuccessResult([]);
    }
    const taskUsers = taskUsersRes.data;
    return generateSuccessResult(taskUsers);
  }

  async getAllTaskTypes(): Promise<OperationResult<Type[]>> {
    return this.typeService.findAll();
  }
}

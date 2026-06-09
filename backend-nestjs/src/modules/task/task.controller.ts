import { HttpResponse } from 'mvc-common-toolkit';

import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';

import { RequestUser } from '@shared/decorators/request-user.decorator';
import { TASK_DIFFICULTY } from '@shared/enums';
import { AuthGuard } from '@shared/guards/auth.guard';

import { SubmitTaskDto } from './dtos/task.dto';
import { TaskSubmitService } from './services/task-submit.service';
import { TaskService } from './services/task.service';

@ApiTags('Tasks')
@ApiBearerAuth()
@Controller('tasks')
export class TaskController {
  constructor(
    private readonly taskService: TaskService,
    private readonly taskSubmitService: TaskSubmitService,
  ) {}

  @Get()
  @ApiOperation({ summary: 'Get list of tasks' })
  async getAllTasks(): Promise<HttpResponse> {
    return this.taskService.getAllTasks();
  }

  @Get('type/:type_name')
  @ApiOperation({ summary: 'Get task by type name' })
  async getAllTasksByTypeName(
    @Param('type_name') typeName: string,
  ): Promise<HttpResponse> {
    return this.taskService.getAllTasksByTypeName(typeName);
  }

  @Get('difficulty/:difficulty_name')
  @ApiOperation({ summary: 'Get task by difficulty name' })
  async getAllTasksByDifficultyName(
    @Param('difficulty_name') difficultyName: TASK_DIFFICULTY,
  ): Promise<HttpResponse> {
    return this.taskService.getAllTasksByDifficultyName(difficultyName);
  }

  @Get('submissions/user/:user_id')
  @UseGuards(AuthGuard)
  @ApiOperation({ summary: 'Get task submit by user ID' })
  async getTaskSubmitByUserId(
    @Param('user_id') userId: string,
  ): Promise<HttpResponse> {
    return this.taskSubmitService.getTaskSubmitByUserId(userId);
  }

  @Get('status/public')
  @ApiOperation({ summary: 'Get all tasks status public' })
  async getAllTasksStatusPublic(): Promise<HttpResponse> {
    return this.taskService.getAllTasksStatusPublic();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get task by ID' })
  async getTaskById(@Param('id') id: string): Promise<HttpResponse> {
    return this.taskService.getTaskById(id);
  }

  @Post('accept/:id')
  @UseGuards(AuthGuard)
  @ApiOperation({ summary: 'Accept a task' })
  async acceptTask(
    @Param('id') id: string,
    @RequestUser() reqUser: any,
  ): Promise<HttpResponse> {
    return this.taskService.acceptTask(id, reqUser.id);
  }

  @Post('progress/increase/:task_user_id')
  @UseGuards(AuthGuard)
  @ApiOperation({ summary: 'Increase progress count of a task' })
  async increaseProgressCount(
    @Param('task_user_id') taskUserId: string,
  ): Promise<HttpResponse> {
    return this.taskService.increaseProgressCount(taskUserId);
  }

  @Post('submit/:task_id')
  @UseGuards(AuthGuard)
  @UseInterceptors(FilesInterceptor('images', 5))
  @ApiOperation({ summary: 'Submit a task' })
  async submitTask(
    @Param('task_id') taskId: string,
    @Body() dto: SubmitTaskDto,
    @UploadedFiles() files: Express.Multer.File[],
    @RequestUser() reqUser: any,
  ): Promise<HttpResponse> {
    return this.taskService.submitTask(
      taskId,
      reqUser.id,
      dto.description || '',
      files,
    );
  }
}

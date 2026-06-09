import { HttpResponse } from 'mvc-common-toolkit';

import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';

import { RequestUser } from '@shared/decorators/request-user.decorator';
import { Roles } from '@shared/decorators/roles.decorator';
import { ROLE, TASK_DIFFICULTY } from '@shared/enums';
import { AuthGuard } from '@shared/guards/auth.guard';
import { RolesGuard } from '@shared/guards/roles.guard';
import { generateForbiddenResult } from '@shared/helpers/operation-result.helper';

import {
  ChangeTaskStatusDto,
  CreateTaskDto,
  DecisionTaskSubmitDto,
  SubmitTaskDto,
  UpdateTaskDto,
} from './dtos/task.dto';
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
    const data = await this.taskService.getAllTasks();
    return {
      success: true,
      data,
    };
  }

  @Get('customer')
  @UseGuards(AuthGuard)
  @ApiOperation({ summary: 'Get all tasks of customer' })
  async getAllTasksOfCustomer(
    @RequestUser() reqUser: any,
  ): Promise<HttpResponse> {
    const data = await this.taskService.getAllTasksOfCustomer(reqUser.id);
    return {
      success: true,
      data,
    };
  }

  @Get('type/:type_name')
  @ApiOperation({ summary: 'Get task by type name' })
  async getAllTasksByTypeName(
    @Param('type_name') typeName: string,
  ): Promise<HttpResponse> {
    const data = await this.taskService.getAllTasksByTypeName(typeName);
    return {
      success: true,
      data,
    };
  }

  @Get('difficulty/:difficulty_name')
  @ApiOperation({ summary: 'Get task by difficulty name' })
  async getAllTasksByDifficultyName(
    @Param('difficulty_name') difficultyName: TASK_DIFFICULTY,
  ): Promise<HttpResponse> {
    const data =
      await this.taskService.getAllTasksByDifficultyName(difficultyName);
    return {
      success: true,
      data,
    };
  }

  @Get('submit/user/:user_id')
  @ApiOperation({ summary: 'Get task submit by user ID' })
  async getTaskSubmitByUserId(
    @Param('user_id') userId: string,
  ): Promise<HttpResponse> {
    const data = await this.taskSubmitService.getTaskSubmitByUserId(userId);
    return {
      success: true,
      data,
    };
  }

  @Get('submit/customer/:customer_id')
  @ApiOperation({ summary: 'Get task submit by customer ID' })
  async getTaskSubmitByCustomerId(
    @Param('customer_id') customerId: string,
  ): Promise<HttpResponse> {
    const data =
      await this.taskSubmitService.getTaskSubmitByCustomerId(customerId);
    return {
      success: true,
      data,
    };
  }

  @Get('status/public')
  @ApiOperation({ summary: 'Get all tasks status public' })
  async getAllTasksStatusPublic(): Promise<HttpResponse> {
    const data = await this.taskService.getAllTasksStatusPublic();
    return {
      success: true,
      data,
    };
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get task by ID' })
  async getTaskById(@Param('id') id: string): Promise<HttpResponse> {
    const data = await this.taskService.getTaskById(id);
    return {
      success: true,
      data,
    };
  }

  @Post('upload')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(ROLE.ADMIN, ROLE.PARTNER)
  @ApiOperation({ summary: 'Create a task' })
  async createTask(
    @Body() dto: CreateTaskDto,
    @RequestUser() reqUser: any,
  ): Promise<HttpResponse> {
    const data = await this.taskService.createTask(dto, reqUser.id);
    return {
      success: true,
      data,
    };
  }

  @Post('accept/:id')
  @UseGuards(AuthGuard)
  @ApiOperation({ summary: 'Accept a task' })
  async acceptTask(
    @Param('id') id: string,
    @RequestUser() reqUser: any,
  ): Promise<HttpResponse> {
    const data = await this.taskService.acceptTask(id, reqUser.id);
    return {
      success: true,
      data,
    };
  }

  @Post('progress/increase/:task_user_id')
  @UseGuards(AuthGuard)
  @ApiOperation({ summary: 'Increase progress count of a task' })
  async increaseProgressCount(
    @Param('task_user_id') taskUserId: string,
  ): Promise<HttpResponse> {
    const data = await this.taskService.increaseProgressCount(taskUserId);
    return {
      success: true,
      data,
    };
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
    const data = await this.taskService.submitTask(
      taskId,
      reqUser.id,
      dto.description || '',
      files,
    );
    return {
      success: true,
      data,
    };
  }

  @Post('status/change/:task_id')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(ROLE.ADMIN, ROLE.PARTNER)
  @ApiOperation({ summary: 'Change task status (visibility)' })
  async changeTaskStatus(
    @Param('task_id') taskId: string,
    @Body() dto: ChangeTaskStatusDto,
    @RequestUser() reqUser: any,
  ): Promise<HttpResponse> {
    const task = await this.taskService.getTaskById(taskId);
    if (reqUser.role !== ROLE.ADMIN && task.creatorId !== reqUser.id) {
      return generateForbiddenResult(
        'Bạn không có quyền chỉnh sửa nhiệm vụ của người khác',
      );
    }
    const data = await this.taskService.changeTaskStatus(taskId, dto.status);
    return {
      success: true,
      data,
    };
  }

  @Put('submit/decision/:id')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(ROLE.ADMIN, ROLE.PARTNER)
  @ApiOperation({ summary: 'Approve or reject a task submission' })
  async handleDecisionTaskSubmit(
    @Param('id') id: string,
    @Body() dto: DecisionTaskSubmitDto,
  ): Promise<HttpResponse> {
    const data = await this.taskService.updateDecisionTaskSubmit(
      id,
      dto.decision,
    );
    return {
      success: true,
      data,
    };
  }

  @Put(':id')
  @UseGuards(AuthGuard)
  @ApiOperation({ summary: 'Update a task by ID' })
  async updateTask(
    @Param('id') id: string,
    @Body() dto: UpdateTaskDto,
    @RequestUser() reqUser: any,
  ): Promise<HttpResponse> {
    const task = await this.taskService.getTaskById(id);
    if (reqUser.role !== ROLE.ADMIN && task.creatorId !== reqUser.id) {
      return generateForbiddenResult(
        'Bạn không có quyền chỉnh sửa nhiệm vụ của người khác',
      );
    }
    const data = await this.taskService.updateTask(id, dto);
    return {
      success: true,
      data,
    };
  }

  @Delete(':id')
  @UseGuards(AuthGuard)
  @ApiOperation({ summary: 'Delete a task by ID' })
  async deleteTask(
    @Param('id') id: string,
    @RequestUser() reqUser: any,
  ): Promise<HttpResponse> {
    const task = await this.taskService.getTaskById(id);
    if (reqUser.role !== ROLE.ADMIN && task.creatorId !== reqUser.id) {
      return generateForbiddenResult(
        'Bạn không có quyền xóa nhiệm vụ của người khác',
      );
    }
    await this.taskService.deleteTask(id);
    return {
      success: true,
      message: 'Delete task success',
    };
  }
}

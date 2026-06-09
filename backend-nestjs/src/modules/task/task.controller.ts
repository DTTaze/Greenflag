import {
  Body,
  Controller,
  Delete,
  ForbiddenException,
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
  async getAllTasks() {
    return this.taskService.getAllTasks();
  }

  @Get('customer')
  @UseGuards(AuthGuard)
  @ApiOperation({ summary: 'Get all tasks of customer' })
  async getAllTasksOfCustomer(@RequestUser() reqUser: any) {
    return this.taskService.getAllTasksOfCustomer(reqUser.id);
  }

  @Get('type/:type_name')
  @ApiOperation({ summary: 'Get task by type name' })
  async getAllTasksByTypeName(@Param('type_name') typeName: string) {
    return this.taskService.getAllTasksByTypeName(typeName);
  }

  @Get('difficulty/:difficulty_name')
  @ApiOperation({ summary: 'Get task by difficulty name' })
  async getAllTasksByDifficultyName(
    @Param('difficulty_name') difficultyName: TASK_DIFFICULTY,
  ) {
    return this.taskService.getAllTasksByDifficultyName(difficultyName);
  }

  @Get('submit/user/:user_id')
  @ApiOperation({ summary: 'Get task submit by user ID' })
  async getTaskSubmitByUserId(@Param('user_id') userId: string) {
    return this.taskSubmitService.getTaskSubmitByUserId(userId);
  }

  @Get('submit/customer/:customer_id')
  @ApiOperation({ summary: 'Get task submit by customer ID' })
  async getTaskSubmitByCustomerId(@Param('customer_id') customerId: string) {
    return this.taskSubmitService.getTaskSubmitByCustomerId(customerId);
  }

  @Get('status/public')
  @ApiOperation({ summary: 'Get all tasks status public' })
  async getAllTasksStatusPublic() {
    return this.taskService.getAllTasksStatusPublic();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get task by ID' })
  async getTaskById(@Param('id') id: string) {
    return this.taskService.getTaskById(id);
  }

  @Post('upload')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(ROLE.ADMIN, ROLE.PARTNER)
  @ApiOperation({ summary: 'Create a task' })
  async createTask(@Body() dto: CreateTaskDto, @RequestUser() reqUser: any) {
    return this.taskService.createTask(dto, reqUser.id);
  }

  @Post('accept/:id')
  @UseGuards(AuthGuard)
  @ApiOperation({ summary: 'Accept a task' })
  async acceptTask(@Param('id') id: string, @RequestUser() reqUser: any) {
    return this.taskService.acceptTask(id, reqUser.id);
  }

  @Post('progress/increase/:task_user_id')
  @UseGuards(AuthGuard)
  @ApiOperation({ summary: 'Increase progress count of a task' })
  async increaseProgressCount(@Param('task_user_id') taskUserId: string) {
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
  ) {
    return this.taskService.submitTask(
      taskId,
      reqUser.id,
      dto.description || '',
      files,
    );
  }

  @Post('status/change/:task_id')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(ROLE.ADMIN, ROLE.PARTNER)
  @ApiOperation({ summary: 'Change task status (visibility)' })
  async changeTaskStatus(
    @Param('task_id') taskId: string,
    @Body() dto: ChangeTaskStatusDto,
    @RequestUser() reqUser: any,
  ) {
    const task = await this.taskService.getTaskById(taskId);
    if (reqUser.role !== ROLE.ADMIN && task.creatorId !== reqUser.id) {
      throw new ForbiddenException(
        'Bạn không có quyền chỉnh sửa nhiệm vụ của người khác',
      );
    }
    return this.taskService.changeTaskStatus(taskId, dto.status);
  }

  @Put('submit/decision/:id')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(ROLE.ADMIN, ROLE.PARTNER)
  @ApiOperation({ summary: 'Approve or reject a task submission' })
  async handleDecisionTaskSubmit(
    @Param('id') id: string,
    @Body() dto: DecisionTaskSubmitDto,
  ) {
    return this.taskService.updateDecisionTaskSubmit(id, dto.decision);
  }

  @Put(':id')
  @UseGuards(AuthGuard)
  @ApiOperation({ summary: 'Update a task by ID' })
  async updateTask(
    @Param('id') id: string,
    @Body() dto: UpdateTaskDto,
    @RequestUser() reqUser: any,
  ) {
    const task = await this.taskService.getTaskById(id);
    if (reqUser.role !== ROLE.ADMIN && task.creatorId !== reqUser.id) {
      throw new ForbiddenException(
        'Bạn không có quyền chỉnh sửa nhiệm vụ của người khác',
      );
    }
    return this.taskService.updateTask(id, dto);
  }

  @Delete(':id')
  @UseGuards(AuthGuard)
  @ApiOperation({ summary: 'Delete a task by ID' })
  async deleteTask(@Param('id') id: string, @RequestUser() reqUser: any) {
    const task = await this.taskService.getTaskById(id);
    if (reqUser.role !== ROLE.ADMIN && task.creatorId !== reqUser.id) {
      throw new ForbiddenException(
        'Bạn không có quyền xóa nhiệm vụ của người khác',
      );
    }
    await this.taskService.deleteTask(id);
    return { message: 'Delete task success' };
  }
}

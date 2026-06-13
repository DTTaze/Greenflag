import { HttpResponse } from 'mvc-common-toolkit';

import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';

import { RequestUser } from '@shared/decorators/request-user.decorator';
import { Roles } from '@shared/decorators/roles.decorator';
import { ROLE } from '@shared/enums';
import { AuthGuard } from '@shared/guards/auth.guard';
import { RolesGuard } from '@shared/guards/roles.guard';

import {
  ChangeTaskStatusDto,
  CreateTaskDto,
  DecisionTaskSubmitDto,
  UpdateTaskDto,
} from './dtos/task.dto';
import { TaskSubmitService } from './services/task-submit.service';
import { TaskService } from './services/task.service';

@ApiTags('Admin Tasks')
@ApiBearerAuth()
@Controller('admin/tasks')
@UseGuards(AuthGuard, RolesGuard)
@Roles(ROLE.ADMIN)
export class AdminTaskController {
  constructor(
    private readonly taskService: TaskService,
    private readonly taskSubmitService: TaskSubmitService,
  ) {}

  @Get()
  @ApiOperation({ summary: 'Get list of all tasks' })
  async getAllTasks(
    @Query('showDeleted') showDeleted?: string,
  ): Promise<HttpResponse> {
    const withDeleted = showDeleted === 'true';
    return this.taskService.getAllTasks(withDeleted);
  }

  @Get('submissions/count/pending')
  @ApiOperation({ summary: 'Get pending task submissions count' })
  async getPendingTaskSubmissionsCount(): Promise<HttpResponse> {
    return this.taskSubmitService.getPendingCount();
  }

  @Get('types')
  @ApiOperation({ summary: 'Get all task types' })
  async getAllTaskTypes(): Promise<HttpResponse> {
    return this.taskService.getAllTaskTypes();
  }

  @Get('submissions/:customerId')
  @ApiOperation({ summary: "Get submissions for any customer's tasks" })
  async getTaskSubmissions(
    @Param('customerId') customerId: string,
    @RequestUser() reqUser: any,
  ): Promise<HttpResponse> {
    const isAdmin = reqUser.role === ROLE.ADMIN;
    return this.taskSubmitService.getTaskSubmitByCustomerId(customerId, isAdmin);
  }

  @Post()
  @ApiOperation({ summary: 'Create a task' })
  async createTask(
    @Body() dto: CreateTaskDto,
    @RequestUser() reqUser: any,
  ): Promise<HttpResponse> {
    return this.taskService.createTask(dto, reqUser.id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update any task' })
  async updateTask(
    @Param('id') id: string,
    @Body() dto: UpdateTaskDto,
  ): Promise<HttpResponse> {
    return this.taskService.updateTask(id, dto, undefined, true);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete any task' })
  async deleteTask(@Param('id') id: string): Promise<HttpResponse> {
    return this.taskService.deleteTask(id, undefined, true);
  }

  @Patch(':id/status')
  @ApiOperation({ summary: 'Change visibility status of any task' })
  async changeTaskStatus(
    @Param('id') id: string,
    @Body() dto: ChangeTaskStatusDto,
  ): Promise<HttpResponse> {
    return this.taskService.changeTaskStatus(id, dto.status, undefined, true);
  }

  @Put('submissions/:id/decision')
  @ApiOperation({ summary: 'Approve or reject any submission' })
  async handleDecisionTaskSubmit(
    @Param('id') id: string,
    @Body() dto: DecisionTaskSubmitDto,
  ): Promise<HttpResponse> {
    return this.taskService.updateDecisionTaskSubmit(
      id,
      dto.decision,
      undefined,
      true,
    );
  }
}

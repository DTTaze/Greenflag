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

@ApiTags('Partner Tasks')
@ApiBearerAuth()
@Controller('partner/tasks')
@UseGuards(AuthGuard, RolesGuard)
@Roles(ROLE.PARTNER)
export class PartnerTaskController {
  constructor(
    private readonly taskService: TaskService,
    private readonly taskSubmitService: TaskSubmitService,
  ) {}

  @Get()
  @ApiOperation({ summary: 'Get all tasks created by the current partner' })
  async getMyTasks(@RequestUser() reqUser: any): Promise<HttpResponse> {
    return this.taskService.getAllTasksOfCustomer(reqUser.id);
  }

  @Get('submissions')
  @ApiOperation({ summary: "Get submissions for the current partner's tasks" })
  async getMyTaskSubmissions(
    @RequestUser() reqUser: any,
  ): Promise<HttpResponse> {
    return this.taskSubmitService.getTaskSubmitByCustomerId(reqUser.id);
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
  @ApiOperation({ summary: "Update partner's own task" })
  async updateTask(
    @Param('id') id: string,
    @Body() dto: UpdateTaskDto,
    @RequestUser() reqUser: any,
  ): Promise<HttpResponse> {
    return this.taskService.updateTask(id, dto, reqUser.id, false);
  }

  @Delete(':id')
  @ApiOperation({ summary: "Delete partner's own task" })
  async deleteTask(
    @Param('id') id: string,
    @RequestUser() reqUser: any,
  ): Promise<HttpResponse> {
    return this.taskService.deleteTask(id, reqUser.id, false);
  }

  @Patch(':id/status')
  @ApiOperation({ summary: "Change visibility status of partner's own task" })
  async changeTaskStatus(
    @Param('id') id: string,
    @Body() dto: ChangeTaskStatusDto,
    @RequestUser() reqUser: any,
  ): Promise<HttpResponse> {
    return this.taskService.changeTaskStatus(id, dto.status, reqUser.id, false);
  }

  @Put('submissions/:id/decision')
  @ApiOperation({
    summary: "Approve or reject a submission for partner's own task",
  })
  async handleDecisionTaskSubmit(
    @Param('id') id: string,
    @Body() dto: DecisionTaskSubmitDto,
    @RequestUser() reqUser: any,
  ): Promise<HttpResponse> {
    return this.taskService.updateDecisionTaskSubmit(
      id,
      dto.decision,
      reqUser.id,
      false,
    );
  }
}

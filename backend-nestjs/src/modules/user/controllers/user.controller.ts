import { HttpResponse } from 'mvc-common-toolkit';

import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Put,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

import { TransactionService } from '@modules/commerce/services/transaction.service';
import { TaskService } from '@modules/task/services/task.service';

import { RequestUser } from '@shared/decorators/request-user.decorator';
import { Roles } from '@shared/decorators/roles.decorator';
import { ROLE } from '@shared/enums';
import { AuthGuard } from '@shared/guards/auth.guard';
import { RolesGuard } from '@shared/guards/roles.guard';
import { generateForbiddenResult } from '@shared/helpers/operation-result.helper';
import { extractUserPublicInfo } from '@shared/helpers/user.helper';

import { AdminUpdateUserDto } from '../dtos/user.dto';
import { UserService } from '../services/user.service';

@ApiTags('Users')
@ApiBearerAuth()
@Controller('users')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly taskService: TaskService,
    private readonly transactionService: TransactionService,
  ) {}

  @Get()
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(ROLE.ADMIN)
  async getAllUsers(): Promise<HttpResponse> {
    return this.userService.getAllUsers();
  }

  @Get('me')
  @UseGuards(AuthGuard)
  async getProfile(@RequestUser() reqUser: any): Promise<HttpResponse> {
    const result = await this.userService.getUserByID(reqUser.id);
    if (!result.success) {
      return result;
    }
    return {
      success: true,
      data: extractUserPublicInfo(result.data),
    };
  }

  @Get('task/completed')
  @UseGuards(AuthGuard)
  async getTaskCompleted(@RequestUser() reqUser: any): Promise<HttpResponse> {
    const data = await this.taskService.getCompletedTasksByUserId(reqUser.id);
    return {
      success: true,
      data,
    };
  }

  @Get('tasks/all/:id')
  @UseGuards(AuthGuard)
  async getAllTasksById(@RequestUser() reqUser: any): Promise<HttpResponse> {
    const data = await this.taskService.getAllTasksByUserId(reqUser.id);
    return {
      success: true,
      data,
    };
  }

  @Get('items/:user_id')
  @UseGuards(AuthGuard)
  async getItemByIdUser(
    @Param('user_id') userId: string,
  ): Promise<HttpResponse> {
    const data = await this.transactionService.getItemsByUserId(userId);
    return {
      success: true,
      data,
    };
  }

  @Put('me/avatar')
  @UseGuards(AuthGuard)
  @UseInterceptors(FileInterceptor('avatar'))
  async updateAvatar(
    @RequestUser() reqUser: any,
    @UploadedFile() file: Express.Multer.File,
  ): Promise<HttpResponse> {
    return this.userService.updateUserAvatar(reqUser.id, file);
  }

  @Get(':id')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(ROLE.ADMIN)
  async getUser(@Param('id') id: string): Promise<HttpResponse> {
    const result = await this.userService.getUserByID(id);
    if (!result.success) {
      return result;
    }
    return {
      success: true,
      data: extractUserPublicInfo(result.data),
    };
  }

  @Put(':id')
  @UseGuards(AuthGuard)
  async updateUserById(
    @Param('id') id: string,
    @Body() dto: AdminUpdateUserDto,
    @RequestUser() reqUser: any,
  ): Promise<HttpResponse> {
    if (reqUser.role !== ROLE.ADMIN && reqUser.id !== id) {
      return generateForbiddenResult(
        'Bạn không có quyền cập nhật người dùng này',
      );
    }
    return this.userService.updateUserById(id, dto);
  }

  @Delete(':id')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(ROLE.ADMIN)
  async handleDeleteUser(@Param('id') id: string): Promise<HttpResponse> {
    return this.userService.deleteUser(id);
  }
}

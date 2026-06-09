import { HttpResponse } from 'mvc-common-toolkit';

import {
  Body,
  Controller,
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
import { AuthGuard } from '@shared/guards/auth.guard';
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

  @Put('me')
  @UseGuards(AuthGuard)
  async updateProfile(
    @RequestUser() reqUser: any,
    @Body() dto: AdminUpdateUserDto,
  ): Promise<HttpResponse> {
    return this.userService.updateUserById(reqUser.id, dto);
  }
}

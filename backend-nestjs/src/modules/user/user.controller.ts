import {
  Body,
  Controller,
  Delete,
  ForbiddenException,
  Get,
  Param,
  Put,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

import { TaskService } from '@modules/task/services/task.service';

import { RequestUser } from '@shared/decorators/request-user.decorator';
import { Roles } from '@shared/decorators/roles.decorator';
import { ROLE } from '@shared/enums';
import { AuthGuard } from '@shared/guards/auth.guard';
import { RolesGuard } from '@shared/guards/roles.guard';
import { extractUserPublicInfo } from '@shared/helpers/user.helper';

import { AdminUpdateUserDto } from './dtos/user.dto';
import { UserService } from './services/user.service';

@ApiTags('Users')
@ApiBearerAuth()
@Controller('users')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly taskService: TaskService,
  ) {}

  @Get()
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(ROLE.ADMIN)
  async getAllUsers() {
    return this.userService.getAllUsers();
  }

  @Get('me')
  @UseGuards(AuthGuard)
  async getProfile(@RequestUser() reqUser: any) {
    const user = await this.userService.getUserByID(reqUser.id);
    if (user) {
      delete user.password;
    }
    return user;
  }

  @Get('task/completed')
  @UseGuards(AuthGuard)
  async getTaskCompleted(@RequestUser() reqUser: any) {
    return this.taskService.getCompletedTasksByUserId(reqUser.id);
  }

  @Get('tasks/all/:id')
  @UseGuards(AuthGuard)
  async getAllTasksById(@RequestUser() reqUser: any) {
    return this.taskService.getAllTasksByUserId(reqUser.id);
  }

  @Get('items/:user_id')
  @UseGuards(AuthGuard)
  async getItemByIdUser(@Param('user_id') userId: string) {
    return [];
  }

  @Get(':id')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(ROLE.ADMIN)
  async getUser(@Param('id') id: string) {
    const user = await this.userService.getUserByID(id);
    return extractUserPublicInfo(user);
  }

  @Put(':id')
  @UseGuards(AuthGuard)
  async updateUserById(
    @Param('id') id: string,
    @Body() dto: AdminUpdateUserDto,
    @RequestUser() reqUser: any,
  ) {
    if (reqUser.role !== ROLE.ADMIN && reqUser.id !== id) {
      throw new ForbiddenException(
        'Bạn không có quyền cập nhật người dùng này',
      );
    }
    return this.userService.updateUserById(id, dto);
  }

  @Delete(':id')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(ROLE.ADMIN)
  async handleDeleteUser(@Param('id') id: string) {
    await this.userService.deleteUser(id);
    return { message: 'Delete user success' };
  }
}

import {
  Body,
  Controller,
  Delete,
  ForbiddenException,
  Get,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

import { RequestUser } from '@shared/decorators/request-user.decorator';
import { Roles } from '@shared/decorators/roles.decorator';
import { ROLE } from '@shared/enums';
import { AuthGuard } from '@shared/guards/auth.guard';
import { RolesGuard } from '@shared/guards/roles.guard';

import {
  AdminUpdateUserDto,
  CreateUserDto,
  UpdateUserProfileDto,
} from './dto/user.dto';
import { UserService } from './user.service';

@ApiTags('Users')
@ApiBearerAuth()
@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

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

  // Stub endpoints for Phase 3/4 integration compatibility
  @Get('task/completed')
  @UseGuards(AuthGuard)
  async getTaskCompleted() {
    return [];
  }

  @Get('tasks/all/:id')
  @UseGuards(AuthGuard)
  async getAllTasksById(@Param('id') id: string) {
    return [];
  }

  @Get('items/:user_id')
  @UseGuards(AuthGuard)
  async getItemByIdUser(@Param('user_id') userId: string) {
    return [];
  }

  @Get('public/:public_id')
  async getUserByPublicId(@Param('public_id') publicId: string) {
    const user = await this.userService.getUserByPublicID(publicId);
    if (user) {
      delete user.password;
    }
    return user;
  }

  @Put('public/:public_id')
  @UseGuards(AuthGuard)
  async updateUserByPublicId(
    @Param('public_id') publicId: string,
    @Body() dto: UpdateUserProfileDto,
    @RequestUser() reqUser: any,
  ) {
    const user = await this.userService.getUserByPublicID(publicId);
    if (reqUser.role !== ROLE.ADMIN && reqUser.id !== user.id) {
      throw new ForbiddenException(
        'Bạn không có quyền cập nhật người dùng này',
      );
    }
    return this.userService.updateUserByPublicID(publicId, dto);
  }

  @Delete('public/:public_id')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(ROLE.ADMIN)
  async deleteUserByPublicId(@Param('public_id') publicId: string) {
    await this.userService.deleteUserByPublicID(publicId);
    return { message: 'Delete user success' };
  }

  @Get(':id')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(ROLE.ADMIN)
  async getUser(@Param('id') id: number) {
    const user = await this.userService.getUserByID(id);
    if (user) {
      delete user.password;
    }
    return user;
  }

  @Put(':id')
  @UseGuards(AuthGuard)
  async updateUserById(
    @Param('id') id: number,
    @Body() dto: AdminUpdateUserDto,
    @RequestUser() reqUser: any,
  ) {
    if (reqUser.role !== ROLE.ADMIN && reqUser.id !== Number(id)) {
      throw new ForbiddenException(
        'Bạn không có quyền cập nhật người dùng này',
      );
    }
    return this.userService.updateUserById(Number(id), dto);
  }

  @Delete(':id')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(ROLE.ADMIN)
  async handleDeleteUser(@Param('id') id: number) {
    await this.userService.deleteUser(Number(id));
    return { message: 'Delete user success' };
  }
}

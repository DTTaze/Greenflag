import { HttpResponse } from 'mvc-common-toolkit';

import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Put,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

import { Roles } from '@shared/decorators/roles.decorator';
import { ROLE } from '@shared/enums';
import { AuthGuard } from '@shared/guards/auth.guard';
import { RolesGuard } from '@shared/guards/roles.guard';
import { extractUserPublicInfo } from '@shared/helpers/user.helper';

import { AdminUpdateUserDto } from '../dtos/user.dto';
import { UserService } from '../services/user.service';

@ApiTags('Admin Users')
@ApiBearerAuth()
@Controller('admin/users')
@UseGuards(AuthGuard, RolesGuard)
@Roles(ROLE.ADMIN)
export class AdminUserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  async getAllUsers(): Promise<HttpResponse> {
    return this.userService.getAllUsers();
  }

  @Get(':id')
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
  async updateUserById(
    @Param('id') id: string,
    @Body() dto: AdminUpdateUserDto,
  ): Promise<HttpResponse> {
    return this.userService.updateUserById(id, dto);
  }

  @Delete(':id')
  async handleDeleteUser(@Param('id') id: string): Promise<HttpResponse> {
    return this.userService.deleteUser(id);
  }
}

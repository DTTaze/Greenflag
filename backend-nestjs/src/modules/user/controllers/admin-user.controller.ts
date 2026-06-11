import { HttpResponse } from 'mvc-common-toolkit';
import { IsNull, Not } from 'typeorm';

import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

import { Item } from '@modules/commerce/entities/item.entity';
import { Transaction } from '@modules/commerce/entities/transaction.entity';
import { TaskUser } from '@modules/task/entities/task-user.entity';

import { Roles } from '@shared/decorators/roles.decorator';
import { ROLE, TRANSACTION_STATUS } from '@shared/enums';
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
  async getAllUsers(
    @Query('showDeleted') showDeleted?: string,
  ): Promise<HttpResponse> {
    const withDeleted = showDeleted === 'true';
    return this.userService.getAllUsers(withDeleted);
  }

  @Get('dashboard-stats')
  async getDashboardStats(): Promise<HttpResponse> {
    const totalUsers = await this.userService.model.count({
      where: { deletedAt: IsNull() },
    });

    const tasksCompleted = await this.userService.model.manager
      .getRepository(TaskUser)
      .count({
        where: { completedAt: Not(IsNull()) },
      });

    const totalItems = await this.userService.model.manager
      .getRepository(Item)
      .count({
        where: { deletedAt: IsNull() },
      });

    const acceptedTransactions = await this.userService.model.manager
      .getRepository(Transaction)
      .find({
        where: { status: TRANSACTION_STATUS.ACCEPTED },
      });

    const totalRevenue = acceptedTransactions.reduce(
      (sum, tx) => sum + (tx.totalPrice || 0),
      0,
    );

    return {
      success: true,
      data: {
        totalUsers,
        tasksCompleted,
        totalItems,
        totalRevenue,
      },
    };
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

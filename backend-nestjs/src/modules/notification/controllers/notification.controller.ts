import { HttpResponse } from 'mvc-common-toolkit';

import {
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Query,
  UseGuards,
} from '@nestjs/common';

import { ERR_CODE } from '@shared/constants';
import { RequestUser } from '@shared/decorators/request-user.decorator';
import { AuthGuard } from '@shared/guards/auth.guard';
import {
  generateNotFoundResult,
  generateSuccessResult,
} from '@shared/helpers/operation-result.helper';

import { NotificationService } from '../services/notification.service';

@Controller('notifications')
@UseGuards(AuthGuard)
export class NotificationController {
  constructor(private readonly notificationService: NotificationService) {}

  @Get()
  async getNotifications(
    @RequestUser() user: any,
    @Query('page') page?: number,
    @Query('limit') limit?: number,
  ): Promise<HttpResponse> {
    const pageNum = page ? Number(page) : 1;
    const limitNum = limit ? Number(limit) : 20;
    const result = await this.notificationService.findAllForUser(
      user.id,
      pageNum,
      limitNum,
    );
    return generateSuccessResult(result, 'Lấy danh sách thông báo thành công');
  }

  @Patch('read-all')
  @HttpCode(HttpStatus.OK)
  async markAllAsRead(@RequestUser() user: any): Promise<HttpResponse> {
    await this.notificationService.markAllAsRead(user.id);
    return generateSuccessResult(
      null,
      'Đánh dấu tất cả thông báo là đã đọc thành công',
    );
  }

  @Patch(':id/read')
  async markAsRead(
    @RequestUser() user: any,
    @Param('id') id: string,
  ): Promise<HttpResponse> {
    const result = await this.notificationService.markAsRead(id, user.id);
    if (!result) {
      return generateNotFoundResult(
        'Không tìm thấy thông báo hoặc không có quyền truy cập',
        ERR_CODE.NOTIFICATION_NOT_FOUND,
      );
    }
    return generateSuccessResult(
      result,
      'Đánh dấu thông báo đã đọc thành công',
    );
  }
}

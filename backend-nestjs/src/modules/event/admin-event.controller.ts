import { HttpResponse } from 'mvc-common-toolkit';

import {
  Body,
  Controller,
  Delete,
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
import { ROLE } from '@shared/enums';
import { AuthGuard } from '@shared/guards/auth.guard';
import { RolesGuard } from '@shared/guards/roles.guard';

import { CreateEventDto, UpdateEventDto } from './dtos/event.dto';
import { EventUserService } from './services/event-user.service';
import { EventService } from './services/event.service';

@ApiTags('Admin Events')
@ApiBearerAuth()
@Controller('admin/events')
@UseGuards(AuthGuard, RolesGuard)
@Roles(ROLE.ADMIN)
export class AdminEventController {
  constructor(
    private readonly eventService: EventService,
    private readonly eventUserService: EventUserService,
  ) {}

  @Post()
  @UseInterceptors(FilesInterceptor('images', 5))
  @ApiOperation({ summary: 'Create a new event' })
  async createEvent(
    @Body() dto: CreateEventDto,
    @RequestUser() reqUser: any,
    @UploadedFiles() images?: Express.Multer.File[],
  ): Promise<HttpResponse> {
    return this.eventService.createEvent(dto, reqUser.id, images);
  }

  @Put(':id')
  @UseInterceptors(FilesInterceptor('images', 5))
  @ApiOperation({ summary: 'Update any event' })
  async updateEvent(
    @Param('id') eventId: string,
    @Body() dto: UpdateEventDto,
    @UploadedFiles() images?: Express.Multer.File[],
  ): Promise<HttpResponse> {
    return this.eventService.updateEvent(eventId, dto, images, undefined, true);
  }

  @Put(':id/check-in')
  @ApiOperation({ summary: 'Check in user to any event' })
  async checkIn(
    @Param('id') eventId: string,
    @Body('user_id') userId: string,
  ): Promise<HttpResponse> {
    return this.eventUserService.checkIn(eventId, userId, undefined, true);
  }

  @Put(':id/check-out')
  @ApiOperation({ summary: 'Check out user from any event' })
  async checkOut(
    @Param('id') eventId: string,
    @Body('user_id') userId: string,
  ): Promise<HttpResponse> {
    return this.eventUserService.checkOut(eventId, userId, undefined, true);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete any event' })
  async deleteEvent(@Param('id') eventId: string): Promise<HttpResponse> {
    return this.eventService.deleteEvent(eventId, undefined, true);
  }

  @Delete('participants/:eventUserId')
  @ApiOperation({ summary: 'Delete participant from any event' })
  async deleteEventUser(
    @Param('eventUserId') eventUserId: string,
  ): Promise<HttpResponse> {
    return this.eventUserService.deleteEventUser(eventUserId, undefined, true);
  }
}

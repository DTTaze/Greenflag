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

@ApiTags('Partner Events')
@ApiBearerAuth()
@Controller('partner/events')
@UseGuards(AuthGuard, RolesGuard)
@Roles(ROLE.PARTNER, ROLE.ADMIN)
export class PartnerEventController {
  constructor(
    private readonly eventService: EventService,
    private readonly eventUserService: EventUserService,
  ) {}

  @Get()
  @ApiOperation({ summary: 'Get events created by the current partner' })
  async getMyEvents(@RequestUser() reqUser: any): Promise<HttpResponse> {
    const isAdmin = reqUser.role === ROLE.ADMIN;
    return this.eventService.getEventsOfCreator(reqUser.id, isAdmin);
  }

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
  @ApiOperation({ summary: "Update partner's own event" })
  async updateEvent(
    @Param('id') eventId: string,
    @Body() dto: UpdateEventDto,
    @RequestUser() reqUser: any,
    @UploadedFiles() images?: Express.Multer.File[],
  ): Promise<HttpResponse> {
    const isAdmin = reqUser.role === ROLE.ADMIN;
    return this.eventService.updateEvent(
      eventId,
      dto,
      images,
      reqUser.id,
      isAdmin,
    );
  }

  @Put(':id/check-in')
  @ApiOperation({ summary: "Check in user to partner's own event" })
  async checkIn(
    @Param('id') eventId: string,
    @Body('user_id') userId: string,
    @RequestUser() reqUser: any,
  ): Promise<HttpResponse> {
    const isAdmin = reqUser.role === ROLE.ADMIN;
    return this.eventUserService.checkIn(eventId, userId, reqUser.id, isAdmin);
  }

  @Put(':id/check-out')
  @ApiOperation({ summary: "Check out user from partner's own event" })
  async checkOut(
    @Param('id') eventId: string,
    @Body('user_id') userId: string,
    @RequestUser() reqUser: any,
  ): Promise<HttpResponse> {
    const isAdmin = reqUser.role === ROLE.ADMIN;
    return this.eventUserService.checkOut(eventId, userId, reqUser.id, isAdmin);
  }

  @Delete('participants/:eventUserId')
  @ApiOperation({ summary: "Delete participant from partner's own event" })
  async deleteEventUser(
    @Param('eventUserId') eventUserId: string,
    @RequestUser() reqUser: any,
  ): Promise<HttpResponse> {
    const isAdmin = reqUser.role === ROLE.ADMIN;
    return this.eventUserService.deleteEventUser(
      eventUserId,
      reqUser.id,
      isAdmin,
    );
  }
}

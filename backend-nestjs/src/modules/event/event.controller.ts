import { HttpResponse } from 'mvc-common-toolkit';

import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Req,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

import { Roles } from '@shared/decorators/roles.decorator';
import { ROLE } from '@shared/enums';
import { AuthGuard } from '@shared/guards/auth.guard';
import { RolesGuard } from '@shared/guards/roles.guard';

import {
  CheckInOutDto,
  CreateEventDto,
  UpdateEventDto,
} from './dtos/event.dto';
import { EventUserService } from './services/event-user.service';
import { EventService } from './services/event.service';
import { QrService } from './services/qr.service';

@ApiTags('Events')
@ApiBearerAuth()
@Controller('events')
@UseGuards(AuthGuard)
export class EventController {
  constructor(
    private readonly eventService: EventService,
    private readonly eventUserService: EventUserService,
    private readonly qrService: QrService,
  ) {}

  @Get('information/:eventId')
  async getEventById(@Param('eventId') eventId: string): Promise<HttpResponse> {
    const data = await this.eventService.getEventById(eventId);
    return {
      success: true,
      data,
    };
  }

  @Get('informations')
  async getAllEvents(): Promise<HttpResponse> {
    const data = await this.eventService.getAllEvents();
    return {
      success: true,
      data,
    };
  }

  @Get('signed')
  async getEventsSignedSelf(@Req() req: any): Promise<HttpResponse> {
    const data = await this.eventUserService.getEventsSigned(req.user.id);
    return {
      success: true,
      data,
    };
  }

  @Get('signed/:userId')
  async getEventsSigned(
    @Param('userId') userId: string,
  ): Promise<HttpResponse> {
    const data = await this.eventUserService.getEventsSigned(userId);
    return {
      success: true,
      data,
    };
  }

  @Get('creator')
  async getEventsOfCreator(@Req() req: any): Promise<HttpResponse> {
    const data = await this.eventService.getEventsOfCreator(req.user.id);
    return {
      success: true,
      data,
    };
  }

  @Get('user/:eventId')
  async getEventUsersByEventId(
    @Param('eventId') eventId: string,
  ): Promise<HttpResponse> {
    const data = await this.eventUserService.getEventUsersByEventId(eventId);
    return {
      success: true,
      data,
    };
  }

  @Post('create')
  @Roles(ROLE.ADMIN, ROLE.PARTNER)
  @UseGuards(RolesGuard)
  @UseInterceptors(FilesInterceptor('images', 5))
  async createEvent(
    @Body() dto: CreateEventDto,
    @Req() req: any,
    @UploadedFiles() images?: Express.Multer.File[],
  ): Promise<HttpResponse> {
    const data = await this.eventService.createEvent(dto, req.user.id, images);
    return {
      success: true,
      message: 'Create event success',
      data,
    };
  }

  @Post('accept/:eventId')
  async acceptEvent(
    @Param('eventId') eventId: string,
    @Req() req: any,
  ): Promise<HttpResponse> {
    const data = await this.eventUserService.acceptEvent(eventId, req.user.id);
    return {
      success: true,
      message: 'Accept event success',
      data,
    };
  }

  @Put('update/:eventId')
  @Roles(ROLE.ADMIN, ROLE.PARTNER)
  @UseGuards(RolesGuard)
  @UseInterceptors(FilesInterceptor('images', 5))
  async updateEvent(
    @Param('eventId') eventId: string,
    @Body() dto: UpdateEventDto,
    @UploadedFiles() images?: Express.Multer.File[],
  ): Promise<HttpResponse> {
    const data = await this.eventService.updateEvent(eventId, dto, images);
    return {
      success: true,
      message: 'Update event success',
      data,
    };
  }

  @Put('check_in')
  @Roles(ROLE.ADMIN, ROLE.PARTNER)
  @UseGuards(RolesGuard)
  async checkIn(@Body() dto: CheckInOutDto): Promise<HttpResponse> {
    const data = await this.eventUserService.checkIn(dto.event_id, dto.user_id);
    return {
      success: true,
      message: 'Check in success',
      data,
    };
  }

  @Put('check_out')
  @Roles(ROLE.ADMIN, ROLE.PARTNER)
  @UseGuards(RolesGuard)
  async checkOut(@Body() dto: CheckInOutDto): Promise<HttpResponse> {
    const data = await this.eventUserService.checkOut(
      dto.event_id,
      dto.user_id,
    );
    return {
      success: true,
      message: 'Check out success',
      data,
    };
  }

  @Delete('delete/:eventId')
  @Roles(ROLE.ADMIN)
  @UseGuards(RolesGuard)
  async deleteEvent(@Param('eventId') eventId: string): Promise<HttpResponse> {
    const data = await this.eventService.deleteEvent(eventId);
    return {
      success: true,
      message: 'Delete event success',
      data,
    };
  }

  @Delete('user/delete/:eventUserId')
  @Roles(ROLE.ADMIN, ROLE.PARTNER)
  @UseGuards(RolesGuard)
  async deleteEventUser(
    @Param('eventUserId') eventUserId: string,
  ): Promise<HttpResponse> {
    await this.eventUserService.deleteEventUser(eventUserId);
    return {
      success: true,
      message: 'Delete event user success',
    };
  }

  @Get('qr/:eventId')
  async generateEventQr(
    @Param('eventId') eventId: string,
  ): Promise<HttpResponse> {
    const event = await this.eventService.getEventById(eventId);
    const qrDataUrl = await this.qrService.generateDataUrl(
      JSON.stringify({ eventId: event.id, publicId: event.publicId }),
    );
    return {
      success: true,
      data: { qrCode: qrDataUrl },
    };
  }
}

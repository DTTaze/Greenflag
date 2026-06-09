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
  async getEventById(@Param('eventId') eventId: string) {
    return this.eventService.getEventById(eventId);
  }

  @Get('informations')
  async getAllEvents() {
    return this.eventService.getAllEvents();
  }

  @Get('signed')
  async getEventsSignedSelf(@Req() req: any) {
    return this.eventUserService.getEventsSigned(req.user.id);
  }

  @Get('signed/:userId')
  async getEventsSigned(@Param('userId') userId: string) {
    return this.eventUserService.getEventsSigned(userId);
  }

  @Get('creator')
  async getEventsOfCreator(@Req() req: any) {
    return this.eventService.getEventsOfCreator(req.user.id);
  }

  @Get('user/:eventId')
  async getEventUsersByEventId(@Param('eventId') eventId: string) {
    return this.eventUserService.getEventUsersByEventId(eventId);
  }

  @Post('create')
  @Roles(ROLE.ADMIN, ROLE.PARTNER)
  @UseGuards(RolesGuard)
  @UseInterceptors(FilesInterceptor('images', 5))
  async createEvent(
    @Body() dto: CreateEventDto,
    @Req() req: any,
    @UploadedFiles() images?: Express.Multer.File[],
  ) {
    return this.eventService.createEvent(dto, req.user.id, images);
  }

  @Post('accept/:eventId')
  async acceptEvent(@Param('eventId') eventId: string, @Req() req: any) {
    return this.eventUserService.acceptEvent(eventId, req.user.id);
  }

  @Put('update/:eventId')
  @Roles(ROLE.ADMIN, ROLE.PARTNER)
  @UseGuards(RolesGuard)
  @UseInterceptors(FilesInterceptor('images', 5))
  async updateEvent(
    @Param('eventId') eventId: string,
    @Body() dto: UpdateEventDto,
    @UploadedFiles() images?: Express.Multer.File[],
  ) {
    return this.eventService.updateEvent(eventId, dto, images);
  }

  @Put('check_in')
  @Roles(ROLE.ADMIN, ROLE.PARTNER)
  @UseGuards(RolesGuard)
  async checkIn(@Body() dto: CheckInOutDto) {
    return this.eventUserService.checkIn(dto.event_id, dto.user_id);
  }

  @Put('check_out')
  @Roles(ROLE.ADMIN, ROLE.PARTNER)
  @UseGuards(RolesGuard)
  async checkOut(@Body() dto: CheckInOutDto) {
    return this.eventUserService.checkOut(dto.event_id, dto.user_id);
  }

  @Delete('delete/:eventId')
  @Roles(ROLE.ADMIN)
  @UseGuards(RolesGuard)
  async deleteEvent(@Param('eventId') eventId: string) {
    return this.eventService.deleteEvent(eventId);
  }

  @Delete('user/delete/:eventUserId')
  @Roles(ROLE.ADMIN, ROLE.PARTNER)
  @UseGuards(RolesGuard)
  async deleteEventUser(@Param('eventUserId') eventUserId: string) {
    return this.eventUserService.deleteEventUser(eventUserId);
  }

  @Get('qr/:eventId')
  async generateEventQr(@Param('eventId') eventId: string) {
    const event = await this.eventService.getEventById(eventId);
    const qrDataUrl = await this.qrService.generateDataUrl(
      JSON.stringify({ eventId: event.id, publicId: event.publicId }),
    );
    return { qrCode: qrDataUrl };
  }
}

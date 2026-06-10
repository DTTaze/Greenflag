import { HttpResponse } from 'mvc-common-toolkit';

import { Controller, Get, Param, Post, Req, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

import { AuthGuard } from '@shared/guards/auth.guard';

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
    return this.eventService.getEventById(eventId);
  }

  @Get('informations')
  async getAllEvents(): Promise<HttpResponse> {
    return this.eventService.getAllEvents();
  }

  @Get('signed')
  async getEventsSignedSelf(@Req() req: any): Promise<HttpResponse> {
    return this.eventUserService.getEventsSigned(req.user.id);
  }

  @Get('signed/:userId')
  async getEventsSigned(
    @Param('userId') userId: string,
  ): Promise<HttpResponse> {
    return this.eventUserService.getEventsSigned(userId);
  }

  @Get('user/:eventId')
  async getEventUsersByEventId(
    @Param('eventId') eventId: string,
  ): Promise<HttpResponse> {
    return this.eventUserService.getEventUsersByEventId(eventId);
  }

  @Post('accept/:eventId')
  async acceptEvent(
    @Param('eventId') eventId: string,
    @Req() req: any,
  ): Promise<HttpResponse> {
    const result = await this.eventUserService.acceptEvent(eventId, req.user.id);
    if (result.success) {
      result.message = 'Accept event success';
    }
    return result;
  }

  @Get('qr/:eventId')
  async generateEventQr(
    @Param('eventId') eventId: string,
  ): Promise<HttpResponse> {
    const eventRes = await this.eventService.getEventById(eventId);
    if (!eventRes.success || !eventRes.data) {
      return eventRes;
    }
    const event = eventRes.data;
    const qrDataUrl = await this.qrService.generateDataUrl(
      JSON.stringify({ eventId: event.id, publicId: event.publicId }),
    );
    return {
      success: true,
      data: { qrCode: qrDataUrl },
    };
  }
}

import { nanoid } from 'nanoid';
import { In, Repository } from 'typeorm';

import { Injectable } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { InjectRepository } from '@nestjs/typeorm';
import { EVENT_STATUS } from '@shared/enums';

import { CloudinaryService } from '@modules/cloudinary/services/cloudinary.service';

import { ERR_CODE, EVENT_KEYS, getStorageFolder } from '@shared/constants';
import {
  OperationResult,
  generateForbiddenResult,
  generateNotFoundResult,
  generateSuccessResult,
} from '@shared/helpers/operation-result.helper';
import { BaseCRUDService } from '@shared/services/base-crud.service';

import { CreateEventDto, UpdateEventDto } from '../dtos/event.dto';
import { Event } from '../entities/event.entity';

@Injectable()
export class EventService extends BaseCRUDService<Event> {
  constructor(
    @InjectRepository(Event)
    private readonly eventRepository: Repository<Event>,
    private readonly cloudinaryService: CloudinaryService,
    private readonly eventEmitter: EventEmitter2,
  ) {
    super(eventRepository);
  }

  async getEventById(eventId: string): Promise<OperationResult<any>> {
    const event = await this.eventRepository.findOne({
      where: { id: eventId },
      relations: ['creator'],
    });

    if (!event) {
      return generateNotFoundResult(
        'Event not found',
        ERR_CODE.EVENT_NOT_FOUND,
      );
    }

    const mapped = {
      ...event,
      creator: event.creator
        ? { id: event.creator.id, username: event.creator.username }
        : null,
      images: event.images || [],
    };

    return generateSuccessResult(mapped);
  }

  async getAllEvents(
    withDeleted = false,
    status?: string,
  ): Promise<OperationResult<any[]>> {
    const whereCondition: any = {};
    if (status === 'active') {
      whereCondition.status = In([EVENT_STATUS.UPCOMING, EVENT_STATUS.ONGOING]);
    }

    const events = await this.eventRepository.find({
      where: whereCondition,
      relations: ['creator'],
      order: { createdAt: 'DESC' },
      withDeleted,
    });

    const mapped = events.map((event) => ({
      ...event,
      creator: event.creator
        ? { id: event.creator.id, username: event.creator.username }
        : null,
      images: event.images || [],
    }));

    return generateSuccessResult(mapped);
  }

  async getEventsOfCreator(
    creatorId: string,
    isAdmin: boolean = false,
  ): Promise<OperationResult<any[]>> {
    const whereCondition = isAdmin ? {} : { creatorId };
    const events = await this.eventRepository.find({
      where: whereCondition,
      relations: ['creator'],
      order: { createdAt: 'DESC' },
    });

    const mapped = events.map((event) => ({
      ...event,
      creator: event.creator
        ? { id: event.creator.id, username: event.creator.username }
        : null,
      images: event.images || [],
    }));

    return generateSuccessResult(mapped);
  }

  async createEvent(
    dto: CreateEventDto,
    creatorId: string,
    images?: Express.Multer.File[],
  ): Promise<OperationResult<any>> {
    const uploadedImageUrls: string[] = [];
    if (images?.length) {
      for (const file of images) {
        const result = await this.cloudinaryService.uploadImage(
          file,
          getStorageFolder().EVENT,
        );
        if (result?.secure_url) {
          uploadedImageUrls.push(result.secure_url);
        }
      }
    } else if (dto.images?.length) {
      uploadedImageUrls.push(...dto.images);
    }

    const event = await this.eventRepository.save({
      publicId: nanoid(),
      creatorId,
      title: dto.title,
      description: dto.description,
      location: dto.location,
      capacity: dto.capacity,
      coins: dto.coins,
      endSign: new Date(dto.end_sign),
      startTime: new Date(dto.start_time),
      endTime: new Date(dto.end_time),
      images: uploadedImageUrls,
    });

    const mapped = {
      ...event,
      images: event.images || [],
    };

    this.eventEmitter.emit(EVENT_KEYS.EVENT_CREATED, {
      eventId: event.id,
      eventTitle: event.title,
      creatorId,
    });

    return generateSuccessResult(mapped);
  }

  async updateEvent(
    eventId: string,
    dto: UpdateEventDto,
    images?: Express.Multer.File[],
    currentUserId?: string,
    isAdmin: boolean = false,
  ): Promise<OperationResult<any>> {
    const event = await this.eventRepository.findOne({
      where: { id: eventId },
    });
    if (!event) {
      return generateNotFoundResult(
        'Event not found',
        ERR_CODE.EVENT_NOT_FOUND,
      );
    }
    if (!isAdmin && currentUserId && event.creatorId !== currentUserId) {
      return generateForbiddenResult(
        'Bạn không có quyền chỉnh sửa sự kiện của người khác',
        ERR_CODE.FORBIDDEN,
      );
    }

    const updateFields: Partial<Event> = {};
    if (dto.title !== undefined) updateFields.title = dto.title;
    if (dto.description !== undefined)
      updateFields.description = dto.description;
    if (dto.location !== undefined) updateFields.location = dto.location;
    if (dto.capacity !== undefined) updateFields.capacity = dto.capacity;
    if (dto.coins !== undefined) updateFields.coins = dto.coins;
    if (dto.start_time !== undefined)
      updateFields.startTime = new Date(dto.start_time);
    if (dto.end_time !== undefined)
      updateFields.endTime = new Date(dto.end_time);
    if (dto.end_sign !== undefined)
      updateFields.endSign = new Date(dto.end_sign);
    if (dto.status !== undefined) updateFields.status = dto.status;

    if (images?.length) {
      await this.deleteEventImages(event);
      const uploadedImageUrls: string[] = [];
      for (const file of images) {
        const result = await this.cloudinaryService.uploadImage(
          file,
          getStorageFolder().EVENT,
        );
        if (result?.secure_url) {
          uploadedImageUrls.push(result.secure_url);
        }
      }
      updateFields.images = uploadedImageUrls;
    } else if (dto.images !== undefined) {
      updateFields.images = dto.images;
    }

    await this.eventRepository.update(eventId, updateFields);

    this.eventEmitter.emit(EVENT_KEYS.EVENT_UPDATED, {
      eventId,
      eventTitle: dto.title || event.title,
      updaterId: currentUserId,
    });

    return this.getEventById(eventId);
  }

  async deleteEvent(
    eventId: string,
    currentUserId?: string,
    isAdmin: boolean = false,
  ): Promise<OperationResult<any>> {
    const event = await this.eventRepository.findOne({
      where: { id: eventId },
    });
    if (!event) {
      return generateNotFoundResult(
        'Event not found',
        ERR_CODE.EVENT_NOT_FOUND,
      );
    }
    if (!isAdmin && currentUserId && event.creatorId !== currentUserId) {
      return generateForbiddenResult(
        'Bạn không có quyền xóa sự kiện của người khác',
        ERR_CODE.FORBIDDEN,
      );
    }
    const detailedEventResult = await this.getEventById(eventId);
    if (!detailedEventResult.success) {
      return detailedEventResult;
    }
    const detailedEvent = detailedEventResult.data;
    // Do not delete event images from Cloudinary during soft-delete to support auditing and recovery.
    await this.eventRepository.softDelete(eventId);
    return generateSuccessResult(detailedEvent);
  }

  private async deleteEventImages(event: Event): Promise<void> {
    if (event.images && event.images.length > 0) {
      for (const imageUrl of event.images) {
        const publicId = this.cloudinaryService.extractPublicId(imageUrl);
        if (publicId) {
          try {
            await this.cloudinaryService.deleteImage(publicId);
          } catch (error) {
            console.error(
              `Failed to delete image ${publicId} from Cloudinary:`,
              error,
            );
          }
        }
      }
    }
  }
}

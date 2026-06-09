import { nanoid } from 'nanoid';
import { Repository } from 'typeorm';

import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { CloudinaryService } from '@modules/cloudinary/services/cloudinary.service';

import { getStorageFolder } from '@shared/constants';
import { BaseCRUDService } from '@shared/services/base-crud.service';

import { CreateEventDto, UpdateEventDto } from '../dtos/event.dto';
import { Event } from '../entities/event.entity';

@Injectable()
export class EventService extends BaseCRUDService<Event> {
  constructor(
    @InjectRepository(Event)
    private readonly eventRepository: Repository<Event>,
    private readonly cloudinaryService: CloudinaryService,
  ) {
    super(eventRepository);
  }

  async getEventById(eventId: string): Promise<any> {
    const event = await this.eventRepository.findOne({
      where: { id: eventId },
      relations: ['creator'],
    });

    if (!event) {
      throw new NotFoundException('Event not found');
    }

    return {
      ...event,
      creator: event.creator
        ? { id: event.creator.id, username: event.creator.username }
        : null,
      images: event.images || [],
    };
  }

  async getAllEvents(): Promise<any[]> {
    const events = await this.eventRepository.find({
      relations: ['creator'],
      order: { createdAt: 'DESC' },
    });

    return events.map((event) => ({
      ...event,
      creator: event.creator
        ? { id: event.creator.id, username: event.creator.username }
        : null,
      images: event.images || [],
    }));
  }

  async getEventsOfCreator(creatorId: string): Promise<any[]> {
    const events = await this.eventRepository.find({
      where: { creatorId },
      relations: ['creator'],
      order: { createdAt: 'DESC' },
    });

    return events.map((event) => ({
      ...event,
      creator: event.creator
        ? { id: event.creator.id, username: event.creator.username }
        : null,
      images: event.images || [],
    }));
  }

  async createEvent(
    dto: CreateEventDto,
    creatorId: string,
    images?: Express.Multer.File[],
  ): Promise<any> {
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

    return {
      ...event,
      images: event.images || [],
    };
  }

  async updateEvent(
    eventId: string,
    dto: UpdateEventDto,
    images?: Express.Multer.File[],
  ): Promise<any> {
    const event = await this.eventRepository.findOne({
      where: { id: eventId },
    });
    if (!event) {
      throw new NotFoundException('Event not found');
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
    }

    await this.eventRepository.update(eventId, updateFields);

    return this.getEventById(eventId);
  }

  async deleteEvent(eventId: string): Promise<any> {
    const event = await this.getEventById(eventId);
    await this.deleteEventImages(event);
    await this.eventRepository.delete(eventId);
    return event;
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

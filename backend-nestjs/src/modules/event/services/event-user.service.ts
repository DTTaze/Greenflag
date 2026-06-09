import { Repository } from 'typeorm';

import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { CoinService } from '@modules/user/services/coin.service';
import { UserService } from '@modules/user/services/user.service';

import { BaseCRUDService } from '@shared/services/base-crud.service';

import { EventUser } from '../entities/event-user.entity';
import { EventService } from './event.service';

@Injectable()
export class EventUserService extends BaseCRUDService<EventUser> {
  constructor(
    @InjectRepository(EventUser)
    private readonly eventUserRepository: Repository<EventUser>,
    private readonly eventService: EventService,
    private readonly userService: UserService,
    private readonly coinService: CoinService,
  ) {
    super(eventUserRepository);
  }

  async acceptEvent(eventId: string, userId: string): Promise<EventUser> {
    const event = await this.eventService.findOne({ id: eventId });
    if (!event) {
      throw new NotFoundException('Event not found');
    }

    const user = await this.userService.findOne({ id: userId });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    const existingRegistration = await this.eventUserRepository.findOne({
      where: { eventId, userId },
    });
    if (existingRegistration) {
      throw new BadRequestException('User already registered for this event');
    }

    const registeredCount = await this.eventUserRepository.count({
      where: { eventId },
    });
    if (registeredCount >= event.capacity) {
      throw new BadRequestException('Event has reached maximum capacity');
    }

    return this.eventUserRepository.save({ userId, eventId });
  }

  async checkIn(eventId: string, userId: string): Promise<EventUser> {
    if (!eventId || !userId) {
      throw new BadRequestException('Event ID and User ID are required');
    }

    const user = await this.userService.findOne({ id: userId });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    const event = await this.eventService.findOne({ id: eventId });
    if (!event) {
      throw new NotFoundException('Event not found');
    }

    const eventUser = await this.eventUserRepository.findOne({
      where: { userId, eventId },
    });
    if (!eventUser) {
      throw new NotFoundException('User not found in this event');
    }

    if (eventUser.joinedAt) {
      throw new BadRequestException('User has already checked in');
    }

    eventUser.joinedAt = new Date();
    return this.eventUserRepository.save(eventUser);
  }

  async checkOut(eventId: string, userId: string): Promise<EventUser> {
    if (!eventId || !userId) {
      throw new BadRequestException('Event ID and User ID are required');
    }

    const user = await this.userService.findOne({ id: userId });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    const event = await this.eventService.findOne({ id: eventId });
    if (!event) {
      throw new NotFoundException('Event not found');
    }

    const eventUser = await this.eventUserRepository.findOne({
      where: { userId, eventId },
    });
    if (!eventUser) {
      throw new NotFoundException('User not found in this event');
    }

    if (!eventUser.joinedAt) {
      throw new BadRequestException('User has not checked in yet');
    }

    if (eventUser.completedAt) {
      throw new BadRequestException('User has already checked out');
    }

    eventUser.completedAt = new Date();
    await this.eventUserRepository.save(eventUser);

    await this.rewardCoins(userId, event.coins);

    return eventUser;
  }

  async getEventUsersByEventId(eventId: string): Promise<EventUser[]> {
    return this.eventUserRepository.find({
      where: { eventId },
      relations: ['user'],
    });
  }

  async getEventsSigned(userId: string): Promise<EventUser[]> {
    return this.eventUserRepository.find({
      where: { userId },
      relations: ['event', 'event.creator'],
    });
  }

  async deleteEventUser(eventUserId: string): Promise<void> {
    const result = await this.eventUserRepository.delete(eventUserId);
    if (result.affected === 0) {
      throw new NotFoundException(
        `No event user found with id: ${eventUserId}`,
      );
    }
  }

  private async rewardCoins(userId: string, amount: number): Promise<void> {
    if (amount <= 0) return;

    const coin = await this.coinService.findOne({ userId });
    if (!coin) return;

    await this.coinService.updateIncreaseCoin(coin.id, amount);
  }
}

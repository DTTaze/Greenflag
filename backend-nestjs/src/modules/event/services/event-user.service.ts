import { Repository } from 'typeorm';

import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { CoinService } from '@modules/user/services/coin.service';
import { UserService } from '@modules/user/services/user.service';

import { ERR_CODE } from '@shared/constants';
import {
  OperationResult,
  generateBadRequestResult,
  generateForbiddenResult,
  generateNotFoundResult,
  generateSuccessResult,
} from '@shared/helpers/operation-result.helper';
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

  async acceptEvent(
    eventId: string,
    userId: string,
  ): Promise<OperationResult<EventUser>> {
    const eventRes = await this.eventService.findOne({ id: eventId });
    if (!eventRes.success || !eventRes.data) {
      return generateNotFoundResult(
        'Event not found',
        ERR_CODE.EVENT_NOT_FOUND,
      );
    }
    const event = eventRes.data;

    const userRes = await this.userService.findOne({ id: userId });
    if (!userRes.success || !userRes.data) {
      return generateNotFoundResult('User not found', ERR_CODE.USER_NOT_FOUND);
    }

    const existingRegistration = await this.eventUserRepository.findOne({
      where: { eventId, userId },
    });
    if (existingRegistration) {
      return generateBadRequestResult(
        'User already registered for this event',
        ERR_CODE.EVENT_ALREADY_JOINED,
      );
    }

    const registeredCount = await this.eventUserRepository.count({
      where: { eventId },
    });
    if (registeredCount >= event.capacity) {
      return generateBadRequestResult(
        'Event has reached maximum capacity',
        ERR_CODE.EVENT_FULL,
      );
    }

    const created = await this.eventUserRepository.save({ userId, eventId });
    return generateSuccessResult(created);
  }

  async checkIn(
    eventId: string,
    userId: string,
    currentUserId?: string,
    isAdmin: boolean = false,
  ): Promise<OperationResult<EventUser>> {
    if (!eventId || !userId) {
      return generateBadRequestResult(
        'Event ID and User ID are required',
        ERR_CODE.BAD_REQUEST,
      );
    }

    const userRes = await this.userService.findOne({ id: userId });
    if (!userRes.success || !userRes.data) {
      return generateNotFoundResult('User not found', ERR_CODE.USER_NOT_FOUND);
    }

    const eventRes = await this.eventService.findOne({ id: eventId });
    if (!eventRes.success || !eventRes.data) {
      return generateNotFoundResult(
        'Event not found',
        ERR_CODE.EVENT_NOT_FOUND,
      );
    }
    const event = eventRes.data;

    if (!isAdmin && currentUserId && event.creatorId !== currentUserId) {
      return generateForbiddenResult(
        'Bạn không có quyền điểm danh cho sự kiện của người khác',
        ERR_CODE.FORBIDDEN,
      );
    }

    const eventUser = await this.eventUserRepository.findOne({
      where: { userId, eventId },
    });
    if (!eventUser) {
      return generateNotFoundResult(
        'User not found in this event',
        ERR_CODE.EVENT_USER_NOT_FOUND,
      );
    }

    if (eventUser.joinedAt) {
      return generateBadRequestResult(
        'User has already checked in',
        ERR_CODE.EVENT_CHECKIN_ALREADY,
      );
    }

    eventUser.joinedAt = new Date();
    const saved = await this.eventUserRepository.save(eventUser);
    return generateSuccessResult(saved);
  }

  async checkOut(
    eventId: string,
    userId: string,
    currentUserId?: string,
    isAdmin: boolean = false,
  ): Promise<OperationResult<EventUser>> {
    if (!eventId || !userId) {
      return generateBadRequestResult(
        'Event ID and User ID are required',
        ERR_CODE.BAD_REQUEST,
      );
    }

    const userRes = await this.userService.findOne({ id: userId });
    if (!userRes.success || !userRes.data) {
      return generateNotFoundResult('User not found', ERR_CODE.USER_NOT_FOUND);
    }

    const eventRes = await this.eventService.findOne({ id: eventId });
    if (!eventRes.success || !eventRes.data) {
      return generateNotFoundResult(
        'Event not found',
        ERR_CODE.EVENT_NOT_FOUND,
      );
    }
    const event = eventRes.data;

    if (!isAdmin && currentUserId && event.creatorId !== currentUserId) {
      return generateForbiddenResult(
        'Bạn không có quyền điểm danh cho sự kiện của người khác',
        ERR_CODE.FORBIDDEN,
      );
    }

    const eventUser = await this.eventUserRepository.findOne({
      where: { userId, eventId },
    });
    if (!eventUser) {
      return generateNotFoundResult(
        'User not found in this event',
        ERR_CODE.EVENT_USER_NOT_FOUND,
      );
    }

    if (!eventUser.joinedAt) {
      return generateBadRequestResult(
        'User has not checked in yet',
        ERR_CODE.EVENT_NOT_CHECKED_IN,
      );
    }

    if (eventUser.completedAt) {
      return generateBadRequestResult(
        'User has already checked out',
        ERR_CODE.EVENT_CHECKOUT_ALREADY,
      );
    }

    eventUser.completedAt = new Date();
    await this.eventUserRepository.save(eventUser);

    await this.rewardCoins(userId, event.coins);

    return generateSuccessResult(eventUser);
  }

  async getEventUsersByEventId(
    eventId: string,
  ): Promise<OperationResult<EventUser[]>> {
    const list = await this.eventUserRepository.find({
      where: { eventId },
      relations: ['user'],
    });
    return generateSuccessResult(list);
  }

  async getEventsSigned(userId: string): Promise<OperationResult<EventUser[]>> {
    const list = await this.eventUserRepository.find({
      where: { userId },
      relations: ['event', 'event.creator'],
    });
    return generateSuccessResult(list);
  }

  async deleteEventUser(
    eventUserId: string,
    currentUserId?: string,
    isAdmin: boolean = false,
  ): Promise<OperationResult<void>> {
    const eventUser = await this.eventUserRepository.findOne({
      where: { id: eventUserId },
      relations: ['event'],
    });
    if (!eventUser) {
      return generateNotFoundResult(
        `No event user found with id: ${eventUserId}`,
        ERR_CODE.EVENT_USER_NOT_FOUND,
      );
    }
    if (
      !isAdmin &&
      currentUserId &&
      eventUser.event?.creatorId !== currentUserId
    ) {
      return generateForbiddenResult(
        'Bạn không có quyền xóa người tham gia khỏi sự kiện của người khác',
        ERR_CODE.FORBIDDEN,
      );
    }
    await this.eventUserRepository.delete(eventUserId);
    return generateSuccessResult(undefined);
  }

  private async rewardCoins(
    userId: string,
    amount: number,
  ): Promise<OperationResult<void>> {
    if (amount <= 0) return generateSuccessResult(undefined);

    const coinRes = await this.coinService.findOne({ userId });
    if (!coinRes.success || !coinRes.data) {
      return generateNotFoundResult('Coin not found', ERR_CODE.COIN_NOT_FOUND);
    }

    const coin = coinRes.data;
    const updateRes = await this.coinService.updateIncreaseCoin(coin.id, {
      coins: amount,
    });
    if (!updateRes.success) {
      return OperationResult.fail(
        updateRes.code || 'update_failed',
        updateRes.message,
      );
    }

    return generateSuccessResult(undefined);
  }
}

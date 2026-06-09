import { Repository } from 'typeorm';

import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { ERR_CODE } from '@shared/constants';
import {
  OperationResult,
  generateForbiddenResult,
  generateNotFoundResult,
  generateSuccessResult,
} from '@shared/helpers/operation-result.helper';
import { BaseCRUDService } from '@shared/services/base-crud.service';

import { ReceiverInformation } from '../entities/receiver-information.entity';

@Injectable()
export class ReceiverInformationService extends BaseCRUDService<ReceiverInformation> {
  constructor(
    @InjectRepository(ReceiverInformation)
    private readonly receiverInformationRepository: Repository<ReceiverInformation>,
  ) {
    super(receiverInformationRepository);
  }

  public async getReceiverInfoByUserId(
    userId: string,
  ): Promise<OperationResult<ReceiverInformation[]>> {
    return this.findAll({ userId });
  }

  public async getReceiverInfoById(
    id: string,
    currentUserId?: string,
    isAdmin: boolean = false,
  ): Promise<OperationResult<ReceiverInformation>> {
    const infoRes = await this.findByID(id);
    if (!infoRes.success || !infoRes.data) {
      return generateNotFoundResult(
        `Receiver information not found`,
        ERR_CODE.RECEIVER_INFO_NOT_FOUND,
      );
    }
    const info = infoRes.data;

    if (!isAdmin && currentUserId && info.userId !== currentUserId) {
      return generateForbiddenResult(
        'Bạn không có quyền truy cập thông tin nhận hàng của người khác',
        ERR_CODE.FORBIDDEN,
      );
    }
    return generateSuccessResult(info);
  }

  public async updateReceiverInfo(
    id: string,
    dto: Partial<ReceiverInformation>,
    currentUserId?: string,
    isAdmin: boolean = false,
  ): Promise<OperationResult<ReceiverInformation>> {
    const infoRes = await this.findByID(id);
    if (!infoRes.success || !infoRes.data) {
      return generateNotFoundResult(
        `Receiver information not found`,
        ERR_CODE.RECEIVER_INFO_NOT_FOUND,
      );
    }
    const info = infoRes.data;

    if (!isAdmin && currentUserId && info.userId !== currentUserId) {
      return generateForbiddenResult(
        'Bạn không có quyền chỉnh sửa thông tin nhận hàng của người khác',
        ERR_CODE.FORBIDDEN,
      );
    }
    const updateRes = await this.updateByID(id, dto);
    if (!updateRes.success) {
      return updateRes;
    }
    return this.getReceiverInfoById(id, currentUserId, isAdmin);
  }

  public async deleteReceiverInfo(
    id: string,
    currentUserId?: string,
    isAdmin: boolean = false,
  ): Promise<OperationResult<void>> {
    const infoRes = await this.findByID(id);
    if (!infoRes.success || !infoRes.data) {
      return generateNotFoundResult(
        `Receiver information not found`,
        ERR_CODE.RECEIVER_INFO_NOT_FOUND,
      );
    }
    const info = infoRes.data;

    if (!isAdmin && currentUserId && info.userId !== currentUserId) {
      return generateForbiddenResult(
        'Bạn không có quyền xóa thông tin nhận hàng của người khác',
        ERR_CODE.FORBIDDEN,
      );
    }
    await this.deleteByID(id);
    return generateSuccessResult(undefined);
  }

  public async setDefaultReceiverInfoById(
    id: string,
    currentUserId?: string,
    isAdmin: boolean = false,
  ): Promise<OperationResult<ReceiverInformation>> {
    const infoRes = await this.findByID(id);
    if (!infoRes.success || !infoRes.data) {
      return generateNotFoundResult(
        'Receiver information not found',
        ERR_CODE.RECEIVER_INFO_NOT_FOUND,
      );
    }
    const info = infoRes.data;

    if (!isAdmin && currentUserId && info.userId !== currentUserId) {
      return generateForbiddenResult(
        'Bạn không có quyền đặt thông tin nhận hàng mặc định của người khác',
        ERR_CODE.FORBIDDEN,
      );
    }

    // Set all other receiver infos of this user to false
    await this.bulkUpdate({ userId: info.userId }, { isDefault: false });

    // Set this one to true
    await this.updateByID(id, { isDefault: true });
    return this.getReceiverInfoById(id, currentUserId, isAdmin);
  }
}

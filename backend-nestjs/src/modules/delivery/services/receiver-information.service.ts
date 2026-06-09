import { Repository } from 'typeorm';

import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

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
  ): Promise<ReceiverInformation[]> {
    return this.findAll({ userId });
  }

  public async getReceiverInfoById(id: string): Promise<ReceiverInformation> {
    const info = await this.findByID(id);
    if (!info) {
      throw new NotFoundException(`ReceiverInformation ${id} not found`);
    }
    return info;
  }

  public async setDefaultReceiverInfoById(
    id: string,
  ): Promise<ReceiverInformation> {
    const info = await this.findByID(id);
    if (!info) {
      throw new NotFoundException('Receiver information not found');
    }

    // Set all other receiver infos of this user to false
    await this.bulkUpdate({ userId: info.userId }, { isDefault: false });

    // Set this one to true
    const updated = await this.updateByID(id, { isDefault: true });
    return updated;
  }
}

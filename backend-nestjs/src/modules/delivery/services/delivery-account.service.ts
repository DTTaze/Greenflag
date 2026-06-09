import { Repository } from 'typeorm';

import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { CARRIER_TYPE } from '@shared/enums';
import { BaseCRUDService } from '@shared/services/base-crud.service';

import { DeliveryAccount } from '../entities/delivery-account.entity';
import { ShippingFactoryService } from './shipping-factory.service';

@Injectable()
export class DeliveryAccountService extends BaseCRUDService<DeliveryAccount> {
  constructor(
    @InjectRepository(DeliveryAccount)
    private readonly deliveryAccountRepository: Repository<DeliveryAccount>,
    private readonly shippingFactoryService: ShippingFactoryService,
  ) {
    super(deliveryAccountRepository);
  }

  public override async create(
    dto: Partial<DeliveryAccount>,
  ): Promise<DeliveryAccount> {
    if (dto.apiConfig) {
      const carrier = dto.carrier || CARRIER_TYPE.GHN;
      await this.validateAccountConfig(carrier, dto.apiConfig);
    }
    return super.create(dto);
  }

  public override async updateByID(
    id: string | number,
    dto: Partial<DeliveryAccount>,
  ): Promise<DeliveryAccount | null> {
    if (dto.apiConfig !== undefined || dto.carrier !== undefined) {
      const existing = await this.findByID(id);
      if (existing) {
        const carrier =
          dto.carrier !== undefined ? dto.carrier : existing.carrier;
        const apiConfig =
          dto.apiConfig !== undefined ? dto.apiConfig : existing.apiConfig;
        if (apiConfig) {
          await this.validateAccountConfig(carrier, apiConfig);
        }
      }
    }
    return super.updateByID(id, dto);
  }

  private async validateAccountConfig(
    carrier: CARRIER_TYPE,
    apiConfig: Record<string, any>,
  ) {
    const provider = this.shippingFactoryService.getProvider(carrier);
    const isValid = await provider.validateConfig(apiConfig);
    if (!isValid) {
      throw new BadRequestException('Invalid carrier configuration');
    }
  }

  public async getAllDeliveryAccounts(
    userId: string,
  ): Promise<DeliveryAccount[]> {
    return this.findAll({ userId });
  }

  public async getDeliveryAccountById(id: string): Promise<DeliveryAccount> {
    const account = await this.findByID(id);
    if (!account) {
      throw new NotFoundException('Delivery account not found');
    }
    return account;
  }

  public async setDefaultDeliveryAccount(id: string): Promise<DeliveryAccount> {
    const account = await this.findByID(id);
    if (!account) {
      throw new NotFoundException('Delivery account not found');
    }

    // Set all other accounts of the user to false
    await this.bulkUpdate({ userId: account.userId }, { isDefault: false });

    // Set this account to true
    const updated = await this.updateByID(id, { isDefault: true });
    return updated;
  }
}

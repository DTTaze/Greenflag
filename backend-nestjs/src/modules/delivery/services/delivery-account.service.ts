import { Repository } from 'typeorm';

import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { ERR_CODE } from '@shared/constants';
import { CARRIER_TYPE } from '@shared/enums';
import {
  OperationResult,
  generateBadRequestResult,
  generateForbiddenResult,
  generateNotFoundResult,
  generateSuccessResult,
} from '@shared/helpers/operation-result.helper';
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
  ): Promise<OperationResult<DeliveryAccount>> {
    try {
      if (dto.apiConfig) {
        const carrier = dto.carrier || CARRIER_TYPE.GHN;
        const validationRes = await this.validateAccountConfig(
          carrier,
          dto.apiConfig,
        );
        if (!validationRes.success) {
          return OperationResult.fail(
            validationRes.code || ERR_CODE.CARRIER_CONFIG_INVALID,
            validationRes.message,
          );
        }
      }
      return super.create(dto);
    } catch (error) {
      return OperationResult.fail('create_failed', error.message);
    }
  }

  public async updateDeliveryAccount(
    id: string,
    dto: Partial<DeliveryAccount>,
    currentUserId?: string,
    isAdmin: boolean = false,
  ): Promise<OperationResult<DeliveryAccount>> {
    const existingRes = await this.findByID(id);
    if (!existingRes.success || !existingRes.data) {
      return generateNotFoundResult(
        'Delivery account not found',
        ERR_CODE.DELIVERY_ACCOUNT_NOT_FOUND,
      );
    }
    const existing = existingRes.data;

    if (!isAdmin && currentUserId && existing.userId !== currentUserId) {
      return generateForbiddenResult(
        'Bạn không có quyền chỉnh sửa tài khoản giao hàng của người khác',
        ERR_CODE.FORBIDDEN,
      );
    }

    if (dto.apiConfig !== undefined || dto.carrier !== undefined) {
      const carrier =
        dto.carrier !== undefined ? dto.carrier : existing.carrier;
      const apiConfig =
        dto.apiConfig !== undefined ? dto.apiConfig : existing.apiConfig;
      if (apiConfig) {
        const validationRes = await this.validateAccountConfig(
          carrier,
          apiConfig,
        );
        if (!validationRes.success) {
          return OperationResult.fail(
            validationRes.code || ERR_CODE.CARRIER_CONFIG_INVALID,
            validationRes.message,
          );
        }
      }
    }
    const updateRes = await this.updateByID(id, dto);
    if (!updateRes.success) {
      return updateRes;
    }
    return this.getDeliveryAccountById(id, currentUserId, isAdmin);
  }

  public async deleteDeliveryAccount(
    id: string,
    currentUserId?: string,
    isAdmin: boolean = false,
  ): Promise<OperationResult<void>> {
    const accountRes = await this.findByID(id);
    if (!accountRes.success || !accountRes.data) {
      return generateNotFoundResult(
        'Delivery account not found',
        ERR_CODE.DELIVERY_ACCOUNT_NOT_FOUND,
      );
    }
    const account = accountRes.data;

    if (!isAdmin && currentUserId && account.userId !== currentUserId) {
      return generateForbiddenResult(
        'Bạn không có quyền xóa tài khoản giao hàng của người khác',
        ERR_CODE.FORBIDDEN,
      );
    }
    await this.deleteByID(id);
    return generateSuccessResult(undefined);
  }

  private async validateAccountConfig(
    carrier: CARRIER_TYPE,
    apiConfig: Record<string, any>,
  ): Promise<OperationResult<boolean>> {
    try {
      const provider = this.shippingFactoryService.getProvider(carrier);
      const isValid = await provider.validateConfig(apiConfig);
      if (!isValid) {
        return generateBadRequestResult(
          'Invalid carrier configuration',
          ERR_CODE.CARRIER_CONFIG_INVALID,
        );
      }
      return generateSuccessResult(true);
    } catch (error) {
      return generateBadRequestResult(
        `Validation error: ${error.message}`,
        ERR_CODE.CARRIER_CONFIG_INVALID,
      );
    }
  }

  public async getAllDeliveryAccounts(
    userId: string,
    isAdmin: boolean = false,
  ): Promise<OperationResult<DeliveryAccount[]>> {
    const whereCondition = isAdmin ? {} : { userId };
    return this.findAll(whereCondition);
  }

  public async getDeliveryAccountById(
    id: string,
    currentUserId?: string,
    isAdmin: boolean = false,
  ): Promise<OperationResult<DeliveryAccount>> {
    const accountRes = await this.findByID(id);
    if (!accountRes.success || !accountRes.data) {
      return generateNotFoundResult(
        'Delivery account not found',
        ERR_CODE.DELIVERY_ACCOUNT_NOT_FOUND,
      );
    }
    const account = accountRes.data;

    if (!isAdmin && currentUserId && account.userId !== currentUserId) {
      return generateForbiddenResult(
        'Bạn không có quyền truy cập tài khoản giao hàng của người khác',
        ERR_CODE.FORBIDDEN,
      );
    }
    return generateSuccessResult(account);
  }

  public async setDefaultDeliveryAccount(
    id: string,
    currentUserId?: string,
    isAdmin: boolean = false,
  ): Promise<OperationResult<DeliveryAccount>> {
    const accountRes = await this.findByID(id);
    if (!accountRes.success || !accountRes.data) {
      return generateNotFoundResult(
        'Delivery account not found',
        ERR_CODE.DELIVERY_ACCOUNT_NOT_FOUND,
      );
    }
    const account = accountRes.data;

    if (!isAdmin && currentUserId && account.userId !== currentUserId) {
      return generateForbiddenResult(
        'Bạn không có quyền đặt tài khoản giao hàng mặc định của người khác',
        ERR_CODE.FORBIDDEN,
      );
    }

    // Set all other accounts of the user to false
    await this.bulkUpdate({ userId: account.userId }, { isDefault: false });

    // Set this account to true
    await this.updateByID(id, { isDefault: true });
    return this.getDeliveryAccountById(id, currentUserId, isAdmin);
  }
}

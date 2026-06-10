import {
  CreateDeliveryAccountDto,
  CreateReceiverInfoDto,
  UpdateDeliveryAccountDto,
  UpdateReceiverInfoDto,
} from '@modules/delivery/dtos/delivery.dto';
import { DeliveryAccount } from '@modules/delivery/entities/delivery-account.entity';
import { ReceiverInformation } from '@modules/delivery/entities/receiver-information.entity';

export function mapToDeliveryAccountEntity(
  dto: CreateDeliveryAccountDto | UpdateDeliveryAccountDto,
): Partial<DeliveryAccount> {
  const entity: Partial<DeliveryAccount> = {};
  if (dto.name !== undefined) entity.name = dto.name;
  if (dto.carrier !== undefined) entity.carrier = dto.carrier;
  if (dto.is_default !== undefined) entity.isDefault = dto.is_default;

  // Map token and shop_id into apiConfig JSONB
  entity.apiConfig = entity.apiConfig || {};
  if (dto.token !== undefined) entity.apiConfig.token = dto.token;
  if (dto.shop_id !== undefined) entity.apiConfig.shop_id = dto.shop_id;
  return entity;
}

export function mapToReceiverInfoEntity(
  dto: CreateReceiverInfoDto | UpdateReceiverInfoDto,
): Partial<ReceiverInformation> {
  const entity: Partial<ReceiverInformation> = {};
  if (dto.to_name !== undefined) entity.toName = dto.to_name;
  if (dto.to_phone !== undefined) entity.toPhone = dto.to_phone;
  if (dto.to_address !== undefined) entity.toAddress = dto.to_address;
  if (dto.to_ward_name !== undefined) entity.toWardName = dto.to_ward_name;
  if (dto.to_district_name !== undefined)
    entity.toDistrictName = dto.to_district_name;
  if (dto.to_province_name !== undefined)
    entity.toProvinceName = dto.to_province_name;
  if (dto.account_type !== undefined) entity.accountType = dto.account_type;
  if (dto.is_default !== undefined) entity.isDefault = dto.is_default;
  return entity;
}

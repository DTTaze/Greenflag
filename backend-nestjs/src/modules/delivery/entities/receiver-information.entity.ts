import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { User } from '@modules/user/entities/user.entity';

import { AuditWithTimezone } from '@shared/common/audit.entity';
import { RECEIVER_ACCOUNT_TYPE } from '@shared/enums';

@Entity('receiver_informations')
export class ReceiverInformation extends AuditWithTimezone {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'user_id', type: 'uuid' })
  userId: string;

  @Column({ name: 'to_name', type: 'varchar' })
  toName: string;

  @Column({ name: 'to_phone', type: 'varchar' })
  toPhone: string;

  @Column({ name: 'to_address', type: 'text' })
  toAddress: string;

  @Column({ name: 'to_ward_name', type: 'varchar' })
  toWardName: string;

  @Column({ name: 'to_district_name', type: 'varchar' })
  toDistrictName: string;

  @Column({ name: 'to_province_name', type: 'varchar' })
  toProvinceName: string;

  @Column({
    name: 'account_type',
    type: 'varchar',
    default: RECEIVER_ACCOUNT_TYPE.HOME,
  })
  accountType: RECEIVER_ACCOUNT_TYPE;

  @Column({ name: 'is_default', type: 'boolean', default: false })
  isDefault: boolean;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: User;
}

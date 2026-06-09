import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { User } from '@modules/user/entities/user.entity';

import { CARRIER_TYPE } from '@shared/enums';

import { DeliveryOrder } from './delivery-order.entity';

@Entity('delivery_accounts')
export class DeliveryAccount {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar' })
  name: string;

  @Column({ name: 'user_id', type: 'uuid' })
  userId: string;

  @Column({
    type: 'varchar',
    default: CARRIER_TYPE.GHN,
  })
  carrier: CARRIER_TYPE;

  @Column({ name: 'api_config', type: 'jsonb', nullable: true })
  apiConfig?: Record<string, any>;

  @Column({ name: 'is_default', type: 'boolean', default: false })
  isDefault: boolean;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @OneToMany(() => DeliveryOrder, (order) => order.deliveryAccount)
  deliveryOrders: DeliveryOrder[];
}

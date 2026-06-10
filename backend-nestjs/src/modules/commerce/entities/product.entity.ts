import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { User } from '@modules/user/entities/user.entity';

import { AuditWithTimezone } from '@shared/common/audit.entity';
import {
  PRODUCT_CATEGORY,
  PRODUCT_CONDITION,
  PRODUCT_POST_STATUS,
} from '@shared/enums';

import { Item } from './item.entity';

@Entity('products')
export class Product extends AuditWithTimezone {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'seller_id', type: 'uuid' })
  sellerId: string;

  @Column({ type: 'varchar' })
  name: string;

  @Column({ type: 'text', nullable: true })
  description?: string;

  @Column({ type: 'integer' })
  price: number;

  @Column({
    type: 'varchar',
  })
  category: PRODUCT_CATEGORY;

  @Column({
    name: 'product_status',
    type: 'varchar',
    default: PRODUCT_CONDITION.NEW,
  })
  productStatus: PRODUCT_CONDITION;

  @Column({
    name: 'post_status',
    type: 'varchar',
    default: PRODUCT_POST_STATUS.PENDING,
  })
  postStatus: PRODUCT_POST_STATUS;

  @Column({ type: 'text', array: true, nullable: true })
  images?: string[];

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'seller_id' })
  seller: User;

  @OneToMany(() => Item, (item) => item.product, { cascade: true })
  items: Item[];
}

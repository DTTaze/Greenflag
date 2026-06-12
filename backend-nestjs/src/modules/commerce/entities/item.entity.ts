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
import { ITEM_STATUS } from '@shared/enums';

import { Product } from './product.entity';
import { Transaction } from './transaction.entity';

@Entity('items')
export class Item extends AuditWithTimezone {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  entityType: string = 'ITEM';

  @Column({ name: 'product_id', type: 'uuid', nullable: true })
  productId?: string;

  @Column({ name: 'creator_id', type: 'uuid' })
  creatorId: string;

  @Column({ type: 'varchar' })
  name: string;

  @Column({ type: 'text', nullable: true })
  description?: string;

  @Column({ type: 'integer' })
  price: number;

  @Column({ type: 'integer' })
  stock: number;

  @Column({
    type: 'varchar',
    default: ITEM_STATUS.PENDING,
  })
  status: ITEM_STATUS;

  @Column({ type: 'integer' })
  weight: number;

  @Column({ type: 'integer' })
  length: number;

  @Column({ type: 'integer' })
  width: number;

  @Column({ type: 'integer' })
  height: number;

  @Column({ name: 'purchase_limit_per_day', type: 'integer', nullable: true })
  purchaseLimitPerDay?: number;

  @Column({ type: 'text', array: true, nullable: true })
  images?: string[];

  @ManyToOne(() => Product, (product) => product.items, {
    onDelete: 'RESTRICT',
    nullable: true,
  })
  @JoinColumn({ name: 'product_id' })
  product?: Product;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'creator_id' })
  creator: User;

  @OneToMany(() => Transaction, (tx) => tx.item)
  transactions: Transaction[];
}

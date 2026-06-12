import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { DeliveryOrder } from '@modules/delivery/entities/delivery-order.entity';
import { ReceiverInformation } from '@modules/delivery/entities/receiver-information.entity';
import { User } from '@modules/user/entities/user.entity';

import { AuditWithTimezone } from '@shared/common/audit.entity';
import { TRANSACTION_STATUS } from '@shared/enums';

import { Item } from './item.entity';
import { Product } from './product.entity';


@Entity('transactions')
export class Transaction extends AuditWithTimezone {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'receiver_information_id', type: 'uuid' })
  receiverInformationId: string;

  @Column({ name: 'buyer_id', type: 'uuid' })
  buyerId: string;

  @Column({ name: 'seller_id', type: 'uuid' })
  sellerId: string;

  @Column({ name: 'item_id', type: 'uuid', nullable: true })
  itemId?: string;

  @Column({ name: 'product_id', type: 'uuid', nullable: true })
  productId?: string;


  @Column({ type: 'varchar', nullable: true })
  name?: string;

  @Column({ name: 'item_snapshot', type: 'jsonb' })
  itemSnapshot: any;

  @Column({ name: 'total_price', type: 'integer' })
  totalPrice: number;

  @Column({ type: 'integer', default: 1 })
  quantity: number;

  @Column({
    type: 'varchar',
    default: TRANSACTION_STATUS.PENDING,
  })
  status: TRANSACTION_STATUS;

  @ManyToOne(() => ReceiverInformation, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'receiver_information_id' })
  receiverInformation: ReceiverInformation;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'buyer_id' })
  buyer: User;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'seller_id' })
  seller: User;

  @ManyToOne(() => Item, (item) => item.transactions, { onDelete: 'CASCADE', nullable: true })
  @JoinColumn({ name: 'item_id' })
  item?: Item;

  @ManyToOne(() => Product, { onDelete: 'SET NULL', nullable: true })
  @JoinColumn({ name: 'product_id' })
  product?: Product;


  @OneToOne(() => DeliveryOrder, (order) => order.transaction)
  deliveryOrder: DeliveryOrder;
}

import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { Transaction } from '@modules/commerce/entities/transaction.entity';
import { User } from '@modules/user/entities/user.entity';

import { DELIVERY_ORDER_STATUS } from '@shared/enums';

import { DeliveryAccount } from './delivery-account.entity';

@Entity('delivery_orders')
export class DeliveryOrder {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'transaction_id', type: 'uuid', unique: true })
  transactionId: string;

  @Column({ name: 'seller_id', type: 'uuid' })
  sellerId: string;

  @Column({ name: 'buyer_id', type: 'uuid', nullable: true })
  buyerId?: string;

  @Column({ name: 'delivery_account_id', type: 'uuid', nullable: true })
  deliveryAccountId?: string;

  @Column({ name: 'order_code', type: 'varchar', nullable: true })
  orderCode?: string;

  @Column({
    type: 'varchar',
    default: DELIVERY_ORDER_STATUS.READY_TO_PICK,
  })
  status: DELIVERY_ORDER_STATUS;

  @Column({ name: 'to_name', type: 'varchar' })
  toName: string;

  @Column({ name: 'to_phone', type: 'varchar' })
  toPhone: string;

  @Column({ name: 'to_address', type: 'text' })
  toAddress: string;

  @Column({ name: 'is_printed', type: 'boolean', default: false })
  isPrinted: boolean;

  @Column({
    name: 'created_date',
    type: 'timestamp with time zone',
    nullable: true,
  })
  createdDate?: Date;

  @Column({ name: 'cod_amount', type: 'integer' })
  codAmount: number;

  @Column({ type: 'integer' })
  weight: number;

  @Column({ name: 'payment_type_id', type: 'integer' })
  paymentTypeId: number;

  @Column({ name: 'total_amount', type: 'integer' })
  totalAmount: number;

  @Column({ name: 'item_snapshot', type: 'jsonb', nullable: true })
  itemSnapshot?: any;

  @OneToOne(() => Transaction, (transaction) => transaction.deliveryOrder, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'transaction_id' })
  transaction: Transaction;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'seller_id' })
  seller: User;

  @ManyToOne(() => User, { onDelete: 'CASCADE', nullable: true })
  @JoinColumn({ name: 'buyer_id' })
  buyer?: User;

  @ManyToOne(() => DeliveryAccount, (acc) => acc.deliveryOrders, {
    onDelete: 'CASCADE',
    nullable: true,
  })
  @JoinColumn({ name: 'delivery_account_id' })
  deliveryAccount?: DeliveryAccount;
}

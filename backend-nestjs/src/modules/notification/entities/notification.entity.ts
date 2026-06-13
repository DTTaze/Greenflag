import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { User } from '@modules/user/entities/user.entity';

import { AuditWithTimezone } from '@shared/common/audit.entity';

export enum NotificationType {
  NEW_COMMENT = 'NEW_COMMENT',
  POST_APPROVED = 'POST_APPROVED',
  POST_REJECTED = 'POST_REJECTED',
  MENTION = 'MENTION',
  COIN_RECEIVED = 'COIN_RECEIVED',
  ORDER_REFUNDED = 'ORDER_REFUNDED',
  TASK_SUBMITTED = 'TASK_SUBMITTED',
  TASK_CREATED = 'TASK_CREATED',
  POST_CREATED_BY_ADMIN = 'POST_CREATED_BY_ADMIN',
  EVENT_CREATED = 'EVENT_CREATED',
  EVENT_UPDATED = 'EVENT_UPDATED',
  TRANSACTION_CREATED = 'TRANSACTION_CREATED',
  SHIPPING_STATUS_CHANGED = 'SHIPPING_STATUS_CHANGED',
  TASK_MODERATED = 'TASK_MODERATED',
}

@Entity('notifications')
export class Notification extends AuditWithTimezone {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'recipient_id', type: 'uuid' })
  @Index()
  recipientId: string;

  @Column({ name: 'sender_id', type: 'uuid', nullable: true })
  @Index()
  senderId: string | null;

  @Column({
    type: 'varchar',
    length: 50,
  })
  type: NotificationType;

  @Column({ type: 'text' })
  content: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  link: string | null;

  @Column({ name: 'is_read', type: 'boolean', default: false })
  isRead: boolean;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'recipient_id' })
  recipient: User;

  @ManyToOne(() => User, { onDelete: 'SET NULL', nullable: true })
  @JoinColumn({ name: 'sender_id' })
  sender: User | null;
}

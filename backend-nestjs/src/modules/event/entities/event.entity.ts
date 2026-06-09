import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { User } from '@modules/user/entities/user.entity';

import { AuditWithTimezone } from '@shared/common/audit.entity';
import { EVENT_STATUS } from '@shared/enums';

import { EventUser } from './event-user.entity';

@Entity('events')
export class Event extends AuditWithTimezone {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'public_id', type: 'varchar', unique: true })
  @Index()
  publicId: string;

  @Column({ name: 'creator_id', type: 'uuid' })
  creatorId: string;

  @Column({ type: 'text' })
  title: string;

  @Column({ type: 'text' })
  description: string;

  @Column({ type: 'text' })
  location: string;

  @Column({ type: 'integer' })
  capacity: number;

  @Column({ type: 'integer' })
  coins: number;

  @Column({ name: 'end_sign', type: 'timestamp with time zone' })
  endSign: Date;

  @Column({ name: 'start_time', type: 'timestamp with time zone' })
  startTime: Date;

  @Column({ name: 'end_time', type: 'timestamp with time zone' })
  endTime: Date;

  @Column({ type: 'varchar', default: EVENT_STATUS.UPCOMING })
  status: string;

  @Column('text', { array: true, nullable: true })
  images: string[];

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'creator_id' })
  creator: User;

  @OneToMany(() => EventUser, (eventUser: EventUser) => eventUser.event, {
    cascade: true,
  })
  eventUsers: EventUser[];
}

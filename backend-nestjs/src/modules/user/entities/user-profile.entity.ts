import {
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { AuditWithTimezone } from '@shared/common/audit.entity';

import { User } from './user.entity';

@Entity('user_profiles')
export class UserProfile extends AuditWithTimezone {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'user_id', type: 'uuid', unique: true })
  userId: string;

  @Column({ name: 'full_name', type: 'varchar', length: 255 })
  fullName: string;

  @Column({
    name: 'phone_number',
    nullable: true,
    type: 'varchar',
    length: 255,
    unique: true,
  })
  phoneNumber?: string;

  @Column({ type: 'integer', default: 0 })
  streak: number;

  @Column({
    name: 'last_completed_task',
    nullable: true,
    type: 'timestamp with time zone',
  })
  lastCompletedTask?: Date;

  @OneToOne(() => User, (user) => user.profile, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: User;
}

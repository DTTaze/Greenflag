import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { AuditWithTimezone } from '@shared/common/audit.entity';

import { User } from './user.entity';

@Entity('user_social_accounts')
export class UserSocialAccount extends AuditWithTimezone {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column({ name: 'user_id', type: 'uuid' })
  @Index()
  userId: string;

  @Column()
  @Index()
  provider: string;

  @Column({ name: 'provider_user_id', unique: true })
  @Index()
  providerUserId: string;
}

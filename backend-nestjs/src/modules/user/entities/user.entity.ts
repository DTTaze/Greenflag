import * as crypto from 'crypto';
import {
  BeforeInsert,
  Column,
  Entity,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { AuditWithTimezone } from '@shared/common/audit.entity';
import { ROLE } from '@shared/enums';

import { Coin } from './coin.entity';
import { Rank } from './rank.entity';

@Entity('users')
export class User extends AuditWithTimezone {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'public_id', unique: true, type: 'varchar', length: 255 })
  publicId: string;

  @Column({
    type: 'varchar',
    default: ROLE.USER,
  })
  role: ROLE;

  @Column({ name: 'avatar_url', nullable: true, type: 'varchar', length: 255 })
  avatarUrl?: string;

  @Column({
    name: 'google_id',
    nullable: true,
    unique: true,
    type: 'varchar',
    length: 255,
  })
  googleId?: string;

  @Column({ unique: true, type: 'varchar', length: 255 })
  email: string;

  @Column({ nullable: true, type: 'varchar', length: 255 })
  password?: string;

  @Column({ unique: true, type: 'varchar', length: 255 })
  username: string;

  @Column({ name: 'full_name', type: 'varchar', length: 255 })
  fullName: string;

  @Column({
    name: 'phone_number',
    nullable: true,
    unique: true,
    type: 'varchar',
    length: 255,
  })
  phoneNumber?: string;

  @Column({ name: 'rank_id', type: 'integer', default: 0 })
  rankId: number;

  @Column({ type: 'integer', default: 0 })
  streak: number;

  @Column({ name: 'last_completed_task', nullable: true, type: 'date' })
  lastCompletedTask?: Date;

  @OneToOne(() => Coin, (coin) => coin.user)
  coin: Coin;

  @OneToOne(() => Rank, (rank) => rank.user)
  rank: Rank;

  @BeforeInsert()
  generatePublicId() {
    if (!this.publicId) {
      this.publicId = crypto.randomUUID();
    }
  }
}

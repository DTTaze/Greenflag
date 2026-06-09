import {
  Column,
  Entity,
  Index,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { AuditWithTimezone } from '@shared/common/audit.entity';
import { ENTITY_STATUS, ROLE } from '@shared/enums';

import { Coin } from './coin.entity';
import { Rank } from './rank.entity';
import { UserProfile } from './user-profile.entity';
import { UserSocialAccount } from './user-social-account.entity';

@Entity('users')
export class User extends AuditWithTimezone {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', default: ENTITY_STATUS.ACTIVE })
  status: ENTITY_STATUS;

  @Column({ type: 'varchar', unique: true })
  @Index()
  email: string;

  @Column({ type: 'varchar', unique: true })
  @Index()
  username: string;

  @Column({ type: 'varchar', nullable: true })
  password?: string;

  @Column({ type: 'varchar', default: ROLE.USER })
  role: ROLE;

  @Column({
    type: 'jsonb',
    nullable: true,
  })
  metadata?: Record<string, any>;

  @Column({
    name: 'avatar_url',
    type: 'varchar',
    length: 512,
    default:
      'https://res.cloudinary.com/ptquanh/image/upload/v1779947161/default-avatar.png',
  })
  avatarUrl: string;

  @OneToOne(() => UserProfile, (profile) => profile.user, { cascade: true })
  profile: UserProfile;

  @OneToOne(() => Coin, (coin) => coin.user)
  coin: Coin;

  @OneToOne(() => Rank, (rank) => rank.user)
  rank: Rank;

  @OneToMany(() => UserSocialAccount, (social) => social.user)
  socialAccounts: UserSocialAccount[];
}

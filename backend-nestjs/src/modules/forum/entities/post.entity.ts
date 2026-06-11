import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { Event } from '@modules/event/entities/event.entity';
import { User } from '@modules/user/entities/user.entity';

import { AuditWithTimezone } from '@shared/common/audit.entity';
import { FORUM_POST_STATUS } from '@shared/enums';

import { Comment } from './comment.entity';
import { PostVote } from './post-vote.entity';

@Entity('posts')
export class Post extends AuditWithTimezone {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'event_id', type: 'uuid', nullable: true })
  eventId: string;

  @Column({ name: 'author_id', type: 'uuid' })
  @Index()
  authorId: string;

  @Column({ type: 'text' })
  content: string;

  @Column({ type: 'jsonb', default: [] })
  images: string[];

  @Column({ type: 'jsonb', default: [] })
  tags: string[];

  @Column({ type: 'integer', default: 0 })
  upvotes: number;

  @Column({ type: 'integer', default: 0 })
  downvotes: number;

  @Column({ name: 'comment_count', type: 'integer', default: 0 })
  commentCount: number;

  @Column({ type: 'integer', default: 0 })
  @Index()
  score: number;

  @Column({
    type: 'varchar',
    default: FORUM_POST_STATUS.PENDING,
  })
  status: FORUM_POST_STATUS;

  @Column({ name: 'rejected_by', type: 'varchar', length: 20, nullable: true })
  rejectedBy: string;

  @Column({ type: 'varchar', nullable: true })
  category: string;

  @Column({ name: 'flagged_reason', type: 'text', nullable: true })
  flaggedReason: string;

  @Column({ name: 'is_admin_post', type: 'boolean', default: false })
  isAdminPost: boolean;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'author_id' })
  author: User;

  @ManyToOne(() => Event, { nullable: true })
  @JoinColumn({ name: 'event_id' })
  event: Event;

  @OneToMany(() => Comment, (comment) => comment.post)
  comments: Comment[];

  @OneToMany(() => PostVote, (vote) => vote.post)
  votes: PostVote[];
}

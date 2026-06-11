import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { User } from '@modules/user/entities/user.entity';

import { FORUM_VOTE_TYPE } from '@shared/enums';

import { Post } from './post.entity';

@Entity('post_votes')
export class PostVote {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'post_id', type: 'uuid' })
  postId: string;

  @Column({ name: 'user_id', type: 'uuid' })
  @Index()
  userId: string;

  @Column({ type: 'varchar', length: 10 })
  type: FORUM_VOTE_TYPE;

  @ManyToOne(() => Post, (post) => post.votes, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'post_id' })
  @Index()
  post: Post;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'user_id' })
  user: User;
}

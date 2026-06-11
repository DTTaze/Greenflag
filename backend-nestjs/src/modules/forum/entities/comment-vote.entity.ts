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

import { Comment } from './comment.entity';

@Entity('comment_votes')
export class CommentVote {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'comment_id', type: 'uuid' })
  commentId: string;

  @Column({ name: 'user_id', type: 'uuid' })
  @Index()
  userId: string;

  @Column({ type: 'varchar', length: 10 })
  type: FORUM_VOTE_TYPE;

  @ManyToOne(() => Comment, (comment) => comment.votes, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'comment_id' })
  @Index()
  comment: Comment;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'user_id' })
  user: User;
}

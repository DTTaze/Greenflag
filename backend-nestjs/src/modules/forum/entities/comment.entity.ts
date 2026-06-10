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
import { FORUM_POST_STATUS } from '@shared/enums';

import { CommentVote } from './comment-vote.entity';
import { Post } from './post.entity';

@Entity('comments')
export class Comment extends AuditWithTimezone {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'post_id', type: 'uuid' })
  @Index()
  postId: string;

  @Column({ name: 'author_id', type: 'uuid' })
  authorId: string;

  @Column({ name: 'parent_id', type: 'uuid', nullable: true })
  @Index()
  parentId: string;

  @Column({ type: 'text' })
  content: string;

  @Column({ type: 'integer', default: 0 })
  upvotes: number;

  @Column({ type: 'integer', default: 0 })
  downvotes: number;

  @Column({ name: 'image_url', type: 'varchar', nullable: true })
  imageUrl: string | null;

  @Column({
    type: 'varchar',
    default: FORUM_POST_STATUS.APPROVED,
  })
  status: FORUM_POST_STATUS;

  @Column({ name: 'rejected_by', type: 'varchar', length: 20, nullable: true })
  rejectedBy: string;

  @ManyToOne(() => Post, (post) => post.comments, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'post_id' })
  post: Post;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'author_id' })
  author: User;

  @ManyToOne(() => Comment, (comment) => comment.replies, {
    nullable: true,
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'parent_id' })
  parent: Comment;

  @OneToMany(() => Comment, (comment) => comment.parent)
  replies: Comment[];

  @OneToMany(() => CommentVote, (vote) => vote.comment)
  votes: CommentVote[];
}

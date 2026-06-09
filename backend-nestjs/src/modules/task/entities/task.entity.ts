import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { User } from '@modules/user/entities/user.entity';

import { AuditWithTimezone } from '@shared/common/audit.entity';
import { TASK_DIFFICULTY, TASK_VISIBILITY } from '@shared/enums';

import { TaskType } from './task-type.entity';
import { TaskUser } from './task-user.entity';

@Entity('tasks')
export class Task extends AuditWithTimezone {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'creator_id', type: 'uuid' })
  creatorId: string;

  @Column({ type: 'varchar', length: 255 })
  title: string;

  @Column({ type: 'text', nullable: true })
  content?: string;

  @Column({ type: 'varchar', length: 255 })
  description: string;

  @Column({ type: 'integer' })
  coins: number;

  @Column({ type: 'varchar' })
  difficulty: TASK_DIFFICULTY;

  @Column({ type: 'integer', default: 1, nullable: true })
  total: number;

  @Column({
    type: 'varchar',
    default: TASK_VISIBILITY.PUBLIC,
  })
  status: TASK_VISIBILITY;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'creator_id' })
  creator: User;

  @OneToMany(() => TaskType, (taskType) => taskType.task)
  taskTypes: TaskType[];

  @OneToMany(() => TaskUser, (taskUser) => taskUser.task)
  taskUsers: TaskUser[];
}

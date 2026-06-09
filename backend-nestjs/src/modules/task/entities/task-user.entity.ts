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

import { TaskSubmit } from './task-submit.entity';
import { Task } from './task.entity';

@Entity('task_users')
export class TaskUser extends AuditWithTimezone {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'user_id', type: 'uuid' })
  userId: string;

  @Column({ name: 'task_id', type: 'uuid' })
  taskId: string;

  @Column({
    name: 'progress_count',
    type: 'integer',
    default: 0,
    nullable: true,
  })
  progressCount: number;

  @Column({
    name: 'assigned_at',
    type: 'timestamp with time zone',
    default: () => 'CURRENT_TIMESTAMP',
  })
  assignedAt: Date;

  @Column({
    name: 'completed_at',
    type: 'timestamp with time zone',
    nullable: true,
  })
  completedAt?: Date;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @ManyToOne(() => Task, (task) => task.taskUsers, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'task_id' })
  task: Task;

  @OneToMany(() => TaskSubmit, (submit) => submit.taskUser)
  submits: TaskSubmit[];
}

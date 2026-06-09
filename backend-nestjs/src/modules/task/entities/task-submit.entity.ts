import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { AuditWithTimezone } from '@shared/common/audit.entity';
import { TASK_SUBMIT_STATUS } from '@shared/enums';

import { TaskUser } from './task-user.entity';

@Entity('task_submits')
export class TaskSubmit extends AuditWithTimezone {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'task_user_id', type: 'uuid' })
  taskUserId: string;

  @Column({ type: 'text', nullable: true })
  description?: string;

  @Column({
    type: 'enum',
    enum: TASK_SUBMIT_STATUS,
    default: TASK_SUBMIT_STATUS.PENDING,
  })
  status: TASK_SUBMIT_STATUS;

  @Column({
    name: 'submitted_at',
    type: 'timestamp with time zone',
    default: () => 'CURRENT_TIMESTAMP',
  })
  submittedAt: Date;

  @Column({ type: 'jsonb', nullable: true })
  images?: string[];

  @ManyToOne(() => TaskUser, (taskUser) => taskUser.submits, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'task_user_id' })
  taskUser: TaskUser;
}

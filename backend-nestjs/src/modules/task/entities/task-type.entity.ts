import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { AuditWithTimezone } from '@shared/common/audit.entity';

import { Task } from './task.entity';
import { Type } from './type.entity';

@Entity('task_types')
export class TaskType extends AuditWithTimezone {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'task_id', type: 'uuid' })
  taskId: string;

  @Column({ name: 'type_id', type: 'uuid' })
  typeId: string;

  @ManyToOne(() => Task, (task) => task.taskTypes, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'task_id' })
  task: Task;

  @ManyToOne(() => Type, (type) => type.taskTypes, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'type_id' })
  type: Type;
}

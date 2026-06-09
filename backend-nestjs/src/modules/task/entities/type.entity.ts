import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

import { AuditWithTimezone } from '@shared/common/audit.entity';

import { TaskType } from './task-type.entity';

@Entity('types')
export class Type extends AuditWithTimezone {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true, type: 'varchar', length: 255 })
  type: string;

  @OneToMany(() => TaskType, (taskType) => taskType.type)
  taskTypes: TaskType[];
}

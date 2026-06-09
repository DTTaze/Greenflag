import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

import { AuditWithTimezone } from '@shared/common/audit.entity';

@Entity('system_configs')
export class SystemConfig extends AuditWithTimezone {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 100, unique: true })
  key: string;

  @Column({ type: 'text' })
  value: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ name: 'is_active', type: 'boolean', default: true })
  isActive: boolean;
}

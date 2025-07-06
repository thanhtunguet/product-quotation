import { Column, Index } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { BaseEntity } from './base.entity';

export abstract class MasterDataEntity extends BaseEntity {
  @Column({ type: 'varchar', length: 255 })
  @ApiProperty()
  name: string;

  @Column({ type: 'varchar', length: 100, unique: true })
  @Index()
  @ApiProperty()
  code: string;

  @Column({ type: 'text', nullable: true })
  @ApiProperty({ required: false })
  description?: string;

  @Column({ type: 'boolean', default: true })
  @ApiProperty({ default: true })
  isActive: boolean;
}
import { Entity, Column } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { MasterDataEntity } from './master-data.entity';

@Entity('colors')
export class Color extends MasterDataEntity {
  @Column({ type: 'varchar', length: 7, nullable: true })
  @ApiProperty({ required: false, description: 'Hex color code' })
  hexCode?: string;
}
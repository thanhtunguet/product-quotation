import { 
  CreateDateColumn, 
  UpdateDateColumn, 
  DeleteDateColumn, 
  PrimaryGeneratedColumn,
  Column
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

export abstract class BaseEntity {
  @PrimaryGeneratedColumn()
  @ApiProperty()
  id: number;

  @CreateDateColumn()
  @ApiProperty()
  createdAt: Date;

  @UpdateDateColumn()
  @ApiProperty()
  updatedAt: Date;

  @DeleteDateColumn()
  @ApiProperty({ required: false })
  deletedAt?: Date;

  @Column({ default: 1 })
  @ApiProperty({ required: false })
  createdBy?: number;

  @Column({ default: 1 })
  @ApiProperty({ required: false })
  updatedBy?: number;
}
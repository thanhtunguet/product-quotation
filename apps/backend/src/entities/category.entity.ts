import { Entity, Column, ManyToOne, OneToMany, JoinColumn, Index } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { BaseEntity } from './base.entity';

@Entity('categories')
@Index(['parentId'])
export class Category extends BaseEntity {
  @Column({ type: 'varchar', length: 255 })
  @ApiProperty()
  name: string;

  @Column({ type: 'varchar', length: 100, unique: true })
  @ApiProperty()
  code: string;

  @Column({ type: 'text', nullable: true })
  @ApiProperty({ required: false })
  description?: string;

  @Column({ type: 'int', nullable: true })
  @ApiProperty({ required: false })
  parentId?: number;

  @Column({ type: 'boolean', default: true })
  @ApiProperty({ default: true })
  isActive: boolean;

  // Self-referencing relationship
  @ManyToOne(() => Category, (category) => category.children, { nullable: true })
  @JoinColumn({ name: 'parentId' })
  parent?: Category;

  @OneToMany(() => Category, (category) => category.parent)
  children: Category[];
}
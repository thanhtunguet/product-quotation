import { Entity, Column, OneToMany, Index } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { BaseEntity } from './base.entity';
import { ProductAttributeValue } from './product-attribute-value.entity';

export enum AttributeDataType {
  TEXT = 'TEXT',
  NUMBER = 'NUMBER',
}

@Entity('product_attributes')
export class ProductAttribute extends BaseEntity {
  @Column({ type: 'varchar', length: 255 })
  @ApiProperty()
  name: string;

  @Column({ type: 'varchar', length: 100, unique: true })
  @Index()
  @ApiProperty()
  code: string;

  @Column({ type: 'enum', enum: AttributeDataType, default: AttributeDataType.TEXT })
  @ApiProperty({ enum: AttributeDataType })
  dataType: AttributeDataType;

  @Column({ type: 'text', nullable: true })
  @ApiProperty({ required: false })
  description?: string;

  @Column({ type: 'boolean', default: false })
  @ApiProperty({ default: false })
  isRequired: boolean;

  @Column({ type: 'boolean', default: true })
  @ApiProperty({ default: true })
  isActive: boolean;

  @OneToMany(() => ProductAttributeValue, (value) => value.attribute)
  values: ProductAttributeValue[];
}
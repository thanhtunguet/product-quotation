import { Entity, Column, ManyToOne, JoinColumn, Index } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { BaseEntity } from './base.entity';
import { ProductAttribute } from './product-attribute.entity';

@Entity('product_attribute_values')
@Index(['attributeId'])
export class ProductAttributeValue extends BaseEntity {
  @Column({ type: 'int' })
  @ApiProperty()
  attributeId: number;

  @Column({ type: 'varchar', length: 500 })
  @ApiProperty()
  value: string;

  @Column({ type: 'int', default: 0 })
  @ApiProperty({ default: 0 })
  displayOrder: number;

  @Column({ type: 'boolean', default: true })
  @ApiProperty({ default: true })
  isActive: boolean;

  @ManyToOne(() => ProductAttribute, (attribute) => attribute.values)
  @JoinColumn({ name: 'attributeId' })
  attribute: ProductAttribute;
}
import { Entity, Column, ManyToOne, JoinColumn, Index } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { BaseEntity } from './base.entity';
import { Product } from './product.entity';
import { ProductAttribute } from './product-attribute.entity';

@Entity('product_dynamic_attributes')
@Index(['productId', 'attributeId'])
export class ProductDynamicAttribute extends BaseEntity {
  @Column({ type: 'int' })
  @ApiProperty()
  productId: number;

  @Column({ type: 'int' })
  @ApiProperty()
  attributeId: number;

  @Column({ type: 'text', nullable: true })
  @ApiProperty({ required: false })
  textValue?: string;

  @Column({ type: 'decimal', precision: 15, scale: 4, nullable: true })
  @ApiProperty({ required: false })
  numberValue?: number;

  @ManyToOne(() => Product, (product) => product.dynamicAttributes)
  @JoinColumn({ name: 'productId' })
  product: Product;

  @ManyToOne(() => ProductAttribute)
  @JoinColumn({ name: 'attributeId' })
  attribute: ProductAttribute;
}
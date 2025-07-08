import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Products } from './Products';
import { ProductAttributes } from './ProductAttributes';

@Index('unique_product_attribute', ['productId', 'attributeId'], {
  unique: true,
})
@Index('idx_product_id', ['productId'], {})
@Index('idx_attribute_id', ['attributeId'], {})
@Index('idx_deleted', ['deletedAt'], {})
@Entity('ProductDynamicAttributes', { schema: 'product_quotation' })
export class ProductDynamicAttributes {
  @PrimaryGeneratedColumn({ type: 'int', name: 'id' })
  id: number;

  @Column('int', { name: 'productId' })
  productId: number;

  @Column('int', { name: 'attributeId' })
  attributeId: number;

  @Column('text', { name: 'textValue', nullable: true })
  textValue: string | null;

  @Column('decimal', {
    name: 'numberValue',
    nullable: true,
    precision: 15,
    scale: 4,
  })
  numberValue: string | null;

  @Column('timestamp', {
    name: 'createdAt',
    nullable: true,
    default: () => 'CURRENT_TIMESTAMP',
  })
  createdAt: Date | null;

  @Column('timestamp', {
    name: 'updatedAt',
    nullable: true,
    default: () => 'CURRENT_TIMESTAMP',
  })
  updatedAt: Date | null;

  @Column('varchar', { name: 'createdBy', nullable: true, length: 100 })
  createdBy: string | null;

  @Column('varchar', { name: 'updatedBy', nullable: true, length: 100 })
  updatedBy: string | null;

  @Column('timestamp', { name: 'deletedAt', nullable: true })
  deletedAt: Date | null;

  @ManyToOne(() => Products, (products) => products.productDynamicAttributes, {
    onDelete: 'CASCADE',
    onUpdate: 'RESTRICT',
  })
  @JoinColumn([{ name: 'productId', referencedColumnName: 'id' }])
  product: Products;

  @ManyToOne(
    () => ProductAttributes,
    (productAttributes) => productAttributes.productDynamicAttributes,
    { onDelete: 'CASCADE', onUpdate: 'RESTRICT' }
  )
  @JoinColumn([{ name: 'attributeId', referencedColumnName: 'id' }])
  attribute: ProductAttributes;
}

import {
  Column,
  Entity,
  Index,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { ProductDynamicAttributes } from './ProductDynamicAttributes';
import { ProductAttributeValues } from './ProductAttributeValues';

@Index('code', ['code'], { unique: true })
@Index('idx_code', ['code'], {})
@Index('idx_data_type', ['dataType'], {})
@Index('idx_active_deleted', ['isActive', 'deletedAt'], {})
@Entity('ProductAttributes', { schema: 'product_quotation' })
export class ProductAttributes {
  @PrimaryGeneratedColumn({ type: 'int', name: 'id' })
  id: number;

  @Column('varchar', { name: 'name', length: 255 })
  name: string;

  @Column('varchar', { name: 'code', unique: true, length: 100 })
  code: string;

  @Column('enum', {
    name: 'dataType',
    enum: ['TEXT', 'NUMBER'],
    default: () => "'TEXT'",
  })
  dataType: 'TEXT' | 'NUMBER';

  @Column('text', { name: 'description', nullable: true })
  description: string | null;

  @Column('tinyint', { name: 'isRequired', width: 1, default: () => "'0'" })
  isRequired: boolean;

  @Column('tinyint', { name: 'isActive', width: 1, default: () => "'1'" })
  isActive: boolean;

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

  @OneToMany(
    () => ProductDynamicAttributes,
    (productDynamicAttributes) => productDynamicAttributes.attribute
  )
  productDynamicAttributes: ProductDynamicAttributes[];

  @OneToMany(
    () => ProductAttributeValues,
    (productAttributeValues) => productAttributeValues.attribute
  )
  productAttributeValues: ProductAttributeValues[];
}

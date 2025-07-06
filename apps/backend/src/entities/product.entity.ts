import { Entity, Column, ManyToOne, JoinColumn, OneToMany, Index } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { BaseEntity } from './base.entity';
import { Category } from './category.entity';
import { Brand } from './brand.entity';
import { Manufacturer } from './manufacturer.entity';
import { Material } from './material.entity';
import { ManufacturingMethod } from './manufacturing-method.entity';
import { Color } from './color.entity';
import { Size } from './size.entity';
import { ProductType } from './product-type.entity';
import { PackagingType } from './packaging-type.entity';
import { ProductDynamicAttribute } from './product-dynamic-attribute.entity';

@Entity('products')
@Index(['categoryId', 'brandId', 'isActive'])
export class Product extends BaseEntity {
  @Column({ type: 'varchar', length: 255 })
  @ApiProperty()
  name: string;

  @Column({ type: 'varchar', length: 100, unique: true })
  @Index()
  @ApiProperty()
  code: string;

  @Column({ type: 'varchar', length: 100, nullable: true, unique: true })
  @Index()
  @ApiProperty({ required: false })
  sku?: string;

  @Column({ type: 'int' })
  @ApiProperty()
  categoryId: number;

  @Column({ type: 'int', nullable: true })
  @ApiProperty({ required: false })
  brandId?: number;

  @Column({ type: 'int', nullable: true })
  @ApiProperty({ required: false })
  manufacturerId?: number;

  @Column({ type: 'int', nullable: true })
  @ApiProperty({ required: false })
  materialId?: number;

  @Column({ type: 'int', nullable: true })
  @ApiProperty({ required: false })
  manufacturingMethodId?: number;

  @Column({ type: 'int', nullable: true })
  @ApiProperty({ required: false })
  colorId?: number;

  @Column({ type: 'int', nullable: true })
  @ApiProperty({ required: false })
  sizeId?: number;

  @Column({ type: 'int', nullable: true })
  @ApiProperty({ required: false })
  productTypeId?: number;

  @Column({ type: 'int', nullable: true })
  @ApiProperty({ required: false })
  packagingTypeId?: number;

  @Column({ type: 'varchar', length: 1000, nullable: true })
  @ApiProperty({ required: false })
  imageUrl?: string;

  @Column({ type: 'text', nullable: true })
  @ApiProperty({ required: false })
  description?: string;

  @Column({ type: 'decimal', precision: 15, scale: 2, default: 0.00 })
  @ApiProperty({ default: 0.00 })
  basePrice: number;

  @Column({ type: 'boolean', default: true })
  @ApiProperty({ default: true })
  isActive: boolean;

  // Relationships
  @ManyToOne(() => Category)
  @JoinColumn({ name: 'categoryId' })
  category: Category;

  @ManyToOne(() => Brand)
  @JoinColumn({ name: 'brandId' })
  brand?: Brand;

  @ManyToOne(() => Manufacturer)
  @JoinColumn({ name: 'manufacturerId' })
  manufacturer?: Manufacturer;

  @ManyToOne(() => Material)
  @JoinColumn({ name: 'materialId' })
  material?: Material;

  @ManyToOne(() => ManufacturingMethod)
  @JoinColumn({ name: 'manufacturingMethodId' })
  manufacturingMethod?: ManufacturingMethod;

  @ManyToOne(() => Color)
  @JoinColumn({ name: 'colorId' })
  color?: Color;

  @ManyToOne(() => Size)
  @JoinColumn({ name: 'sizeId' })
  size?: Size;

  @ManyToOne(() => ProductType)
  @JoinColumn({ name: 'productTypeId' })
  productType?: ProductType;

  @ManyToOne(() => PackagingType)
  @JoinColumn({ name: 'packagingTypeId' })
  packagingType?: PackagingType;

  @OneToMany(() => ProductDynamicAttribute, (attr) => attr.product)
  dynamicAttributes: ProductDynamicAttribute[];
}
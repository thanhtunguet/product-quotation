import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { ProductDynamicAttributes } from './ProductDynamicAttributes';
import { QuotationItems } from './QuotationItems';
import { Categories } from './Categories';
import { Brands } from './Brands';
import { Manufacturers } from './Manufacturers';
import { Materials } from './Materials';
import { ManufacturingMethods } from './ManufacturingMethods';
import { Colors } from './Colors';
import { Sizes } from './Sizes';
import { ProductTypes } from './ProductTypes';
import { PackagingTypes } from './PackagingTypes';

@Index('code', ['code'], { unique: true })
@Index('sku', ['sku'], { unique: true })
@Index('idx_code', ['code'], {})
@Index('idx_sku', ['sku'], {})
@Index('idx_category_id', ['categoryId'], {})
@Index('idx_brand_id', ['brandId'], {})
@Index('idx_manufacturer_id', ['manufacturerId'], {})
@Index('idx_active_deleted', ['isActive', 'deletedAt'], {})
@Index('materialId', ['materialId'], {})
@Index('manufacturingMethodId', ['manufacturingMethodId'], {})
@Index('colorId', ['colorId'], {})
@Index('sizeId', ['sizeId'], {})
@Index('productTypeId', ['productTypeId'], {})
@Index('packagingTypeId', ['packagingTypeId'], {})
@Entity('Products', { schema: 'product_quotation' })
export class Products {
  @PrimaryGeneratedColumn({ type: 'int', name: 'id' })
  id: number;

  @Column('varchar', { name: 'name', length: 255 })
  name: string;

  @Column('varchar', { name: 'code', unique: true, length: 100 })
  code: string;

  @Column('varchar', { name: 'sku', nullable: true, unique: true, length: 100 })
  sku: string | null;

  @Column('int', { name: 'categoryId' })
  categoryId: number;

  @Column('int', { name: 'brandId', nullable: true })
  brandId: number | null;

  @Column('int', { name: 'manufacturerId', nullable: true })
  manufacturerId: number | null;

  @Column('int', { name: 'materialId', nullable: true })
  materialId: number | null;

  @Column('int', { name: 'manufacturingMethodId', nullable: true })
  manufacturingMethodId: number | null;

  @Column('int', { name: 'colorId', nullable: true })
  colorId: number | null;

  @Column('int', { name: 'sizeId', nullable: true })
  sizeId: number | null;

  @Column('int', { name: 'productTypeId', nullable: true })
  productTypeId: number | null;

  @Column('int', { name: 'packagingTypeId', nullable: true })
  packagingTypeId: number | null;

  @Column('varchar', { name: 'imageUrl', nullable: true, length: 1000 })
  imageUrl: string | null;

  @Column('text', { name: 'description', nullable: true })
  description: string | null;

  @Column('decimal', {
    name: 'basePrice',
    precision: 15,
    scale: 2,
    default: () => "'0.00'",
  })
  basePrice: string;

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
    (productDynamicAttributes) => productDynamicAttributes.product
  )
  productDynamicAttributes: ProductDynamicAttributes[];

  @OneToMany(() => QuotationItems, (quotationItems) => quotationItems.product)
  quotationItems: QuotationItems[];

  @ManyToOne(() => Categories, (categories) => categories.products, {
    onDelete: 'RESTRICT',
    onUpdate: 'RESTRICT',
  })
  @JoinColumn([{ name: 'categoryId', referencedColumnName: 'id' }])
  category: Categories;

  @ManyToOne(() => Brands, (brands) => brands.products, {
    onDelete: 'RESTRICT',
    onUpdate: 'RESTRICT',
  })
  @JoinColumn([{ name: 'brandId', referencedColumnName: 'id' }])
  brand: Brands;

  @ManyToOne(() => Manufacturers, (manufacturers) => manufacturers.products, {
    onDelete: 'RESTRICT',
    onUpdate: 'RESTRICT',
  })
  @JoinColumn([{ name: 'manufacturerId', referencedColumnName: 'id' }])
  manufacturer: Manufacturers;

  @ManyToOne(() => Materials, (materials) => materials.products, {
    onDelete: 'RESTRICT',
    onUpdate: 'RESTRICT',
  })
  @JoinColumn([{ name: 'materialId', referencedColumnName: 'id' }])
  material: Materials;

  @ManyToOne(
    () => ManufacturingMethods,
    (manufacturingMethods) => manufacturingMethods.products,
    { onDelete: 'RESTRICT', onUpdate: 'RESTRICT' }
  )
  @JoinColumn([{ name: 'manufacturingMethodId', referencedColumnName: 'id' }])
  manufacturingMethod: ManufacturingMethods;

  @ManyToOne(() => Colors, (colors) => colors.products, {
    onDelete: 'RESTRICT',
    onUpdate: 'RESTRICT',
  })
  @JoinColumn([{ name: 'colorId', referencedColumnName: 'id' }])
  color: Colors;

  @ManyToOne(() => Sizes, (sizes) => sizes.products, {
    onDelete: 'RESTRICT',
    onUpdate: 'RESTRICT',
  })
  @JoinColumn([{ name: 'sizeId', referencedColumnName: 'id' }])
  size: Sizes;

  @ManyToOne(() => ProductTypes, (productTypes) => productTypes.products, {
    onDelete: 'RESTRICT',
    onUpdate: 'RESTRICT',
  })
  @JoinColumn([{ name: 'productTypeId', referencedColumnName: 'id' }])
  productType: ProductTypes;

  @ManyToOne(
    () => PackagingTypes,
    (packagingTypes) => packagingTypes.products,
    { onDelete: 'RESTRICT', onUpdate: 'RESTRICT' }
  )
  @JoinColumn([{ name: 'packagingTypeId', referencedColumnName: 'id' }])
  packagingType: PackagingTypes;
}

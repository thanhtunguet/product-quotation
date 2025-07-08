import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ProductDynamicAttributes, Products } from '../../entities';

export interface DynamicAttributeDto {
  attributeId: number;
  value: string;
}

export interface CreateProductDto {
  name: string;
  code: string;
  sku?: string;
  categoryId: number;
  brandId?: number;
  manufacturerId?: number;
  materialId?: number;
  manufacturingMethodId?: number;
  colorId?: number;
  sizeId?: number;
  productTypeId?: number;
  packagingTypeId?: number;
  imageUrl?: string;
  description?: string;
  basePrice?: number;
  isActive?: boolean;
  dynamicAttributes?: DynamicAttributeDto[];
}

export interface UpdateProductDto {
  name?: string;
  code?: string;
  sku?: string;
  categoryId?: number;
  brandId?: number;
  manufacturerId?: number;
  materialId?: number;
  manufacturingMethodId?: number;
  colorId?: number;
  sizeId?: number;
  productTypeId?: number;
  packagingTypeId?: number;
  imageUrl?: string;
  description?: string;
  basePrice?: number;
  isActive?: boolean;
  dynamicAttributes?: DynamicAttributeDto[];
}

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Products)
    private readonly productRepository: Repository<Products>,
    @InjectRepository(ProductDynamicAttributes)
    private readonly productDynamicAttributesRepository: Repository<ProductDynamicAttributes>
  ) {}

  async create(createProductDto: CreateProductDto): Promise<Products> {
    const { dynamicAttributes, ...productData } = createProductDto;

    // Create product
    const product = this.productRepository.create({
      ...productData,
      basePrice: productData.basePrice?.toString() || '0.00',
    });

    const savedProduct = await this.productRepository.save(product);

    // Handle dynamic attributes
    if (dynamicAttributes && dynamicAttributes.length > 0) {
      await this.saveDynamicAttributes(savedProduct.id, dynamicAttributes);
    }

    return this.findOne(savedProduct.id);
  }

  async findAll(
    page = 1,
    limit = 10
  ): Promise<{ products: Products[]; total: number }> {
    const [products, total] = await this.productRepository.findAndCount({
      where: { isActive: true },
      relations: [
        'category',
        'brand',
        'manufacturer',
        'material',
        'manufacturingMethod',
        'color',
        'size',
        'productType',
        'packagingType',
        'productDynamicAttributes',
        'productDynamicAttributes.attribute',
      ],
      order: { createdAt: 'DESC' },
      skip: (page - 1) * limit,
      take: limit,
    });

    return { products, total };
  }

  async findOne(id: number): Promise<Products> {
    const product = await this.productRepository.findOne({
      where: { id, isActive: true },
      relations: [
        'category',
        'brand',
        'manufacturer',
        'material',
        'manufacturingMethod',
        'color',
        'size',
        'productType',
        'packagingType',
        'productDynamicAttributes',
        'productDynamicAttributes.attribute',
      ],
    });

    if (!product) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }

    return product;
  }

  async update(
    id: number,
    updateProductDto: UpdateProductDto
  ): Promise<Products> {
    const { dynamicAttributes, ...productData } = updateProductDto;

    const product = await this.productRepository.findOne({
      where: { id, isActive: true },
    });

    if (!product) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }

    // Update product
    Object.assign(product, {
      ...productData,
      basePrice: productData.basePrice?.toString() || product.basePrice,
    });

    await this.productRepository.save(product);

    // Handle dynamic attributes
    if (dynamicAttributes !== undefined) {
      // Remove existing dynamic attributes
      await this.productDynamicAttributesRepository.delete({ productId: id });

      // Add new dynamic attributes
      if (dynamicAttributes.length > 0) {
        await this.saveDynamicAttributes(id, dynamicAttributes);
      }
    }

    return this.findOne(id);
  }

  async remove(id: number): Promise<void> {
    const product = await this.productRepository.findOne({
      where: { id, isActive: true },
    });

    if (!product) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }

    await this.productRepository.softDelete(id);
  }

  async findByCode(code: string): Promise<Products | null> {
    return await this.productRepository.findOne({
      where: { code, isActive: true },
      relations: [
        'category',
        'brand',
        'manufacturer',
        'material',
        'manufacturingMethod',
        'color',
        'size',
        'productType',
        'packagingType',
        'productDynamicAttributes',
        'productDynamicAttributes.attribute',
      ],
    });
  }

  async findBySku(sku: string): Promise<Products | null> {
    return await this.productRepository.findOne({
      where: { sku, isActive: true },
      relations: [
        'category',
        'brand',
        'manufacturer',
        'material',
        'manufacturingMethod',
        'color',
        'size',
        'productType',
        'packagingType',
        'productDynamicAttributes',
        'productDynamicAttributes.attribute',
      ],
    });
  }

  async search(
    term: string,
    page = 1,
    limit = 10
  ): Promise<{ products: Products[]; total: number }> {
    const queryBuilder = this.productRepository
      .createQueryBuilder('product')
      .leftJoinAndSelect('product.category', 'category')
      .leftJoinAndSelect('product.brand', 'brand')
      .leftJoinAndSelect('product.manufacturer', 'manufacturer')
      .leftJoinAndSelect('product.material', 'material')
      .leftJoinAndSelect('product.manufacturingMethod', 'manufacturingMethod')
      .leftJoinAndSelect('product.color', 'color')
      .leftJoinAndSelect('product.size', 'size')
      .leftJoinAndSelect('product.productType', 'productType')
      .leftJoinAndSelect('product.packagingType', 'packagingType')
      .leftJoinAndSelect(
        'product.productDynamicAttributes',
        'productDynamicAttributes'
      )
      .leftJoinAndSelect('productDynamicAttributes.attribute', 'attribute')
      .where('product.isActive = true')
      .andWhere(
        '(product.name LIKE :term OR product.code LIKE :term OR product.sku LIKE :term OR product.description LIKE :term)',
        { term: `%${term}%` }
      )
      .orderBy('product.createdAt', 'DESC')
      .skip((page - 1) * limit)
      .take(limit);

    const [products, total] = await queryBuilder.getManyAndCount();

    return { products, total };
  }

  async findByCategory(
    categoryId: number,
    page = 1,
    limit = 10
  ): Promise<{ products: Products[]; total: number }> {
    const [products, total] = await this.productRepository.findAndCount({
      where: { categoryId, isActive: true },
      relations: [
        'category',
        'brand',
        'manufacturer',
        'material',
        'manufacturingMethod',
        'color',
        'size',
        'productType',
        'packagingType',
        'productDynamicAttributes',
        'productDynamicAttributes.attribute',
      ],
      order: { createdAt: 'DESC' },
      skip: (page - 1) * limit,
      take: limit,
    });

    return { products, total };
  }

  private async saveDynamicAttributes(
    productId: number,
    dynamicAttributes: DynamicAttributeDto[]
  ): Promise<void> {
    const dynamicAttributeEntities = dynamicAttributes.map((attr) =>
      this.productDynamicAttributesRepository.create({
        productId,
        attributeId: attr.attributeId,
        value: attr.value,
      })
    );

    await this.productDynamicAttributesRepository.save(
      dynamicAttributeEntities
    );
  }
}

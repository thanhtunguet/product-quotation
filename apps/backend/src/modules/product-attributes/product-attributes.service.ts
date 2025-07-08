import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ProductAttributes } from '../../entities';

export interface CreateProductAttributeDto {
  name: string;
  code: string;
  dataType: 'TEXT' | 'NUMBER';
  description?: string;
  isRequired?: boolean;
  isActive?: boolean;
}

export interface UpdateProductAttributeDto {
  name?: string;
  code?: string;
  dataType?: 'TEXT' | 'NUMBER';
  description?: string;
  isRequired?: boolean;
  isActive?: boolean;
}

@Injectable()
export class ProductAttributesService {
  constructor(
    @InjectRepository(ProductAttributes)
    private readonly productAttributeRepository: Repository<ProductAttributes>
  ) {}

  async create(
    createProductAttributeDto: CreateProductAttributeDto
  ): Promise<ProductAttributes> {
    const productAttribute = this.productAttributeRepository.create(
      createProductAttributeDto
    );
    return await this.productAttributeRepository.save(productAttribute);
  }

  async findAll(): Promise<ProductAttributes[]> {
    return await this.productAttributeRepository.find({
      where: { isActive: true },
      order: { name: 'ASC' },
    });
  }

  async findOne(id: number): Promise<ProductAttributes> {
    const productAttribute = await this.productAttributeRepository.findOne({
      where: { id, isActive: true },
      relations: ['productAttributeValues'],
    });
    if (!productAttribute) {
      throw new NotFoundException(`Product attribute with ID ${id} not found`);
    }
    return productAttribute;
  }

  async update(
    id: number,
    updateProductAttributeDto: UpdateProductAttributeDto
  ): Promise<ProductAttributes> {
    const productAttribute = await this.findOne(id);
    Object.assign(productAttribute, updateProductAttributeDto);
    return await this.productAttributeRepository.save(productAttribute);
  }

  async remove(id: number): Promise<void> {
    await this.findOne(id);
    await this.productAttributeRepository.softDelete(id);
  }

  async findByCode(code: string): Promise<ProductAttributes | null> {
    return await this.productAttributeRepository.findOne({
      where: { code, isActive: true },
      relations: ['productAttributeValues'],
    });
  }

  async search(term: string): Promise<ProductAttributes[]> {
    return await this.productAttributeRepository
      .createQueryBuilder('attribute')
      .where('attribute.isActive = true')
      .andWhere('(attribute.name LIKE :term OR attribute.code LIKE :term)', {
        term: `%${term}%`,
      })
      .orderBy('attribute.name', 'ASC')
      .getMany();
  }

  async findByDataType(
    dataType: 'TEXT' | 'NUMBER'
  ): Promise<ProductAttributes[]> {
    return await this.productAttributeRepository.find({
      where: { dataType, isActive: true },
      order: { name: 'ASC' },
    });
  }

  async findRequired(): Promise<ProductAttributes[]> {
    return await this.productAttributeRepository.find({
      where: { isRequired: true, isActive: true },
      order: { name: 'ASC' },
    });
  }
}

import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ProductTypes } from '../../entities';
import {
  CreateMasterDataDto,
  UpdateMasterDataDto,
} from '../../dto/master-data.dto';

@Injectable()
export class ProductTypesService {
  constructor(
    @InjectRepository(ProductTypes)
    private readonly productTypeRepository: Repository<ProductTypes>
  ) {}

  async create(
    createProductTypeDto: CreateMasterDataDto
  ): Promise<ProductTypes> {
    const productType = this.productTypeRepository.create(createProductTypeDto);
    return await this.productTypeRepository.save(productType);
  }

  async findAll(): Promise<ProductTypes[]> {
    return await this.productTypeRepository.find({
      where: { isActive: true },
      order: { name: 'ASC' },
    });
  }

  async findOne(id: number): Promise<ProductTypes> {
    const productType = await this.productTypeRepository.findOne({
      where: { id, isActive: true },
    });
    if (!productType) {
      throw new NotFoundException(`Product type with ID ${id} not found`);
    }
    return productType;
  }

  async update(
    id: number,
    updateProductTypeDto: UpdateMasterDataDto
  ): Promise<ProductTypes> {
    const productType = await this.findOne(id);
    Object.assign(productType, updateProductTypeDto);
    return await this.productTypeRepository.save(productType);
  }

  async remove(id: number): Promise<void> {
    await this.findOne(id);
    await this.productTypeRepository.softDelete(id);
  }

  async findByCode(code: string): Promise<ProductTypes | null> {
    return await this.productTypeRepository.findOne({
      where: { code, isActive: true },
    });
  }

  async search(term: string): Promise<ProductTypes[]> {
    return await this.productTypeRepository
      .createQueryBuilder('productType')
      .where('productType.isActive = true')
      .andWhere(
        '(productType.name LIKE :term OR productType.code LIKE :term)',
        {
          term: `%${term}%`,
        }
      )
      .orderBy('productType.name', 'ASC')
      .getMany();
  }
}

import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PackagingTypes } from '../../entities';
import {
  CreateMasterDataDto,
  UpdateMasterDataDto,
} from '../../dto/master-data.dto';

@Injectable()
export class PackagingTypesService {
  constructor(
    @InjectRepository(PackagingTypes)
    private readonly packagingTypeRepository: Repository<PackagingTypes>
  ) {}

  async create(
    createPackagingTypeDto: CreateMasterDataDto
  ): Promise<PackagingTypes> {
    const packagingType = this.packagingTypeRepository.create(
      createPackagingTypeDto
    );
    return await this.packagingTypeRepository.save(packagingType);
  }

  async findAll(): Promise<PackagingTypes[]> {
    return await this.packagingTypeRepository.find({
      where: { isActive: true },
      order: { name: 'ASC' },
    });
  }

  async findOne(id: number): Promise<PackagingTypes> {
    const packagingType = await this.packagingTypeRepository.findOne({
      where: { id, isActive: true },
    });
    if (!packagingType) {
      throw new NotFoundException(`Packaging type with ID ${id} not found`);
    }
    return packagingType;
  }

  async update(
    id: number,
    updatePackagingTypeDto: UpdateMasterDataDto
  ): Promise<PackagingTypes> {
    const packagingType = await this.findOne(id);
    Object.assign(packagingType, updatePackagingTypeDto);
    return await this.packagingTypeRepository.save(packagingType);
  }

  async remove(id: number): Promise<void> {
    await this.findOne(id);
    await this.packagingTypeRepository.softDelete(id);
  }

  async findByCode(code: string): Promise<PackagingTypes | null> {
    return await this.packagingTypeRepository.findOne({
      where: { code, isActive: true },
    });
  }

  async search(term: string): Promise<PackagingTypes[]> {
    return await this.packagingTypeRepository
      .createQueryBuilder('packagingType')
      .where('packagingType.isActive = true')
      .andWhere(
        '(packagingType.name LIKE :term OR packagingType.code LIKE :term)',
        {
          term: `%${term}%`,
        }
      )
      .orderBy('packagingType.name', 'ASC')
      .getMany();
  }
}

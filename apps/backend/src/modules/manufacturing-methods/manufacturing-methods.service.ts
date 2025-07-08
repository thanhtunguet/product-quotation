import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ManufacturingMethods } from '../../entities';
import {
  CreateMasterDataDto,
  UpdateMasterDataDto,
} from '../../dto/master-data.dto';

@Injectable()
export class ManufacturingMethodsService {
  constructor(
    @InjectRepository(ManufacturingMethods)
    private readonly manufacturingMethodRepository: Repository<ManufacturingMethods>
  ) {}

  async create(
    createManufacturingMethodDto: CreateMasterDataDto
  ): Promise<ManufacturingMethods> {
    const manufacturingMethod = this.manufacturingMethodRepository.create(
      createManufacturingMethodDto
    );
    return await this.manufacturingMethodRepository.save(manufacturingMethod);
  }

  async findAll(): Promise<ManufacturingMethods[]> {
    return await this.manufacturingMethodRepository.find({
      where: { isActive: true },
      order: { name: 'ASC' },
    });
  }

  async findOne(id: number): Promise<ManufacturingMethods> {
    const manufacturingMethod =
      await this.manufacturingMethodRepository.findOne({
        where: { id, isActive: true },
      });
    if (!manufacturingMethod) {
      throw new NotFoundException(
        `Manufacturing method with ID ${id} not found`
      );
    }
    return manufacturingMethod;
  }

  async update(
    id: number,
    updateManufacturingMethodDto: UpdateMasterDataDto
  ): Promise<ManufacturingMethods> {
    const manufacturingMethod = await this.findOne(id);
    Object.assign(manufacturingMethod, updateManufacturingMethodDto);
    return await this.manufacturingMethodRepository.save(manufacturingMethod);
  }

  async remove(id: number): Promise<void> {
    await this.findOne(id);
    await this.manufacturingMethodRepository.softDelete(id);
  }

  async findByCode(code: string): Promise<ManufacturingMethods | null> {
    return await this.manufacturingMethodRepository.findOne({
      where: { code, isActive: true },
    });
  }

  async search(term: string): Promise<ManufacturingMethods[]> {
    return await this.manufacturingMethodRepository
      .createQueryBuilder('manufacturingMethod')
      .where('manufacturingMethod.isActive = true')
      .andWhere(
        '(manufacturingMethod.name LIKE :term OR manufacturingMethod.code LIKE :term)',
        {
          term: `%${term}%`,
        }
      )
      .orderBy('manufacturingMethod.name', 'ASC')
      .getMany();
  }
}

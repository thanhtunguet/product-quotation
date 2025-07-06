import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Materials } from '../../entities';
import { CreateMasterDataDto, UpdateMasterDataDto } from '../../dto/master-data.dto';

@Injectable()
export class MaterialsService {
  constructor(
    @InjectRepository(Materials)
    private readonly materialRepository: Repository<Materials>,
  ) {}

  async create(createMaterialDto: CreateMasterDataDto): Promise<Materials> {
    const material = this.materialRepository.create(createMaterialDto);
    return await this.materialRepository.save(material);
  }

  async findAll(): Promise<Materials[]> {
    return await this.materialRepository.find({
      where: { isActive: true },
      order: { name: 'ASC' },
    });
  }

  async findOne(id: number): Promise<Materials> {
    const material = await this.materialRepository.findOne({
      where: { id, isActive: true },
    });
    if (!material) {
      throw new NotFoundException(`Material with ID ${id} not found`);
    }
    return material;
  }

  async update(id: number, updateMaterialDto: UpdateMasterDataDto): Promise<Materials> {
    const material = await this.findOne(id);
    Object.assign(material, updateMaterialDto);
    return await this.materialRepository.save(material);
  }

  async remove(id: number): Promise<void> {
    await this.findOne(id);
    await this.materialRepository.softDelete(id);
  }

  async findByCode(code: string): Promise<Materials | null> {
    return await this.materialRepository.findOne({
      where: { code, isActive: true },
    });
  }

  async search(term: string): Promise<Materials[]> {
    return await this.materialRepository
      .createQueryBuilder('material')
      .where('material.isActive = true')
      .andWhere('(material.name LIKE :term OR material.code LIKE :term)', {
        term: `%${term}%`,
      })
      .orderBy('material.name', 'ASC')
      .getMany();
  }
}
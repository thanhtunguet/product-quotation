import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Colors } from '../../entities';
import {
  CreateMasterDataDto,
  UpdateMasterDataDto,
} from '../../dto/master-data.dto';

@Injectable()
export class ColorsService {
  constructor(
    @InjectRepository(Colors)
    private readonly colorRepository: Repository<Colors>
  ) {}

  async create(
    createColorDto: CreateMasterDataDto & { hexCode?: string }
  ): Promise<Colors> {
    const color = this.colorRepository.create(createColorDto);
    return await this.colorRepository.save(color);
  }

  async findAll(): Promise<Colors[]> {
    return await this.colorRepository.find({
      where: { isActive: true },
      order: { name: 'ASC' },
    });
  }

  async findOne(id: number): Promise<Colors> {
    const color = await this.colorRepository.findOne({
      where: { id, isActive: true },
    });
    if (!color) {
      throw new NotFoundException(`Color with ID ${id} not found`);
    }
    return color;
  }

  async update(
    id: number,
    updateColorDto: UpdateMasterDataDto & { hexCode?: string }
  ): Promise<Colors> {
    const color = await this.findOne(id);
    Object.assign(color, updateColorDto);
    return await this.colorRepository.save(color);
  }

  async remove(id: number): Promise<void> {
    await this.findOne(id);
    await this.colorRepository.softDelete(id);
  }

  async findByCode(code: string): Promise<Colors | null> {
    return await this.colorRepository.findOne({
      where: { code, isActive: true },
    });
  }

  async search(term: string): Promise<Colors[]> {
    return await this.colorRepository
      .createQueryBuilder('color')
      .where('color.isActive = true')
      .andWhere('(color.name LIKE :term OR color.code LIKE :term)', {
        term: `%${term}%`,
      })
      .orderBy('color.name', 'ASC')
      .getMany();
  }
}

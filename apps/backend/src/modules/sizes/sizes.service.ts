import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Sizes } from '../../entities';
import { CreateMasterDataDto, UpdateMasterDataDto } from '../../dto/master-data.dto';

@Injectable()
export class SizesService {
  constructor(
    @InjectRepository(Sizes)
    private readonly sizeRepository: Repository<Sizes>,
  ) {}

  async create(createSizeDto: CreateMasterDataDto): Promise<Sizes> {
    const size = this.sizeRepository.create(createSizeDto);
    return await this.sizeRepository.save(size);
  }

  async findAll(): Promise<Sizes[]> {
    return await this.sizeRepository.find({
      where: { isActive: true },
      order: { name: 'ASC' },
    });
  }

  async findOne(id: number): Promise<Sizes> {
    const size = await this.sizeRepository.findOne({
      where: { id, isActive: true },
    });
    if (!size) {
      throw new NotFoundException(`Size with ID ${id} not found`);
    }
    return size;
  }

  async update(id: number, updateSizeDto: UpdateMasterDataDto): Promise<Sizes> {
    const size = await this.findOne(id);
    Object.assign(size, updateSizeDto);
    return await this.sizeRepository.save(size);
  }

  async remove(id: number): Promise<void> {
    await this.findOne(id);
    await this.sizeRepository.softDelete(id);
  }

  async findByCode(code: string): Promise<Sizes | null> {
    return await this.sizeRepository.findOne({
      where: { code, isActive: true },
    });
  }

  async search(term: string): Promise<Sizes[]> {
    return await this.sizeRepository
      .createQueryBuilder('size')
      .where('size.isActive = true')
      .andWhere('(size.name LIKE :term OR size.code LIKE :term)', {
        term: `%${term}%`,
      })
      .orderBy('size.name', 'ASC')
      .getMany();
  }
}
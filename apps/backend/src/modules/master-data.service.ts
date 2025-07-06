import { Injectable, NotFoundException } from '@nestjs/common';
import { Repository, FindManyOptions } from 'typeorm';
import { MasterDataEntity } from '../entities/master-data.entity';
import { CreateMasterDataDto, UpdateMasterDataDto } from '../dto/master-data.dto';

@Injectable()
export abstract class MasterDataService<T extends MasterDataEntity> {
  constructor(protected readonly repository: Repository<T>) {}

  async create(createDto: CreateMasterDataDto): Promise<T> {
    const entity = this.repository.create(createDto);
    return await this.repository.save(entity);
  }

  async findAll(options?: FindManyOptions<T>): Promise<T[]> {
    return await this.repository.find({
      where: { isActive: true } as any,
      ...options,
    });
  }

  async findOne(id: number): Promise<T> {
    const entity = await this.repository.findOne({
      where: { id, isActive: true } as any,
    });
    if (!entity) {
      throw new NotFoundException(`Entity with ID ${id} not found`);
    }
    return entity;
  }

  async update(id: number, updateDto: UpdateMasterDataDto): Promise<T> {
    const entity = await this.findOne(id);
    Object.assign(entity, updateDto);
    return await this.repository.save(entity);
  }

  async remove(id: number): Promise<void> {
    const entity = await this.findOne(id);
    await this.repository.softDelete(id);
  }

  async findByCode(code: string): Promise<T | null> {
    return await this.repository.findOne({
      where: { code, isActive: true } as any,
    });
  }

  async search(term: string): Promise<T[]> {
    return await this.repository.createQueryBuilder('entity')
      .where('entity.isActive = true')
      .andWhere('(entity.name LIKE :term OR entity.code LIKE :term)', {
        term: `%${term}%`,
      })
      .getMany();
  }
}
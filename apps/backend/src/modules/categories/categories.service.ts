import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Categories } from '../../entities';
import { CreateCategoryDto, UpdateCategoryDto } from '../../dto/category.dto';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectRepository(Categories)
    private readonly categoryRepository: Repository<Categories>
  ) {}

  async create(createCategoryDto: CreateCategoryDto): Promise<Categories> {
    const category = this.categoryRepository.create(createCategoryDto);
    return await this.categoryRepository.save(category);
  }

  async findAll(): Promise<Categories[]> {
    return await this.categoryRepository.find({
      where: { isActive: true },
      relations: ['parent', 'children'],
    });
  }

  async findTree(): Promise<Categories[]> {
    return await this.categoryRepository
      .createQueryBuilder('category')
      .leftJoinAndSelect('category.children', 'children')
      .where('category.parentId IS NULL')
      .andWhere('category.isActive = true')
      .getMany();
  }

  async findOne(id: number): Promise<Categories> {
    const category = await this.categoryRepository.findOne({
      where: { id, isActive: true },
      relations: ['parent', 'children'],
    });
    if (!category) {
      throw new NotFoundException(`Category with ID ${id} not found`);
    }
    return category;
  }

  async update(
    id: number,
    updateCategoryDto: UpdateCategoryDto
  ): Promise<Categories> {
    const category = await this.findOne(id);
    Object.assign(category, updateCategoryDto);
    return await this.categoryRepository.save(category);
  }

  async remove(id: number): Promise<void> {
    await this.findOne(id);
    await this.categoryRepository.softDelete(id);
  }

  async findByCode(code: string): Promise<Categories | null> {
    return await this.categoryRepository.findOne({
      where: { code, isActive: true },
      relations: ['parent', 'children'],
    });
  }

  async search(term: string): Promise<Categories[]> {
    return await this.categoryRepository
      .createQueryBuilder('category')
      .where('category.isActive = true')
      .andWhere('(category.name LIKE :term OR category.code LIKE :term)', {
        term: `%${term}%`,
      })
      .leftJoinAndSelect('category.parent', 'parent')
      .leftJoinAndSelect('category.children', 'children')
      .getMany();
  }
}

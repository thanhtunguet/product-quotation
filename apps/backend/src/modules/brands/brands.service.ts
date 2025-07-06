import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Brand } from '../../entities/brand.entity';
import { MasterDataService } from '../master-data.service';

@Injectable()
export class BrandsService extends MasterDataService<Brand> {
  constructor(
    @InjectRepository(Brand)
    repository: Repository<Brand>,
  ) {
    super(repository);
  }
}
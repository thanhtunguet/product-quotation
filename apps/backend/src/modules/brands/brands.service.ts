import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Brands } from '../../entities';
import { MasterDataService } from '../master-data.service';

@Injectable()
export class BrandsService extends MasterDataService<Brands> {
  constructor(
    @InjectRepository(Brands)
    repository: Repository<Brands>
  ) {
    super(repository);
  }
}

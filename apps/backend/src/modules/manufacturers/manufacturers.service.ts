import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Manufacturer } from '../../entities/manufacturer.entity';
import { MasterDataService } from '../master-data.service';

@Injectable()
export class ManufacturersService extends MasterDataService<Manufacturer> {
  constructor(
    @InjectRepository(Manufacturer)
    repository: Repository<Manufacturer>,
  ) {
    super(repository);
  }
}
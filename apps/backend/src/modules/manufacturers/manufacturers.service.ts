import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Manufacturers } from '../../entities';
import { MasterDataService } from '../master-data.service';

@Injectable()
export class ManufacturersService extends MasterDataService<Manufacturers> {
  constructor(
    @InjectRepository(Manufacturers)
    repository: Repository<Manufacturers>
  ) {
    super(repository);
  }
}

import { Controller } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { BrandsService } from './brands.service';
import { Brands } from '../../entities';
import { MasterDataController } from '../master-data.controller';

@ApiTags('brands')
@Controller('brands')
export class BrandsController extends MasterDataController<Brands> {
  constructor(private readonly brandsService: BrandsService) {
    super(brandsService);
  }
}

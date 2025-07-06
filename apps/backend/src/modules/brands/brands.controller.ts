import { Controller } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { BrandsService } from './brands.service';
import { Brand } from '../../entities/brand.entity';
import { MasterDataController } from '../master-data.controller';

@ApiTags('brands')
@Controller('brands')
export class BrandsController extends MasterDataController<Brand> {
  constructor(private readonly brandsService: BrandsService) {
    super(brandsService);
  }
}
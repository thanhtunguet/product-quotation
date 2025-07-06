import { Controller } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ManufacturersService } from './manufacturers.service';
import { Manufacturer } from '../../entities/manufacturer.entity';
import { MasterDataController } from '../master-data.controller';

@ApiTags('manufacturers')
@Controller('manufacturers')
export class ManufacturersController extends MasterDataController<Manufacturer> {
  constructor(private readonly manufacturersService: ManufacturersService) {
    super(manufacturersService);
  }
}
import { Controller } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ManufacturersService } from './manufacturers.service';
import { Manufacturers } from '../../entities';
import { MasterDataController } from '../master-data.controller';

@ApiTags('manufacturers')
@Controller('manufacturers')
export class ManufacturersController extends MasterDataController<Manufacturers> {
  constructor(private readonly manufacturersService: ManufacturersService) {
    super(manufacturersService);
  }
}
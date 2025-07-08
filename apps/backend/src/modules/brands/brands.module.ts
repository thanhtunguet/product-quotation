import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Brands } from '../../entities';
import { BrandsService } from './brands.service';
import { BrandsController } from './brands.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Brands])],
  controllers: [BrandsController],
  providers: [BrandsService],
  exports: [BrandsService],
})
export class BrandsModule {}

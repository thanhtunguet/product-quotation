import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PackagingTypesService } from './packaging-types.service';
import { PackagingTypesController } from './packaging-types.controller';
import { PackagingTypes } from '../../entities';

@Module({
  imports: [TypeOrmModule.forFeature([PackagingTypes])],
  controllers: [PackagingTypesController],
  providers: [PackagingTypesService],
  exports: [PackagingTypesService],
})
export class PackagingTypesModule {}

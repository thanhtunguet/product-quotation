import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SizesService } from './sizes.service';
import { SizesController } from './sizes.controller';
import { Sizes } from '../../entities';

@Module({
  imports: [TypeOrmModule.forFeature([Sizes])],
  controllers: [SizesController],
  providers: [SizesService],
  exports: [SizesService],
})
export class SizesModule {}
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ColorsService } from './colors.service';
import { ColorsController } from './colors.controller';
import { Colors } from '../../entities';

@Module({
  imports: [TypeOrmModule.forFeature([Colors])],
  controllers: [ColorsController],
  providers: [ColorsService],
  exports: [ColorsService],
})
export class ColorsModule {}

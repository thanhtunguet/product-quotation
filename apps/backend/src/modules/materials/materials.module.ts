import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MaterialsService } from './materials.service';
import { MaterialsController } from './materials.controller';
import { Materials } from '../../entities';

@Module({
  imports: [TypeOrmModule.forFeature([Materials])],
  controllers: [MaterialsController],
  providers: [MaterialsService],
  exports: [MaterialsService],
})
export class MaterialsModule {}

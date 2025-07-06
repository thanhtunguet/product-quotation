import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ManufacturingMethodsService } from './manufacturing-methods.service';
import { ManufacturingMethodsController } from './manufacturing-methods.controller';
import { ManufacturingMethods } from '../../entities';

@Module({
  imports: [TypeOrmModule.forFeature([ManufacturingMethods])],
  controllers: [ManufacturingMethodsController],
  providers: [ManufacturingMethodsService],
  exports: [ManufacturingMethodsService],
})
export class ManufacturingMethodsModule {}
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductAttributesService } from './product-attributes.service';
import { ProductAttributesController } from './product-attributes.controller';
import { ProductAttributes } from '../../entities';

@Module({
  imports: [TypeOrmModule.forFeature([ProductAttributes])],
  controllers: [ProductAttributesController],
  providers: [ProductAttributesService],
  exports: [ProductAttributesService],
})
export class ProductAttributesModule {}

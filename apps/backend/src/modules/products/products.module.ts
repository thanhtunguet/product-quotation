import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductsService } from './products.service';
import { ProductsController } from './products.controller';
import { Products, ProductDynamicAttributes } from '../../entities';

@Module({
  imports: [TypeOrmModule.forFeature([Products, ProductDynamicAttributes])],
  controllers: [ProductsController],
  providers: [ProductsService],
  exports: [ProductsService],
})
export class ProductsModule {}
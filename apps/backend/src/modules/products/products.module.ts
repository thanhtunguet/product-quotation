import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductsService } from './products.service';
import { ProductsController } from './products.controller';
import { ExcelService } from './excel/excel.service';
import {
  Brands,
  Categories,
  Colors,
  Manufacturers,
  ManufacturingMethods,
  Materials,
  PackagingTypes,
  ProductAttributes,
  ProductDynamicAttributes,
  Products,
  ProductTypes,
  Sizes,
} from '../../entities';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Products,
      ProductDynamicAttributes,
      Categories,
      Brands,
      Manufacturers,
      Materials,
      ManufacturingMethods,
      Colors,
      Sizes,
      ProductTypes,
      PackagingTypes,
      ProductAttributes,
    ]),
  ],
  controllers: [ProductsController],
  providers: [ProductsService, ExcelService],
  exports: [ProductsService, ExcelService],
})
export class ProductsModule {}

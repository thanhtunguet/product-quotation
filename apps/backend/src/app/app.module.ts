import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import * as entities from '../entities';
import { CategoriesModule } from '../modules/categories/categories.module';
import { BrandsModule } from '../modules/brands/brands.module';
import { ManufacturersModule } from '../modules/manufacturers/manufacturers.module';
import { ColorsModule } from '../modules/colors/colors.module';
import { MaterialsModule } from '../modules/materials/materials.module';
import { SizesModule } from '../modules/sizes/sizes.module';
import { ProductAttributesModule } from '../modules/product-attributes/product-attributes.module';
import { ProductsModule } from '../modules/products/products.module';
import { QuotationsModule } from '../modules/quotations/quotations.module';
import { ProductTypesModule } from '../modules/product-types/product-types.module';
import { ManufacturingMethodsModule } from '../modules/manufacturing-methods/manufacturing-methods.module';
import { PackagingTypesModule } from '../modules/packaging-types/packaging-types.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env.DB_HOST || 'localhost',
      port: parseInt(process.env.DB_PORT ?? '3306') || 3306,
      username: process.env.DB_USERNAME || 'root',
      password: process.env.DB_PASSWORD || '',
      database: process.env.DB_NAME || 'product_quotation',
      entities: Object.values(entities),
      synchronize: false,
      logging: process.env.NODE_ENV !== 'production',
    }),
    CategoriesModule,
    BrandsModule,
    ManufacturersModule,
    ColorsModule,
    MaterialsModule,
    SizesModule,
    ProductAttributesModule,
    ProductsModule,
    QuotationsModule,
    ProductTypesModule,
    ManufacturingMethodsModule,
    PackagingTypesModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import * as entities from '../entities';
import { CategoriesModule } from '../modules/categories/categories.module';
import { BrandsModule } from '../modules/brands/brands.module';
import { ManufacturersModule } from '../modules/manufacturers/manufacturers.module';

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
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

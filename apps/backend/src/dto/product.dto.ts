import {
  IsArray,
  IsBoolean,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  MaxLength,
  ValidateNested,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class ProductDynamicAttributeDto {
  @IsNumber()
  @IsNotEmpty()
  @ApiProperty()
  attributeId: number;

  @IsString()
  @IsOptional()
  @ApiProperty({ required: false })
  textValue?: string;

  @IsNumber()
  @IsOptional()
  @ApiProperty({ required: false })
  numberValue?: number;
}

export class CreateProductDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  @ApiProperty()
  name: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  @ApiProperty()
  code: string;

  @IsString()
  @IsOptional()
  @MaxLength(100)
  @ApiProperty({ required: false })
  sku?: string;

  @IsNumber()
  @IsNotEmpty()
  @ApiProperty()
  categoryId: number;

  @IsNumber()
  @IsOptional()
  @ApiProperty({ required: false })
  brandId?: number;

  @IsNumber()
  @IsOptional()
  @ApiProperty({ required: false })
  manufacturerId?: number;

  @IsNumber()
  @IsOptional()
  @ApiProperty({ required: false })
  materialId?: number;

  @IsNumber()
  @IsOptional()
  @ApiProperty({ required: false })
  manufacturingMethodId?: number;

  @IsNumber()
  @IsOptional()
  @ApiProperty({ required: false })
  colorId?: number;

  @IsNumber()
  @IsOptional()
  @ApiProperty({ required: false })
  sizeId?: number;

  @IsNumber()
  @IsOptional()
  @ApiProperty({ required: false })
  productTypeId?: number;

  @IsNumber()
  @IsOptional()
  @ApiProperty({ required: false })
  packagingTypeId?: number;

  @IsString()
  @IsOptional()
  @MaxLength(1000)
  @ApiProperty({ required: false })
  imageUrl?: string;

  @IsString()
  @IsOptional()
  @ApiProperty({ required: false })
  description?: string;

  @IsNumber()
  @IsOptional()
  @ApiProperty({ required: false, default: 0.0 })
  basePrice?: number;

  @IsBoolean()
  @IsOptional()
  @ApiProperty({ required: false, default: true })
  isActive?: boolean;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ProductDynamicAttributeDto)
  @IsOptional()
  @ApiProperty({ type: [ProductDynamicAttributeDto], required: false })
  dynamicAttributes?: ProductDynamicAttributeDto[];
}

export class UpdateProductDto {
  @IsString()
  @IsOptional()
  @MaxLength(255)
  @ApiProperty({ required: false })
  name?: string;

  @IsString()
  @IsOptional()
  @MaxLength(100)
  @ApiProperty({ required: false })
  code?: string;

  @IsString()
  @IsOptional()
  @MaxLength(100)
  @ApiProperty({ required: false })
  sku?: string;

  @IsNumber()
  @IsOptional()
  @ApiProperty({ required: false })
  categoryId?: number;

  @IsNumber()
  @IsOptional()
  @ApiProperty({ required: false })
  brandId?: number;

  @IsNumber()
  @IsOptional()
  @ApiProperty({ required: false })
  manufacturerId?: number;

  @IsNumber()
  @IsOptional()
  @ApiProperty({ required: false })
  materialId?: number;

  @IsNumber()
  @IsOptional()
  @ApiProperty({ required: false })
  manufacturingMethodId?: number;

  @IsNumber()
  @IsOptional()
  @ApiProperty({ required: false })
  colorId?: number;

  @IsNumber()
  @IsOptional()
  @ApiProperty({ required: false })
  sizeId?: number;

  @IsNumber()
  @IsOptional()
  @ApiProperty({ required: false })
  productTypeId?: number;

  @IsNumber()
  @IsOptional()
  @ApiProperty({ required: false })
  packagingTypeId?: number;

  @IsString()
  @IsOptional()
  @MaxLength(1000)
  @ApiProperty({ required: false })
  imageUrl?: string;

  @IsString()
  @IsOptional()
  @ApiProperty({ required: false })
  description?: string;

  @IsNumber()
  @IsOptional()
  @ApiProperty({ required: false })
  basePrice?: number;

  @IsBoolean()
  @IsOptional()
  @ApiProperty({ required: false })
  isActive?: boolean;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ProductDynamicAttributeDto)
  @IsOptional()
  @ApiProperty({ type: [ProductDynamicAttributeDto], required: false })
  dynamicAttributes?: ProductDynamicAttributeDto[];
}

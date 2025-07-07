import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, IsNumber, IsBoolean, IsArray, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

export class ExcelImportResultDto {
  @ApiProperty({ description: 'Total number of rows processed' })
  totalRows: number;

  @ApiProperty({ description: 'Number of rows successfully imported' })
  successCount: number;

  @ApiProperty({ description: 'Number of rows with errors' })
  errorCount: number;

  @ApiProperty({ description: 'List of errors with row numbers', type: [Object] })
  errors: Array<{
    row: number;
    field: string;
    message: string;
    value: any;
  }>;

  @ApiProperty({ description: 'IDs of created products', type: [Number] })
  createdProductIds: number[];
}

export class ExcelRowErrorDto {
  @ApiProperty({ description: 'Row number where error occurred' })
  row: number;

  @ApiProperty({ description: 'Field name that caused the error' })
  field: string;

  @ApiProperty({ description: 'Error message' })
  message: string;

  @ApiProperty({ description: 'The value that caused the error' })
  value: any;
}

export class ProductImportRowDto {
  @ApiProperty({ description: 'Product name', required: true })
  @IsString()
  name: string;

  @ApiProperty({ description: 'Product code', required: true })
  @IsString()
  code: string;

  @ApiProperty({ description: 'Product SKU', required: false })
  @IsOptional()
  @IsString()
  sku?: string;

  @ApiProperty({ description: 'Category name', required: true })
  @IsString()
  categoryName: string;

  @ApiProperty({ description: 'Brand name', required: false })
  @IsOptional()
  @IsString()
  brandName?: string;

  @ApiProperty({ description: 'Manufacturer name', required: false })
  @IsOptional()
  @IsString()
  manufacturerName?: string;

  @ApiProperty({ description: 'Material name', required: false })
  @IsOptional()
  @IsString()
  materialName?: string;

  @ApiProperty({ description: 'Manufacturing method name', required: false })
  @IsOptional()
  @IsString()
  manufacturingMethodName?: string;

  @ApiProperty({ description: 'Color name', required: false })
  @IsOptional()
  @IsString()
  colorName?: string;

  @ApiProperty({ description: 'Size name', required: false })
  @IsOptional()
  @IsString()
  sizeName?: string;

  @ApiProperty({ description: 'Product type name', required: false })
  @IsOptional()
  @IsString()
  productTypeName?: string;

  @ApiProperty({ description: 'Packaging type name', required: false })
  @IsOptional()
  @IsString()
  packagingTypeName?: string;

  @ApiProperty({ description: 'Base price', required: false })
  @IsOptional()
  @IsNumber()
  basePrice?: number;

  @ApiProperty({ description: 'Image URL', required: false })
  @IsOptional()
  @IsString()
  imageUrl?: string;

  @ApiProperty({ description: 'Description', required: false })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ description: 'Is active', required: false })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @ApiProperty({ description: 'Dynamic attributes as key-value pairs', required: false })
  @IsOptional()
  dynamicAttributes?: Record<string, string | number>;
}

export class ProductImportValidationDto {
  @ApiProperty({ description: 'Array of product import rows', type: [ProductImportRowDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ProductImportRowDto)
  products: ProductImportRowDto[];
}

export class RelationMappingDto {
  @ApiProperty({ description: 'Name from Excel' })
  name: string;

  @ApiProperty({ description: 'Database ID' })
  id: number;

  @ApiProperty({ description: 'Whether this is a newly created record' })
  isNew: boolean;
}

export class RelationMappingsDto {
  @ApiProperty({ description: 'Category mappings', type: [RelationMappingDto] })
  categories: RelationMappingDto[];

  @ApiProperty({ description: 'Brand mappings', type: [RelationMappingDto] })
  brands: RelationMappingDto[];

  @ApiProperty({ description: 'Manufacturer mappings', type: [RelationMappingDto] })
  manufacturers: RelationMappingDto[];

  @ApiProperty({ description: 'Material mappings', type: [RelationMappingDto] })
  materials: RelationMappingDto[];

  @ApiProperty({ description: 'Manufacturing method mappings', type: [RelationMappingDto] })
  manufacturingMethods: RelationMappingDto[];

  @ApiProperty({ description: 'Color mappings', type: [RelationMappingDto] })
  colors: RelationMappingDto[];

  @ApiProperty({ description: 'Size mappings', type: [RelationMappingDto] })
  sizes: RelationMappingDto[];

  @ApiProperty({ description: 'Product type mappings', type: [RelationMappingDto] })
  productTypes: RelationMappingDto[];

  @ApiProperty({ description: 'Packaging type mappings', type: [RelationMappingDto] })
  packagingTypes: RelationMappingDto[];

  @ApiProperty({ description: 'Product attribute mappings', type: [RelationMappingDto] })
  productAttributes: RelationMappingDto[];
}
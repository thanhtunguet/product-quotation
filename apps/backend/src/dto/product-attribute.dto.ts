import { IsString, IsBoolean, IsOptional, IsNotEmpty, MaxLength, IsEnum } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { AttributeDataType } from '../entities/product-attribute.entity';

export class CreateProductAttributeDto {
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

  @IsEnum(AttributeDataType)
  @ApiProperty({ enum: AttributeDataType })
  dataType: AttributeDataType;

  @IsString()
  @IsOptional()
  @ApiProperty({ required: false })
  description?: string;

  @IsBoolean()
  @IsOptional()
  @ApiProperty({ required: false, default: false })
  isRequired?: boolean;

  @IsBoolean()
  @IsOptional()
  @ApiProperty({ required: false, default: true })
  isActive?: boolean;
}

export class UpdateProductAttributeDto {
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

  @IsEnum(AttributeDataType)
  @IsOptional()
  @ApiProperty({ enum: AttributeDataType, required: false })
  dataType?: AttributeDataType;

  @IsString()
  @IsOptional()
  @ApiProperty({ required: false })
  description?: string;

  @IsBoolean()
  @IsOptional()
  @ApiProperty({ required: false })
  isRequired?: boolean;

  @IsBoolean()
  @IsOptional()
  @ApiProperty({ required: false })
  isActive?: boolean;
}
import { IsString, IsBoolean, IsOptional, IsNotEmpty, MaxLength, IsNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateProductAttributeValueDto {
  @IsNumber()
  @IsNotEmpty()
  @ApiProperty()
  attributeId: number;

  @IsString()
  @IsNotEmpty()
  @MaxLength(500)
  @ApiProperty()
  value: string;

  @IsNumber()
  @IsOptional()
  @ApiProperty({ required: false, default: 0 })
  displayOrder?: number;

  @IsBoolean()
  @IsOptional()
  @ApiProperty({ required: false, default: true })
  isActive?: boolean;
}

export class UpdateProductAttributeValueDto {
  @IsNumber()
  @IsOptional()
  @ApiProperty({ required: false })
  attributeId?: number;

  @IsString()
  @IsOptional()
  @MaxLength(500)
  @ApiProperty({ required: false })
  value?: string;

  @IsNumber()
  @IsOptional()
  @ApiProperty({ required: false })
  displayOrder?: number;

  @IsBoolean()
  @IsOptional()
  @ApiProperty({ required: false })
  isActive?: boolean;
}
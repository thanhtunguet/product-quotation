import {
  IsBoolean,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateCategoryDto {
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
  @ApiProperty({ required: false })
  description?: string;

  @IsNumber()
  @IsOptional()
  @ApiProperty({ required: false })
  parentId?: number;

  @IsBoolean()
  @IsOptional()
  @ApiProperty({ required: false, default: true })
  isActive?: boolean;
}

export class UpdateCategoryDto {
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
  @ApiProperty({ required: false })
  description?: string;

  @IsNumber()
  @IsOptional()
  @ApiProperty({ required: false })
  parentId?: number;

  @IsBoolean()
  @IsOptional()
  @ApiProperty({ required: false })
  isActive?: boolean;
}

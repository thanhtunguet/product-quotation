import { IsString, IsOptional, IsNotEmpty, MaxLength, IsNumber, IsEnum, IsArray, ValidateNested, IsDateString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
// Define the enum based on the new entity structure
export enum QuotationStatus {
  DRAFT = 'DRAFT',
  SENT = 'SENT',
  ACCEPTED = 'ACCEPTED',
  REJECTED = 'REJECTED',
  EXPIRED = 'EXPIRED'
}

export class QuotationItemDto {
  @IsNumber()
  @IsNotEmpty()
  @ApiProperty()
  productId: number;

  @IsNumber()
  @IsNotEmpty()
  @ApiProperty()
  quantity: number;

  @IsNumber()
  @IsNotEmpty()
  @ApiProperty()
  unitPrice: number;

  @IsString()
  @IsOptional()
  @ApiProperty({ required: false })
  notes?: string;
}

export class CreateQuotationDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  @ApiProperty()
  customerName: string;

  @IsString()
  @IsOptional()
  @MaxLength(255)
  @ApiProperty({ required: false })
  companyName?: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  @ApiProperty()
  phoneNumber: string;

  @IsDateString()
  @IsNotEmpty()
  @ApiProperty()
  quotationDate: string;

  @IsDateString()
  @IsOptional()
  @ApiProperty({ required: false })
  validUntil?: string;

  @IsString()
  @IsOptional()
  @ApiProperty({ required: false })
  notes?: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => QuotationItemDto)
  @IsNotEmpty()
  @ApiProperty({ type: [QuotationItemDto] })
  items: QuotationItemDto[];
}

export class UpdateQuotationDto {
  @IsString()
  @IsOptional()
  @MaxLength(255)
  @ApiProperty({ required: false })
  customerName?: string;

  @IsString()
  @IsOptional()
  @MaxLength(255)
  @ApiProperty({ required: false })
  companyName?: string;

  @IsString()
  @IsOptional()
  @MaxLength(50)
  @ApiProperty({ required: false })
  phoneNumber?: string;

  @IsDateString()
  @IsOptional()
  @ApiProperty({ required: false })
  quotationDate?: string;

  @IsDateString()
  @IsOptional()
  @ApiProperty({ required: false })
  validUntil?: string;

  @IsEnum(QuotationStatus)
  @IsOptional()
  @ApiProperty({ enum: QuotationStatus, required: false })
  status?: QuotationStatus;

  @IsString()
  @IsOptional()
  @ApiProperty({ required: false })
  notes?: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => QuotationItemDto)
  @IsOptional()
  @ApiProperty({ type: [QuotationItemDto], required: false })
  items?: QuotationItemDto[];
}
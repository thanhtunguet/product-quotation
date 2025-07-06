import { Entity, Column, OneToMany, Index } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { BaseEntity } from './base.entity';
import { QuotationItem } from './quotation-item.entity';

export enum QuotationStatus {
  DRAFT = 'DRAFT',
  SENT = 'SENT',
  ACCEPTED = 'ACCEPTED',
  REJECTED = 'REJECTED',
  EXPIRED = 'EXPIRED',
}

@Entity('quotations')
@Index(['quotationNumber'])
@Index(['customerName'])
@Index(['quotationDate'])
@Index(['status'])
export class Quotation extends BaseEntity {
  @Column({ type: 'varchar', length: 100, unique: true })
  @ApiProperty()
  quotationNumber: string;

  @Column({ type: 'varchar', length: 255 })
  @ApiProperty()
  customerName: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  @ApiProperty({ required: false })
  companyName?: string;

  @Column({ type: 'varchar', length: 50 })
  @ApiProperty()
  phoneNumber: string;

  @Column({ type: 'date' })
  @ApiProperty()
  quotationDate: Date;

  @Column({ type: 'date', nullable: true })
  @ApiProperty({ required: false })
  validUntil?: Date;

  @Column({ type: 'enum', enum: QuotationStatus, default: QuotationStatus.DRAFT })
  @ApiProperty({ enum: QuotationStatus })
  status: QuotationStatus;

  @Column({ type: 'decimal', precision: 15, scale: 2, default: 0.00 })
  @ApiProperty({ default: 0.00 })
  totalAmount: number;

  @Column({ type: 'text', nullable: true })
  @ApiProperty({ required: false })
  notes?: string;

  @OneToMany(() => QuotationItem, (item) => item.quotation, { cascade: true })
  items: QuotationItem[];
}
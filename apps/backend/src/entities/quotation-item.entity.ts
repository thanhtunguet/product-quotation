import { Entity, Column, ManyToOne, JoinColumn, Index } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { BaseEntity } from './base.entity';
import { Quotation } from './quotation.entity';
import { Product } from './product.entity';

@Entity('quotation_items')
@Index(['quotationId'])
@Index(['productId'])
export class QuotationItem extends BaseEntity {
  @Column({ type: 'int' })
  @ApiProperty()
  quotationId: number;

  @Column({ type: 'int' })
  @ApiProperty()
  productId: number;

  @Column({ type: 'int', default: 1 })
  @ApiProperty({ default: 1 })
  quantity: number;

  @Column({ type: 'decimal', precision: 15, scale: 2 })
  @ApiProperty()
  unitPrice: number;

  @Column({ type: 'decimal', precision: 15, scale: 2 })
  @ApiProperty()
  totalPrice: number;

  @Column({ type: 'text', nullable: true })
  @ApiProperty({ required: false })
  notes?: string;

  @ManyToOne(() => Quotation, (quotation) => quotation.items)
  @JoinColumn({ name: 'quotationId' })
  quotation: Quotation;

  @ManyToOne(() => Product)
  @JoinColumn({ name: 'productId' })
  product: Product;
}
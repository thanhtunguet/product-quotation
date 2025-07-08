import {
  Column,
  Entity,
  Index,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { QuotationItems } from './QuotationItems';

@Index('quotationNumber', ['quotationNumber'], { unique: true })
@Index('idx_quotation_number', ['quotationNumber'], {})
@Index('idx_customer_name', ['customerName'], {})
@Index('idx_phone_number', ['phoneNumber'], {})
@Index('idx_quotation_date', ['quotationDate'], {})
@Index('idx_status', ['status'], {})
@Index('idx_active_deleted', ['deletedAt'], {})
@Entity('Quotations', { schema: 'product_quotation' })
export class Quotations {
  @PrimaryGeneratedColumn({ type: 'int', name: 'id' })
  id: number;

  @Column('varchar', { name: 'quotationNumber', unique: true, length: 100 })
  quotationNumber: string;

  @Column('varchar', { name: 'customerName', length: 255 })
  customerName: string;

  @Column('varchar', { name: 'companyName', nullable: true, length: 255 })
  companyName: string | null;

  @Column('varchar', { name: 'phoneNumber', length: 50 })
  phoneNumber: string;

  @Column('date', { name: 'quotationDate' })
  quotationDate: string;

  @Column('date', { name: 'validUntil', nullable: true })
  validUntil: string | null;

  @Column('enum', {
    name: 'status',
    enum: ['DRAFT', 'SENT', 'ACCEPTED', 'REJECTED', 'EXPIRED'],
    default: () => "'DRAFT'",
  })
  status: 'DRAFT' | 'SENT' | 'ACCEPTED' | 'REJECTED' | 'EXPIRED';

  @Column('decimal', {
    name: 'totalAmount',
    precision: 15,
    scale: 2,
    default: () => "'0.00'",
  })
  totalAmount: string;

  @Column('text', { name: 'notes', nullable: true })
  notes: string | null;

  @Column('timestamp', {
    name: 'createdAt',
    nullable: true,
    default: () => 'CURRENT_TIMESTAMP',
  })
  createdAt: Date | null;

  @Column('timestamp', {
    name: 'updatedAt',
    nullable: true,
    default: () => 'CURRENT_TIMESTAMP',
  })
  updatedAt: Date | null;

  @Column('varchar', { name: 'createdBy', nullable: true, length: 100 })
  createdBy: string | null;

  @Column('varchar', { name: 'updatedBy', nullable: true, length: 100 })
  updatedBy: string | null;

  @Column('timestamp', { name: 'deletedAt', nullable: true })
  deletedAt: Date | null;

  @OneToMany(() => QuotationItems, (quotationItems) => quotationItems.quotation)
  quotationItems: QuotationItems[];
}

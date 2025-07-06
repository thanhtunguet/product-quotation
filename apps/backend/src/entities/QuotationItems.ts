import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Quotations } from "./Quotations";
import { Products } from "./Products";

@Index("idx_quotation_id", ["quotationId"], {})
@Index("idx_product_id", ["productId"], {})
@Index("idx_deleted", ["deletedAt"], {})
@Entity("QuotationItems", { schema: "product_quotation" })
export class QuotationItems {
  @PrimaryGeneratedColumn({ type: "int", name: "id" })
  id: number;

  @Column("int", { name: "quotationId" })
  quotationId: number;

  @Column("int", { name: "productId" })
  productId: number;

  @Column("int", { name: "quantity", default: () => "'1'" })
  quantity: number;

  @Column("decimal", { name: "unitPrice", precision: 15, scale: 2 })
  unitPrice: string;

  @Column("decimal", { name: "totalPrice", precision: 15, scale: 2 })
  totalPrice: string;

  @Column("text", { name: "notes", nullable: true })
  notes: string | null;

  @Column("timestamp", {
    name: "createdAt",
    nullable: true,
    default: () => "CURRENT_TIMESTAMP",
  })
  createdAt: Date | null;

  @Column("timestamp", {
    name: "updatedAt",
    nullable: true,
    default: () => "CURRENT_TIMESTAMP",
  })
  updatedAt: Date | null;

  @Column("varchar", { name: "createdBy", nullable: true, length: 100 })
  createdBy: string | null;

  @Column("varchar", { name: "updatedBy", nullable: true, length: 100 })
  updatedBy: string | null;

  @Column("timestamp", { name: "deletedAt", nullable: true })
  deletedAt: Date | null;

  @ManyToOne(() => Quotations, (quotations) => quotations.quotationItems, {
    onDelete: "CASCADE",
    onUpdate: "RESTRICT",
  })
  @JoinColumn([{ name: "quotationId", referencedColumnName: "id" }])
  quotation: Quotations;

  @ManyToOne(() => Products, (products) => products.quotationItems, {
    onDelete: "RESTRICT",
    onUpdate: "RESTRICT",
  })
  @JoinColumn([{ name: "productId", referencedColumnName: "id" }])
  product: Products;
}

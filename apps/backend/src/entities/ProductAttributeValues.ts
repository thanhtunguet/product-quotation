import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { ProductAttributes } from "./ProductAttributes";

@Index("unique_attribute_value", ["attributeId", "value"], { unique: true })
@Index("idx_attribute_id", ["attributeId"], {})
@Index("idx_display_order", ["displayOrder"], {})
@Index("idx_active_deleted", ["isActive", "deletedAt"], {})
@Entity("ProductAttributeValues", { schema: "product_quotation" })
export class ProductAttributeValues {
  @PrimaryGeneratedColumn({ type: "int", name: "id" })
  id: number;

  @Column("int", { name: "attributeId" })
  attributeId: number;

  @Column("varchar", { name: "value", length: 500 })
  value: string;

  @Column("int", { name: "displayOrder", nullable: true, default: () => "'0'" })
  displayOrder: number | null;

  @Column("tinyint", { name: "isActive", width: 1, default: () => "'1'" })
  isActive: boolean;

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

  @ManyToOne(
    () => ProductAttributes,
    (productAttributes) => productAttributes.productAttributeValues,
    { onDelete: "CASCADE", onUpdate: "RESTRICT" }
  )
  @JoinColumn([{ name: "attributeId", referencedColumnName: "id" }])
  attribute: ProductAttributes;
}

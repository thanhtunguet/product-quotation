import { Column, Entity, Index, PrimaryGeneratedColumn, ManyToOne, OneToMany, JoinColumn } from "typeorm";

@Index("IDX_77d7eff8a7aaa05457a12b8007", ["code"], { unique: true })
@Index("IDX_9a6f051e66982b5f0318981bca", ["parentId"], {})
@Entity("categories", { schema: "product_quotation" })
export class Categories {
  @PrimaryGeneratedColumn({ type: "int", name: "id" })
  id: number;

  @Column("datetime", {
    name: "createdAt",
    default: () => "'current_timestamp(6)'",
  })
  createdAt: Date;

  @Column("datetime", {
    name: "updatedAt",
    default: () => "'current_timestamp(6)'",
  })
  updatedAt: Date;

  @Column("datetime", { name: "deletedAt", nullable: true })
  deletedAt: Date | null;

  @Column("int", { name: "createdBy", default: () => "'1'" })
  createdBy: number;

  @Column("int", { name: "updatedBy", default: () => "'1'" })
  updatedBy: number;

  @Column("varchar", { name: "name", length: 255 })
  name: string;

  @Column("varchar", { name: "code", unique: true, length: 100 })
  code: string;

  @Column("text", { name: "description", nullable: true })
  description: string | null;

  @Column("int", { name: "parentId", nullable: true })
  parentId: number | null;

  @ManyToOne(() => Categories, (category) => category.children, { nullable: true })
  @JoinColumn({ name: "parentId" })
  parent?: Categories;

  @OneToMany(() => Categories, (category) => category.parent)
  children?: Categories[];

  @Column("tinyint", { name: "isActive", default: () => "'1'" })
  isActive: number;
}

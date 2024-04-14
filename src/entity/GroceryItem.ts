import { Entity, PrimaryGeneratedColumn, Column, UpdateDateColumn, CreateDateColumn, BaseEntity } from "typeorm";

@Entity({
  database: process.env.DB_NAME,
  synchronize: process.env.DB_SYNCHRONIZE === "true"
})
export class GroceryItem extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: string;

  @Column()
  name: string;

  @Column("float")
  price: number;

  @Column()
  quantity: number;

  @CreateDateColumn({ name: "created_at" })
  createdAt: Date;

  @UpdateDateColumn({ name: "updated_at" })
  updatedAt: Date;
}

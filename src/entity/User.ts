import { Entity, PrimaryGeneratedColumn, Column, BaseEntity, UpdateDateColumn, CreateDateColumn } from "typeorm";

@Entity({
  database: process.env.DB_NAME,
  synchronize: process.env.DB_SYNCHRONIZE === "true"
})
export class User extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: string;

  @Column({ type: "varchar", length: 255, nullable: true })
  name: string;

  @Column({ type: "varchar", length: 255, nullable: true })
  email: string;

  @Column({ type: "varchar", length: 255, nullable: true })
  password: string;

  @Column({
    nullable: false,
    type: "enum",
    enum: ["User", "Admin"],
    default: "User"
  })
  role: "User" | "Admin";

  @CreateDateColumn({ name: "created_at" })
  createdAt: Date;

  @UpdateDateColumn({ name: "updated_at" })
  updatedAt: Date;
}

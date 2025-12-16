import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

export type Category =
  | "FIRST" | "SECOND" | "THIRD" | "FOURTH"
  | "FIFTH" | "SIXTH" | "SEVENTH" | "DONE";

@Entity({ name: "cards" })
export class CardEntity {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column({ type: "text" })
  question!: string;

  @Column({ type: "text" })
  answer!: string;

  @Column({ type: "text", nullable: true })
  tag!: string | null;

  @Column({ type: "varchar" })
  category!: Category;
}
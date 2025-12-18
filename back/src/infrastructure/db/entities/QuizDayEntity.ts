import { Column, Entity, PrimaryColumn } from "typeorm";

@Entity({ name: "quiz_days" })
export class QuizDayEntity {
  @PrimaryColumn({ type: "date" })
  date!: string;

  @Column({ type: "uuid", array: true })
  cardIds!: string[];

  @Column({ type: "timestamptz" })
  generatedAt!: Date;
}
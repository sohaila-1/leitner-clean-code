import { Category } from "./Category";
import { Question } from "../questions/Question";
import { ExpectedAnswer } from "../answers/ExpectedAnswer";

const NEXT: Record<Exclude<Category, "DONE">, Category> = {
  FIRST: "SECOND",
  SECOND: "THIRD",
  THIRD: "FOURTH",
  FOURTH: "FIFTH",
  FIFTH: "SIXTH",
  SIXTH: "SEVENTH",
  SEVENTH: "DONE",
};

export class Card {
  constructor(
    public readonly id: string,
    public question: Question,
    public expectedAnswer: ExpectedAnswer,
    public tag: string | null,
    public category: Category,
    public lastAnsweredAt: Date | null
  ) {}

  validate(isValid: boolean, at: Date = new Date()): void {
    if (isValid) {
      if (this.category !== "DONE") this.category = NEXT[this.category];
    } else {
      this.category = "FIRST";
    }
    this.lastAnsweredAt = at;
  }

  isDone(): boolean {
    return this.category === "DONE";
  }
}

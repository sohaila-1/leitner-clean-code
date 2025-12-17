import { CardEntity, Category } from "../entities/CardEntity";

const NEXT_CATEGORY: Record<Exclude<Category, "DONE">, Category> = {
  FIRST: "SECOND",
  SECOND: "THIRD",
  THIRD: "FOURTH",
  FOURTH: "FIFTH",
  FIFTH: "SIXTH",
  SIXTH: "SEVENTH",
  SEVENTH: "DONE",
};

export class LeitnerService {
  applyAnswer(card: CardEntity, isValid: boolean, now: Date = new Date()): void {
    if (isValid) {
      if (card.category !== "DONE") {
        card.category = NEXT_CATEGORY[card.category];
      }
    } else {
      card.category = "FIRST";
    }
  }
}
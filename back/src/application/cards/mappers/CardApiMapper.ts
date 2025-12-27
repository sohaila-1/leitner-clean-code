import { Card } from "../../../domain/cards/Card";
import { CardResponse } from "../dtos/CardResponse";

export function toCardResponse(card: Card): CardResponse {
  return {
    id: card.id,
    question: card.question.value,
    answer: card.expectedAnswer.value,
    category: card.category,
    ...(card.tag ? { tag: card.tag } : {}),
  };
}
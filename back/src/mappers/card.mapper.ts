import { CardEntity } from "../entities/CardEntity";
import { CardDto } from "../dtos/CardDto";

export function toCardDto(card: CardEntity): CardDto {
  return {
    id: card.id,
    question: card.question,
    answer: card.answer,
    category: card.category,
    ...(card.tag ? { tag: card.tag } : {}),
  };
}
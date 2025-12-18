import { Card } from "../../../domain/cards/Card";
import { Question } from "../../../domain/questions/Question";
import { ExpectedAnswer } from "../../../domain/answers/ExpectedAnswer";
import { CardEntity } from "../entities/CardEntity";

export const CardDbMapper = {
  toDomain(e: CardEntity): Card {
    return new Card(
      e.id,
      new Question(e.question),
      new ExpectedAnswer(e.answer),
      e.tag,
      e.category,
      e.lastAnsweredAt
    );
  },

  toEntity(domain: Card, existing?: CardEntity): CardEntity {
    const e = existing ?? new CardEntity();

    e.id = domain.id;
    e.question = domain.question.value;
    e.answer = domain.expectedAnswer.value;
    e.tag = domain.tag;
    e.category = domain.category;
    e.lastAnsweredAt = domain.lastAnsweredAt;

    return e;
  },
};

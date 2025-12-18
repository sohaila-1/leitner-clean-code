import { Card } from "../../../domain/cards/Card";
import { CardRepository } from "../../../domain/cards/ports/CardRepository";
import { QuizDayRepository } from "../../../domain/quiz/ports/QuizDayRepository";

function todayISO(): string {
  return new Date().toISOString().slice(0, 10);
}

export class GetQuizDayUseCase {
  constructor(
    private cardRepo: CardRepository,
    private quizRepo: QuizDayRepository
  ) {}

  async execute(date?: string): Promise<Card[]> {
    const quizDate = date && date.trim().length > 0 ? date : todayISO();

    const existing = await this.quizRepo.findByDate(quizDate);
    if (existing) {
      const cards = await this.cardRepo.findManyByIds(existing.cardIds);
      const byId = new Map(cards.map(c => [c.id, c]));
      return existing.cardIds
        .map(id => byId.get(id))
        .filter(Boolean) as Card[];
    }

    const all = await this.cardRepo.findAll();
    const selected = all.filter(c => !c.isDone());

    await this.quizRepo.save({
      date: quizDate,
      cardIds: selected.map(c => c.id),
      generatedAt: new Date(),
    });

    return selected;
  }
}

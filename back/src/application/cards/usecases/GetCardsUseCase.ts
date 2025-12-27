import { Card } from "../../../domain/cards/Card";
import { CardRepository } from "../../../domain/cards/ports/CardRepository";

export class GetCardsUseCase {
  constructor(private cardRepo: CardRepository) {}

  async execute(tags?: string[]): Promise<Card[]> {
    if (!tags || tags.length === 0) {
      return this.cardRepo.findAll();
    }
    return this.cardRepo.findByTags(tags);
  }
}
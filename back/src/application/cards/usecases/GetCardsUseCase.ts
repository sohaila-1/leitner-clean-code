import { Card } from "../../../domain/cards/Card";
import { CardRepository } from "../../../domain/cards/ports/CardRepository";

export class GetCardsUseCase {
  constructor(private cardRepo: CardRepository) {}

  async execute(): Promise<Card[]> {
    return this.cardRepo.findAll();
  }
}
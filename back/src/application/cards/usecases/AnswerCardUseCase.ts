import { CardRepository } from "../../../domain/cards/ports/CardRepository";

export class AnswerCardUseCase {
  constructor(private cardRepo: CardRepository) {}

  async execute(cardId: string, isValid: boolean): Promise<void> {
    const card = await this.cardRepo.findById(cardId);
    if (!card) {
      throw new Error("CARD_NOT_FOUND");
    }

    card.validate(isValid);
    await this.cardRepo.save(card);
  }
}
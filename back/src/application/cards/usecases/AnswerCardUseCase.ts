import { CardRepository } from "../../../domain/cards/ports/CardRepository";
import {CardNotFoundError} from "../errors/CardNotFoundError";

export class AnswerCardUseCase {
  constructor(private cardRepo: CardRepository) {}

  async execute(cardId: string, isValid: boolean): Promise<void> {
    const card = await this.cardRepo.findById(cardId);
    if (!card) {
      throw new CardNotFoundError(cardId);
    }

    card.validate(isValid);
    await this.cardRepo.save(card);
  }
}
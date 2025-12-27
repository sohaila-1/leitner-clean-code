import { ExpectedAnswer } from "../../../domain/answers/ExpectedAnswer";
import { Card } from "../../../domain/cards/Card";
import { CardRepository } from "../../../domain/cards/ports/CardRepository";
import { Question } from "../../../domain/questions/Question";

export class CreateCardUseCase {
    constructor(private cardRepo: CardRepository) { }

    async execute(input: {
        question: string;
        answer: string;
        tag?: string;
    }): Promise<Card> {
        const card = new Card(
            crypto.randomUUID(),
            new Question(input.question),
            new ExpectedAnswer(input.answer),
            input.tag ?? null,
            "FIRST",
            null
        );

        return this.cardRepo.save(card);
    }
}
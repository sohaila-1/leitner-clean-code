import { describe, it, expect, vi } from "vitest";
import { AnswerCardUseCase } from "../../src/application/cards/usecases/AnswerCardUseCase";
import { CardNotFoundError } from "../../src/application/cards/errors/CardNotFoundError";
import type { CardRepository } from "../../src/domain/cards/ports/CardRepository";
import { Card } from "../../src/domain/cards/Card";
import { Question } from "../../src/domain/questions/Question";
import { ExpectedAnswer } from "../../src/domain/answers/ExpectedAnswer";

function makeCard(category: "FIRST" | "DONE" = "FIRST") {
    return new Card("card-1", new Question("Capital de la France ?"), new ExpectedAnswer("Paris"), "Géo",
        category,
        null)
}

describe("AnswerCardUseCase", () => {
    it("lève CardNotFoundError si la carte est introuvable", async () => {
        const repo: CardRepository = {
            findAll: vi.fn().mockResolvedValue([]),
            findById: vi.fn().mockResolvedValue(null),
            save: vi.fn(),
            findManyByIds: vi.fn().mockResolvedValue([]),
            findByTags: vi.fn().mockResolvedValue([]),
        }
        const useCase = new AnswerCardUseCase(repo);
        await expect(
            useCase.execute("6c10ad48-2bb8-4e2e-900a-21d62c00c07b", true)
        ).rejects.toBeInstanceOf(CardNotFoundError);
    })

    it("met à jour la catégorie et sauvegarde quand la réponse est correcte", async () => {
        const card = makeCard("FIRST");

        const repo: CardRepository = {
            findAll: vi.fn().mockResolvedValue([]),
            findById: vi.fn().mockResolvedValue(card),
            save: vi.fn().mockImplementation(async (c) => c),
            findManyByIds: vi.fn().mockResolvedValue([]),
            findByTags: vi.fn().mockResolvedValue([]),
        }
        const useCase = new AnswerCardUseCase(repo);
        await useCase.execute(card.id, true);

        expect(card.category).toBe("SECOND");
        expect(repo.save).toHaveBeenCalledTimes(1);
        expect(repo.save).toHaveBeenCalledWith(card);
    });
});

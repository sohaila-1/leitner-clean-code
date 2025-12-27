import { describe, it, expect, vi } from "vitest";
import { GetQuizDayUseCase } from "../../src/application/quiz/usecases/GetQuizDayUseCase";
import type { CardRepository } from "../../src/domain/cards/ports/CardRepository";
import type { QuizDayRepository } from "../../src/domain/quiz/ports/QuizDayRepository";
import { QuizDay } from "../../src/domain/quiz/QuizDay";
import { Card } from "../../src/domain/cards/Card";
import { Question } from "../../src/domain/questions/Question";
import { ExpectedAnswer } from "../../src/domain/answers/ExpectedAnswer";

function makeCard(id: string, category: "FIRST" | "DONE" = "FIRST") {
    return new Card(id, new Question("Capital de France ?"),
        new ExpectedAnswer("Paris"),
        "Tag",
        category,
        null
    )
}

describe("GetQuizDayUseCase", () => {
    it("renvoie les cartes du quiz existant dans le même ordre", async () => {
        const cardA = makeCard("a");
        const cardB = makeCard("b");
        const quizRepo: QuizDayRepository = {
            findByDate: vi
                .fn()
                .mockResolvedValue(new QuizDay("2025-01-01", ["b", "a"], new Date("2025-01-01T10:00:00Z"))),
            save: vi.fn(),
        }
        const cardRepo: CardRepository = {
            findAll: vi.fn(),
            findById: vi.fn(),
            save: vi.fn(),
            findByTags: vi.fn(),
            findManyByIds: vi.fn().mockResolvedValue([cardA, cardB]),
        }



        const useCase = new GetQuizDayUseCase(cardRepo, quizRepo);
        const result = await useCase.execute("2025-01-01");

        expect(result.map((c) => c.id)).toEqual(["b", "a"]);
        expect(quizRepo.save).not.toHaveBeenCalled();
    })

    it("génère un quiz si absent : exclut DONE et sauvegarde", async () => {
        const card1 = makeCard("c1", "FIRST");
        const card2 = makeCard("c2", "DONE");
        const card3 = makeCard("c3", "FIRST");

        const quizRepo: QuizDayRepository = {
            findByDate: vi.fn().mockResolvedValue(null),
            save: vi.fn().mockImplementation(async (q) => q),
        }

        const cardRepo: CardRepository = {
            findAll: vi.fn().mockResolvedValue([card1, card2, card3]),
            findById: vi.fn(),
            save: vi.fn(),
            findByTags: vi.fn(),
            findManyByIds: vi.fn(),
        }

        const useCase = new GetQuizDayUseCase(cardRepo, quizRepo);
        const result = await useCase.execute("2025-01-02");

        expect(result.map((c) => c.id)).toEqual(["c1", "c3"]);
        expect(quizRepo.save).toHaveBeenCalledTimes(1);


        const saved = (quizRepo.save as any).mock.calls[0][0] as QuizDay;
        expect(saved.date).toBe("2025-01-02");
        expect(saved.cardIds).toEqual(["c1", "c3"]);
    })
})

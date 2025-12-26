import { describe, it, expect, vi } from "vitest";
import { GetCardsUseCase } from "../../src/application/cards/usecases/GetCardsUseCase";
import type { CardRepository } from "../../src/domain/cards/ports/CardRepository";
import type { Card } from "../../src/domain/cards/Card";

describe("GetCardsUseCase", () => {
    it("appelle findAll quand aucun tag n'est fourni", async () => {
        const repo: CardRepository = {
            findAll: vi.fn().mockResolvedValue([]),
            findById: vi.fn(),
            save: vi.fn(),
            findManyByIds: vi.fn(),
            findByTags: vi.fn(),
        }

        const useCase = new GetCardsUseCase(repo);
        await useCase.execute();

        expect(repo.findAll).toHaveBeenCalledTimes(1);
        expect(repo.findByTags).not.toHaveBeenCalled();
    })

    it("appelle findByTags quand des tags sont fournis", async () => {
        const fakeCards: Card[] = [];
        const repo: CardRepository = {
            findAll: vi.fn(),
            findById: vi.fn(),
            save: vi.fn(),
            findManyByIds: vi.fn(),
            findByTags: vi.fn().mockResolvedValue(fakeCards),
        }

        const useCase = new GetCardsUseCase(repo);
        await useCase.execute(["Géo", "Architecture"]);

        expect(repo.findByTags).toHaveBeenCalledTimes(1);
        expect(repo.findByTags).toHaveBeenCalledWith(["Géo", "Architecture"]);
        expect(repo.findAll).not.toHaveBeenCalled();
    })
})

import { describe, it, expect, vi } from "vitest"
import { CreateCardUseCase } from "../../src/application/cards/usecases/CreateCardUseCase"
import type { CardRepository } from "../../src/domain/cards/ports/CardRepository"
import { Card } from "../../src/domain/cards/Card"

describe("CreateCardUseCase", () => {
    it("crée une carte en FIRST sans tag quand tag n'est pas fourni", async () => {
        const repo: CardRepository = {
            findAll: vi.fn(),
            findByTags: vi.fn(),
            findById: vi.fn(),
            findManyByIds: vi.fn(),
            save: vi.fn().mockImplementation(async (c) => c),
        }

        const useCase = new CreateCardUseCase(repo)

        const created = await useCase.execute({
            question: "Capital de la France ?",
            answer: "Paris",
        })

        expect(repo.save).toHaveBeenCalledTimes(1)
        expect(repo.save).toHaveBeenCalledWith(expect.any(Card))
        expect(created.category).toBe("FIRST")
        expect((created as any).tag == null).toBe(true)
    })

    it("crée une carte en FIRST avec tag quand tag est fourni", async () => {
        const repo: CardRepository = {
            findAll: vi.fn(),
            findByTags: vi.fn(),
            findById: vi.fn(),
            findManyByIds: vi.fn(),
            save: vi.fn().mockImplementation(async (c) => c),
        }

        const useCase = new CreateCardUseCase(repo)



        const created = await useCase.execute({
            question: "Capital de la France ?",
            answer: "Paris",
            tag: "Géo",
        })

        expect(repo.save).toHaveBeenCalledTimes(1)
        expect(repo.save).toHaveBeenCalledWith(expect.any(Card))
        expect(created.category).toBe("FIRST")
        expect((created as any).tag).toBe("Géo")
    })
})

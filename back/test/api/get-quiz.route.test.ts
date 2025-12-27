import express from "express";
import request from "supertest";
import { describe, it, expect, vi } from "vitest";
import { buildRoutes } from "../../src/main/routes";
import { CardController } from "../../src/main/controllers/CardController";
import { Card } from "../../src/domain/cards/Card";
import { Question } from "../../src/domain/questions/Question";
import { ExpectedAnswer } from "../../src/domain/answers/ExpectedAnswer";

function makeTestApp(options?: {
    getQuizDayExecute?: (date?: string) => Promise<Card[]>;
}) {
    const app = express();
    app.use(express.json())

    const createCardUseCase = { execute: vi.fn() } as any;
    const getCardsUseCase = { execute: vi.fn() } as any;

    const getQuizDayUseCase = {
        execute: options?.getQuizDayExecute ? vi.fn(options.getQuizDayExecute) : vi.fn().mockResolvedValue([]),
    } as any;

    const answerCardUseCase = { execute: vi.fn() } as any;

    const controller = new CardController(
        createCardUseCase,
        getCardsUseCase,
        getQuizDayUseCase,
        answerCardUseCase
    )
    app.use(buildRoutes(controller));
    return {
        app, getQuizDayUseCase }
}



describe("GET /cards/quizz", () => {
    it("passe undefined au use case quand date n'est pas fourni", async () => {
        const card = new Card("card-1", new Question("q2"), new ExpectedAnswer("rep2"), "Tag", "FIRST", null );

        const { app, getQuizDayUseCase } = makeTestApp({
            getQuizDayExecute: async () => [card],
        })

        const res = await request(app).get("/cards/quizz").expect(200);

        expect(getQuizDayUseCase.execute).toHaveBeenCalledWith(undefined);
        expect(Array.isArray(res.body)).toBe(true);
    })

    it("passe la date au use case quand date est fourni", async () => {
        const { app, getQuizDayUseCase } = makeTestApp({
            getQuizDayExecute: async () => [],
        })

        const res = await request(app)
            .get("/cards/quizz?date=2025-01-02")
            .expect(200);

        expect(getQuizDayUseCase.execute).toHaveBeenCalledWith("2025-01-02");
        expect(Array.isArray(res.body)).toBe(true);
    })
})

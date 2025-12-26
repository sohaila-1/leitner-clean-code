import express from "express";
import request from "supertest";
import { describe, it, expect, vi } from "vitest";
import { buildRoutes } from "../../src/main/routes";
import { CardController } from "../../src/main/controllers/CardController";
import { Card } from "../../src/domain/cards/Card";
import { Question } from "../../src/domain/questions/Question";
import { ExpectedAnswer } from "../../src/domain/answers/ExpectedAnswer";

function makeTestApp(options?: {
    getCardsExecute?: (tags?: string[]) => Promise<Card[]>;
}) {
    const app = express();
    app.use(express.json());

    const createCardUseCase = {
        execute: vi.fn()
    } as any;
    const getCardsUseCase = {
        execute: options?.getCardsExecute ? vi.fn(options.getCardsExecute) : vi.fn().mockResolvedValue([]),
    } as any;
    const getQuizDayUseCase = {
        execute: vi.fn()
    } as any;
    const answerCardUseCase = {
        execute: vi.fn() } as any;

    const controller = new CardController( createCardUseCase, getCardsUseCase, getQuizDayUseCase, answerCardUseCase);

    app.use(buildRoutes(controller));
    return { app, getCardsUseCase };
}

describe("GET /cards?tags=...", () => {
    it("passe les tags au use case quand tags est fourni", async () => {
        const card = new Card("card-1", new Question("Capital de France"),
            new ExpectedAnswer("PARIS"), "Géo", "FIRST", null)

        const { app, getCardsUseCase } = makeTestApp({
            getCardsExecute: async () => [card],
        })

        const res = await request(app)
            .get("/cards?tags=Géo,Archi")
            .expect(200);

        expect(getCardsUseCase.execute).toHaveBeenCalledWith(["Géo", "Archi"]);
        expect(Array.isArray(res.body)).toBe(true);
    });
});

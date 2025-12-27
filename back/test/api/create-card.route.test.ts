import request from "supertest";
import { describe, it, expect, vi } from "vitest";
import express from "express";
import { buildRoutes } from "../../src/main/routes";
import { CardController } from "../../src/main/controllers/CardController";
import { Card } from "../../src/domain/cards/Card";
import { Question } from "../../src/domain/questions/Question";
import { ExpectedAnswer } from "../../src/domain/answers/ExpectedAnswer";

function makeTestApp(options?: {
    createCardExecute?: (input: { question: string; answer: string; tag?: string }) => Promise<Card> })
    {const app = express()
    app.use(express.json())

    const createCardUseCase = {
        execute: options?.createCardExecute ? vi.fn(options.createCardExecute) : vi.fn().mockResolvedValue (
                new Card("card-1", new Question("q1"), new ExpectedAnswer("rep1"), "Tag", "FIRST", null))
    } as any;

    const getCardsUseCase = { execute: vi.fn() } as any;
    const getQuizDayUseCase = { execute: vi.fn() } as any;
    const answerCardUseCase = { execute: vi.fn() } as any;

    const controller = new CardController(
        createCardUseCase,
        getCardsUseCase,
        getQuizDayUseCase,
        answerCardUseCase
    )

    app.use(buildRoutes(controller));
    return { app, createCardUseCase }
}

describe("POST /cards", () => {
    it("doit retourner 201 si la requête est valide", async () => {
        const created = new Card("card-1", new Question("Capital de la France ?"),
            new ExpectedAnswer("Paris"),
            "Géo",
            "FIRST",
            null
        );

        const { app, createCardUseCase } = makeTestApp({
            createCardExecute: async () => created,
        });

        const res = await request(app)
            .post("/cards")
            .send({ question: "Capital de la France ?", answer: "Paris", tag: "Géo" })
            .expect(201);

        expect(createCardUseCase.execute).toHaveBeenCalledWith({
            question: "Capital de la France ?",
            answer: "Paris",
            tag: "Géo",
        })

        expect(res.body).toMatchObject({
            question: "Capital de la France ?",
            answer: "Paris",
            category: "FIRST",
            tag: "Géo",
        })
        expect(res.body).toHaveProperty("id");
    })

    it("doit retourner 400 si le body est invalide", async () => {
        const { app, createCardUseCase } = makeTestApp();

        await request(app)
            .post("/cards")
            .send({ question: "" })
            .expect(400);

        expect(createCardUseCase.execute).not.toHaveBeenCalled();
    })
})
